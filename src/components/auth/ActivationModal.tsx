import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EastAfricaCountry } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Smartphone,
  Sparkles,
  Zap,
  HelpCircle,
  X
} from 'lucide-react';

export const ActivationModal: React.FC = () => {
  const {
    user,
    activationModalOpen,
    setActivationModalOpen,
    activationInstructions,
    submitActivationPayment,
    simulateStkPush,
    showToast
  } = useApp();

  const [activeCountry, setActiveCountry] = useState<EastAfricaCountry>(
    (user?.country as EastAfricaCountry) || 'Kenya'
  );
  const [transactionCode, setTransactionCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activationModalOpen) return null;

  const currentInstruction = activationInstructions[activeCountry];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`Copied ${text} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionCode.trim()) {
      showToast('Please enter your SMS transaction confirmation code.');
      return;
    }

    const method =
      activeCountry === 'Uganda'
        ? 'mtn_uganda'
        : activeCountry === 'Tanzania'
        ? 'mpesa_tanzania'
        : 'mpesa_kenya';

    submitActivationPayment(transactionCode.trim(), method, phoneNumber);
  };

  const handleSimulateStk = async () => {
    setIsSimulating(true);
    try {
      await simulateStkPush(phoneNumber || '+254 712 345 678', activeCountry);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#111827] border border-emerald-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-white animate-in zoom-in-95 duration-200">
        {/* Close Button if user is already activated */}
        {user?.isActivated && (
          <button
            onClick={() => setActivationModalOpen(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold w-fit mb-3 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>One-Time System Activation</span>
        </div>

        <h2 className="text-2xl font-bold font-heading">
          Activate Your Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pay the <span className="text-emerald-400 font-bold">500 Kenya Shillings</span> (or regional equivalent) activation fee to unlock unlimited Kiswahili conversations and start earning 500 Shillings every active hour.
        </p>

        {/* Country Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          {[
            { country: 'Kenya', label: 'Kenya 🇰🇪', fee: '500 KES', provider: 'M-Pesa' },
            { country: 'Uganda', label: 'Uganda 🇺🇬', fee: '15,000 UGX', provider: 'MTN MoMo' },
            { country: 'Tanzania', label: 'Tanzania 🇹🇿', fee: '10,000 TZS', provider: 'M-Pesa/Tigo' }
          ].map(item => (
            <button
              key={item.country}
              type="button"
              onClick={() => setActiveCountry(item.country as EastAfricaCountry)}
              className={`py-2 px-1 text-center rounded-xl transition ${
                activeCountry === item.country
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[10px] opacity-90">{item.fee}</div>
            </button>
          ))}
        </div>

        {/* Payment Details Card */}
        <div className="mt-5 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Payment Channel</span>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{currentInstruction.provider}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Activation Fee</span>
              <div className="text-base font-extrabold text-emerald-400">
                {currentInstruction.currency} {currentInstruction.amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {currentInstruction.accountType}
              </div>
              <div className="text-base font-mono font-bold text-emerald-300">
                {currentInstruction.accountNumber}
              </div>
              <div className="text-[11px] text-slate-400">{currentInstruction.accountName}</div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(currentInstruction.accountNumber)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Payment Steps */}
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">How to pay:</span>
            <ol className="mt-1.5 space-y-1 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              {currentInstruction.instructions.map((step, idx) => (
                <li key={idx} className="text-slate-300">
                  <span className="text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Registered Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+254 7XX XXX XXX or +256 7XX XXX XXX"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {activeCountry === 'Uganda'
                ? 'Enter MTN Mobile Money Transaction ID'
                : 'Enter M-Pesa Transaction Confirmation Code'}
            </label>
            <input
              type="text"
              required
              value={transactionCode}
              onChange={e => setTransactionCode(e.target.value)}
              placeholder={activeCountry === 'Uganda' ? 'e.g. MTN-8849201' : 'e.g. QJK89XZP45'}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 uppercase font-mono tracking-wider"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Found in the official confirmation SMS from {currentInstruction.provider}.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm shadow-xl hover:shadow-emerald-900/40 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Verify Code & Unlock My Account</span>
          </button>
        </form>

        {/* Instant STK Simulation for testing */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Auto-Pay (Demo / Fast Pass)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Simulate instant {activeCountry === 'Uganda' ? 'MTN MoMo' : 'M-Pesa'} STK push confirmation
              </div>
            </div>
            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulateStk}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Processing...' : 'Simulate Payment'}</span>
            </button>
          </div>
        </div>

        {/* Benefits Note */}
        <div className="mt-4 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-emerald-300 leading-snug">
            <strong>Welcome Bonus:</strong> You receive an instant <strong>250 Shillings bonus</strong> in your wallet immediately after activation!
          </p>
        </div>
      </div>
    </div>
  );
};
