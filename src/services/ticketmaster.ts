import { TMEvent, TMAttraction, TMAPIResponse, EventFilterState, APIKeyValidationResult } from '../types';
import { DEMO_EVENTS, DEMO_ARTISTS } from '../data/mockEvents';

/**
 * Service layer for interacting with Ticketmaster API via secure Express proxy
 */

export async function fetchEvents(
  filters: Partial<EventFilterState>,
  byokToken?: string,
  page: number = 0,
  size: number = 20
): Promise<TMAPIResponse<TMEvent>> {
  const query = new URLSearchParams();

  if (filters.keyword) query.append('keyword', filters.keyword);
  if (filters.city) query.append('city', filters.city);
  if (filters.state) query.append('stateCode', filters.state);
  if (filters.lat && filters.lng) {
    query.append('latlong', `${filters.lat.toFixed(4)},${filters.lng.toFixed(4)}`);
  }
  if (filters.radius) query.append('radius', String(filters.radius));

  if (filters.classification && filters.classification !== 'all') {
    query.append('classificationName', filters.classification);
  }

  if (filters.sortBy) {
    query.append('sort', filters.sortBy);
  }

  // Handle date filters
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date();
    let startDateStr = now.toISOString().split('.')[0] + 'Z';
    let endDate: Date | null = null;

    if (filters.dateRange === 'today') {
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (filters.dateRange === 'this_weekend') {
      const day = now.getDay();
      const daysToFriday = (5 - day + 7) % 7;
      const friday = new Date(now);
      friday.setDate(now.getDate() + daysToFriday);
      friday.setHours(0, 0, 0, 0);

      const sunday = new Date(friday);
      sunday.setDate(friday.getDate() + 2);
      sunday.setHours(23, 59, 59, 999);

      startDateStr = friday.toISOString().split('.')[0] + 'Z';
      endDate = sunday;
    } else if (filters.dateRange === 'this_week') {
      endDate = new Date(now);
      endDate.setDate(now.getDate() + 7);
    } else if (filters.dateRange === 'this_month') {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (filters.dateRange === 'custom' && filters.customStartDate) {
      startDateStr = `${filters.customStartDate}T00:00:00Z`;
      if (filters.customEndDate) {
        endDate = new Date(`${filters.customEndDate}T23:59:59Z`);
      }
    }

    query.append('startDateTime', startDateStr);
    if (endDate) {
      query.append('endDateTime', endDate.toISOString().split('.')[0] + 'Z');
    }
  }

  query.append('page', String(page));
  query.append('size', String(size));

  const headers: HeadersInit = {};
  if (byokToken) {
    headers['x-byok-token'] = byokToken;
  }

  try {
    const res = await fetch(`/api/ticketmaster/events?${query.toString()}`, { headers });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const result: TMAPIResponse<TMEvent> = await res.json();

    // If no results returned or demo mode active, provide filtered demo events so UI is vibrant
    if ((!result.data || result.data.length === 0) && (result.isDemoMode || !byokToken)) {
      let filteredDemo = filterDemoEvents(DEMO_EVENTS, filters);
      return {
        data: filteredDemo,
        isDemoMode: true,
        message: result.message || 'Displaying curated events. Add your Ticketmaster API Key in Settings to explore live global shows.',
        page: {
          size: 20,
          totalElements: filteredDemo.length,
          totalPages: 1,
          number: 0
        }
      };
    }

    return result;
  } catch (err: any) {
    console.warn('Error fetching events via API proxy, falling back to local demo dataset:', err);
    let filteredDemo = filterDemoEvents(DEMO_EVENTS, filters);
    return {
      data: filteredDemo,
      isDemoMode: true,
      message: 'Currently using curated event fallback mode. Set your Ticketmaster API Key in Settings.',
      page: {
        size: 20,
        totalElements: filteredDemo.length,
        totalPages: 1,
        number: 0
      }
    };
  }
}

// Client helper to filter demo events when live API isn't connected
function filterDemoEvents(events: TMEvent[], filters: Partial<EventFilterState>): TMEvent[] {
  return events.filter(e => {
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      const matchName = e.name.toLowerCase().includes(k);
      const matchVenue = e.venues.some(v => v.name.toLowerCase().includes(k) || v.city?.toLowerCase().includes(k));
      const matchArtist = e.attractions.some(a => a.name.toLowerCase().includes(k));
      const matchGenre = e.classifications.genre?.toLowerCase().includes(k);
      if (!matchName && !matchVenue && !matchArtist && !matchGenre) return false;
    }
    if (filters.city) {
      const c = filters.city.toLowerCase();
      const matchCity = e.venues.some(v => v.city?.toLowerCase().includes(c) || v.state?.toLowerCase().includes(c));
      if (!matchCity) return false;
    }
    if (filters.genre && filters.genre !== 'all') {
      const g = filters.genre.toLowerCase();
      const matchGenre = e.classifications.genre?.toLowerCase().includes(g) || e.classifications.subGenre?.toLowerCase().includes(g);
      if (!matchGenre) return false;
    }
    if (filters.classification && filters.classification !== 'all') {
      if (filters.classification === 'Festival' && !e.isFestival) return false;
      if (filters.classification === 'Music' && e.classifications.segment !== 'Music') return false;
    }
    if (filters.priceCategory && filters.priceCategory !== 'all') {
      const price = e.priceRanges?.[0]?.min || 0;
      if (filters.priceCategory === 'under_25' && price >= 25) return false;
      if (filters.priceCategory === '25_50' && (price < 25 || price > 50)) return false;
      if (filters.priceCategory === '50_100' && (price < 50 || price > 100)) return false;
      if (filters.priceCategory === 'over_100' && price < 100) return false;
    }
    return true;
  });
}

export async function fetchEventById(id: string, byokToken?: string): Promise<TMEvent | null> {
  // Check demo events first
  const demoMatch = DEMO_EVENTS.find(e => e.id === id);
  if (demoMatch) return demoMatch;

  const headers: HeadersInit = {};
  if (byokToken) headers['x-byok-token'] = byokToken;

  try {
    const res = await fetch(`/api/ticketmaster/events/${encodeURIComponent(id)}`, { headers });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    return null;
  }
}

export async function searchArtists(
  keyword: string,
  byokToken?: string
): Promise<TMAPIResponse<TMAttraction>> {
  const headers: HeadersInit = {};
  if (byokToken) headers['x-byok-token'] = byokToken;

  try {
    const res = await fetch(`/api/ticketmaster/attractions?keyword=${encodeURIComponent(keyword)}`, { headers });
    if (!res.ok) throw new Error('API error');
    const result: TMAPIResponse<TMAttraction> = await res.json();

    if ((!result.data || result.data.length === 0) && (result.isDemoMode || !byokToken)) {
      const matches = DEMO_ARTISTS.filter(a => a.name.toLowerCase().includes(keyword.toLowerCase()));
      return {
        data: matches.length > 0 ? matches : DEMO_ARTISTS,
        isDemoMode: true,
        page: { size: 20, totalElements: matches.length || DEMO_ARTISTS.length, totalPages: 1, number: 0 }
      };
    }
    return result;
  } catch (e) {
    const matches = DEMO_ARTISTS.filter(a => a.name.toLowerCase().includes(keyword.toLowerCase()));
    return {
      data: matches.length > 0 ? matches : DEMO_ARTISTS,
      isDemoMode: true,
      page: { size: 20, totalElements: matches.length || DEMO_ARTISTS.length, totalPages: 1, number: 0 }
    };
  }
}

export async function validateAndEncryptKey(apiKey: string): Promise<APIKeyValidationResult> {
  try {
    const res = await fetch('/api/byok/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      valid: false,
      message: err.message || 'Failed to reach validation service'
    };
  }
}
