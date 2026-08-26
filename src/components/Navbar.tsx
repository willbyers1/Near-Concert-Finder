import React from 'react';
import { Music, Calendar as CalendarIcon, Heart, Settings, MapPin, Key, User, Search, Radio } from 'lucide-react';
import { UserPreferences, UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'explore' | 'artists' | 'calendar' | 'following' | 'settings';
  setActiveTab: (tab: 'home' | 'explore' | 'artists' | 'calendar' | 'following' | 'settings') => void;
  userPreferences: UserPreferences;
  userProfile: UserProfile;
  onOpenLocationModal: () => void;
  savedCount: number;
  followingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userPreferences,
  userProfile,
  onOpenLocationModal,
  savedCount,
  followingCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Music className="w-5 h-5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Concert Finder
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-widest text-indigo-400 ml-2 px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded">
                Live Music
              </span>
            </div>
          </button>

          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {userPreferences.preferredLocation.city
                ? `${userPreferences.preferredLocation.city}, ${userPreferences.preferredLocation.state || ''}`
                : 'Select Location'}
            </span>
            <span className="text-slate-500 text-[10px]">({userPreferences.preferredLocation.radius}mi)</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Discover
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Explore Shows
            </button>

            <button
              onClick={() => setActiveTab('artists')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'artists'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Search Artists
            </button>

            <button
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'following'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Your Artists</span>
              {followingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500 text-white font-bold">
                  {followingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>My Calendar</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Items: BYOK Indicator & Profile Settings */}
          <div className="flex items-center gap-2">
            
            {/* BYOK Status Badge */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                userPreferences.isByokActive
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/50'
              }`}
              title="Ticketmaster BYOK API Key Configuration"
            >
              <Key className="w-3 h-3" />
              <span className="hidden sm:inline">
                {userPreferences.isByokActive ? 'BYOK Active' : 'Set API Key'}
              </span>
              <span className={`w-2 h-2 rounded-full ${userPreferences.isByokActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Settings button */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'text-indigo-400 bg-slate-900' : ''
              }`}
              title="Settings & Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950 py-2 px-1 text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'home' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'explore' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('following')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded relative ${
            activeTab === 'following' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Artists</span>
          {followingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center font-bold">
              {followingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded relative ${
            activeTab === 'calendar' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Calendar</span>
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] flex items-center justify-center font-bold">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'settings' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>BYOK</span>
        </button>
      </div>
    </header>
  );
};
