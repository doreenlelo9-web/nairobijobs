import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TESTIMONIALS, FAQS } from '../../data/faqAndHelp';
import { AI_PARTNERS } from '../../data/aiFriends';
import {
  MessageSquare,
  Sparkles,
  Shield,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Coins,
  Globe2,
  Gift,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveTab,
    setAuthModalOpen,
    setAuthModalView,
    setActivationModalOpen,
    setCurrentPartner,
    isAuthenticated,
    formatShillings
  } = useApp();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleStartChatting = (partnerId?: string) => {
    if (partnerId) {
      const partner = AI_PARTNERS.find(p => p.id === partnerId);
      if (partner) setCurrentPartner(partner);
    }
    if (isAuthenticated) {
      setActiveTab('chat');
    } else {
      setAuthModalView('login');
      setAuthModalOpen(true);
    }
  };

  const handleCreateAccount = () => {
    setAuthModalView('register');
    setAuthModalOpen(true);
  };

  const featuredPartners = AI_PARTNERS.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 overflow-hidden pb-20">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Earn 500 Shillings Every Active Hour • Kenya, Uganda & Tanzania</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Chat with AI Friends from <span className="text-emerald-400 underline decoration-emerald-500/40 decoration-4">Europe & USA</span> and Practice Kiswahili.
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Teach foreign learners Kiswahili through natural conversations.
          Share cultural stories, answer curiosity about East Africa, and earn real Shillings every active hour.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={() => handleStartChatting()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Start Chatting</span>
          </button>
          <button
            onClick={handleCreateAccount}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <span>Create Account (500 KSh)</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Safaricom M-Pesa & MTN MoMo Cashouts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>24 European & American Personas</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Automated Verified Timer Rewards</span>
          </div>
        </div>
      </section>

      {/* ACCOUNT ACTIVATION EXPLAINER BANNER (500 KES FEE) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border border-emerald-500/30 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simple Account Activation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              One-Time 500 Kenya Shillings Account Activation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Pay <strong>500 Kenya Shillings</strong> (or regional equivalent: <strong>15,000 UGX</strong> via MTN Mobile Money in Uganda, or <strong>10,000 TZS</strong> in Tanzania) to activate your account and unlock access to all 24 AI conversation partners. Plus, receive an instant <strong>250 Shillings starter bonus</strong>!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActivationModalOpen(true);
                } else {
                  setAuthModalView('register');
                  setAuthModalOpen(true);
                }
              }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Pay 500 KSh Activation</span>
            </button>
          </div>
        </div>
      </section>

      {/* MEET AI FRIENDS SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Language Partners</span>
            <h2 className="text-3xl font-bold font-heading text-white mt-1">
              Chat With Learners From 14+ Countries
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every AI partner has their own personality, city, profession, and Swahili learning goals.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('directory')}
            className="mt-4 md:mt-0 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View all 24 partners</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPartners.map(p => (
            <div
              key={p.id}
              onClick={() => handleStartChatting(p.id)}
              className="bg-[#111827] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="relative">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-44 object-cover rounded-xl group-hover:brightness-105 transition"
                />
                <span className="absolute top-2 right-2 text-xl shadow-md">
                  {p.flag}
                </span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-emerald-400 backdrop-blur-sm border border-white/10">
                  {p.swahiliLevel}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                    {p.name}
                  </h3>
                  <span className="text-xs text-slate-400">{p.age} yrs</span>
                </div>
                <p className="text-xs text-emerald-400 mt-0.5">{p.personality} • {p.country}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  "{p.bio}"
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{p.learningGoal}</span>
                  <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                    Chat <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REWARD MECHANISM SECTION (500 SHILLINGS PER HOUR) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-950/60 via-[#111827] to-[#111827] border border-emerald-500/40 rounded-3xl p-6 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
              <Coins className="w-3.5 h-3.5" />
              <span>Transparent Reward System</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white">
              Every 1 Hour of Active Chatting = 500 Shillings
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              Our automated conversation timer tracks active, genuine message exchanges.
              Complete your 1st hour to earn 500 Shillings. Complete 2 hours to earn 1,000 Shillings total.
              Every additional completed hour adds another 500 Shillings directly to your wallet.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="text-emerald-400 font-bold text-xl">1 Hour Chat</div>
                <div className="text-2xl font-black text-white mt-1">500 Shillings</div>
                <div className="text-[11px] text-slate-400 mt-1">500 KES / 15,000 UGX</div>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-emerald-500/30 ring-1 ring-emerald-500/20">
                <div className="text-emerald-400 font-bold text-xl">2 Hours Chat</div>
                <div className="text-2xl font-black text-white mt-1">1,000 Shillings</div>
                <div className="text-[11px] text-slate-400 mt-1">1,000 KES / 30,000 UGX</div>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="text-emerald-400 font-bold text-xl">Bonus Perks</div>
                <div className="text-2xl font-black text-white mt-1">+ Daily Spin</div>
                <div className="text-[11px] text-slate-400 mt-1">Up to 1,000 bonus Shillings</div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => handleStartChatting()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                Start Earning Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold font-heading text-white">What East African Tutors Say</h2>
          <p className="text-sm text-slate-400 mt-2">Real community members earning daily via M-Pesa & MTN</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(item => (
            <div key={item.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.role}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-2 py-1 bg-emerald-950/60 rounded-md border border-emerald-800/40">
                  {item.earned}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-heading text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 mt-1">Everything you need to know about activation and payouts</p>
        </div>

        <div className="space-y-3">
          {[
            {
              question: 'How do I activate my account?',
              answer:
                'New tutors pay a one-time activation fee of 500 Kenya Shillings (or 15,000 UGX via MTN Mobile Money in Uganda, or 10,000 TZS in Tanzania). You receive an instant 250 Shillings welcome starter bonus immediately upon verification.'
            },
            {
              question: 'Can I pay the activation fee using MTN Mobile Money?',
              answer:
                'Yes! If you are in Uganda, you can pay 15,000 UGX directly using MTN Mobile Money by dialing *165# or sending to our registered MTN MoMo merchant number, then enter the SMS transaction code in the activation box.'
            },
            {
              question: 'How much do I earn while chatting?',
              answer:
                'You earn 500 Shillings for every completed hour of active conversation with our AI friends. The timer tracks your genuine replies and automatically deposits Shillings to your wallet upon completing each hour.'
            },
            {
              question: 'How do I withdraw my earnings?',
              answer:
                'Withdrawals are processed directly to your Safaricom M-Pesa or MTN Mobile Money account. Minimum withdrawal is 500 Shillings with zero hidden withdrawal fees.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-white text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 pt-3 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-800 pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span className="font-bold text-slate-300">Shillings</span> &copy; 2025. All Rights Reserved. Not an AdSense website.
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab('support')} className="hover:text-emerald-400 transition">Support & FAQ</button>
          <button onClick={() => setActiveTab('settings')} className="hover:text-emerald-400 transition">Privacy & Terms</button>
          <button onClick={() => setActiveTab('admin')} className="hover:text-purple-400 transition">Admin Portal</button>
        </div>
      </footer>
    </div>
  );
};
