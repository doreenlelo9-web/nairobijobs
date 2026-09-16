export type UserRole = 'user' | 'admin';
export type EastAfricaCurrency = 'KES' | 'TZS' | 'UGX';
export type EastAfricaCountry = 'Kenya' | 'Tanzania' | 'Uganda';

export interface ActivationPayment {
  transactionCode: string;
  method: 'mpesa_kenya' | 'mtn_uganda' | 'airtel_uganda' | 'mpesa_tanzania' | 'tigo_tanzania' | string;
  amount: number;
  currency: EastAfricaCurrency;
  phoneNumber: string;
  status: 'active' | 'pending';
  paidAt: string;
}

export interface ActivationInstruction {
  country: EastAfricaCountry;
  currency: EastAfricaCurrency;
  amount: number;
  provider: string;
  accountType: 'Till Number' | 'Paybill' | 'Mobile Number';
  accountNumber: string;
  accountName: string;
  instructions: string[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  country: EastAfricaCountry | string;
  currency: EastAfricaCurrency;
  nativeLanguage: string;
  bio: string;
  role: UserRole;
  isVerified: boolean;
  isActivated: boolean; // Requires 500 KES (or TZS/UGX equivalent) to unlock
  activationPayment?: ActivationPayment;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface AIPartner {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  avatar: string;
  age: number;
  gender: 'male' | 'female';
  bio: string;
  interests: string[];
  swahiliLevel: 'Absolute Beginner' | 'Elementary' | 'Curious Explorer' | 'Intermediate Learner';
  personality: string;
  nativeLanguage: string;
  favoriteTopics: string[];
  learningGoal: string;
  status: 'online' | 'offline' | 'typing';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isAi: boolean;
  correction?: {
    original: string;
    suggested: string;
    explanation: string;
  };
  audioDuration?: number;
  isVoiceNote?: boolean;
}

export interface ChatSession {
  id: string;
  partnerId: string;
  startTime: number;
  lastActiveTime: number;
  totalActiveSeconds: number;
  coinsEarned: number;
  messageCount: number;
  isPaused: boolean;
}

export type TransactionType = 'chat_reward' | 'referral_bonus' | 'daily_checkin' | 'spin_wheel' | 'achievement_reward' | 'withdrawal' | 'activation_fee';
export type TransactionStatus = 'completed' | 'pending' | 'rejected';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  amount: number; // in Shillings (positive for credit, negative for debit)
  currency?: EastAfricaCurrency;
  timestamp: string;
  status: TransactionStatus;
  referenceId?: string;
  payoutMethod?: 'mpesa' | 'mtn' | 'airtel' | 'paypal' | 'bank' | 'crypto';
  payoutDetails?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
  isClaimed: boolean;
  isUnlocked: boolean;
}

export interface ReferralUser {
  id: string;
  username: string;
  dateJoined: string;
  earningsGenerated: number;
  hoursChatted: number;
  status: 'active' | 'inactive';
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amountCoins: number;
  amountCash: number;
  currency: string;
  paymentMethod: 'mpesa' | 'mtn' | 'airtel' | 'paypal' | 'bank' | 'crypto' | string;
  accountDetails: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface DailyStreakDay {
  dayNumber: number;
  rewardCoins: number;
  isClaimed: boolean;
  isCurrent: boolean;
}
