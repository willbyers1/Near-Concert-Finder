import React from 'react';
import { Heart, Music, ExternalLink, Calendar } from 'lucide-react';
import { TMAttraction } from '../types';

interface ArtistCardProps {
  artist: TMAttraction;
  isFollowed: boolean;
  onToggleFollow: (artist: TMAttraction) => void;
  onViewShows: (artistName: string) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  isFollowed,
  onToggleFollow,
  onViewShows
}) => {
  const imageUrl = artist.image || artist.images?.[0]?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300">
      
      {/* Artist Image Banner */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Follow Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFollow(artist);
          }}
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-lg backdrop-blur-md flex items-center gap-1.5 ${
            isFollowed
              ? 'bg-rose-500 text-white'
              : 'bg-slate-950/70 text-slate-200 hover:bg-slate-950'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
          <span>{isFollowed ? 'Following' : 'Follow'}</span>
        </button>

        {/* Genre Pill */}
        {artist.genre && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md">
            {artist.genre}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors">
            {artist.name}
          </h3>
          {artist.upcomingEventsCount !== undefined && artist.upcomingEventsCount > 0 && (
            <p className="text-xs text-indigo-400 font-semibold mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{artist.upcomingEventsCount} upcoming show{artist.upcomingEventsCount > 1 ? 's' : ''}</span>
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onViewShows(artist.name)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Find Shows & Concerts
          </button>
        </div>
      </div>

    </div>
  );
};
