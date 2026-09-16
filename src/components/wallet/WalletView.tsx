import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Gift,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Smartphone,
  Coins,
  ShieldCheck
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const {
    user,
    coinBalance,
    transactions,
    requestWithdrawal,
    formatShillings,
    selectedCurrency,
    setActivationModalOpen,
    showToast
  } = useApp();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'mtn' | 'bank' | 'paypal'>(
    user?.country === 'Uganda' ? 'mtn' : 'mpesa'
  );
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [accountIdentifier, setAccountIdentifier] = useState(user?.phone || '+254 712 345 678');
  const [accountName, setAccountName] = useState(user?.fullName || 'Doreen Lelo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MIN_WITHDRAW_SHILLINGS = 500;

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user && !user.isActivated) {
      setActivationModalOpen(true);
      showToast('⚠️ Please complete your 500 KSh account activation before making withdrawals.');
      return;
    }

    if (withdrawAmount < MIN_WITHDRAW_SHILLINGS) {
      showToast(`Minimum withdrawal is ${formatShillings(MIN_WITHDRAW_SHILLINGS)}.`);
      return;
    }
    if (withdrawAmount > coinBalance) {
      showToast('Insufficient wallet balance!');
      return;
    }
    if (!accountIdentifier.trim()) {
      showToast('Please enter your mobile wallet phone number or account details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestWithdrawal(withdrawAmount, selectedMethod, accountIdentifier);
      if (res.success) {
        setShowWithdrawModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 text-slate-100">
      {/* Activation Prompt if Unactivated */}
      {user && !user.isActivated && (
        <div className="p-4 bg-amber-950/60 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm text-amber-200">
              Your account is pending activation. Pay <strong>500 Kenya Shillings</strong> (or via MTN MoMo / TZS) to activate payouts.
            </span>
          </div>
          <button
            onClick={() => setActivationModalOpen(true)}
            className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400 shrink-0"
          >
            Activate (500 KSh)
          </button>
        </div>
      )}

      {/* 1. WALLET HERO SUMMARY */}
      <div className="bg-gradient-to-br from-[#111827] via-slate-900 to-emerald-950/70 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <Wallet className="w-3.5 h-3.5" />
              <span>Available Shillings Earnings</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {formatShillings(coinBalance)}
              </h1>
            </div>

            {/* Currency Multi-conversions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-slate-300">
              <span className="font-semibold text-white">Direct Mobile Payout Ready</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Safaricom M-Pesa (Kenya)</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-medium">MTN Mobile Money (Uganda)</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Tigo & M-Pesa (Tanzania)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95 text-sm"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw to M-Pesa / MTN</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. TRANSACTION LEDGER */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-heading text-white">Wallet Transaction History</h2>
            <p className="text-xs text-slate-400">Earnings milestones, activation fee record, and withdrawals</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">{transactions.length} Transactions</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {transactions.map(tx => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 px-2 rounded-xl transition">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.amount > 0
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : tx.type === 'activation_fee'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <Coins className="w-5 h-5" />
                  ) : tx.type === 'activation_fee' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{tx.title}</div>
                  <div className="text-xs text-slate-400 truncate">{tx.description}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-sm font-bold font-mono ${
                    tx.amount > 0
                      ? 'text-emerald-400'
                      : tx.type === 'activation_fee'
                      ? 'text-amber-300'
                      : 'text-rose-400'
                  }`}
                >
                  {tx.amount > 0 ? `+${formatShillings(tx.amount)}` : `-${formatShillings(Math.abs(tx.amount))}`}
                </div>
                <div className="text-[11px] text-slate-500">{tx.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111827] border border-slate-700 rounded-3xl p-6 sm:p-8 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h3 className="text-xl font-bold font-heading">Withdraw Earnings</h3>
              <p className="text-xs text-slate-400 mt-1">
                Available: <strong className="text-emerald-400">{formatShillings(coinBalance)}</strong>
              </p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mpesa', label: 'M-Pesa 🇰🇪 🇹🇿', desc: 'Safaricom / Vodacom' },
                    { id: 'mtn', label: 'MTN MoMo 🇺🇬', desc: 'MTN Uganda Money' },
                    { id: 'bank', label: 'Bank Transfer', desc: 'Direct East Africa' },
                    { id: 'paypal', label: 'PayPal', desc: 'International USD' }
                  ].map(m => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedMethod === m.id
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{m.label}</div>
                      <div className="text-[10px] opacity-80">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Shillings */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Amount to Cash Out
                  </label>
                  <span className="text-xs text-emerald-400 font-semibold">
                    {formatShillings(withdrawAmount)}
                  </span>
                </div>
                <input
                  type="number"
                  min={MIN_WITHDRAW_SHILLINGS}
                  max={coinBalance}
                  step={100}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Recipient Account Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {selectedMethod === 'mtn'
                    ? 'MTN Uganda Registered Mobile Number'
                    : selectedMethod === 'mpesa'
                    ? 'M-Pesa Mobile Number'
                    : 'Account Details'}
                </label>
                <input
                  type="text"
                  required
                  value={accountIdentifier}
                  onChange={e => setAccountIdentifier(e.target.value)}
                  placeholder={selectedMethod === 'mtn' ? '+256 77X XXX XXX' : '+254 7XX XXX XXX'}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || coinBalance < MIN_WITHDRAW_SHILLINGS}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-sm shadow-xl transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : `Confirm Cashout of ${formatShillings(withdrawAmount)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
