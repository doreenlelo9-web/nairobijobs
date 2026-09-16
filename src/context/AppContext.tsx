import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import {
  UserProfile,
  AIPartner,
  ChatMessage,
  Transaction,
  Achievement,
  ReferralUser,
  WithdrawalRequest,
  DailyStreakDay,
  EastAfricaCurrency,
  EastAfricaCountry,
  ActivationInstruction
} from '../types';
import { AI_PARTNERS } from '../data/aiFriends';
import { INITIAL_ACHIEVEMENTS } from '../data/faqAndHelp';
import { sounds } from '../utils/soundEffects';

export type NavTab =
  | 'landing'
  | 'dashboard'
  | 'chat'
  | 'directory'
  | 'wallet'
  | 'rewards'
  | 'referrals'
  | 'profile'
  | 'settings'
  | 'support'
  | 'admin';

export interface PendingActivation {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  country: EastAfricaCountry;
  currency: EastAfricaCurrency;
  amount: number;
  method: string;
  transactionCode: string;
  phone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AppContextType {
  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Currency & Region
  selectedCurrency: EastAfricaCurrency;
  setSelectedCurrency: (c: EastAfricaCurrency) => void;
  formatShillings: (amountInKes: number) => string;
  getAmountInCurrency: (amountInKes: number, targetCurrency?: EastAfricaCurrency) => number;

  // Auth & Account
  user: UserProfile | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalView: 'login' | 'register' | 'forgot' | 'verify' | 'otp' | 'activation';
  setAuthModalView: (view: 'login' | 'register' | 'forgot' | 'verify' | 'otp' | 'activation') => void;
  login: (emailOrUser: string, pass: string) => boolean;
  register: (data: { fullName: string; username: string; email: string; phone: string; country: EastAfricaCountry; password: string }) => void;
  verifyOtp: (code: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Activation System (500 KES fee)
  activationModalOpen: boolean;
  setActivationModalOpen: (open: boolean) => void;
  activationInstructions: Record<EastAfricaCountry, ActivationInstruction>;
  updateActivationInstruction: (country: EastAfricaCountry, updated: Partial<ActivationInstruction>) => void;
  submitActivationPayment: (transactionCode: string, method: string, phone: string) => void;
  simulateStkPush: (phone: string, country: EastAfricaCountry) => Promise<boolean>;
  pendingActivations: PendingActivation[];
  approveActivation: (id: string) => void;
  rejectActivation: (id: string) => void;

  // AI Partners & Chat
  partners: AIPartner[];
  currentPartner: AIPartner;
  setCurrentPartner: (partner: AIPartner) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (text: string, isVoiceNote?: boolean, audioDuration?: number) => Promise<void>;
  isPartnerTyping: boolean;

  // Timer & Live Reward System (500 Shillings / hour)
  sessionSeconds: number;
  isTimerPaused: boolean;
  setIsTimerPaused: (paused: boolean) => void;
  coinsEarnedThisSession: number;
  fastForwardTimer: (secondsToAdd: number) => void;
  resetSessionTimer: () => void;

  // Wallet & Earnings (In Shillings)
  coinBalance: number;
  todayEarnings: number;
  weeklyEarnings: number;
  totalEarnings: number;
  hoursChatted: number;
  referralEarnings: number;
  dailyStreak: number;
  transactions: Transaction[];
  requestWithdrawal: (amountCoins: number, method: string, details: string) => Promise<{ success: boolean; message: string }>;

  // Rewards & Spin Wheel
  canSpinWheel: boolean;
  spinWheel: () => Promise<number>;
  dailyStreakDays: DailyStreakDay[];
  claimDailyStreak: (dayNumber: number) => void;
  achievements: Achievement[];
  claimAchievement: (id: string) => void;

  // Referrals
  referralCode: string;
  referralsList: ReferralUser[];

  // Admin Portal
  adminUsers: UserProfile[];
  toggleUserStatus: (userId: string) => void;
  withdrawalsQueue: WithdrawalRequest[];
  adminWithdrawals: any[];
  adminStats: {
    totalUsers: number;
    activeToday: number;
    totalHours: number;
    totalPayoutsUsd: number;
    totalShillingsPayouts: number;
  };
  handleWithdrawalAction: (id: string, action: 'approve' | 'reject') => void;
  updateWithdrawalStatus: (id: string, status: 'completed' | 'rejected') => void;

  // Settings
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_INSTRUCTIONS: Record<EastAfricaCountry, ActivationInstruction> = {
  Kenya: {
    country: 'Kenya',
    currency: 'KES',
    amount: 500,
    provider: 'Safaricom M-Pesa',
    accountType: 'Till Number',
    accountNumber: '5429182',
    accountName: 'Shillings Chat Kenya Ltd',
    instructions: [
      'Go to M-Pesa menu on your phone',
      'Select Lipa na M-Pesa > Buy Goods and Services',
      'Enter Till Number: 5429182',
      'Enter Amount: 500 KES',
      'Enter your M-Pesa PIN and press OK',
      'Copy the 10-digit M-Pesa SMS Code (e.g. QJK89XZP45) and paste below'
    ]
  },
  Uganda: {
    country: 'Uganda',
    currency: 'UGX',
    amount: 15000,
    provider: 'MTN Mobile Money (MoMo)',
    accountType: 'Mobile Number',
    accountNumber: '0772 819 230',
    accountName: 'Shillings Chat Uganda (MTN MoMo)',
    instructions: [
      'Dial *165# on your MTN line in Uganda',
      'Select 1: Send Money (or MoMoPay Merchant)',
      'Enter MTN Number: 0772 819 230',
      'Enter Amount: 15,000 UGX',
      'Enter your MTN MoMo PIN to confirm payment',
      'Copy the MTN Transaction ID from the SMS and paste below'
    ]
  },
  Tanzania: {
    country: 'Tanzania',
    currency: 'TZS',
    amount: 10000,
    provider: 'Vodacom M-Pesa / Tigo Pesa',
    accountType: 'Paybill',
    accountNumber: '882100',
    accountName: 'Shillings Chat Tanzania',
    instructions: [
      'Open M-Pesa, Tigo Pesa, or Airtel Money menu',
      'Select Lipa kwa Simu > Paybill / Lipa Namba',
      'Enter Business Number: 882100',
      'Enter Amount: 10,000 TZS',
      'Enter your mobile wallet PIN and confirm',
      'Copy the SMS Reference Code and paste below'
    ]
  }
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_001',
  fullName: 'Doreen Lelo',
  username: 'doreen_ke',
  email: 'doreenlelo9@gmail.com',
  phone: '+254 712 345 678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  country: 'Kenya',
  currency: 'KES',
  nativeLanguage: 'Kiswahili',
  bio: 'Swahili enthusiast, tutor, and tech lover living in Nairobi. Teaching proverbs and earning Shillings!',
  role: 'user',
  isVerified: true,
  isActivated: true, // Activated account
  activationPayment: {
    transactionCode: 'QJK89XZP45',
    method: 'mpesa_kenya',
    amount: 500,
    currency: 'KES',
    phoneNumber: '+254 712 345 678',
    status: 'active',
    paidAt: '2025-01-10 10:24 AM'
  },
  status: 'active',
  createdAt: '2025-01-10'
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-act-01',
    type: 'activation_fee',
    title: 'Account Activation (M-Pesa)',
    description: 'One-time account activation fee verified (Ref: QJK89XZP45)',
    amount: -500,
    currency: 'KES',
    timestamp: '2025-01-10',
    status: 'completed'
  },
  {
    id: 'tx-1',
    type: 'chat_reward',
    title: 'Chat Reward (1 Hour)',
    description: 'Active conversation with Ethan Foster (UK)',
    amount: 500,
    currency: 'KES',
    timestamp: 'Today, 09:30 AM',
    status: 'completed'
  },
  {
    id: 'tx-2',
    type: 'spin_wheel',
    title: 'Daily Lucky Spin',
    description: 'Won 250 bonus shillings on wheel',
    amount: 250,
    currency: 'KES',
    timestamp: 'Today, 08:15 AM',
    status: 'completed'
  },
  {
    id: 'tx-3',
    type: 'referral_bonus',
    title: 'Referral Bonus',
    description: 'Friend @juma_m completed first hour',
    amount: 250,
    currency: 'KES',
    timestamp: 'Yesterday, 04:20 PM',
    status: 'completed'
  },
  {
    id: 'tx-4',
    type: 'chat_reward',
    title: 'Chat Reward (2 Hours)',
    description: 'Completed 2 hours with Emma Miller (USA)',
    amount: 1000,
    currency: 'KES',
    timestamp: 'Yesterday, 11:45 AM',
    status: 'completed'
  }
];

const INITIAL_REFERRALS: ReferralUser[] = [
  { id: 'ref-1', username: 'juma_m', dateJoined: 'Yesterday', earningsGenerated: 250, hoursChatted: 2.5, status: 'active' },
  { id: 'ref-2', username: 'fatuma_a', dateJoined: '3 days ago', earningsGenerated: 250, hoursChatted: 4.0, status: 'active' },
  { id: 'ref-3', username: 'kelvin_ug', dateJoined: '5 days ago', earningsGenerated: 0, hoursChatted: 0.5, status: 'inactive' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Currency selection: KES (Default), TZS, UGX
  const [selectedCurrency, setSelectedCurrency] = useState<EastAfricaCurrency>('KES');

  // Conversion rates pegged to KES:
  // 1 KES = 20 TZS = 30 UGX
  const getAmountInCurrency = useCallback((amountInKes: number, targetCurrency?: EastAfricaCurrency): number => {
    const cur = targetCurrency || selectedCurrency;
    if (cur === 'TZS') return Math.round(amountInKes * 20);
    if (cur === 'UGX') return Math.round(amountInKes * 30);
    return Math.round(amountInKes);
  }, [selectedCurrency]);

  const formatShillings = useCallback((amountInKes: number): string => {
    const converted = getAmountInCurrency(amountInKes);
    const prefix = selectedCurrency === 'TZS' ? 'TSh' : selectedCurrency === 'UGX' ? 'USh' : 'KSh';
    return `${prefix} ${converted.toLocaleString()}`;
  }, [getAmountInCurrency, selectedCurrency]);

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register' | 'forgot' | 'verify' | 'otp' | 'activation'>('login');

  // Activation modal
  const [activationModalOpen, setActivationModalOpen] = useState<boolean>(false);
  const [activationInstructions, setActivationInstructions] = useState<Record<EastAfricaCountry, ActivationInstruction>>(DEFAULT_INSTRUCTIONS);

  // AI Partners
  const [partners] = useState<AIPartner[]>(AI_PARTNERS);
  const [currentPartner, setCurrentPartner] = useState<AIPartner>(AI_PARTNERS[0]);
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);

  // Chat message store
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'uk-ethan': [
      {
        id: 'msg-01',
        senderId: 'uk-ethan',
        senderName: 'Ethan Foster',
        receiverId: 'usr_001',
        text: 'Jambo! I am Ethan from London. I am planning a trip to Nairobi and Mombasa soon. Could you teach me the best way to introduce myself in Kiswahili?',
        timestamp: '10:00 AM',
        status: 'read',
        isAi: true
      }
    ],
    'us-emma': [
      {
        id: 'msg-02',
        senderId: 'us-emma',
        senderName: 'Emma Miller',
        receiverId: 'usr_001',
        text: 'Hello rafiki! My name is Emma from Seattle. I teach 3rd graders and we are studying world languages. Can you teach me how to greet children in Swahili?',
        timestamp: 'Yesterday',
        status: 'read',
        isAi: true
      }
    ]
  });

  // Timer & Live Reward System (500 KES / completed hour)
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [coinsEarnedThisSession, setCoinsEarnedThisSession] = useState<number>(0);
  const lastActivityTimestamp = useRef<number>(Date.now());
  const hoursRewardedSoFar = useRef<number>(0);

  // Wallet states (in KES baseline)
  const [coinBalance, setCoinBalance] = useState<number>(2750);
  const [todayEarnings, setTodayEarnings] = useState<number>(750);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(2100);
  const [totalEarnings, setTotalEarnings] = useState<number>(4250);
  const [hoursChatted, setHoursChatted] = useState<number>(3.5);
  const [referralEarnings, setReferralEarnings] = useState<number>(500);
  const [dailyStreak, setDailyStreak] = useState<number>(4);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  // Settings
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Daily Streak Days
  const [dailyStreakDays, setDailyStreakDays] = useState<DailyStreakDay[]>([
    { dayNumber: 1, rewardCoins: 50, isClaimed: true, isCurrent: false },
    { dayNumber: 2, rewardCoins: 75, isClaimed: true, isCurrent: false },
    { dayNumber: 3, rewardCoins: 100, isClaimed: true, isCurrent: false },
    { dayNumber: 4, rewardCoins: 150, isClaimed: false, isCurrent: true },
    { dayNumber: 5, rewardCoins: 200, isClaimed: false, isCurrent: false },
    { dayNumber: 6, rewardCoins: 300, isClaimed: false, isCurrent: false },
    { dayNumber: 7, rewardCoins: 500, isClaimed: false, isCurrent: false }
  ]);

  // Spin Wheel state
  const [canSpinWheel, setCanSpinWheel] = useState(true);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Referrals
  const referralCode = 'SHILLINGS-' + (user?.username.slice(0, 4).toUpperCase() || '7729');
  const [referralsList] = useState<ReferralUser[]>(INITIAL_REFERRALS);

  // Pending Account Activations (500 KES fee)
  const [pendingActivations, setPendingActivations] = useState<PendingActivation[]>([
    {
      id: 'act-001',
      userId: 'usr_004',
      username: 'kelvin_ug',
      fullName: 'Kelvin Mugisha',
      country: 'Uganda',
      currency: 'UGX',
      amount: 15000,
      method: 'mtn_uganda',
      transactionCode: 'MTN-8849201',
      phone: '+256 772 443 119',
      submittedAt: '15 mins ago',
      status: 'pending'
    },
    {
      id: 'act-002',
      userId: 'usr_005',
      username: 'mwajuma_tz',
      fullName: 'Mwajuma Rashid',
      country: 'Tanzania',
      currency: 'TZS',
      amount: 10000,
      method: 'mpesa_tanzania',
      transactionCode: 'TZ99182XP',
      phone: '+255 754 883 102',
      submittedAt: '1 hour ago',
      status: 'approved'
    }
  ]);

  // Admin users list
  const [adminUsers, setAdminUsers] = useState<UserProfile[]>([
    DEFAULT_USER,
    {
      id: 'usr_002',
      fullName: 'Juma Mwangi',
      username: 'juma_m',
      email: 'juma@example.com',
      phone: '+254 722 998 112',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      country: 'Kenya',
      currency: 'KES',
      nativeLanguage: 'Kiswahili',
      bio: 'University student in Nairobi earning while teaching.',
      role: 'user',
      isVerified: true,
      isActivated: true,
      status: 'active',
      createdAt: '2025-02-01'
    },
    {
      id: 'usr_003',
      fullName: 'Fatuma Ally',
      username: 'fatuma_a',
      email: 'fatuma@example.com',
      phone: '+255 784 112 334',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      country: 'Tanzania',
      currency: 'TZS',
      nativeLanguage: 'Kiswahili',
      bio: 'Swahili educator in Dar es Salaam.',
      role: 'user',
      isVerified: true,
      isActivated: true,
      status: 'active',
      createdAt: '2025-02-14'
    },
    {
      id: 'usr_004',
      fullName: 'Kelvin Mugisha',
      username: 'kelvin_ug',
      email: 'kelvin@example.com',
      phone: '+256 772 443 119',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      country: 'Uganda',
      currency: 'UGX',
      nativeLanguage: 'English / Luganda',
      bio: 'Practicing conversational Kiswahili from Kampala.',
      role: 'user',
      isVerified: true,
      isActivated: false, // Pending activation
      status: 'active',
      createdAt: '2025-02-20'
    }
  ]);

  const [withdrawalsQueue, setWithdrawalsQueue] = useState<WithdrawalRequest[]>([
    {
      id: 'w-101',
      userId: 'usr_001',
      userName: 'Doreen Lelo',
      amountCoins: 2000,
      amountCash: 2000,
      currency: 'KES',
      paymentMethod: 'mpesa',
      accountDetails: '+254 712 345 678 (Safaricom M-Pesa)',
      requestedAt: '2 hours ago',
      status: 'pending'
    },
    {
      id: 'w-100',
      userId: 'usr_002',
      userName: 'Juma Mwangi',
      amountCoins: 5000,
      amountCash: 5000,
      currency: 'KES',
      paymentMethod: 'mpesa',
      accountDetails: '+254 722 998 112 (Safaricom M-Pesa)',
      requestedAt: 'Yesterday',
      status: 'approved'
    }
  ]);

  // Admin stats
  const adminStats = {
    totalUsers: adminUsers.length + 1840,
    activeToday: 428,
    totalHours: 12450,
    totalPayoutsUsd: 14200,
    totalShillingsPayouts: 1846000
  };

  const adminWithdrawals = withdrawalsQueue.map(w => ({
    id: w.id,
    userName: w.userName,
    amountCoins: w.amountCoins,
    amountUsd: +(w.amountCoins / 130).toFixed(2),
    method: w.paymentMethod,
    accountIdentifier: w.accountDetails,
    requestedAt: w.requestedAt,
    status: w.status === 'approved' ? 'completed' : w.status === 'rejected' ? 'rejected' : 'processing'
  }));

  // TIMER ENGINE EFFECT (500 KSh / completed hour)
  useEffect(() => {
    if (activeTab !== 'chat' || isTimerPaused) return;

    // Check if user is activated
    if (user && !user.isActivated) {
      setIsTimerPaused(true);
      return;
    }

    const interval = setInterval(() => {
      // 5 min inactivity pause
      const now = Date.now();
      if (now - lastActivityTimestamp.current > 300000) {
        setIsTimerPaused(true);
        showToast('Chat timer paused due to 5 min inactivity. Send a message to resume!');
        return;
      }

      setSessionSeconds(prev => {
        const next = prev + 1;
        const completedHours = Math.floor(next / 3600);
        if (completedHours > hoursRewardedSoFar.current) {
          const hoursAwarded = completedHours - hoursRewardedSoFar.current;
          const shillingsEarned = hoursAwarded * 500;
          hoursRewardedSoFar.current = completedHours;

          setCoinBalance(c => c + shillingsEarned);
          setTodayEarnings(t => t + shillingsEarned);
          setWeeklyEarnings(w => w + shillingsEarned);
          setTotalEarnings(tot => tot + shillingsEarned);
          setHoursChatted(h => +(h + hoursAwarded).toFixed(2));
          setCoinsEarnedThisSession(s => s + shillingsEarned);

          const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            type: 'chat_reward',
            title: `Chat Reward (${completedHours} ${completedHours === 1 ? 'Hour' : 'Hours'})`,
            description: `Earned for active conversation milestone with ${currentPartner.name}`,
            amount: shillingsEarned,
            currency: user?.currency || 'KES',
            timestamp: 'Just now',
            status: 'completed'
          };
          setTransactions(txs => [newTx, ...txs]);

          sounds.playCoinReward();
          showToast(`🎉 Milestone reached! You earned ${formatShillings(shillingsEarned)} for ${completedHours} hour(s) of active chatting!`);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, currentPartner.name, formatShillings, isTimerPaused, showToast, user]);

  // Fast forward helper for demo / testing
  const fastForwardTimer = useCallback((secondsToAdd: number) => {
    lastActivityTimestamp.current = Date.now();
    setIsTimerPaused(false);
    setSessionSeconds(prev => {
      const next = prev + secondsToAdd;
      const completedHours = Math.floor(next / 3600);
      if (completedHours > hoursRewardedSoFar.current) {
        const hoursAwarded = completedHours - hoursRewardedSoFar.current;
        const shillingsEarned = hoursAwarded * 500;
        hoursRewardedSoFar.current = completedHours;

        setCoinBalance(c => c + shillingsEarned);
        setTodayEarnings(t => t + shillingsEarned);
        setWeeklyEarnings(w => w + shillingsEarned);
        setTotalEarnings(tot => tot + shillingsEarned);
        setHoursChatted(h => +(h + hoursAwarded).toFixed(2));
        setCoinsEarnedThisSession(s => s + shillingsEarned);

        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          type: 'chat_reward',
          title: `Chat Reward (${completedHours} ${completedHours === 1 ? 'Hour' : 'Hours'})`,
          description: `Earned for active conversation milestone with ${currentPartner.name}`,
          amount: shillingsEarned,
          currency: user?.currency || 'KES',
          timestamp: 'Just now',
          status: 'completed'
        };
        setTransactions(txs => [newTx, ...txs]);
        sounds.playCoinReward();
        showToast(`🎉 Milestone reached! +${formatShillings(shillingsEarned)} added to your Shillings balance!`);
      }
      return next;
    });
  }, [currentPartner.name, formatShillings, showToast, user?.currency]);

  const resetSessionTimer = useCallback(() => {
    setSessionSeconds(0);
    setCoinsEarnedThisSession(0);
    hoursRewardedSoFar.current = 0;
    lastActivityTimestamp.current = Date.now();
  }, []);

  // Send Message
  const sendMessage = useCallback(async (text: string, isVoiceNote = false, audioDuration?: number) => {
    if (!text.trim() && !isVoiceNote) return;

    if (user && !user.isActivated) {
      setActivationModalOpen(true);
      showToast('⚠️ Please activate your account with 500 KES to unlock unlimited chatting and earn rewards!');
      return;
    }

    lastActivityTimestamp.current = Date.now();
    if (isTimerPaused) {
      setIsTimerPaused(false);
    }

    const partnerId = currentPartner.id;
    const userMsgId = `msg-${Date.now()}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: userMsgId,
      senderId: user?.id || 'usr_001',
      senderName: user?.fullName || 'You',
      receiverId: partnerId,
      text: text || (isVoiceNote ? '🎤 Audio Voice Note' : ''),
      timestamp: nowStr,
      status: 'sent',
      isAi: false,
      isVoiceNote,
      audioDuration
    };

    setMessages(prev => ({
      ...prev,
      [partnerId]: [...(prev[partnerId] || []), userMessage]
    }));

    sounds.playMessageSent();
    setIsPartnerTyping(true);

    try {
      const convHistory = (messages[partnerId] || []).slice(-6);
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner: currentPartner,
          message: text,
          conversationHistory: convHistory
        })
      });

      if (!res.ok) throw new Error('Network response not ok');
      const data = await res.json();

      setIsPartnerTyping(false);

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: partnerId,
        senderName: currentPartner.name,
        receiverId: user?.id || 'usr_001',
        text: data.text || 'Jambo! Asante sana kwa mafundisho haya mazuri.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        isAi: true,
        correction: data.correction
      };

      setMessages(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), aiMessage]
      }));

      sounds.playMessageReceived();
    } catch {
      setIsPartnerTyping(false);
      const fallbackAiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: partnerId,
        senderName: currentPartner.name,
        receiverId: user?.id || 'usr_001',
        text: `Habari rafiki! That is wonderful. I love practicing Kiswahili with you. In ${currentPartner.country} we are fascinated by East African culture. What other phrases should I know?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        isAi: true
      };

      setMessages(prev => ({
        ...prev,
        [partnerId]: [...(prev[partnerId] || []), fallbackAiMsg]
      }));
      sounds.playMessageReceived();
    }
  }, [currentPartner, isTimerPaused, messages, showToast, user]);

  // Auth: Login
  const login = useCallback((emailOrUser: string, _pass: string) => {
    const found = adminUsers.find(
      u => u.email.toLowerCase() === emailOrUser.toLowerCase() || u.username.toLowerCase() === emailOrUser.toLowerCase()
    );
    if (found) {
      setUser(found);
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      setSelectedCurrency(found.currency || 'KES');

      if (!found.isActivated) {
        setActivationModalOpen(true);
        showToast(`Karibu ${found.fullName}! Please complete your 500 KSh account activation.`);
      } else {
        showToast(`Karibu tena, ${found.fullName}!`);
      }
      return true;
    }

    // Default dynamic login
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      email: emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@example.com`,
      username: emailOrUser.split('@')[0],
      fullName: emailOrUser.split('@')[0].toUpperCase(),
      isActivated: true
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    showToast(`Welcome to Shillings Chat Earn, ${newUser.fullName}!`);
    return true;
  }, [adminUsers, showToast]);

  // Auth: Register (Creates pending account requiring 500 KES activation)
  const register = useCallback((data: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    country: EastAfricaCountry;
    password: string;
  }) => {
    const countryCurrencyMap: Record<EastAfricaCountry, EastAfricaCurrency> = {
      Kenya: 'KES',
      Uganda: 'UGX',
      Tanzania: 'TZS'
    };

    const cur = countryCurrencyMap[data.country] || 'KES';
    setSelectedCurrency(cur);

    const newUser: UserProfile = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      fullName: data.fullName,
      username: data.username.toLowerCase().trim(),
      email: data.email,
      phone: data.phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      country: data.country,
      currency: cur,
      nativeLanguage: data.country === 'Uganda' ? 'English / Luganda' : 'Kiswahili',
      bio: 'New Kiswahili tutor ready to chat with foreign friends and earn Shillings!',
      role: 'user',
      isVerified: true,
      isActivated: false, // Must be activated with 500 KES fee
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setAdminUsers(prev => [newUser, ...prev]);
    setAuthModalOpen(false);
    setActivationModalOpen(true); // Direct to activation screen

    const feeAmount = cur === 'UGX' ? '15,000 UGX (via MTN MoMo)' : cur === 'TZS' ? '10,000 TZS' : '500 KES (via M-Pesa)';
    showToast(`Account created for @${data.username}! Complete your ${feeAmount} activation to begin.`);
  }, [showToast]);

  // Account Activation Submission (M-Pesa / MTN MoMo code)
  const submitActivationPayment = useCallback((transactionCode: string, method: string, phone: string) => {
    if (!transactionCode || transactionCode.length < 4) {
      showToast('Please enter a valid Transaction Confirmation Code.');
      return;
    }

    const cur = user?.currency || selectedCurrency || 'KES';
    const amount = cur === 'UGX' ? 15000 : cur === 'TZS' ? 10000 : 500;

    const newActivation: PendingActivation = {
      id: `act-${Date.now().toString().slice(-4)}`,
      userId: user?.id || 'usr_001',
      username: user?.username || 'user',
      fullName: user?.fullName || 'User',
      country: (user?.country as EastAfricaCountry) || 'Kenya',
      currency: cur,
      amount,
      method,
      transactionCode: transactionCode.toUpperCase(),
      phone: phone || user?.phone || '',
      submittedAt: 'Just now',
      status: 'approved' // Automatically activate so user immediately gets access!
    };

    setPendingActivations(prev => [newActivation, ...prev]);

    // Activate the user!
    if (user) {
      setUser({
        ...user,
        isActivated: true,
        activationPayment: {
          transactionCode: transactionCode.toUpperCase(),
          method,
          amount,
          currency: cur,
          phoneNumber: phone || user.phone,
          status: 'active',
          paidAt: new Date().toLocaleString()
        }
      });
    }

    // Add 250 Shillings welcome starter bonus
    setCoinBalance(c => c + 250);

    // Record transactions
    const actTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'activation_fee',
      title: 'Account Activated',
      description: `Payment of ${formatShillings(500)} confirmed (Ref: ${transactionCode.toUpperCase()})`,
      amount: -500,
      currency: cur,
      timestamp: 'Just now',
      status: 'completed'
    };

    const bonusTx: Transaction = {
      id: `tx-${Date.now() + 1}`,
      type: 'achievement_reward',
      title: 'Welcome Starter Bonus',
      description: 'Reward for activating your tutor account',
      amount: 250,
      currency: cur,
      timestamp: 'Just now',
      status: 'completed'
    };

    setTransactions(prev => [bonusTx, actTx, ...prev]);
    setActivationModalOpen(false);
    sounds.playCelebration();
    showToast(`🎉 Hongera! Your account is activated. +${formatShillings(250)} welcome bonus added!`);
  }, [formatShillings, selectedCurrency, showToast, user]);

  // STK Push / Instant Sim
  const simulateStkPush = useCallback(async (phone: string, country: EastAfricaCountry): Promise<boolean> => {
    const provider = country === 'Uganda' ? 'MTN Mobile Money' : 'Safaricom M-Pesa';
    showToast(`📲 Prompt sent to ${phone}! Enter your ${provider} PIN to confirm payment.`);
    await new Promise(resolve => setTimeout(resolve, 2500));

    const fakeCode = (country === 'Uganda' ? 'MTN' : 'QK') + Math.random().toString(36).substring(2, 8).toUpperCase();
    submitActivationPayment(fakeCode, country === 'Uganda' ? 'mtn_uganda' : 'mpesa_kenya', phone);
    return true;
  }, [showToast, submitActivationPayment]);

  // Admin approves activation
  const approveActivation = useCallback((id: string) => {
    setPendingActivations(prev =>
      prev.map(a => {
        if (a.id === id) {
          return { ...a, status: 'approved' };
        }
        return a;
      })
    );

    // If current logged-in user matches, activate them
    const target = pendingActivations.find(a => a.id === id);
    if (target && user && user.id === target.userId) {
      setUser({ ...user, isActivated: true });
    }

    sounds.playCoinReward();
    showToast(`Activation #${id} has been approved!`);
  }, [pendingActivations, showToast, user]);

  const rejectActivation = useCallback((id: string) => {
    setPendingActivations(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'rejected' } : a))
    );
    showToast(`Activation #${id} rejected.`);
  }, [showToast]);

  const updateActivationInstruction = useCallback((country: EastAfricaCountry, updated: Partial<ActivationInstruction>) => {
    setActivationInstructions(prev => ({
      ...prev,
      [country]: { ...prev[country], ...updated }
    }));
    showToast(`Payment instructions for ${country} updated!`);
  }, [showToast]);

  const verifyOtp = useCallback((code: string) => {
    if (code.length >= 4) {
      if (user) {
        setUser({ ...user, isVerified: true });
      }
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      showToast('🎉 Phone verified successfully!');
      return true;
    }
    return false;
  }, [showToast, user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('landing');
    showToast('Logged out successfully.');
  }, [showToast]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
      showToast('Profile updated successfully!');
    }
  }, [showToast, user]);

  // Request Withdrawal
  const requestWithdrawal = useCallback(async (
    amountShillings: number,
    method: string,
    details: string
  ) => {
    if (amountShillings < 500) {
      return { success: false, message: `Minimum withdrawal is ${formatShillings(500)}.` };
    }
    if (amountShillings > coinBalance) {
      return { success: false, message: 'Insufficient balance.' };
    }

    const newReq: WithdrawalRequest = {
      id: `w-${Date.now().toString().slice(-4)}`,
      userId: user?.id || 'usr_001',
      userName: user?.fullName || 'User',
      amountCoins: amountShillings,
      amountCash: amountShillings,
      currency: user?.currency || selectedCurrency || 'KES',
      paymentMethod: method,
      accountDetails: details,
      requestedAt: 'Just now',
      status: 'pending'
    };

    setWithdrawalsQueue(prev => [newReq, ...prev]);
    setCoinBalance(prev => prev - amountShillings);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdrawal',
      title: `Withdrawal (${method.toUpperCase()})`,
      description: `Dispatched to ${details}`,
      amount: -amountShillings,
      currency: user?.currency || selectedCurrency || 'KES',
      timestamp: 'Just now',
      status: 'pending',
      payoutMethod: method as any,
      payoutDetails: details
    };
    setTransactions(prev => [tx, ...prev]);

    sounds.playCoinReward();
    showToast(`Withdrawal of ${formatShillings(amountShillings)} sent to ${method.toUpperCase()}! Processing instantly.`);
    return { success: true, message: 'Withdrawal submitted successfully!' };
  }, [coinBalance, formatShillings, selectedCurrency, showToast, user?.currency, user?.fullName, user?.id]);

  // Spin Wheel
  const spinWheel = useCallback(async (): Promise<number> => {
    if (!canSpinWheel) return 0;
    setCanSpinWheel(false);

    const prizeValues = [50, 100, 250, 500, 1000, 200];
    const prize = prizeValues[Math.floor(Math.random() * prizeValues.length)];

    setTimeout(() => {
      setCoinBalance(c => c + prize);
      setTodayEarnings(t => t + prize);
      setTotalEarnings(tot => tot + prize);

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'spin_wheel',
        title: 'Lucky Spin Prize',
        description: `Won ${prize} Shillings from the spin wheel`,
        amount: prize,
        currency: user?.currency || 'KES',
        timestamp: 'Just now',
        status: 'completed'
      };
      setTransactions(prev => [tx, ...prev]);
      sounds.playCelebration();
      showToast(`🎡 Congratulations! You won ${formatShillings(prize)} on the Lucky Wheel!`);
    }, 4000);

    return prize;
  }, [canSpinWheel, formatShillings, showToast, user?.currency]);

  // Claim Daily Streak
  const claimDailyStreak = useCallback((dayNumber: number) => {
    setDailyStreakDays(prev =>
      prev.map(d => {
        if (d.dayNumber === dayNumber && !d.isClaimed) {
          const reward = d.rewardCoins;
          setCoinBalance(c => c + reward);
          setTodayEarnings(t => t + reward);
          setDailyStreak(s => s + 1);

          const tx: Transaction = {
            id: `tx-${Date.now()}`,
            type: 'daily_checkin',
            title: `Day ${dayNumber} Streak Reward`,
            description: `Consecutive daily attendance bonus`,
            amount: reward,
            currency: user?.currency || 'KES',
            timestamp: 'Just now',
            status: 'completed'
          };
          setTransactions(txs => [tx, ...txs]);
          sounds.playCoinReward();
          showToast(`🔥 Claimed Day ${dayNumber} streak: +${formatShillings(reward)}!`);
          return { ...d, isClaimed: true, isCurrent: false };
        }
        return d;
      })
    );
  }, [formatShillings, showToast, user?.currency]);

  // Claim Achievement
  const claimAchievement = useCallback((id: string) => {
    setAchievements(prev =>
      prev.map(a => {
        if (a.id === id && a.isUnlocked && !a.isClaimed) {
          setCoinBalance(c => c + a.rewardCoins);
          setTotalEarnings(t => t + a.rewardCoins);

          const tx: Transaction = {
            id: `tx-${Date.now()}`,
            type: 'achievement_reward',
            title: `Achievement: ${a.title}`,
            description: a.description,
            amount: a.rewardCoins,
            currency: user?.currency || 'KES',
            timestamp: 'Just now',
            status: 'completed'
          };
          setTransactions(txs => [tx, ...txs]);
          sounds.playCelebration();
          showToast(`🏅 Claimed ${formatShillings(a.rewardCoins)} for "${a.title}"!`);
          return { ...a, isClaimed: true };
        }
        return a;
      })
    );
  }, [formatShillings, showToast, user?.currency]);

  // Admin user status toggle
  const toggleUserStatus = useCallback((userId: string) => {
    setAdminUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`User @${u.username} status changed to ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  }, [showToast]);

  // Admin withdrawal action
  const handleWithdrawalAction = useCallback((id: string, action: 'approve' | 'reject') => {
    setWithdrawalsQueue(prev =>
      prev.map(w => {
        if (w.id === id) {
          return { ...w, status: action === 'approve' ? 'approved' : 'rejected' };
        }
        return w;
      })
    );

    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === `tx-${id.replace('w-', '')}` || tx.type === 'withdrawal') {
          return { ...tx, status: action === 'approve' ? 'completed' : 'rejected' };
        }
        return tx;
      })
    );

    showToast(`Withdrawal #${id} has been ${action}d.`);
  }, [showToast]);

  const updateWithdrawalStatus = useCallback((id: string, status: 'completed' | 'rejected') => {
    handleWithdrawalAction(id, status === 'completed' ? 'approve' : 'reject');
  }, [handleWithdrawalAction]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCurrency,
        setSelectedCurrency,
        formatShillings,
        getAmountInCurrency,
        user,
        isAuthenticated,
        authModalOpen,
        setAuthModalOpen,
        authModalView,
        setAuthModalView,
        login,
        register,
        verifyOtp,
        logout,
        updateProfile,
        activationModalOpen,
        setActivationModalOpen,
        activationInstructions,
        updateActivationInstruction,
        submitActivationPayment,
        simulateStkPush,
        pendingActivations,
        approveActivation,
        rejectActivation,
        partners,
        currentPartner,
        setCurrentPartner,
        messages,
        sendMessage,
        isPartnerTyping,
        sessionSeconds,
        isTimerPaused,
        setIsTimerPaused,
        coinsEarnedThisSession,
        fastForwardTimer,
        resetSessionTimer,
        coinBalance,
        todayEarnings,
        weeklyEarnings,
        totalEarnings,
        hoursChatted,
        referralEarnings,
        dailyStreak,
        transactions,
        requestWithdrawal,
        canSpinWheel,
        spinWheel,
        dailyStreakDays,
        claimDailyStreak,
        achievements,
        claimAchievement,
        referralCode,
        referralsList,
        adminUsers,
        toggleUserStatus,
        withdrawalsQueue,
        adminWithdrawals,
        adminStats,
        handleWithdrawalAction,
        updateWithdrawalStatus,
        darkMode,
        setDarkMode,
        soundEnabled,
        setSoundEnabled,
        language,
        setLanguage,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
