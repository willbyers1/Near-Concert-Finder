import React, { useState } from 'react';
import { X, Calendar, MapPin, ExternalLink, Heart, Sparkles, DollarSign, Share2, Download, Music, AlertCircle, FileText } from 'lucide-react';
import { TMEvent } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface EventDetailsModalProps {
  event: TMEvent | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (event: TMEvent, notes?: string) => void;
  onSelectArtist?: (artistName: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  isSaved,
  onToggleSave,
  onSelectArtist
}) => {
  if (!event) return null;

  const [userNotes, setUserNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const primaryVenue = event.venues?.[0];
  const price = event.priceRanges?.[0];
  const googleCalUrl = generateGoogleCalendarUrl(event);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Check out ${event.name} on Concert & Festival Finder!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mapsUrl = primaryVenue
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${primaryVenue.name}, ${primaryVenue.address || ''}, ${primaryVenue.city || ''}`)}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-950 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950 overflow-hidden">
          <img
            src={event.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {event.isFestival ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-500 text-slate-950 shadow">
                <Sparkles className="w-3.5 h-3.5" />
                Festival
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-600 text-white shadow">
                <Music className="w-3.5 h-3.5" />
                {event.classifications.genre || event.classifications.segment || 'Concert'}
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-700 text-slate-300">
              {event.dates.status?.toUpperCase() || 'ONSALE'}
            </span>
          </div>

          {/* Bottom Title & Date Banner */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{event.dates.formattedDate}</span>
              {event.dates.startTime && <span>• {event.dates.startTime.slice(0, 5)}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {event.name}
            </h1>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            
            {/* Price tag */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tickets / Price</p>
                <p className="text-sm font-extrabold text-emerald-400">
                  {price ? `$${price.min} - $${price.max} ${price.currency}` : 'See Official Pricing'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Save to Calendar Button */}
              <button
                onClick={() => onToggleSave(event, userNotes)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved in Calendar' : 'Save Event'}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Share Event"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Get Tickets CTA */}
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <span>Get Tickets on Ticketmaster</span>
                <ExternalLink className="w-4 h-4" />
              </a>

            </div>

          </div>

          {copied && (
            <p className="text-xs text-emerald-400 text-center">Link copied to clipboard!</p>
          )}

          {/* External Calendar Export Section */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-3">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Add to Your Personal Calendar</span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Google Calendar</span>
              </a>

              <button
                onClick={() => downloadIcsFile(event)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download .ICS File (Apple / Outlook)</span>
              </button>
            </div>
          </div>

          {/* Lineup / Artists */}
          {event.attractions && event.attractions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lineup & Performing Artists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.attractions.map((artist) => (
                  <div
                    key={artist.id}
                    onClick={() => onSelectArtist && onSelectArtist(artist.name)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer group"
                  >
                    <img
                      src={artist.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80'}
                      alt={artist.name}
                      className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">{artist.name}</p>
                      {artist.genre && <p className="text-[10px] text-slate-500">{artist.genre}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Venue Information */}
          {primaryVenue && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue Location</h3>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200">{primaryVenue.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>
                      {primaryVenue.address ? `${primaryVenue.address}, ` : ''}
                      {primaryVenue.city ? `${primaryVenue.city}, ` : ''}
                      {primaryVenue.state || ''} {primaryVenue.postalCode || ''}
                    </span>
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          )}

          {/* Description / Additional Info */}
          {(event.info || event.pleaseNote) && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Details & Guidelines</h3>
              {event.info && <p className="text-xs text-slate-300 leading-relaxed">{event.info}</p>}
              {event.pleaseNote && (
                <p className="text-xs text-amber-300/80 bg-amber-950/20 border border-amber-500/20 p-3 rounded-xl">
                  <strong>Note:</strong> {event.pleaseNote}
                </p>
              )}
            </div>
          )}

          {/* Personal Notes input */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Personal Concert Notes (Saved locally)</span>
            </label>
            <textarea
              placeholder="Add notes like ticket section, seats, friend names, or pre-concert dinner plans..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

      </div>
    </div>
  );
};
