import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AI_PARTNERS } from '../../data/aiFriends';
import {
  Wallet,
  TrendingUp,
  Clock,
  Flame,
  Users,
  MessageSquare,
  ArrowRight,
  Gift,
  Sparkles,
  Play,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Coins
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    user,
    coinBalance,
    todayEarnings,
    weeklyEarnings,
    totalEarnings,
    hoursChatted,
    referralEarnings,
    dailyStreak,
    setActiveTab,
    setCurrentPartner,
    sessionSeconds,
    referralCode,
    formatShillings,
    setActivationModalOpen,
    showToast
  } = useApp();

  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(`https://shillings.app/join?ref=${referralCode}`);
    setCopied(true);
    showToast('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isChatting = sessionSeconds > 0;
  const quickPartners = AI_PARTNERS.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 text-slate-100">
      {/* 0. ACCOUNT ACTIVATION STATUS BANNER (If not activated) */}
      {user && !user.isActivated && (
        <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-900 border border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-2xl shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase mb-1">
                Account Activation Pending
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Pay 500 Kenya Shillings (or via MTN MoMo / TZS) to Unlock System
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Your account is ready! Complete the one-time 500 KSh activation fee to unlock chatting with all 24 foreign learners and start earning 500 Shillings/hr.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivationModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Activate Account (500 KSh)</span>
          </button>
        </div>
      )}

      {/* 1. WELCOME CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#111827] via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow">
                Online
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Habari, {user?.fullName}!
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                  Swahili Tutor
                </span>
                {user?.isActivated && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Activated
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                @{user?.username} • {user?.country} • Earning 500 Shillings/hr
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {dailyStreak} Day Streak
                </span>
                <span className="text-xs text-slate-400">
                  Hourly Reward Rate: <strong className="text-emerald-400">{formatShillings(500)} / hr</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                if (user && !user.isActivated) {
                  setActivationModalOpen(true);
                  showToast('Please activate your account with 500 KES first.');
                } else {
                  setActiveTab('chat');
                }
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm transition active:scale-95"
            >
              {isChatting ? (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume Active Chat</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Chatting</span>
                </>
              )}
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 text-xs transition"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Spin Wheel</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. CORE FINANCIAL & ENGAGEMENT METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Wallet Balance */}
        <div
          onClick={() => setActiveTab('wallet')}
          className="bg-[#111827] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Wallet Balance</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {formatShillings(coinBalance)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Ready for instant M-Pesa / MTN cashout
          </p>
        </div>

        {/* Today's Earnings */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Today's Earnings</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            +{formatShillings(todayEarnings)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Conversations & daily bonuses today
          </p>
        </div>

        {/* Weekly Earnings */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Weekly Earnings</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {formatShillings(weeklyEarnings)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Last 7 days total</p>
        </div>

        {/* Total Lifetime Earnings */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Lifetime</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white">
            {formatShillings(totalEarnings)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total earned since joining
          </p>
        </div>
      </div>

      {/* SECONDARY ROW: Hours Chatted, Referral Earnings, Daily Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Hours Chatted */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Hours Chatted</div>
            <div className="text-xl font-bold text-white mt-0.5">{hoursChatted} hrs</div>
            <div className="text-[10px] text-emerald-400">500 Shillings awarded per hr</div>
          </div>
        </div>

        {/* Referral Earnings */}
        <div
          onClick={() => setActiveTab('referrals')}
          className="bg-[#111827] border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition group"
        >
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white rounded-xl transition">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Referral Earnings</div>
            <div className="text-xl font-bold text-white mt-0.5">{formatShillings(referralEarnings)}</div>
            <div className="text-[10px] text-purple-400">250 Shillings per friend</div>
          </div>
        </div>

        {/* Daily Streak */}
        <div
          onClick={() => setActiveTab('rewards')}
          className="bg-[#111827] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition group"
        >
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-white rounded-xl transition">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Daily Streak</div>
            <div className="text-xl font-bold text-white mt-0.5">{dailyStreak} Days Active</div>
            <div className="text-[10px] text-amber-400">Check in today for bonus</div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE PARTNERS QUICK-ACCESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-heading text-white">Recommended AI Language Partners</h2>
            <p className="text-xs text-slate-400">Foreigners eager to learn Swahili from you right now</p>
          </div>
          <button
            onClick={() => setActiveTab('directory')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <span>View All 24</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickPartners.map(partner => (
            <div
              key={partner.id}
              className="bg-[#111827] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                  <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111827]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white truncate">{partner.name}</h3>
                    <span className="text-xs">{partner.flag}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{partner.country} • {partner.age} yrs</p>
                  <span className="text-[10px] text-emerald-400 font-medium">{partner.swahiliLevel}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                "{partner.bio}"
              </p>

              <button
                onClick={() => {
                  if (user && !user.isActivated) {
                    setActivationModalOpen(true);
                    showToast('Please activate your account with 500 KES first.');
                  } else {
                    setCurrentPartner(partner);
                    setActiveTab('chat');
                  }
                }}
                className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with {partner.name.split(' ')[0]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. REFERRAL QUICK-INVITE BANNER */}
      <div className="bg-gradient-to-r from-purple-950/50 to-slate-900 border border-purple-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">Invite Friends & Earn 250 Shillings Each</h3>
            <p className="text-xs text-slate-300 mt-0.5">Share your invite link with Swahili speakers and earn instant bonus rewards.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="px-3 py-2 bg-black/60 border border-purple-500/30 rounded-xl text-xs font-mono font-bold text-purple-300">
            {referralCode}
          </div>
          <button
            onClick={handleCopyRef}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
