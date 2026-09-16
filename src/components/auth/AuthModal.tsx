import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EastAfricaCountry } from '../../types';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Coins
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalView,
    setAuthModalView,
    setActivationModalOpen,
    login,
    register,
    verifyOtp,
    showToast
  } = useApp();

  // Form states
  const [fullName, setFullName] = useState('Doreen Lelo');
  const [username, setUsername] = useState('doreen_ke');
  const [email, setEmail] = useState('doreenlelo9@gmail.com');
  const [phone, setPhone] = useState('+254 712 345 678');
  const [country, setCountry] = useState<EastAfricaCountry>('Kenya');
  const [password, setPassword] = useState('Password@123');
  const [otpDigits, setOtpDigits] = useState(['5', '2', '8', '4']);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email || username, password);
      setLoading(false);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email || !phone || !password) {
      showToast('Please fill in all registration fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      register({
        fullName,
        username,
        email,
        phone,
        country,
        password
      });
      setLoading(false);
    }, 400);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    setLoading(true);
    setTimeout(() => {
      verifyOtp(code);
      setLoading(false);
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Password reset link sent to ${forgotEmail || email}`);
      setAuthModalView('login');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#111827] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 overflow-hidden text-slate-100">
        {/* Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* VIEW 1: LOGIN */}
        {authModalView === 'login' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                <Coins className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-white">Sign In to Shillings</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your username or email to access your chat dashboard
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Username or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. doreen_ke or doreen@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthModalView('forgot')}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-emerald-900/40 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In Now'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-400">
                Do not have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('register')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Create Account
                </button>
              </p>

              <button
                type="button"
                onClick={() => {
                  setAuthModalOpen(false);
                  setActivationModalOpen(true);
                }}
                className="text-[11px] text-amber-300 hover:underline block mx-auto"
              >
                Already registered? Pay 500 KSh activation fee here
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: REGISTER */}
        {authModalView === 'register' && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold font-heading text-white">Create Account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Join Shillings to practice Kiswahili with foreign AI friends and earn 500 Shillings/hr
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Country Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Select Your Country
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Kenya', label: 'Kenya 🇰🇪', fee: '500 KES' },
                    { id: 'Uganda', label: 'Uganda 🇺🇬', fee: '15k UGX' },
                    { id: 'Tanzania', label: 'Tanzania 🇹🇿', fee: '10k TZS' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCountry(c.id as EastAfricaCountry);
                        if (c.id === 'Uganda' && !phone.startsWith('+256')) setPhone('+256 772 ');
                        if (c.id === 'Kenya' && !phone.startsWith('+254')) setPhone('+254 712 ');
                        if (c.id === 'Tanzania' && !phone.startsWith('+255')) setPhone('+255 754 ');
                      }}
                      className={`p-2 text-center rounded-xl border text-xs font-bold transition ${
                        country === c.id
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>{c.label}</div>
                      <div className="text-[10px] font-normal opacity-80">{c.fee}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Doreen Lelo"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="doreen_ke"
                    className="w-full pl-8 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="doreen@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number ({country === 'Uganda' ? 'MTN Mobile Money' : 'M-Pesa'})
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder={country === 'Uganda' ? '+256 77X XXX XXX' : '+254 7XX XXX XXX'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* Activation Notice */}
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Account Activation:</strong> A one-time activation fee of{' '}
                  <strong className="text-white">
                    {country === 'Uganda' ? '15,000 UGX (via MTN)' : country === 'Tanzania' ? '10,000 TZS' : '500 Kenya Shillings'}
                  </strong>{' '}
                  is required to unlock system access and chat rewards.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg hover:shadow-emerald-900/40 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creating Account...' : 'Continue to Activation (500 KSh)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalView('login')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* VIEW 3: FORGOT PASSWORD */}
        {authModalView === 'forgot' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold font-heading text-white">Reset Password</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your email address and we will send you a reset link
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="doreen@example.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: OTP VERIFICATION */}
        {authModalView === 'otp' && (
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Verify Phone Number</h2>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Enter the 4-digit SMS verification code sent to your mobile phone
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const val = e.target.value;
                      const next = [...otpDigits];
                      next[idx] = val;
                      setOtpDigits(next);
                    }}
                    className="w-12 h-14 text-center text-xl font-bold bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition"
              >
                Verify & Continue
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
