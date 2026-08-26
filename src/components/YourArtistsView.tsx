import React, { useState, useEffect } from 'react';
import { Heart, Music, Search, Calendar, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { FollowedArtist, TMAttraction, TMEvent } from '../types';
import { ArtistCard } from './ArtistCard';
import { EventCard } from './EventCard';
import { searchArtists, fetchEvents } from '../services/ticketmaster';

interface YourArtistsViewProps {
  followedArtists: FollowedArtist[];
  onToggleFollow: (artist: TMAttraction) => void;
  onUnfollowById: (artistId: string) => void;
  onSelectArtistShows: (artistName: string) => void;
  savedEventIds: Set<string>;
  onToggleSaveEvent: (event: TMEvent) => void;
  onSelectEvent: (event: TMEvent) => void;
  byokToken?: string;
}

export const YourArtistsView: React.FC<YourArtistsViewProps> = ({
  followedArtists,
  onToggleFollow,
  onUnfollowById,
  onSelectArtistShows,
  savedEventIds,
  onToggleSaveEvent,
  onSelectEvent,
  byokToken
}) => {
  const [activeTab, setActiveTab] = useState<'followed' | 'search'>('followed');
  const [artistSearchTerm, setArtistSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TMAttraction[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search artists handler
  const handleSearchArtists = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistSearchTerm.trim()) return;

    setSearchLoading(true);
    const res = await searchArtists(artistSearchTerm.trim(), byokToken);
    setSearchLoading(false);
    setSearchResults(res.data || []);
  };

  const followedIdsSet = new Set(followedArtists.map(a => a.artistId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl font-black text-white">Your Followed Artists</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Follow your favorite musicians and bands to receive personalized concert recommendations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('followed')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'followed'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Following ({followedArtists.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Discover New Artists
          </button>
        </div>
      </div>

      {activeTab === 'followed' ? (
        /* FOLLOWED ARTISTS GRID */
        <div className="space-y-6">
          {followedArtists.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-violet-400">
                <Music className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">No Followed Artists Yet</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Search for your favorite performers and click Follow to get customized show updates.
              </p>
              <button
                onClick={() => setActiveTab('search')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Search & Follow Artists
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {followedArtists.map((artist) => (
                <div
                  key={artist.artistId}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4 hover:border-violet-500/50 transition-all group"
                >
                  <img
                    src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80'}
                    alt={artist.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-white truncate">{artist.name}</h3>
                    {artist.genre && <p className="text-[10px] text-violet-400 font-semibold">{artist.genre}</p>}
                    <button
                      onClick={() => onSelectArtistShows(artist.name)}
                      className="text-[11px] text-indigo-400 hover:underline font-medium block cursor-pointer"
                    >
                      Find Shows →
                    </button>
                  </div>
                  <button
                    onClick={() => onUnfollowById(artist.artistId)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Unfollow Artist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* DISCOVER NEW ARTISTS SEARCH */
        <div className="space-y-6">
          <form onSubmit={handleSearchArtists} className="max-w-xl flex gap-2">
            <input
              type="text"
              placeholder="Search band or artist name (e.g. Tame Impala, Dua Lipa, SZA)..."
              value={artistSearchTerm}
              onChange={(e) => setArtistSearchTerm(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {searchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  isFollowed={followedIdsSet.has(artist.id)}
                  onToggleFollow={onToggleFollow}
                  onViewShows={onSelectArtistShows}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
