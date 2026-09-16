import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AI_PARTNERS } from '../../data/aiFriends';
import { AIPartner } from '../../types';
import { Search, Filter, MessageSquare, Globe, Heart, Sparkles } from 'lucide-react';

export const FriendsDirectory: React.FC = () => {
  const { setCurrentPartner, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const countries = ['All', 'United Kingdom', 'United States', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Canada'];
  const levels = ['All', 'Absolute Beginner', 'Elementary', 'Curious Explorer', 'Intermediate Learner'];

  const filteredPartners = useMemo(() => {
    return AI_PARTNERS.filter(partner => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCountry = selectedCountry === 'All' || partner.country === selectedCountry;
      const matchesLevel = selectedLevel === 'All' || partner.swahiliLevel === selectedLevel;

      return matchesSearch && matchesCountry && matchesLevel;
    });
  }, [searchQuery, selectedCountry, selectedLevel]);

  const handleStartChat = (partner: AIPartner) => {
    setCurrentPartner(partner);
    setActiveTab('chat');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24 Foreign Partners Available</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Choose Your AI Language Partner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chat, teach them Swahili, and earn 500 Coins for every active hour of conversation.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, interest..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="space-y-2.5">
        {/* Country Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Country:</span>
          </span>
          {countries.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition ${
                selectedCountry === c
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-[#111827] text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Level:</span>
          </span>
          {levels.map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition ${
                selectedLevel === lvl
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'bg-[#111827] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Partners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredPartners.map(partner => (
          <div
            key={partner.id}
            className="bg-[#111827] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 group"
          >
            <div>
              {/* Image & Flag */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-800">
                <img
                  src={partner.avatar}
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1 border border-white/10 text-white">
                  <span>{partner.flag}</span>
                  <span>{partner.country}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-emerald-950/90 border border-emerald-500/40 rounded-full text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online now</span>
                </div>
              </div>

              {/* Name & Basic details */}
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition">
                  {partner.name}
                </h3>
                <span className="text-xs text-slate-400">{partner.age} yrs</span>
              </div>

              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                  {partner.swahiliLevel}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
                {partner.bio}
              </p>

              {/* Learning goal quote */}
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 mb-3 text-[11px] text-slate-400 italic">
                <span className="text-emerald-400 not-italic font-semibold">Goal: </span>
                "{partner.learningGoal}"
              </div>

              {/* Interests */}
              <div className="flex flex-wrap gap-1 mb-4">
                {partner.interests.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700/60"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleStartChat(partner)}
              className="w-full py-2.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with {partner.name.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-16 bg-[#111827] rounded-2xl border border-slate-800 p-8">
          <p className="text-base text-slate-300 font-semibold">No AI partners found matching your search</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the country or level filters above.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCountry('All');
              setSelectedLevel('All');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
