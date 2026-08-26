import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Heart, Calendar, ArrowRight, Music, RefreshCw } from 'lucide-react';
import { TMEvent, FollowedArtist, SavedEvent, UserPreferences } from '../types';
import { EventCard } from './EventCard';
import { fetchEvents } from '../services/ticketmaster';

interface PersonalizedHomeProps {
  userPreferences: UserPreferences;
  followedArtists: FollowedArtist[];
  savedEvents: SavedEvent[];
  savedEventIds: Set<string>;
  onToggleSaveEvent: (event: TMEvent) => void;
  onSelectEvent: (event: TMEvent) => void;
  onSelectArtist: (artistName: string) => void;
  onNavigateTab: (tab: 'explore' | 'artists' | 'calendar' | 'following') => void;
  byokToken?: string;
}

export const PersonalizedHome: React.FC<PersonalizedHomeProps> = ({
  userPreferences,
  followedArtists,
  savedEvents,
  savedEventIds,
  onToggleSaveEvent,
  onSelectEvent,
  onSelectArtist,
  onNavigateTab,
  byokToken
}) => {
  const [nearbyEvents, setNearbyEvents] = useState<TMEvent[]>([]);
  const [artistEvents, setArtistEvents] = useState<TMEvent[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<TMEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPersonalizedSections() {
      setLoading(true);

      // 1. Fetch Nearby Events
      const city = userPreferences.preferredLocation.city || 'Los Angeles';
      const nearbyRes = await fetchEvents(
        { city, radius: userPreferences.preferredLocation.radius },
        byokToken,
        0,
        8
      );
      setNearbyEvents(nearbyRes.data || []);

      // 2. Fetch Shows for Followed Artists
      if (followedArtists.length > 0) {
        const topArtist = followedArtists[0].name;
        const artistRes = await fetchEvents({ keyword: topArtist }, byokToken, 0, 4);
        setArtistEvents(artistRes.data || []);
      } else {
        setArtistEvents([]);
      }

      // 3. Recommended based on preferred genres
      const topGenre = userPreferences.favoriteGenres?.[0] || 'Rock';
      const recRes = await fetchEvents({ genre: topGenre }, byokToken, 0, 4);
      setRecommendedEvents(recRes.data || []);

      setLoading(false);
    }

    loadPersonalizedSections();
  }, [userPreferences.preferredLocation.city, followedArtists, byokToken]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-slate-100">
      
      {/* 1. UPCOMING NEAR YOU */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Upcoming Near You</h2>
              <p className="text-xs text-slate-400">
                Live shows in {userPreferences.preferredLocation.city} ({userPreferences.preferredLocation.radius} mile radius)
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>See All Shows</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-64 bg-slate-900 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyEvents.slice(0, 4).map(event => (
              <EventCard
                key={event.id}
                event={event}
                isSaved={savedEventIds.has(event.id)}
                onToggleSave={onToggleSaveEvent}
                onSelectEvent={onSelectEvent}
                onSelectArtist={onSelectArtist}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. SHOWS FROM YOUR FOLLOWED ARTISTS */}
      {followedArtists.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">From Your Followed Artists</h2>
                <p className="text-xs text-slate-400">
                  Shows for {followedArtists.map(a => a.name).slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('following')}
              className="flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              <span>Manage Artists</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artistEvents.slice(0, 4).map(event => (
              <EventCard
                key={event.id}
                event={event}
                isSaved={savedEventIds.has(event.id)}
                onToggleSave={onToggleSaveEvent}
                onSelectEvent={onSelectEvent}
                onSelectArtist={onSelectArtist}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDED FOR YOU */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Recommended For You</h2>
              <p className="text-xs text-slate-400">
                Curated music events based on your preferred genre ({userPreferences.favoriteGenres?.[0] || 'Rock'}) and activity
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedEvents.slice(0, 4).map(event => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEventIds.has(event.id)}
              onToggleSave={onToggleSaveEvent}
              onSelectEvent={onSelectEvent}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
