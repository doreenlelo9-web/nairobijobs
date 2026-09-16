import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AI_PARTNERS } from '../../data/aiFriends';
import { EastAfricaCountry } from '../../types';
import {
  ShieldCheck,
  Users,
  CreditCard,
  MessageSquare,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Smartphone,
  Save,
  Coins,
  DollarSign
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    adminStats,
    adminWithdrawals,
    updateWithdrawalStatus,
    adminUsers,
    toggleUserStatus,
    pendingActivations,
    approveActivation,
    rejectActivation,
    activationInstructions,
    updateActivationInstruction,
    formatShillings,
    messages,
    showToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'activations' | 'paymentSetup' | 'withdrawals' | 'users' | 'partners' | 'logs'
  >('activations');
  const [userSearch, setUserSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');

  // Payment Setup form state
  const [selectedCountryConfig, setSelectedCountryConfig] = useState<EastAfricaCountry>('Kenya');
  const [editingProvider, setEditingProvider] = useState(
    activationInstructions.Kenya.provider
  );
  const [editingAccountType, setEditingAccountType] = useState(
    activationInstructions.Kenya.accountType
  );
  const [editingAccountNumber, setEditingAccountNumber] = useState(
    activationInstructions.Kenya.accountNumber
  );
  const [editingAccountName, setEditingAccountName] = useState(
    activationInstructions.Kenya.accountName
  );

  const handleCountryChange = (country: EastAfricaCountry) => {
    setSelectedCountryConfig(country);
    const cfg = activationInstructions[country];
    setEditingProvider(cfg.provider);
    setEditingAccountType(cfg.accountType);
    setEditingAccountNumber(cfg.accountNumber);
    setEditingAccountName(cfg.accountName);
  };

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateActivationInstruction(selectedCountryConfig, {
      provider: editingProvider,
      accountType: editingAccountType,
      accountNumber: editingAccountNumber,
      accountName: editingAccountName
    });
    showToast(`Saved payment configuration for ${selectedCountryConfig}!`);
  };

  const filteredUsers = adminUsers.filter(
    u =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredPartners = AI_PARTNERS.filter(
    p =>
      p.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.country.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  const allMessagesForLogs = Object.entries(messages).flatMap(([partnerId, msgs]) => {
    const partner = AI_PARTNERS.find(p => p.id === partnerId);
    const msgList = (Array.isArray(msgs) ? msgs : []) as any[];
    return msgList.map(m => ({ ...m, partnerName: partner?.name || 'Partner' }));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-1 border border-purple-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Shillings Platform Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage account activations (500 KES / MTN MoMo), payment accounts, user tutors, and payout dispatches.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#111827] border border-slate-800 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            {
              id: 'activations',
              label: 'Activations (500 KSh)',
              count: pendingActivations.filter(a => a.status === 'pending').length
            },
            {
              id: 'paymentSetup',
              label: 'Payment Setup',
              count: '3'
            },
            {
              id: 'withdrawals',
              label: 'Withdrawals',
              count: adminWithdrawals.filter(w => w.status === 'processing').length
            },
            { id: 'users', label: 'Users', count: adminUsers.length },
            { id: 'partners', label: 'AI Friends', count: AI_PARTNERS.length },
            { id: 'logs', label: 'Chat Logs', count: allMessagesForLogs.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeAdminTab === tab.id
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 bg-black/40 rounded-full text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Registered Users</div>
          <div className="text-2xl font-bold text-white mt-1">{adminStats.totalUsers.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-400 mt-0.5">Kenya • Uganda • Tanzania</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Active Chatters Today</div>
          <div className="text-2xl font-bold text-white mt-1">{adminStats.activeToday.toLocaleString()}</div>
          <p className="text-[10px] text-cyan-400 mt-0.5">Earning 500 KSh/hr</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Activation Submissions</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {pendingActivations.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">M-Pesa & MTN MoMo Codes</p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Total Shillings Dispatched</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {formatShillings(adminStats.totalShillingsPayouts)}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">via Instant Mobile Money</p>
        </div>
      </div>

      {/* TAB 1: ACTIVATIONS (500 KES FEE) */}
      {activeAdminTab === 'activations' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Account Activation Approvals</h2>
              <p className="text-xs text-slate-400">
                Verify 500 KES (or equivalent via MTN MoMo / TZS) payments submitted by new users
              </p>
            </div>
            <div className="text-xs px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-semibold">
              Standard Fee: 500 KES / 15,000 UGX / 10,000 TZS
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Country & Method</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Transaction Code</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {pendingActivations.map(a => (
                  <tr key={a.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{a.fullName}</div>
                      <div className="text-slate-400">@{a.username} • {a.phone}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{a.country}</div>
                      <div className="text-slate-400 uppercase font-mono text-[11px]">{a.method}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-emerald-400 font-mono">
                        {a.currency} {a.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 font-mono text-amber-300 font-bold border border-slate-800">
                        {a.transactionCode}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">{a.submittedAt}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          a.status === 'approved'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : a.status === 'pending'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {a.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      {a.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => approveActivation(a.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectActivation(a.id)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT SETUP (TILL / MTN MOMO / PAYBILL CONFIG) */}
      {activeAdminTab === 'paymentSetup' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold font-heading text-white">
              Activation Payment Configurations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize the Till Number, MTN Mobile Money number, or Paybill that users pay the 500 KES fee to.
            </p>
          </div>

          {/* Country Selector */}
          <div className="flex items-center gap-2 mb-6">
            {(['Kenya', 'Uganda', 'Tanzania'] as EastAfricaCountry[]).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => handleCountryChange(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  selectedCountryConfig === c
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c === 'Kenya' && 'Kenya 🇰🇪 (500 KES - M-Pesa)'}
                {c === 'Uganda' && 'Uganda 🇺🇬 (15,000 UGX - MTN MoMo)'}
                {c === 'Tanzania' && 'Tanzania 🇹🇿 (10,000 TZS - M-Pesa/Tigo)'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSavePaymentConfig} className="max-w-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Payment Provider
                </label>
                <input
                  type="text"
                  required
                  value={editingProvider}
                  onChange={e => setEditingProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account / Identifier Type
                </label>
                <input
                  type="text"
                  required
                  value={editingAccountType}
                  onChange={e => setEditingAccountType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Number / Till / Phone
                </label>
                <input
                  type="text"
                  required
                  value={editingAccountNumber}
                  onChange={e => setEditingAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Name / Registered Business
                </label>
                <input
                  type="text"
                  required
                  value={editingAccountName}
                  onChange={e => setEditingAccountName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update {selectedCountryConfig} Instructions</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: WITHDRAWALS QUEUE */}
      {activeAdminTab === 'withdrawals' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Payout Requests Queue</h2>
              <p className="text-xs text-slate-400">Review, approve, or reject user coin withdrawals</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Shillings</th>
                  <th className="pb-3">Method & Details</th>
                  <th className="pb-3">Requested At</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {adminWithdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5 font-semibold text-white">
                      {w.userName}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-white">{formatShillings(w.amountCoins)}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-white uppercase">{w.method}</span>
                      <div className="text-slate-400">{w.accountIdentifier}</div>
                    </td>
                    <td className="py-3.5 text-slate-400">{w.requestedAt}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          w.status === 'completed'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : w.status === 'processing'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {w.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-1.5">
                      {w.status === 'processing' && (
                        <>
                          <button
                            onClick={() => updateWithdrawalStatus(w.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateWithdrawalStatus(w.id, 'rejected')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {w.status === 'completed' && (
                        <span className="text-[11px] text-slate-500 font-medium">Dispatched</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Registered Users & Tutors</h2>
              <p className="text-xs text-slate-400">Manage account status and activation state</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Tutor</th>
                  <th className="pb-3">Country & Contact</th>
                  <th className="pb-3">Activation</th>
                  <th className="pb-3">Joined</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5 font-semibold text-white">
                      <div>{u.fullName}</div>
                      <div className="text-slate-400">@{u.username}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="text-slate-200">{u.country} ({u.currency || 'KES'})</div>
                      <div className="text-slate-400">{u.phone}</div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActivated
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {u.isActivated ? 'ACTIVATED' : 'PENDING 500 KSH'}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">{u.createdAt}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          u.status === 'active'
                            ? 'bg-slate-800 hover:bg-slate-700 text-rose-400'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PARTNERS */}
      {activeAdminTab === 'partners' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">AI Language Partners</h2>
              <p className="text-xs text-slate-400">All foreign language learners configured in the system</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={partnerSearch}
                onChange={e => setPartnerSearch(e.target.value)}
                placeholder="Search partners..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map(p => (
              <div key={p.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-start gap-3">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm truncate">{p.name}</span>
                    <span className="text-xs">{p.flag}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400">{p.swahiliLevel} • {p.country}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{p.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CHAT LOGS */}
      {activeAdminTab === 'logs' && (
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold font-heading text-white mb-2">Platform Chat Activity Logs</h2>
          <p className="text-xs text-slate-400 mb-4">Live message audit trail and AI interaction history</p>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {allMessagesForLogs.map((m, idx) => (
              <div key={m.id || idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-semibold text-slate-200">
                    {m.isAi ? `🤖 AI (${m.partnerName})` : `👤 User (${m.senderName})`}
                  </span>
                  <span className="text-[10px]">{m.timestamp}</span>
                </div>
                <div className="text-slate-300 font-sans">{m.text}</div>
                {m.correction && (
                  <div className="mt-1 text-[11px] text-emerald-400">
                    Correction given: {m.correction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
