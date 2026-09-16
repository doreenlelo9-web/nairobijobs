import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  QrCode,
  Trophy,
  Coins,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ReferralView: React.FC = () => {
  const { referralCode, referralEarnings, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `https://mzungu-chat.earn/join?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast('Referral code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Referral invite link copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Habari! I am earning real money chatting with foreigners in Kiswahili on Mzungu Chat Earn. Join with my code ${referralCode} and get 250 bonus coins: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Mocked top referral champions
  const leaderboard = [
    { rank: 1, name: 'Brian Mwangi', country: '🇰🇪 Nairobi, Kenya', count: 142, earned: '35,500 Coins' },
    { rank: 2, name: 'Amina Salum', country: '🇹🇿 Dar es Salaam', count: 119, earned: '29,750 Coins' },
    { rank: 3, name: 'Kelvin Ochieng', country: '🇰🇪 Kisumu, Kenya', count: 98, earned: '24,500 Coins' },
    { rank: 4, name: 'Faith Wanjiku', country: '🇰🇪 Nakuru, Kenya', count: 76, earned: '19,000 Coins' },
    { rank: 5, name: 'Juma Bakari', country: '🇹🇿 Arusha, TZ', count: 64, earned: '16,000 Coins' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
          <Users className="w-3.5 h-3.5" />
          <span>Affiliate & Friends Program</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Invite Friends & Earn Together
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Give 250 Coins to every friend who signs up, and receive 250 Coins in your wallet automatically.
        </p>
      </div>

      {/* 1. HERO SHARE CARD & QR CODE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-gradient-to-br from-[#111827] via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Instant 250 Coins Referral Bonus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
              Share Kiswahili with your friends & earn passive coins
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
              Anyone you invite who chats with our AI friends will earn 500 Coins for their completed hours, and you will continue earning bonus rewards on their milestones.
            </p>

            {/* Links & Code Inputs */}
            <div className="mt-6 space-y-3 max-w-lg">
              {/* Code Box */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Your Unique Referral Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-black/60 border border-purple-500/40 rounded-xl text-purple-300 font-mono font-bold text-lg">
                    {referralCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Direct Link Box */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Direct Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-3 py-2.5 bg-black/60 border border-slate-700 rounded-xl text-slate-300 text-xs font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        {/* QR CODE CARD */}
        <div className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Scan to Join</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Show this QR code to friends next to you for instant registration
          </p>

          {/* Clean High-Tech SVG QR Code Pattern */}
          <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" fill="#111827" rx="3" />
              <rect x="9" y="9" width="17" height="17" fill="#ffffff" rx="2" />
              <rect x="13" y="13" width="9" height="9" fill="#16a34a" rx="1.5" />

              <rect x="70" y="5" width="25" height="25" fill="#111827" rx="3" />
              <rect x="74" y="9" width="17" height="17" fill="#ffffff" rx="2" />
              <rect x="78" y="13" width="9" height="9" fill="#16a34a" rx="1.5" />

              <rect x="5" y="70" width="25" height="25" fill="#111827" rx="3" />
              <rect x="9" y="74" width="17" height="17" fill="#ffffff" rx="2" />
              <rect x="13" y="78" width="9" height="9" fill="#16a34a" rx="1.5" />

              {/* Data modules */}
              <rect x="36" y="8" width="8" height="8" fill="#111827" />
              <rect x="50" y="8" width="8" height="8" fill="#16a34a" />
              <rect x="36" y="22" width="8" height="8" fill="#111827" />
              <rect x="50" y="22" width="8" height="8" fill="#111827" />
              <rect x="8" y="38" width="8" height="8" fill="#111827" />
              <rect x="22" y="38" width="8" height="8" fill="#16a34a" />
              <rect x="36" y="38" width="12" height="12" fill="#111827" />
              <rect x="54" y="38" width="10" height="10" fill="#111827" />
              <rect x="72" y="38" width="8" height="8" fill="#16a34a" />
              <rect x="84" y="38" width="8" height="8" fill="#111827" />
              <rect x="38" y="56" width="8" height="8" fill="#16a34a" />
              <rect x="52" y="56" width="8" height="8" fill="#111827" />
              <rect x="70" y="56" width="12" height="12" fill="#111827" />
              <rect x="86" y="56" width="6" height="6" fill="#16a34a" />
              <rect x="36" y="72" width="12" height="12" fill="#111827" />
              <rect x="54" y="72" width="10" height="10" fill="#16a34a" />
              <rect x="72" y="72" width="8" height="8" fill="#111827" />
              <rect x="42" y="88" width="8" height="8" fill="#111827" />
              <rect x="60" y="88" width="8" height="8" fill="#111827" />
              <rect x="78" y="88" width="12" height="8" fill="#16a34a" />
            </svg>
          </div>

          <div className="mt-3 font-mono text-xs text-purple-400 font-bold">
            CODE: {referralCode}
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
          <div className="text-xs text-slate-400 font-medium">Total Friends Invited</div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {Math.floor(referralEarnings / 250)} Friends
          </div>
          <p className="text-[11px] text-purple-400 mt-1">Verified registrations</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
          <div className="text-xs text-slate-400 font-medium">Total Referral Earnings</div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {referralEarnings.toLocaleString()} Coins
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">≈ ${(referralEarnings / 1000).toFixed(2)} USD</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
          <div className="text-xs text-slate-400 font-medium">Current Referral Tier</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">Silver Ambassador</div>
          <p className="text-[11px] text-slate-400 mt-1">Next tier at 10 referrals</p>
        </div>
      </div>

      {/* 3. REFERRAL LEADERBOARD */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-lg">Top Community Referrers This Month</h3>
          </div>
          <span className="text-xs text-slate-400">Updated hourly</span>
        </div>

        <div className="divide-y divide-slate-800">
          {leaderboard.map(item => (
            <div key={item.rank} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.rank === 1
                      ? 'bg-amber-400 text-black'
                      : item.rank === 2
                      ? 'bg-slate-300 text-black'
                      : item.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  #{item.rank}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.country}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400">{item.earned}</div>
                <div className="text-[11px] text-slate-400">{item.count} friends</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
