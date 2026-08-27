import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventGrid } from './components/EventGrid';
import { FilterPanel } from './components/FilterPanel';
import { EventDetailsModal } from './components/EventDetailsModal';
import { LocationModal } from './components/LocationModal';
import { CalendarView } from './components/CalendarView';
import { ApiKeySettings } from './components/ApiKeySettings';
import { YourArtistsView } from './components/YourArtistsView';
import { PersonalizedHome } from './components/PersonalizedHome';

import {
  TMEvent,
  TMAttraction,
  EventFilterState,
  UserPreferences,
  UserProfile,
  SavedEvent,
  FollowedArtist
} from './types';

import {
  getUserPreferences,
  saveUserPreferences,
  getUserProfile,
  getSavedEvents,
  saveEvent,
  removeSavedEvent,
  getFollowedArtists,
  followArtist,
  unfollowArtist
} from './services/storage';

import { fetchEvents, searchArtists } from './services/ticketmaster';
import { Filter, Search, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'artists' | 'calendar' | 'following' | 'settings'>('home');

  // Storage Persistent State
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => getUserPreferences());
  const [userProfile] = useState<UserProfile>(() => getUserProfile());
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => getSavedEvents());
  const [followedArtists, setFollowedArtists] = useState<FollowedArtist[]>(() => getFollowedArtists());

  // Set of saved event IDs for quick lookup
  const savedEventIds = useMemo(() => new Set(savedEvents.map(e => e.eventId)), [savedEvents]);

  // Modals & Active View Details
  const [selectedEvent, setSelectedEvent] = useState<TMEvent | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Search & Filter State
  const DEFAULT_FILTERS: EventFilterState = {
    keyword: '',
    city: userPreferences.preferredLocation.city || 'Los Angeles',
    state: userPreferences.preferredLocation.state || 'CA',
    radius: userPreferences.preferredLocation.radius || 50,
    dateRange: 'all',
    classification: 'all',
    genre: 'All',
    priceCategory: 'all',
    sortBy: 'date,asc'
  };

  const [filters, setFilters] = useState<EventFilterState>(DEFAULT_FILTERS);

  // Events API response state
  const [events, setEvents] = useState<TMEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [apiMessage, setApiMessage] = useState<string | undefined>(undefined);
  const [apiError, setApiError] = useState<string | undefined>(undefined);

  // Fetch events when filters or location or BYOK key changes
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setApiError(undefined);

    const res = await fetchEvents(
      {
        keyword: filters.keyword,
        city: filters.city,
        state: filters.state,
        radius: filters.radius,
        dateRange: filters.dateRange,
        customStartDate: filters.customStartDate,
        customEndDate: filters.customEndDate,
        classification: filters.classification,
        genre: filters.genre,
        priceCategory: filters.priceCategory,
        sortBy: filters.sortBy
      },
      userPreferences.byokEncryptedToken
    );

    setEvents(res.data || []);
    setIsDemoMode(!!res.isDemoMode);
    setApiMessage(res.message);
    setApiError(res.error);
    setLoading(false);
  }, [filters, userPreferences.byokEncryptedToken]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Preference Handlers
  const handleSavePreferences = (updated: Partial<UserPreferences>) => {
    const newPrefs = saveUserPreferences(updated);
    setUserPreferences(newPrefs);
    if (newPrefs.preferredLocation.city) {
      setFilters(prev => ({
        ...prev,
        city: newPrefs.preferredLocation.city,
        state: newPrefs.preferredLocation.state || '',
        radius: newPrefs.preferredLocation.radius
      }));
    }
  };

  // Event Save / Toggle Handlers
  const handleToggleSaveEvent = (event: TMEvent, notes?: string) => {
    if (savedEventIds.has(event.id)) {
      const updated = removeSavedEvent(event.id);
      setSavedEvents(updated);
    } else {
      const updated = saveEvent(event, notes);
      setSavedEvents(updated);
    }
  };

  const handleRemoveSavedEvent = (eventId: string) => {
    const updated = removeSavedEvent(eventId);
    setSavedEvents(updated);
  };

  // Artist Follow Handlers
  const handleToggleFollowArtist = (artist: TMAttraction) => {
    const isFollowed = followedArtists.some(a => a.artistId === artist.id);
    if (isFollowed) {
      const updated = unfollowArtist(artist.id);
      setFollowedArtists(updated);
    } else {
      const updated = followArtist({
        id: artist.id,
        name: artist.name,
        image: artist.image || artist.images?.[0]?.url,
        genre: artist.genre
      });
      setFollowedArtists(updated);
    }
  };

  const handleUnfollowArtistById = (artistId: string) => {
    const updated = unfollowArtist(artistId);
    setFollowedArtists(updated);
  };

  // Hero search submit
  const handleHeroSearch = (keyword: string, location: string) => {
    setFilters(prev => ({
      ...prev,
      keyword,
      city: location
    }));
    setActiveTab('explore');
  };

  // Click on artist -> search shows
  const handleSelectArtistShows = (artistName: string) => {
    setFilters(prev => ({
      ...prev,
      keyword: artistName
    }));
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPreferences={userPreferences}
        userProfile={userProfile}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        savedCount={savedEvents.length}
        followingCount={followedArtists.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* DISCOVER / HOME VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <Hero
              onSearch={handleHeroSearch}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              userPreferences={userPreferences}
              onExploreClick={() => setActiveTab('explore')}
            />
            <PersonalizedHome
              userPreferences={userPreferences}
              followedArtists={followedArtists}
              savedEvents={savedEvents}
              savedEventIds={savedEventIds}
              onToggleSaveEvent={handleToggleSaveEvent}
              onSelectEvent={setSelectedEvent}
              onSelectArtist={handleSelectArtistShows}
              onNavigateTab={setActiveTab as any}
              byokToken={userPreferences.byokEncryptedToken}
            />
          </div>
        )}

        {/* EXPLORE EVENTS VIEW */}
        {activeTab === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Search Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>Explore Live Concerts & Festivals</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Showing events for <strong className="text-slate-200">{filters.city}</strong> within {filters.radius} miles
                </p>
              </div>

              {/* Keyword & Mobile Filter Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search event name or artist..."
                    value={filters.keyword}
                    onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                    className="w-full p-2.5 pl-9 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>

                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white flex items-center gap-1.5 text-xs font-bold"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Sidebar Filters + Event Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FilterPanel
                  filters={filters}
                  onFilterChange={updated => setFilters(prev => ({ ...prev, ...updated }))}
                  onResetFilters={() => setFilters(DEFAULT_FILTERS)}
                  isOpenMobile={isMobileFilterOpen}
                  onCloseMobile={() => setIsMobileFilterOpen(false)}
                />
              </div>

              <div className="lg:col-span-3">
                <EventGrid
                  events={events}
                  loading={loading}
                  isDemoMode={isDemoMode}
                  message={apiMessage}
                  error={apiError}
                  savedEventIds={savedEventIds}
                  onToggleSave={handleToggleSaveEvent}
                  onSelectEvent={setSelectedEvent}
                  onSelectArtist={handleSelectArtistShows}
                  onResetFilters={() => setFilters(DEFAULT_FILTERS)}
                  onOpenByokSettings={() => setActiveTab('settings')}
                />
              </div>
            </div>

          </div>
        )}

        {/* ARTISTS SEARCH VIEW */}
        {activeTab === 'artists' && (
          <YourArtistsView
            followedArtists={followedArtists}
            onToggleFollow={handleToggleFollowArtist}
            onUnfollowById={handleUnfollowArtistById}
            onSelectArtistShows={handleSelectArtistShows}
            savedEventIds={savedEventIds}
            onToggleSaveEvent={handleToggleSaveEvent}
            onSelectEvent={setSelectedEvent}
            byokToken={userPreferences.byokEncryptedToken}
          />
        )}

        {/* YOUR ARTISTS VIEW */}
        {activeTab === 'following' && (
          <YourArtistsView
            followedArtists={followedArtists}
            onToggleFollow={handleToggleFollowArtist}
            onUnfollowById={handleUnfollowArtistById}
            onSelectArtistShows={handleSelectArtistShows}
            savedEventIds={savedEventIds}
            onToggleSaveEvent={handleToggleSaveEvent}
            onSelectEvent={setSelectedEvent}
            byokToken={userPreferences.byokEncryptedToken}
          />
        )}

        {/* CALENDAR VIEW */}
        {activeTab === 'calendar' && (
          <CalendarView
            savedEvents={savedEvents}
            onRemoveEvent={handleRemoveSavedEvent}
            onExploreShows={() => setActiveTab('explore')}
          />
        )}

        {/* BYOK SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <ApiKeySettings
            userPreferences={userPreferences}
            onSavePreferences={handleSavePreferences}
          />
        )}

      </main>

      {/* Modals */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isSaved={selectedEvent ? savedEventIds.has(selectedEvent.id) : false}
        onToggleSave={handleToggleSaveEvent}
        onSelectArtist={handleSelectArtistShows}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        userPreferences={userPreferences}
        onSavePreferences={handleSavePreferences}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-300">Concert & Festival Finder</p>
            <p className="mt-1">Live Ticketmaster API Integration & BYOK Credentials Architecture.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setActiveTab('home')} className="hover:text-slate-300">Discover</button>
            <button onClick={() => setActiveTab('explore')} className="hover:text-slate-300">Explore Shows</button>
            <button onClick={() => setActiveTab('calendar')} className="hover:text-slate-300">My Calendar</button>
            <button onClick={() => setActiveTab('settings')} className="hover:text-slate-300">BYOK Settings</button>
            <a href="https://developer.ticketmaster.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400">
              Ticketmaster Dev Portal
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
