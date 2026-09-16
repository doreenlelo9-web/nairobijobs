import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FAQS } from '../../data/faqAndHelp';
import {
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Send,
  CheckCircle2,
  Mail,
  FileText,
  LifeBuoy
} from 'lucide-react';

interface SupportMsg {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

export const SupportView: React.FC = () => {
  const { showToast } = useApp();

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket Form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('payout');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Live Help Chat
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveChatMessages, setLiveChatMessages] = useState<SupportMsg[]>([
    {
      id: '1',
      sender: 'support',
      text: 'Habari! I am Neema from Mzungu Chat Earn support. How can I help you with your account, AI friends, or M-Pesa payouts today?',
      time: 'Just now'
    }
  ]);

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;

    const userText = liveChatInput;
    const newMsg: SupportMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLiveChatMessages(prev => [...prev, newMsg]);
    setLiveChatInput('');

    // Automatic helpful assistant response
    setTimeout(() => {
      let reply = "Thank you for reaching out! Your query has been logged. M-Pesa withdrawals are automated and run 24/7. Let me know if you need assistance with coin milestones or timer settings!";
      if (userText.toLowerCase().includes('withdraw') || userText.toLowerCase().includes('mpesa')) {
        reply = "M-Pesa cashouts require a minimum of 5,000 Coins ($5.00 / ~650 KES). Once you submit a request in the Wallet tab, our automated payout system dispatches it directly to your registered Safaricom number!";
      } else if (userText.toLowerCase().includes('coin') || userText.toLowerCase().includes('timer') || userText.toLowerCase().includes('hour')) {
        reply = "Coins are rewarded at 500 Coins for every completed 60 minutes of active chat. The timer pauses if there is no activity for 5 minutes to prevent idling.";
      }

      setLiveChatMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'support',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    showToast('Support ticket #TK-8492 created successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Help & Assistance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Customer Support & Help Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Get fast support regarding payouts, account verification, and conversation rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. LIVE CHAT WITH SUPPORT LEAD (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-3xl p-5 flex flex-col h-[520px]">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Neema"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111827]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Neema (Support Lead)</h3>
              <p className="text-[11px] text-emerald-400">Online • Typically replies in seconds</p>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {liveChatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendSupportMessage} className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={liveChatInput}
              onChange={e => setLiveChatInput(e.target.value)}
              placeholder="Ask Neema a question..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 2. SUBMIT TICKET FORM (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold font-heading text-white mb-1">Submit an Official Support Ticket</h2>
          <p className="text-xs text-slate-400 mb-4">
            For payment inquiries, bug reports, or partner suggestions.
          </p>

          {ticketSubmitted ? (
            <div className="p-8 text-center bg-emerald-950/30 border border-emerald-500/40 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-bold text-white text-base">Ticket Received!</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Ticket #TK-8492 has been dispatched to our payment & support team. We will respond to your registered email shortly.
              </p>
              <button
                onClick={() => setTicketSubmitted(false)}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="payout">M-Pesa / PayPal Withdrawal Inquiry</option>
                  <option value="rewards">Coin Balance & Milestones</option>
                  <option value="ai">AI Language Partner Feedback</option>
                  <option value="account">Account & Phone Verification</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Question about M-Pesa processing speed"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue with as much detail as possible..."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-95"
              >
                Send Support Ticket
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold font-heading text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-slate-900/50 hover:bg-slate-900"
                >
                  <span className="font-semibold text-white text-sm">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-xs sm:text-sm text-slate-300 border-t border-slate-800 bg-slate-950/40 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
