import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ACHIEVEMENTS_LIST } from '../../data/faqAndHelp';
import { playSpinTickSound, playRewardSound } from '../../utils/soundEffects';
import {
  Gift,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  RotateCw,
  Trophy,
  Zap
} from 'lucide-react';

const WHEEL_SEGMENTS = [
  { text: '50 Coins', value: 50, color: '#10B981', textColor: '#FFFFFF' },
  { text: '100 Coins', value: 100, color: '#1E293B', textColor: '#F1F5F9' },
  { text: '250 Coins', value: 250, color: '#059669', textColor: '#FFFFFF' },
  { text: '500 Coins', value: 500, color: '#D97706', textColor: '#FFFFFF' },
  { text: '1000 Coins', value: 1000, color: '#9333EA', textColor: '#FFFFFF' },
  { text: '75 Coins', value: 75, color: '#0F172A', textColor: '#F1F5F9' },
  { text: '150 Coins', value: 150, color: '#047857', textColor: '#FFFFFF' },
  { text: '200 Coins', value: 200, color: '#334155', textColor: '#FFFFFF' }
];

const STREAK_DAYS = [
  { day: 1, reward: 50 },
  { day: 2, reward: 75 },
  { day: 3, reward: 100 },
  { day: 4, reward: 150 },
  { day: 5, reward: 200 },
  { day: 6, reward: 300 },
  { day: 7, reward: 500 }
];

export const RewardCenterView: React.FC = () => {
  const {
    dailyStreak,
    spinWheel,
    checkInDailyStreak,
    claimAchievement,
    achievements,
    showToast
  } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw Canvas Wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2;
    const numSegments = WHEEL_SEGMENTS.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    WHEEL_SEGMENTS.forEach((segment, i) => {
      const startAngle = i * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 4, startAngle, endAngle);
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = segment.textColor;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(segment.text, radius - 20, 4);
      ctx.restore();
    });

    // Center hub pin
    ctx.beginPath();
    ctx.arc(radius, radius, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#10B981';
    ctx.stroke();
  }, []);

  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);

    // Pick random segment
    const segmentIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const selected = WHEEL_SEGMENTS[segmentIndex];
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    // Calculate rotation: 5 full turns (1800 deg) + angle to pointer (pointer is at top 270 deg)
    const targetDegree = 1800 + (360 - (segmentIndex * segmentAngle + segmentAngle / 2));

    setSpinRotation(prev => prev + targetDegree);

    // Play tick sounds intermittently
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playSpinTickSound();
      tickCount++;
      if (tickCount > 18) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      spinWheel(selected.value);
      setWheelResult(`🎉 You won +${selected.value} Coins!`);
      playRewardSound();
    }, 3200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Daily Bonuses & Quests</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Rewards & Achievement Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Spin the wheel daily, keep your teaching streak alive, and unlock milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. DAILY SPIN WHEEL (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Daily Fortune</span>
              <span className="text-xs text-slate-400">1 Free Spin Daily</span>
            </div>
            <h2 className="text-xl font-bold font-heading text-white mt-1">Spin the Coin Wheel</h2>
          </div>

          {/* Wheel Display Container */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Top Pointer arrow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 filter drop-shadow-md" />

            <div
              style={{
                transform: `rotate(${spinRotation}deg)`,
                transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
              }}
              className="rounded-full shadow-2xl ring-4 ring-slate-800"
            >
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full cursor-pointer"
              />
            </div>
          </div>

          {/* Result Alert */}
          {wheelResult && (
            <div className="mb-4 px-4 py-2 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-sm font-bold animate-bounce">
              {wheelResult}
            </div>
          )}

          {/* Spin CTA */}
          <button
            onClick={handleSpinClick}
            disabled={isSpinning}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning Wheel...' : 'SPIN FOR FREE NOW'}</span>
          </button>
        </div>

        {/* 2. 7-DAY STREAK ATTENDANCE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Attendance Calendar</span>
                <h2 className="text-xl font-bold font-heading text-white mt-0.5">
                  7-Day Teaching Streak: <span className="text-amber-400">{dailyStreak} Days</span>
                </h2>
              </div>
              <button
                onClick={checkInDailyStreak}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
              >
                Check In Today (+150)
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Check in consecutively each day to unlock bigger rewards. Complete day 7 to receive 500 bonus coins!
            </p>

            {/* Streak Day Cards */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {STREAK_DAYS.map(dayItem => {
                const isCompleted = dailyStreak >= dayItem.day;
                const isCurrent = dailyStreak + 1 === dayItem.day;

                return (
                  <div
                    key={dayItem.day}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : isCurrent
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase">Day {dayItem.day}</div>
                    <div className="my-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-400" />
                      ) : (
                        <Flame className={`w-5 h-5 mx-auto ${isCurrent ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-600'}`} />
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-white">+{dayItem.reward}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level & Rank Card */}
          <div className="bg-gradient-to-r from-slate-900 via-[#111827] to-indigo-950/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tutor Rank: Advanced Swahili Mentor</h3>
                  <p className="text-xs text-slate-400">Level 4 • 2,450 / 3,000 XP</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-400 px-3 py-1 bg-indigo-950/80 rounded-full border border-indigo-500/30">
                +10% Coin Booster
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mt-4">
              <div className="w-[78%] h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACHIEVEMENTS MILESTONES */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-heading text-white">Teaching Milestones & Badges</h2>
            <p className="text-xs text-slate-400">Complete challenges to earn bonus coins</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS_LIST.map(ach => {
            const currentObj = achievements.find(a => a.id === ach.id) || ach;
            return (
              <div
                key={ach.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0 text-amber-400">
                    {ach.iconName === 'Clock' ? '⏱️' : ach.iconName === 'Globe' ? '🌍' : ach.iconName === 'Flame' ? '🔥' : ach.iconName === 'BookOpen' ? '📖' : ach.iconName === 'UserPlus' ? '👥' : '✨'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                    <p className="text-xs text-slate-400 leading-tight mt-0.5">{ach.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, (currentObj.progress / currentObj.maxProgress) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {currentObj.progress}/{currentObj.maxProgress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs font-bold text-amber-400 mb-1.5">+{ach.rewardCoins} Coins</div>
                  {currentObj.isClaimed ? (
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-xl font-medium">
                      Claimed
                    </span>
                  ) : currentObj.progress >= currentObj.maxProgress ? (
                    <button
                      onClick={() => claimAchievement(ach.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow animate-pulse"
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-slate-800/60 text-slate-500 text-xs rounded-xl flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
