import React, { useState } from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { EastAfricaCurrency } from '../../types';
import {
  MessageSquare,
  Wallet,
  Gift,
  Users,
  User,
  Settings as SettingsIcon,
  HelpCircle,
  ShieldCheck,
  LogOut,
  Flame,
  Menu,
  X,
  Compass,
  Coins,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    isAuthenticated,
    coinBalance,
    formatShillings,
    selectedCurrency,
    setSelectedCurrency,
    dailyStreak,
    setAuthModalOpen,
    setAuthModalView,
    setActivationModalOpen,
    logout,
    sessionSeconds,
    currentPartner
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navItems: { tab: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: Compass },
    { tab: 'chat', label: 'Chat', icon: MessageSquare },
    { tab: 'directory', label: 'AI Friends', icon: Users },
    { tab: 'wallet', label: 'Wallet', icon: Wallet },
    { tab: 'rewards', label: 'Rewards', icon: Gift },
    { tab: 'referrals', label: 'Referrals', icon: Flame },
    { tab: 'support', label: 'Support', icon: HelpCircle }
  ];

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const isChatting = sessionSeconds > 0;

  const currencies: { code: EastAfricaCurrency; label: string; flag: string; symbol: string }[] = [
    { code: 'KES', label: 'Kenya Shillings', flag: '🇰🇪', symbol: 'KSh' },
    { code: 'TZS', label: 'Tanzania Shillings', flag: '🇹🇿', symbol: 'TSh' },
    { code: 'UGX', label: 'Uganda Shillings', flag: '🇺🇬', symbol: 'USh' }
  ];

  const currentCurrencyMeta = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-white font-bold text-xl">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl text-white tracking-tight">Shillings</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CHAT & EARN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Kenya • Tanzania • Uganda (MTN & M-Pesa)</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.tab === 'chat' && isChatting && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector (KES, TZS, UGX) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 transition"
              >
                <span>{currentCurrencyMeta.flag}</span>
                <span>{currentCurrencyMeta.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#111827] border border-slate-700 rounded-2xl shadow-xl py-1 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    Display Currency
                  </div>
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCurrency(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-800 transition ${
                        selectedCurrency === c.code ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* Account Activation Banner Button if unactivated */}
                {user && !user.isActivated && (
                  <button
                    onClick={() => setActivationModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition animate-pulse"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Activate (500 KSh)</span>
                    <span className="sm:hidden">Activate</span>
                  </button>
                )}

                {/* Active Chat Pill (if session ongoing) */}
                {isChatting && activeTab !== 'chat' && (
                  <button
                    onClick={() => handleNav('chat')}
                    className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-xs text-emerald-300 animate-pulse hover:border-emerald-400 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Chatting ({currentPartner.name.split(' ')[0]})</span>
                  </button>
                )}

                {/* Streak Badge */}
                <button
                  onClick={() => handleNav('rewards')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold hover:bg-amber-500/20 transition"
                  title={`${dailyStreak} Day Streak`}
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dailyStreak}d</span>
                </button>

                {/* Shillings Balance Pill */}
                <button
                  onClick={() => handleNav('wallet')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-emerald-500/30 rounded-xl hover:border-emerald-400 hover:bg-slate-800 transition group shadow-sm"
                >
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                      {formatShillings(coinBalance)}
                    </div>
                    <div className="text-[9px] text-emerald-400 font-medium leading-none">
                      Wallet Balance
                    </div>
                  </div>
                </button>

                {/* Profile Avatar / Menu */}
                <button
                  onClick={() => handleNav('profile')}
                  className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 transition ring-2 ring-emerald-500/20"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.fullName}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Admin Switcher */}
                <button
                  onClick={() => handleNav('admin')}
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                    activeTab === 'admin'
                      ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                      : 'border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40'
                  }`}
                  title="Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalView('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalView('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition active:scale-95"
                >
                  Join (500 KSh)
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F17] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          {isAuthenticated && (
            <>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-2xl border border-slate-800 mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar}
                    alt={user?.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">{user?.fullName}</div>
                    <div className="text-xs text-emerald-400">@{user?.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-300">{formatShillings(coinBalance)}</div>
                  <div className="text-[10px] text-slate-400">Balance</div>
                </div>
              </div>

              {/* Mobile Activation Button */}
              {user && !user.isActivated && (
                <button
                  onClick={() => {
                    setActivationModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Activate Account (500 KSh / MTN MoMo)</span>
                </button>
              )}

              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleNav(item.tab)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </span>
                    {item.tab === 'chat' && isChatting && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => handleNav('admin')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-purple-300 hover:bg-purple-950/40 border border-purple-500/30 transition"
              >
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Admin Portal</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
