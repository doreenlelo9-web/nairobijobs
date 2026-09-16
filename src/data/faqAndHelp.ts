import { Achievement } from '../types';

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Pick an AI Friend',
    description: 'Browse 24 foreign language partners from the UK, USA, Germany, France, and beyond. Check their background and learning goals.',
    icon: 'Users'
  },
  {
    step: '02',
    title: 'Chat & Teach Kiswahili',
    description: 'Talk in Kiswahili or English about food, family, culture, travel, and daily life. They ask questions and learn from you.',
    icon: 'MessageSquare'
  },
  {
    step: '03',
    title: 'Earn Coins Every Hour',
    description: 'The smart conversation timer tracks active banter. Earn 500 Coins for every completed hour, bonus streaks, and spin wheel prizes.',
    icon: 'Coins'
  },
  {
    step: '04',
    title: 'Instant Cash Out',
    description: 'Convert your coins into real cash. Withdraw seamlessly to M-Pesa (Kenya/Tanzania), Bank Transfer, PayPal, or Crypto.',
    icon: 'CreditCard'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Juma Mwangi',
    role: 'University Student, Nairobi',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    quote: 'Teaching Ethan and Emma Kiswahili has been amazing. I earn over 25,000 KES monthly on M-Pesa just having evening chats after classes!',
    earned: '65,400 Coins'
  },
  {
    id: 2,
    name: 'Fatuma Ally',
    role: 'Language Tutor, Dar es Salaam',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    quote: 'The AI partners actually remember previous conversations and ask real questions about Zanzibar spices. Payouts to M-Pesa are always instant.',
    earned: '92,100 Coins'
  },
  {
    id: 3,
    name: 'Brian Omondi',
    role: 'Freelancer, Mombasa',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    quote: 'I love the daily spin wheel and streak bonuses. It feels like chatting with genuine friends abroad while getting paid for my time.',
    earned: '48,750 Coins'
  }
];

export const FAQS = [
  {
    question: 'How do I earn coins on Mzungu Chat Earn?',
    answer: 'You earn 500 Coins for every 1 completed hour of active conversation with any AI friend. If you chat for 2 hours, you earn 1,000 Coins. Every extra completed hour adds another 500 Coins. You also earn from daily streaks, spin wheel, achievements, and referrals!'
  },
  {
    question: 'How does the active chat timer work?',
    answer: 'The timer counts active conversation time. To prevent spamming or idle exploitation, the timer automatically pauses if there is no message exchange for 5 minutes. As long as you and your AI friend exchange messages every few minutes, the clock ticks!'
  },
  {
    question: 'How much are Coins worth and how do I withdraw?',
    answer: '1,000 Coins equals $1.00 USD (approximately 130 KES or 2,600 TZS). You can request withdrawals directly to M-Pesa (Kenya & Tanzania), Bank Transfer, PayPal, or Crypto (USDT). Minimum withdrawal is 1,000 Coins ($1.00).'
  },
  {
    question: 'Can I practice in both English and Kiswahili?',
    answer: 'Yes! The AI friends are native English, French, German, Spanish, Italian, Swedish, or Dutch speakers who are learning Kiswahili. You can speak pure Kiswahili, mixed Swahili/English, or ask them for English vocabulary tips too.'
  },
  {
    question: 'Is this an advertising or AdSense platform?',
    answer: 'No. Mzungu Chat Earn is NOT an AdSense or ad-click website. Rewards are funded by educational language research programs and premium subscription sponsors who value high-quality Swahili dialogue data.'
  },
  {
    question: 'How does the referral program work?',
    answer: 'Share your unique referral link or QR code with friends. When they register and complete their first active hour of chatting, you receive 250 bonus Coins plus a 10% lifetime matching bonus on their chat earnings!'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Karibu',
    description: 'Complete your first message exchange with any AI friend.',
    iconName: 'Sparkles',
    progress: 1,
    maxProgress: 1,
    rewardCoins: 100,
    isClaimed: false,
    isUnlocked: true
  },
  {
    id: 'one_hour',
    title: 'Dedicated Teacher',
    description: 'Complete 1 full hour of active conversation.',
    iconName: 'Clock',
    progress: 0,
    maxProgress: 1,
    rewardCoins: 250,
    isClaimed: false,
    isUnlocked: false
  },
  {
    id: 'three_friends',
    title: 'Cultural Diplomat',
    description: 'Chat with AI friends from at least 3 different countries.',
    iconName: 'Globe',
    progress: 1,
    maxProgress: 3,
    rewardCoins: 300,
    isClaimed: false,
    isUnlocked: false
  },
  {
    id: 'streak_master',
    title: 'Daily Habit',
    description: 'Maintain a 5-day continuous chat streak.',
    iconName: 'Flame',
    progress: 3,
    maxProgress: 5,
    rewardCoins: 500,
    isClaimed: false,
    isUnlocked: false
  },
  {
    id: 'proverb_expert',
    title: 'Methali Master',
    description: 'Teach 10 Swahili proverbs or cultural customs.',
    iconName: 'BookOpen',
    progress: 2,
    maxProgress: 10,
    rewardCoins: 400,
    isClaimed: false,
    isUnlocked: false
  },
  {
    id: 'super_ref',
    title: 'Community Builder',
    description: 'Invite 3 friends to join Mzungu Chat Earn.',
    iconName: 'UserPlus',
    progress: 1,
    maxProgress: 3,
    rewardCoins: 750,
    isClaimed: false,
    isUnlocked: false
  }
];

export const ACHIEVEMENTS_LIST = INITIAL_ACHIEVEMENTS;

export const HELP_ARTICLES = [
  {
    id: 'earning-guide',
    category: 'Earning & Timer',
    title: 'How the 500 Coins/Hour Chat Timer Calculates Active banters',
    excerpt: 'Learn the exact rules for active message pacing, preventing idle pauses, and maximizing daily payouts.',
    readTime: '3 min read'
  },
  {
    id: 'mpesa-withdrawals',
    category: 'Payments & Payouts',
    title: 'Withdrawing to M-Pesa Kenya & Tanzania (Step-by-Step)',
    excerpt: 'How to enter your Safaricom or Vodacom phone number, minimum withdrawal limits, and instant verification.',
    readTime: '2 min read'
  },
  {
    id: 'teaching-swahili',
    category: 'Language Practice',
    title: 'Great Conversation Topics to Teach Your Foreign AI Partners',
    excerpt: 'Recommended discussion starters: coastal food recipes, Safari animal names, Nairobi matatu culture, and Swahili slang.',
    readTime: '4 min read'
  },
  {
    id: 'referral-strategy',
    category: 'Referral Program',
    title: 'Maximizing Passive Income With Your Referral Link & QR Code',
    excerpt: 'How our top ambassadors earn 5,000+ coins weekly by sharing on WhatsApp status and student groups.',
    readTime: '3 min read'
  }
];
