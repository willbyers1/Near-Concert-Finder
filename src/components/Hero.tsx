import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Calendar, Heart, Key, Filter, Compass, Music2 } from 'lucide-react';
import { UserPreferences } from '../types';

interface HeroProps {
  onSearch: (keyword: string, location: string) => void;
  onOpenLocationModal: () => void;
  userPreferences: UserPreferences;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onOpenLocationModal,
  userPreferences,
  onExploreClick
}) => {
  const [keyword, setKeyword] = useState('');
  const [cityInput, setCityInput] = useState(userPreferences.preferredLocation.city || 'Los Angeles');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, cityInput);
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100 py-12 md:py-20 border-b border-slate-800">
      
      {/* Background concert glow FX */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover Live Concerts & Music Festivals Worldwide</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Find your next <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              unforgettable night.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover concerts and festivals near you, follow your favorite artists, and never miss an upcoming show with live Ticketmaster integration.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
              
              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <Search className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Artist, band, event, or genre..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Location Input */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 sm:w-48">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="City or state"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onOpenLocationModal}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 underline shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Search Submit CTA */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Location / Radius indicator pill */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span>Searching in:</span>
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 hover:border-indigo-500/40 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{cityInput}</span>
              <span className="text-slate-500">({userPreferences.preferredLocation.radius} mi)</span>
            </button>
            <button
              onClick={onExploreClick}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline transition-colors cursor-pointer"
            >
              Explore All Events →
            </button>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">Nearby Concerts</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Radius-based show discovery around your city.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 text-amber-400 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">Festival Discovery</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Multiday music festivals & outdoor lineups.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3 text-violet-400 group-hover:scale-110 transition-transform">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">Artist Following</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Follow favorite bands for personalized feeds.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">Personal Calendar</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Save shows & export to Google/Apple Calendar.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center mb-3 text-sky-400 group-hover:scale-110 transition-transform">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">Smart Filters</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Filter by genre, price range, and custom dates.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-200">Bring Your Own Key</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">BYOK Ticketmaster API key for custom quotas.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
