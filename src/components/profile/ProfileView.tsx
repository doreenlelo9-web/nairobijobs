import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Globe,
  Award,
  Clock,
  Coins,
  Check,
  Camera,
  Heart
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
];

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    coinBalance,
    totalEarnings,
    hoursChatted,
    dailyStreak,
    showToast
  } = useApp();

  const [fullName, setFullName] = useState(user?.fullName || 'Doreen Lelo');
  const [username, setUsername] = useState(user?.username || 'doreen_ke');
  const [email, setEmail] = useState(user?.email || 'doreenlelo9@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+254 712 345 678');
  const [country, setCountry] = useState(user?.country || 'Kenya 🇰🇪');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0]);
  const [bio, setBio] = useState('Passionate Swahili speaker helping tourists and international friends learn fluent conversational Kiswahili!');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        fullName,
        username,
        email,
        phone,
        country,
        avatar: selectedAvatar
      });
      showToast('Profile information updated successfully!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Tutor Profile</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, teaching credentials, and payout identification.
        </p>
      </div>

      {/* 1. TOP PROFILE CARD & STATS */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={selectedAvatar}
              alt={fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-emerald-500/30"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 w-fit mx-auto sm:mx-0">
                Verified Swahili Tutor
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">@{username} • {country}</p>
            <p className="text-xs text-slate-300 mt-3 max-w-lg leading-relaxed">{bio}</p>
          </div>
        </div>

        {/* Avatar Picker */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Avatar Photo
          </label>
          <div className="flex items-center gap-3">
            {AVATAR_OPTIONS.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedAvatar(img)}
                className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition ${
                  selectedAvatar === img
                    ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105'
                    : 'border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {selectedAvatar === img && (
                  <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LIFETIME TEACHING METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 text-center">
          <Coins className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{totalEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Total Coins</div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 text-center">
          <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{hoursChatted} hrs</div>
          <div className="text-[11px] text-slate-400">Chat Time</div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 text-center">
          <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{dailyStreak} Days</div>
          <div className="text-[11px] text-slate-400">Current Streak</div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 text-center">
          <Heart className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">Ethan H.</div>
          <div className="text-[11px] text-slate-400">Favorite Partner</div>
        </div>
      </div>

      {/* 3. PROFILE EDIT FORM */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-bold font-heading text-white mb-4">Edit Personal Information</h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number (for M-Pesa)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tutor Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
