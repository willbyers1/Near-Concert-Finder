import { SavedEvent, FollowedArtist, UserPreferences, TMEvent } from '../types';

const SAVED_EVENTS_KEY = 'concert_finder_saved_events';
const FOLLOWED_ARTISTS_KEY = 'concert_finder_followed_artists';
const USER_PREFS_KEY = 'concert_finder_user_prefs';
const USER_PROFILE_KEY = 'concert_finder_user_profile';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  preferredLocation: {
    city: 'Los Angeles',
    state: 'CA',
    radius: 50
  },
  favoriteGenres: ['Rock', 'Indie', 'Pop', 'Electronic', 'Hip-Hop/Rap'],
  isByokActive: false
};

export const DEFAULT_USER: UserProfile = {
  id: 'user_local_101',
  name: 'Music Enthusiast',
  email: 'listener@livemusic.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isAuthenticated: true
};

// Saved Events Storage
export function getSavedEvents(): SavedEvent[] {
  try {
    const raw = localStorage.getItem(SAVED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read saved events:', e);
    return [];
  }
}

export function saveEvent(event: TMEvent, notes?: string): SavedEvent[] {
  const current = getSavedEvents();
  if (current.some(e => e.eventId === event.id)) {
    return current; // already saved
  }

  const primaryVenue = event.venues[0];
  const newSaved: SavedEvent = {
    eventId: event.id,
    eventName: event.name,
    artistNames: event.attractions.map(a => a.name),
    venueName: primaryVenue?.name || 'Venue TBA',
    city: primaryVenue?.city || '',
    state: primaryVenue?.state || '',
    date: event.dates.startDate,
    time: event.dates.startTime,
    startDateTime: event.dates.startDateTime,
    imageUrl: event.images[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    ticketUrl: event.url,
    savedAt: new Date().toISOString(),
    genre: event.classifications.genre || event.classifications.segment || 'Music',
    priceRange: event.priceRanges?.[0] ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}` : undefined,
    notes,
    isFestival: event.isFestival
  };

  const updated = [newSaved, ...current];
  try {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save event:', e);
  }
  return updated;
}

export function removeSavedEvent(eventId: string): SavedEvent[] {
  const current = getSavedEvents();
  const updated = current.filter(e => e.eventId !== eventId);
  try {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove saved event:', e);
  }
  return updated;
}

export function isEventSaved(eventId: string): boolean {
  const current = getSavedEvents();
  return current.some(e => e.eventId === eventId);
}

// Followed Artists Storage
export function getFollowedArtists(): FollowedArtist[] {
  try {
    const raw = localStorage.getItem(FOLLOWED_ARTISTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function followArtist(artist: { id: string; name: string; image?: string; genre?: string }): FollowedArtist[] {
  const current = getFollowedArtists();
  if (current.some(a => a.artistId === artist.id)) return current;

  const newFollow: FollowedArtist = {
    artistId: artist.id,
    name: artist.name,
    image: artist.image,
    genre: artist.genre,
    followedAt: new Date().toISOString()
  };

  const updated = [newFollow, ...current];
  try {
    localStorage.setItem(FOLLOWED_ARTISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to follow artist:', e);
  }
  return updated;
}

export function unfollowArtist(artistId: string): FollowedArtist[] {
  const current = getFollowedArtists();
  const updated = current.filter(a => a.artistId !== artistId);
  try {
    localStorage.setItem(FOLLOWED_ARTISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to unfollow artist:', e);
  }
  return updated;
}

export function isArtistFollowed(artistId: string): boolean {
  const current = getFollowedArtists();
  return current.some(a => a.artistId === artistId);
}

// User Preferences Storage
export function getUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(USER_PREFS_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  try {
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save preferences:', e);
  }
  return updated;
}

// User Profile Storage
export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  } catch (e) {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): UserProfile {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
  return profile;
}
