import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { Compass, MessageSquare, Users, Wallet, Gift } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, sessionSeconds } = useApp();

  if (!isAuthenticated) return null;

  const tabs: { tab: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Home', icon: Compass },
    { tab: 'chat', label: 'Chat', icon: MessageSquare },
    { tab: 'directory', label: 'Partners', icon: Users },
    { tab: 'wallet', label: 'Wallet', icon: Wallet },
    { tab: 'rewards', label: 'Rewards', icon: Gift }
  ];

  const isChatting = sessionSeconds > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-slate-800/80 md:hidden px-3 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center w-14 py-1 relative rounded-xl transition-all ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : ''} transition-transform`} />
                {item.tab === 'chat' && isChatting && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0B0F17] animate-pulse" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
