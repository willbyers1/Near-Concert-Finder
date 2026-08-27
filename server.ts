import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side encryption key for BYOK credentials
const ENCRYPTION_SECRET = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';

// Helper function to encrypt sensitive user BYOK API Key
function encryptKey(text: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_SECRET.padEnd(32).slice(0, 32)), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.error('Encryption error:', err);
    throw new Error('Failed to encrypt API key');
  }
}

// Helper function to decrypt user BYOK API Key
function decryptKey(encryptedText: string): string {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) return '';
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_SECRET.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
    return '';
  }
}

// Mask key helper (e.g. ••••••••••••ABCD)
function maskKey(key: string): string {
  if (!key || key.length <= 4) return '••••';
  const last4 = key.slice(-4);
  return '••••••••••••' + last4;
}

// Determine active Ticketmaster API key from request header or environment
function getActiveApiKey(req: express.Request): string {
  const byokToken = req.headers['x-byok-token'] as string;
  if (byokToken) {
    const decrypted = decryptKey(byokToken);
    if (decrypted) return decrypted;
  }
  return process.env.TICKETMASTER_API_KEY || '';
}

// Normalize Ticketmaster event response object
function normalizeTMEvent(ev: any): any {
  const venues = ev._embedded?.venues?.map((v: any) => ({
    id: v.id || 'v-unknown',
    name: v.name || 'Venue TBA',
    city: v.city?.name || '',
    state: v.state?.stateCode || v.state?.name || '',
    address: v.address?.line1 || '',
    postalCode: v.postalCode || '',
    country: v.country?.name || v.country?.countryCode || '',
    location: v.location ? { latitude: parseFloat(v.location.latitude), longitude: parseFloat(v.location.longitude) } : undefined
  })) || [];

  const attractions = ev._embedded?.attractions?.map((a: any) => ({
    id: a.id || 'att-unknown',
    name: a.name || 'Artist',
    genre: a.classifications?.[0]?.genre?.name || a.classifications?.[0]?.segment?.name || '',
    subGenre: a.classifications?.[0]?.subGenre?.name || '',
    image: a.images?.[0]?.url || '',
    url: a.url || '',
    upcomingEventsCount: a.upcomingEvents?._total || 0,
    externalLinks: a.externalLinks ? {
      spotify: a.externalLinks.spotify?.[0]?.url,
      youtube: a.externalLinks.youtube?.[0]?.url,
      instagram: a.externalLinks.instagram?.[0]?.url,
      twitter: a.externalLinks.twitter?.[0]?.url,
      homepage: a.externalLinks.homepage?.[0]?.url
    } : undefined
  })) || [];

  const images = (ev.images || []).map((img: any) => ({
    url: img.url,
    ratio: img.ratio,
    width: img.width,
    height: img.height,
    fallback: img.fallback
  }));

  const segment = ev.classifications?.[0]?.segment?.name || '';
  const genre = ev.classifications?.[0]?.genre?.name || '';
  const subGenre = ev.classifications?.[0]?.subGenre?.name || '';
  const isFestival = genre.toLowerCase().includes('festival') || ev.name.toLowerCase().includes('festival') || subGenre.toLowerCase().includes('festival');

  // Format date readable
  let formattedDate = 'Date TBA';
  const startDate = ev.dates?.start?.localDate || '';
  const startTime = ev.dates?.start?.localTime || '';
  if (startDate) {
    try {
      const [year, month, day] = startDate.split('-');
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      formattedDate = startDate;
    }
  }

  return {
    id: ev.id,
    name: ev.name,
    type: ev.type || 'event',
    url: ev.url || 'https://www.ticketmaster.com',
    isFestival,
    images: images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' }],
    dates: {
      startDate,
      startTime,
      startDateTime: ev.dates?.start?.dateTime || `${startDate}T${startTime || '00:00:00'}Z`,
      formattedDate,
      status: ev.dates?.status?.code || 'onsale',
      timeZone: ev.dates?.timezone || ''
    },
    classifications: {
      segment,
      genre,
      subGenre,
      type: ev.classifications?.[0]?.type?.name || ''
    },
    priceRanges: ev.priceRanges?.map((p: any) => ({
      min: p.min,
      max: p.max,
      currency: p.currency || 'USD'
    })),
    venues,
    attractions,
    info: ev.info || ev.description || '',
    pleaseNote: ev.pleaseNote || '',
    seatmapUrl: ev.seatmap?.staticUrl || '',
    promoter: ev.promoter?.name || ''
  };
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// BYOK encrypt endpoint
app.post('/api/byok/encrypt', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return res.status(400).json({ error: 'Valid Ticketmaster API Key is required' });
  }

  const cleanKey = apiKey.trim();
  const encryptedToken = encryptKey(cleanKey);
  const maskedKey = maskKey(cleanKey);

  res.json({
    maskedKey,
    encryptedToken,
    message: 'API Key securely encrypted'
  });
});

// BYOK validate key endpoint
app.post('/api/byok/validate', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ valid: false, message: 'Please enter a valid API key string' });
  }

  const cleanKey = apiKey.trim();
  try {
    const testUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${encodeURIComponent(cleanKey)}&size=1`;
    const response = await fetch(testUrl);
    if (response.ok) {
      const encryptedToken = encryptKey(cleanKey);
      const maskedKey = maskKey(cleanKey);
      return res.json({
        valid: true,
        message: 'Ticketmaster API Key successfully verified!',
        maskedKey,
        encryptedToken
      });
    } else {
      const errorText = await response.text();
      return res.status(401).json({
        valid: false,
        message: `Ticketmaster API rejected key (HTTP ${response.status}). Please verify your key on developer.ticketmaster.com`
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      valid: false,
      message: `Failed to connect to Ticketmaster servers: ${err.message || 'Network error'}`
    });
  }
});

// Fetch events from Ticketmaster Discovery API
app.get('/api/ticketmaster/events', async (req, res) => {
  const apiKey = getActiveApiKey(req);

  // Extract query params
  const {
    keyword,
    city,
    stateCode,
    latlong,
    radius,
    classificationName,
    genreId,
    sort,
    startDateTime,
    endDateTime,
    page = '0',
    size = '20'
  } = req.query;

  // If no API Key configured, notify client to fallback or show BYOK banner
  if (!apiKey) {
    return res.json({
      data: [],
      isDemoMode: true,
      message: 'No Ticketmaster API key configured. You can add your own key in Settings (BYOK) or use demo events.',
      page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }
    });
  }

  try {
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('size', String(size));
    params.append('page', String(page));

    // Force segmentName Music for concert & festival focus unless overridden
    if (classificationName) {
      params.append('classificationName', String(classificationName));
    } else {
      params.append('segmentName', 'Music');
    }

    if (keyword) params.append('keyword', String(keyword));
    if (city) params.append('city', String(city));
    if (stateCode) params.append('stateCode', String(stateCode));
    if (latlong) params.append('latlong', String(latlong));
    if (radius) {
      params.append('radius', String(radius));
      params.append('unit', 'miles');
    }
    if (genreId) params.append('genreId', String(genreId));
    if (sort) params.append('sort', String(sort));
    if (startDateTime) params.append('startDateTime', String(startDateTime));
    if (endDateTime) params.append('endDateTime', String(endDateTime));

    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
    const tmRes = await fetch(apiUrl);

    if (!tmRes.ok) {
      if (tmRes.status === 401 || tmRes.status === 403) {
        return res.json({
          data: [],
          isDemoMode: true,
          error: 'Invalid or expired Ticketmaster API key. Please check your BYOK settings.',
          page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }
        });
      }
      if (tmRes.status === 429) {
        return res.json({
          data: [],
          isDemoMode: true,
          error: 'Ticketmaster API rate limit reached. Please wait a moment or use BYOK.',
          page: { size: 20, totalElements: 0, totalPages: 0, number: 0 }
        });
      }
      return res.json({
        data: [],
        isDemoMode: true,
        error: `Ticketmaster API error (HTTP ${tmRes.status})`
      });
    }

    const data: any = await tmRes.json();
    const rawEvents = data._embedded?.events || [];
    const normalizedEvents = rawEvents.map(normalizeTMEvent);

    res.json({
      data: normalizedEvents,
      isDemoMode: false,
      page: {
        size: data.page?.size || 20,
        totalElements: data.page?.totalElements || normalizedEvents.length,
        totalPages: data.page?.totalPages || 1,
        number: data.page?.number || 0
      }
    });
  } catch (err: any) {
    console.error('Error fetching Ticketmaster events:', err);
    res.json({
      data: [],
      isDemoMode: true,
      error: 'Network connection issue while contacting Ticketmaster.'
    });
  }
});

// Single event details
app.get('/api/ticketmaster/events/:id', async (req, res) => {
  const apiKey = getActiveApiKey(req);
  const { id } = req.params;

  if (!apiKey) {
    return res.status(400).json({ error: 'No Ticketmaster API key configured' });
  }

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(id)}.json?apikey=${encodeURIComponent(apiKey)}`;
    const tmRes = await fetch(url);
    if (!tmRes.ok) {
      return res.status(tmRes.status).json({ error: `Event not found (HTTP ${tmRes.status})` });
    }
    const rawEvent = await tmRes.json();
    res.json({ data: normalizeTMEvent(rawEvent) });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
});

// Search artists / attractions
app.get('/api/ticketmaster/attractions', async (req, res) => {
  const apiKey = getActiveApiKey(req);
  const { keyword, page = '0', size = '20' } = req.query;

  if (!apiKey) {
    return res.json({ data: [], isDemoMode: true });
  }

  try {
    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('size', String(size));
    params.append('page', String(page));
    if (keyword) params.append('keyword', String(keyword));

    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?${params.toString()}`;
    const tmRes = await fetch(url);
    if (!tmRes.ok) {
      return res.json({ data: [], isDemoMode: true });
    }

    const data: any = await tmRes.json();
    const rawAttractions = data._embedded?.attractions || [];
    const attractions = rawAttractions.map((a: any) => ({
      id: a.id,
      name: a.name,
      url: a.url || '',
      image: a.images?.[0]?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      genre: a.classifications?.[0]?.genre?.name || a.classifications?.[0]?.segment?.name || 'Music',
      subGenre: a.classifications?.[0]?.subGenre?.name || '',
      upcomingEventsCount: a.upcomingEvents?._total || 0,
      externalLinks: a.externalLinks ? {
        spotify: a.externalLinks.spotify?.[0]?.url,
        youtube: a.externalLinks.youtube?.[0]?.url,
        instagram: a.externalLinks.instagram?.[0]?.url,
        twitter: a.externalLinks.twitter?.[0]?.url,
        homepage: a.externalLinks.homepage?.[0]?.url
      } : undefined
    }));

    res.json({
      data: attractions,
      isDemoMode: false,
      page: {
        size: data.page?.size || 20,
        totalElements: data.page?.totalElements || attractions.length,
        totalPages: data.page?.totalPages || 1,
        number: data.page?.number || 0
      }
    });
  } catch (err: any) {
    res.json({ data: [], isDemoMode: true, error: err.message });
  }
});

// Start Express Server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Concert & Festival Finder server running on port ${PORT}`);
  });
}

startServer();
