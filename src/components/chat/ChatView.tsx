import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Smile,
  Mic,
  Paperclip,
  Clock,
  Coins,
  CheckCheck,
  Volume2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ChevronLeft,
  Image as ImageIcon,
  X,
  FastForward,
  Flame
} from 'lucide-react';

const TOPIC_SUGGESTIONS = [
  'Greetings',
  'Family',
  'Food',
  'Travel',
  'Kenya',
  'Tanzania',
  'Culture',
  'Kiswahili lessons',
  'English practice'
];

const POPULAR_EMOJIS = ['😊', '🙏', '❤️', '🇰🇪', '🇹🇿', '🦁', '☕', '👍', '🔥', '🎉', '🌴', '🦒', '✨', '👏'];

export const ChatView: React.FC = () => {
  const {
    user,
    currentPartner,
    messages,
    sendMessage,
    isPartnerTyping,
    sessionSeconds,
    isTimerPaused,
    setIsTimerPaused,
    coinsEarnedThisSession,
    fastForwardTimer,
    resetSessionTimer,
    setActiveTab,
    setActivationModalOpen,
    formatShillings,
    showToast
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [showPartnerInfo, setShowPartnerInfo] = useState(false);
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessages = messages[currentPartner.id] || [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isPartnerTyping]);

  // Voice recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setVoiceSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setVoiceSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    const msg = inputMessage;
    setInputMessage('');
    setShowEmojiPicker(false);
    await sendMessage(msg);
  };

  const handleTopicClick = (topic: string) => {
    const starters: Record<string, string> = {
      'Greetings': `Habari za leo ${currentPartner.name.split(' ')[0]}? How is everything with you?`,
      'Family': `Let us talk about family. In Kiswahili, 'Familia' or 'Ndugu'. Do you have brothers or sisters?`,
      'Food': `Have you ever tasted traditional Swahili dishes like Pilau, Chapati, or Sukuma Wiki?`,
      'Travel': `Tell me about your travel plans to East Africa! Are you planning to visit Kenya or Tanzania?`,
      'Kenya': `Kenya is a wonderful country known for the Maasai Mara migration, Nairobi city life, and Mt. Kenya!`,
      'Tanzania': `Tanzania has Mt. Kilimanjaro, Serengeti, and the exotic spice island of Zanzibar!`,
      'Culture': `In Swahili culture, elders are respected with the greeting 'Shikamoo', and the reply is 'Marahaba'.`,
      'Kiswahili lessons': `Can you try saying: 'Jina langu ni ${currentPartner.name.split(' ')[0]}, ninajifunza Kiswahili'?`,
      'English practice': `I would also love to practice my conversational English with you while we chat!`
    };

    const text = starters[topic] || `Tell me your thoughts on ${topic}!`;
    setInputMessage(text);
  };

  const handleSendVoiceNote = () => {
    setIsRecordingVoice(false);
    const duration = voiceSeconds || 3;
    sendMessage(`🎤 Voice message (${duration}s)`, true, duration);
  };

  // Text to speech helper
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      showToast('Text-to-speech not supported in this browser.');
    }
  };

  // Timer format (HH:MM:SS)
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress toward the next 1 hour milestone (3600s)
  const secondsIntoCurrentHour = sessionSeconds % 3600;
  const minutesRemainingInHour = Math.ceil((3600 - secondsIntoCurrentHour) / 60);
  const hourProgressPercent = Math.min(100, Math.floor((secondsIntoCurrentHour / 3600) * 100));

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col bg-[#0F172A] border-x border-slate-800 relative">
      {/* 1. CHAT HEADER */}
      <div className="px-4 py-3 bg-[#111827] border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('directory')}
            className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            className="relative cursor-pointer"
            onClick={() => setShowPartnerInfo(!showPartnerInfo)}
          >
            <img
              src={currentPartner.avatar}
              alt={currentPartner.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#111827]" />
          </div>

          <div className="cursor-pointer" onClick={() => setShowPartnerInfo(!showPartnerInfo)}>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-white text-sm sm:text-base leading-tight">
                {currentPartner.name}
              </h2>
              <span className="text-sm">{currentPartner.flag}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                {isPartnerTyping ? (
                  <span className="animate-pulse">typing message...</span>
                ) : (
                  <span>online • {currentPartner.country}</span>
                )}
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                ({currentPartner.swahiliLevel})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPartnerInfo(!showPartnerInfo)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            title="Partner Profile"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. STICKY CHAT TIMER & REWARDS BAR */}
      <div className="bg-[#0B0F17] border-b border-slate-800/80 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* Active Stopwatch */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className={`w-4 h-4 ${isTimerPaused ? 'text-amber-400' : 'text-emerald-400 animate-spin-slow'}`} />
            <div>
              <div className="font-mono font-bold text-white text-sm leading-none">
                {formatTime(sessionSeconds)}
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">
                {isTimerPaused ? (
                  <span className="text-amber-400 font-semibold">Paused (Idle)</span>
                ) : (
                  <span className="text-emerald-400">Active Timer</span>
                )}
              </div>
            </div>
          </div>

          {/* Coins Earned Live */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <Coins className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-white text-sm leading-none">
                +{coinsEarnedThisSession} <span className="text-[10px] text-emerald-400">Coins</span>
              </div>
              <div className="text-[9px] text-slate-400 leading-tight">Session Earnings</div>
            </div>
          </div>

          {/* Pause / Resume button */}
          <button
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 border border-slate-700"
            title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isTimerPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Milestone Progress & Testing Tools */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex-1 sm:w-44 text-right">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Next 500 Coins:</span>
              <span className="text-emerald-400 font-semibold">{minutesRemainingInHour}m left</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${hourProgressPercent}%` }}
              />
            </div>
          </div>

          {/* DEMO / TEST BUTTONS */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => fastForwardTimer(900)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-semibold text-slate-300 hover:text-white border border-slate-700"
              title="Fast-forward timer by 15 minutes for testing"
            >
              +15m
            </button>
            <button
              onClick={() => fastForwardTimer(3600)}
              className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 rounded text-[10px] font-bold text-emerald-300 border border-emerald-700"
              title="Fast-forward 1 full hour to trigger +500 Coins milestone immediately!"
            >
              +1hr Reward
            </button>
          </div>
        </div>
      </div>

      {/* 2.5 ACTIVATION ALERT BANNER IF NOT ACTIVATED */}
      {user && !user.isActivated && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <span className="font-bold">⚠️ Account Activation Required:</span>
            <span className="text-amber-200/90 hidden sm:inline">Pay 500 Kenya Shillings (or via MTN MoMo in Uganda / TZS in Tanzania) to unlock AI replies & rewards.</span>
          </div>
          <button
            onClick={() => setActivationModalOpen(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shrink-0"
          >
            Activate (500 KSh)
          </button>
        </div>
      )}

      {/* PARTNER INFO DRAWER MODAL */}
      {showPartnerInfo && (
        <div className="bg-[#111827] border-b border-slate-800 p-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img src={currentPartner.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  {currentPartner.name} {currentPartner.flag}
                </h3>
                <p className="text-xs text-slate-400">{currentPartner.age} years old • {currentPartner.country}</p>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">Swahili Level: {currentPartner.swahiliLevel}</p>
              </div>
            </div>
            <button onClick={() => setShowPartnerInfo(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <p className="font-semibold text-emerald-400 mb-1">Learning Goal:</p>
            "{currentPartner.learningGoal}"
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentPartner.interests.map((int, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                #{int}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. CHAT MESSAGES SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Swahili welcome pill */}
        <div className="text-center my-2">
          <span className="px-3 py-1 bg-slate-900/90 border border-slate-800 text-slate-400 text-[11px] rounded-full">
            Conversing with {currentPartner.name} • Keep chatting to earn coins!
          </span>
        </div>

        {chatMessages.map(msg => {
          const isMe = !msg.isAi;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%] ${
                isMe ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-[#1E293B] text-slate-100 rounded-tl-none border border-slate-700/60'
                }`}
              >
                {/* Voice note presentation */}
                {msg.isVoiceNote ? (
                  <div className="flex items-center gap-3 py-1">
                    <button
                      onClick={() => {
                        setActiveVoicePlaying(activeVoicePlaying === msg.id ? null : msg.id);
                        handleSpeak(msg.text.replace('🎤 Voice message', ''));
                      }}
                      className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition"
                    >
                      {activeVoicePlaying === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-1">
                        <div className="w-24 h-4 flex items-center gap-1">
                          <span className="w-1 h-3 bg-white/80 rounded-full animate-pulse" />
                          <span className="w-1 h-4 bg-white rounded-full" />
                          <span className="w-1 h-2 bg-white/60 rounded-full" />
                          <span className="w-1 h-5 bg-white rounded-full" />
                          <span className="w-1 h-3 bg-white/80 rounded-full" />
                          <span className="w-1 h-1 bg-white/40 rounded-full" />
                        </div>
                        <span className="text-[11px] text-white/90">0:{msg.audioDuration?.toString().padStart(2, '0') || '03'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>{msg.text}</div>
                )}

                {/* Optional polite correction box */}
                {msg.correction && (
                  <div className="mt-2 p-2 bg-black/30 rounded-xl border border-emerald-400/30 text-xs">
                    <div className="flex items-center gap-1 text-emerald-300 font-semibold mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Swahili Tip / Marekebisho:</span>
                    </div>
                    <div className="text-slate-200">
                      💡 {msg.correction.suggested}
                    </div>
                  </div>
                )}

                {/* Footer timestamp & read receipts */}
                <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-white/70">
                  <span>{msg.timestamp}</span>
                  {!msg.isAi && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="opacity-70 hover:opacity-100 transition ml-1"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                  {msg.isAi && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="opacity-70 hover:opacity-100 transition ml-1 text-emerald-300"
                      title="Pronounce response"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isPartnerTyping && (
          <div className="flex items-center gap-2 max-w-[70%] mr-auto">
            <div className="bg-[#1E293B] border border-slate-700/60 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="text-xs text-slate-400 ml-2 font-medium">{currentPartner.name.split(' ')[0]} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. CONVERSATION TOPICS BAR */}
      <div className="px-3 py-2 bg-[#111827] border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Topics:</span>
        </span>
        {TOPIC_SUGGESTIONS.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleTopicClick(topic)}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-500/40 text-slate-300 border border-slate-700 shrink-0 transition"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* EMOJI PICKER POPUP */}
      {showEmojiPicker && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-2 animate-in slide-in-from-bottom duration-150">
          {POPULAR_EMOJIS.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(prev => prev + emoji);
              }}
              className="text-lg hover:scale-125 transition p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* IMAGE ATTACHMENT MODAL */}
      {showAttachmentModal && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 animate-in slide-in-from-bottom duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">Attach Cultural Image to Teach:</span>
            <button onClick={() => setShowAttachmentModal(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Chapati & Chai', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80' },
              { label: 'Maasai Mara Lion', url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=300&q=80' },
              { label: 'Zanzibar Beach', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80' }
            ].map((pic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setShowAttachmentModal(false);
                  sendMessage(`Look at this photo of ${pic.label}! In Kiswahili, let me tell you why this is special...`);
                }}
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500 aspect-video text-left"
              >
                <img src={pic.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] text-white p-1 truncate font-medium">
                  {pic.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. BOTTOM INPUT BAR (WhatsApp-style) */}
      <div className="p-3 bg-[#111827] border-t border-slate-800">
        {isRecordingVoice ? (
          <div className="flex items-center justify-between px-4 py-2 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-300 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Recording Voice Note... ({voiceSeconds}s)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecordingVoice(false)}
                className="px-3 py-1 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSendVoiceNote}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
              >
                Send Voice
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex items-center gap-2">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachmentModal(!showAttachmentModal)}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Attach Photo"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Emoji Picker Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Pick Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={`Message ${currentPartner.name.split(' ')[0]} in Kiswahili or English...`}
              className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition"
            />

            {/* Mic / Voice Note or Send */}
            {inputMessage.trim() ? (
              <button
                type="submit"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-95"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-xl transition"
                title="Hold or Click to Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
