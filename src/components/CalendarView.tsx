import React, { useState } from 'react';
import { Calendar as CalendarIcon, Trash2, ExternalLink, Download, Sparkles, Music, MapPin, Clock, Plus, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { SavedEvent } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface CalendarViewProps {
  savedEvents: SavedEvent[];
  onRemoveEvent: (eventId: string) => void;
  onExploreShows: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  savedEvents,
  onRemoveEvent,
  onExploreShows
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Sort saved events chronologically by date
  const sortedEvents = [...savedEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Separate upcoming vs past events
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingEvents = sortedEvents.filter(e => e.date >= todayStr);
  const pastEvents = sortedEvents.filter(e => e.date < todayStr);

  const handleExportAll = () => {
    if (savedEvents.length === 0) return;
    // Download .ics for all saved shows
    savedEvents.forEach(e => downloadIcsFile(e as any));
  };

  // Month navigation helpers for calendar view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Map events by date YYYY-MM-DD
  const eventsByDate = new Map<string, SavedEvent[]>();
  sortedEvents.forEach(e => {
    const list = eventsByDate.get(e.date) || [];
    list.push(e);
    eventsByDate.set(e.date, list);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white">My Live Music Calendar</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage saved concerts & festivals, export to external calendars, and track your upcoming shows.
          </p>
        </div>

        {/* View Switcher & Export */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Month Grid
            </button>
          </div>

          {savedEvents.length > 0 && (
            <button
              onClick={handleExportAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export All (.ICS)</span>
            </button>
          )}

        </div>
      </div>

      {/* Empty State */}
      {savedEvents.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your Live Music Calendar is Empty</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Browse upcoming concerts and festivals near you, then click the heart icon on any event card to save it to your personal calendar.
          </p>
          <button
            onClick={onExploreShows}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Discover Events Now</span>
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="space-y-8">
          
          {/* Upcoming Shows Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Upcoming Saved Shows ({upcomingEvents.length})</span>
            </h2>

            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No upcoming saved shows.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.eventId}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={event.imageUrl}
                        alt={event.eventName}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                          <span>{event.date}</span>
                          {event.time && <span>• {event.time.slice(0, 5)}</span>}
                        </div>
                        <h3 className="text-sm font-bold text-white truncate">{event.eventName}</h3>
                        <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{event.venueName}, {event.city}</span>
                        </p>
                        {event.isFestival ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950">
                            Festival
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                            {event.genre || 'Concert'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Personal Notes */}
                    {event.notes && (
                      <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{event.notes}</span>
                      </p>
                    )}

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={generateGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
                        >
                          Google Cal
                        </a>
                        <button
                          onClick={() => downloadIcsFile(event)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
                        >
                          .ICS
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={event.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors cursor-pointer"
                        >
                          <span>Tickets</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => onRemoveEvent(event.eventId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Remove Event from Calendar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Shows Section */}
          {pastEvents.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Past Concert History ({pastEvents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
                {pastEvents.map((event) => (
                  <div
                    key={event.eventId}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={event.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs text-slate-500">{event.date}</p>
                        <h4 className="text-xs font-bold text-slate-300">{event.eventName}</h4>
                        <p className="text-[11px] text-slate-500">{event.venueName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveEvent(event.eventId)}
                      className="p-1.5 rounded text-slate-600 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* MONTH GRID VIEW */
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          
          {/* Month Navigator Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{monthName}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty leading cells */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] bg-slate-950/20 rounded-xl p-1" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
              const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
              const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

              const dayEvents = eventsByDate.get(dateKey) || [];
              const isToday = dateKey === todayStr;

              return (
                <div
                  key={dateKey}
                  className={`min-h-[90px] rounded-xl p-1.5 border transition-colors flex flex-col justify-between ${
                    isToday
                      ? 'bg-indigo-950/40 border-indigo-500/60'
                      : dayEvents.length > 0
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-950/40 border-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : 'text-slate-400'}`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.map(e => (
                      <a
                        key={e.eventId}
                        href={e.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-1 rounded text-[10px] font-bold truncate ${
                          e.isFestival
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/30'
                        }`}
                        title={`${e.eventName} @ ${e.venueName}`}
                      >
                        {e.eventName}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
