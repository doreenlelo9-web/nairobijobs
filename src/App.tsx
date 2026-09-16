import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { AuthModal } from './components/auth/AuthModal';
import { ActivationModal } from './components/auth/ActivationModal';
import { LandingPage } from './components/landing/LandingPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { ChatView } from './components/chat/ChatView';
import { FriendsDirectory } from './components/friends/FriendsDirectory';
import { WalletView } from './components/wallet/WalletView';
import { RewardCenterView } from './components/rewards/RewardCenterView';
import { ReferralView } from './components/referrals/ReferralView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { SupportView } from './components/support/SupportView';
import { AdminPanel } from './components/admin/AdminPanel';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'dashboard' && <UserDashboard />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'directory' && <FriendsDirectory />}
        {activeTab === 'wallet' && <WalletView />}
        {activeTab === 'rewards' && <RewardCenterView />}
        {activeTab === 'referrals' && <ReferralView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'support' && <SupportView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Mobile Bottom Dock */}
      <BottomNav />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Account Activation Modal (500 KES fee) */}
      <ActivationModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-[#111827] border border-emerald-500/50 text-emerald-300 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
