import React from 'react';
import { EventCard } from './EventCard';
import { TMEvent } from '../types';
import { Music, RefreshCw, AlertCircle } from 'lucide-react';

interface EventGridProps {
  events: TMEvent[];
  loading: boolean;
  isDemoMode?: boolean;
  message?: string;
  error?: string;
  savedEventIds: Set<string>;
  onToggleSave: (event: TMEvent) => void;
  onSelectEvent: (event: TMEvent) => void;
  onSelectArtist?: (artistName: string) => void;
  onResetFilters?: () => void;
  onOpenByokSettings?: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading,
  isDemoMode,
  message,
  error,
  savedEventIds,
  onToggleSave,
  onSelectEvent,
  onSelectArtist,
  onResetFilters,
  onOpenByokSettings
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 space-y-4 animate-pulse">
            <div className="aspect-[16/9] bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
            <div className="h-3 bg-slate-800/40 rounded w-2/3" />
            <div className="h-8 bg-slate-800 rounded-lg pt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Demo mode or BYOK Notice Banner */}
      {isDemoMode && (
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {message || 'Displaying curated music events. Add your Ticketmaster API key in BYOK Settings for live global searches.'}
            </span>
          </div>
          {onOpenByokSettings && (
            <button
              onClick={onOpenByokSettings}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Configure BYOK Key
            </button>
          )}
        </div>
      )}

      {/* Error message banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No events found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't find any upcoming concerts or festivals matching your current search parameters or location.
          </p>
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Search Filters</span>
            </button>
          )}
        </div>
      ) : (
        /* Event Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={savedEventIds.has(event.id)}
              onToggleSave={onToggleSave}
              onSelectEvent={onSelectEvent}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      )}

    </div>
  );
};
