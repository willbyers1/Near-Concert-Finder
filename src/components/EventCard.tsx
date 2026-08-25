import React from 'react';
import { Calendar, MapPin, Tag, ExternalLink, Heart, Sparkles, DollarSign, Music } from 'lucide-react';
import { TMEvent } from '../types';

interface EventCardProps {
  event: TMEvent;
  isSaved: boolean;
  onToggleSave: (event: TMEvent) => void;
  onSelectEvent: (event: TMEvent) => void;
  onSelectArtist?: (artistName: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSaved,
  onToggleSave,
  onSelectEvent,
  onSelectArtist
}) => {
  const imageUrl = event.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
  const primaryVenue = event.venues?.[0];
  const primaryArtist = event.attractions?.[0]?.name;
  const price = event.priceRanges?.[0];

  return (
    <div className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/90 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/40 transition-all duration-300">
      
      {/* Event Image Banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Festival Badge / Classification */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {event.isFestival ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3" />
              Festival
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
              <Music className="w-3 h-3" />
              {event.classifications.genre || event.classifications.segment || 'Concert'}
            </span>
          )}
        </div>

        {/* Save / Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(event);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg z-10 ${
            isSaved
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-slate-950/60 text-slate-300 hover:text-rose-400 hover:bg-slate-950/90'
          }`}
          title={isSaved ? 'Remove from Saved Calendar' : 'Save to Calendar'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Price tag over image */}
        {price && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/80 text-[11px] font-bold text-amber-300 backdrop-blur-md">
            ${price.min} - ${price.max} {price.currency}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{event.dates.formattedDate}</span>
            {event.dates.startTime && (
              <span className="text-slate-500">• {event.dates.startTime.slice(0, 5)}</span>
            )}
          </div>

          {/* Event Title */}
          <h3
            onClick={() => onSelectEvent(event)}
            className="text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {event.name}
          </h3>

          {/* Primary Artist Link */}
          {primaryArtist && (
            <p className="text-xs font-medium text-slate-400">
              Artist:{' '}
              <button
                onClick={() => onSelectArtist && onSelectArtist(primaryArtist)}
                className="text-slate-200 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
              >
                {primaryArtist}
              </button>
            </p>
          )}

          {/* Venue & Location */}
          {primaryVenue && (
            <div className="flex items-start gap-1.5 text-xs text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                {primaryVenue.name}
                {primaryVenue.city ? `, ${primaryVenue.city}` : ''}
                {primaryVenue.state ? `, ${primaryVenue.state}` : ''}
              </span>
            </div>
          )}

        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          
          <button
            onClick={() => onSelectEvent(event)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Details
          </button>

          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <span>Get Tickets</span>
            <ExternalLink className="w-3 h-3" />
          </a>

        </div>

      </div>

    </div>
  );
};
