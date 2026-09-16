import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Volume2,
  Lock,
  Globe,
  Shield,
  Trash2,
  Check
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useApp();

  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [appLanguage, setAppLanguage] = useState<'en' | 'sw'>('en');

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      showToast('Please fill all password fields.');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match.');
      return;
    }
    showToast('Password updated securely!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Settings & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize notifications, audio feedback, and account security.
        </p>
      </div>

      {/* 1. NOTIFICATIONS & AUDIO */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-5">
        <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          <span>Notifications & Sound</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Interactive Sound Effects</div>
              <div className="text-xs text-slate-400">Play audio when messages, coins, or spin rewards arrive</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSoundEffects(!soundEffects);
                showToast(`Sound effects ${!soundEffects ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                soundEffects ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Push Notifications</div>
              <div className="text-xs text-slate-400">Receive alerts when AI friends respond to conversations</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setNotifications(!notifications);
                showToast(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                notifications ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Daily Streak Reminder</div>
              <div className="text-xs text-slate-400">Get a reminder before midnight to protect your active streak</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setStreakReminders(!streakReminders);
                showToast(`Streak reminders ${!streakReminders ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                streakReminders ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECURITY (PASSWORD CHANGE) */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 3. DANGER ZONE */}
      <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-rose-400 text-base flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            <span>Danger Zone: Close Account</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Permanently delete your account, accumulated coins, and conversation records.
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast('Account deletion protection enabled. Please contact support.')}
          className="px-4 py-2 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold border border-rose-500/40 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
