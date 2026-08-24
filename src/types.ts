export interface TMImage {
  url: string;
  ratio?: string;
  width?: number;
  height?: number;
  fallback?: boolean;
}

export interface TMVenue {
  id: string;
  name: string;
  city?: string;
  state?: string;
  address?: string;
  postalCode?: string;
  country?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface TMAttraction {
  id: string;
  name: string;
  url?: string;
  image?: string;
  images?: TMImage[];
  genre?: string;
  subGenre?: string;
  upcomingEventsCount?: number;
  externalLinks?: {
    spotify?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    wiki?: string;
    homepage?: string;
  };
}

export interface TMPriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface TMEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  images: TMImage[];
  dates: {
    startDateTime?: string;
    startDate: string;
    startTime?: string;
    status?: string;
    timeZone?: string;
    formattedDate: string;
  };
  classifications: {
    segment?: string;
    genre?: string;
    subGenre?: string;
    type?: string;
  };
  priceRanges?: TMPriceRange[];
  venues: TMVenue[];
  attractions: TMAttraction[];
  info?: string;
  pleaseNote?: string;
  seatmapUrl?: string;
  promoter?: string;
  isFestival?: boolean;
}

export interface SavedEvent {
  eventId: string;
  eventName: string;
  artistNames: string[];
  venueName: string;
  city: string;
  state: string;
  date: string; // YYYY-MM-DD
  time?: string;
  startDateTime?: string;
  imageUrl: string;
  ticketUrl: string;
  savedAt: string;
  genre?: string;
  priceRange?: string;
  notes?: string;
  isFestival?: boolean;
}

export interface FollowedArtist {
  artistId: string;
  name: string;
  image?: string;
  genre?: string;
  followedAt: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

export interface UserPreferences {
  preferredLocation: {
    city: string;
    state: string;
    lat?: number;
    lng?: number;
    radius: number; // in miles
  };
  favoriteGenres: string[];
  byokKeyMasked?: string;
  byokEncryptedToken?: string;
  isByokActive: boolean;
}

export interface EventFilterState {
  keyword: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  radius: number;
  dateRange: 'all' | 'today' | 'this_weekend' | 'this_week' | 'this_month' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  classification: 'all' | 'Music' | 'Festival' | 'Arts & Theatre' | 'Sports';
  genre: string;
  priceCategory: 'all' | 'under_25' | '25_50' | '50_100' | 'over_100';
  sortBy: 'date,asc' | 'date,desc' | 'name,asc' | 'relevance,desc' | 'distance,asc';
}

export interface APIKeyValidationResult {
  valid: boolean;
  message: string;
  maskedKey?: string;
  encryptedToken?: string;
}

export interface TMAPIResponse<T> {
  data: T[];
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  isDemoMode?: boolean;
  message?: string;
  error?: string;
}
