import { TMEvent, TMAttraction, SavedEvent } from '../types';

export const DEMO_EVENTS: TMEvent[] = [
  {
    id: 'demo-101',
    name: 'Coachella Valley Music and Arts Festival 2026',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    isFestival: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        ratio: '16_9',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      startDate: '2026-04-17',
      startTime: '13:00:00',
      startDateTime: '2026-04-17T13:00:00Z',
      formattedDate: 'Fri, Apr 17, 2026',
      status: 'onsale'
    },
    classifications: {
      segment: 'Music',
      genre: 'Festival',
      subGenre: 'Indie Pop / Electronic / Rock'
    },
    priceRanges: [{ min: 499, max: 1299, currency: 'USD' }],
    venues: [
      {
        id: 'v-empire',
        name: 'Empire Polo Club',
        city: 'Indio',
        state: 'CA',
        address: '81-800 Avenue 51',
        postalCode: '92201',
        country: 'United States',
        location: { latitude: 33.6798, longitude: -116.2372 }
      }
    ],
    attractions: [
      {
        id: 'att-1',
        name: 'Tame Impala',
        genre: 'Psychedelic Rock',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'att-2',
        name: 'Dua Lipa',
        genre: 'Pop',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'att-3',
        name: 'Fred again..',
        genre: 'Electronic',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80'
      }
    ],
    info: 'World-famous 3-day music and arts festival in the desert featuring top global pop, rock, indie, and electronic artists.',
    pleaseNote: 'Passes include access to all desert stages, art installations, and festival amenities.'
  },
  {
    id: 'demo-102',
    name: 'The Weeknd - After Hours Til Dawn World Tour',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    isFestival: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
        ratio: '16_9',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      startDate: '2026-08-22',
      startTime: '19:30:00',
      startDateTime: '2026-08-22T19:30:00Z',
      formattedDate: 'Sat, Aug 22, 2026',
      status: 'onsale'
    },
    classifications: {
      segment: 'Music',
      genre: 'R&B',
      subGenre: 'Pop / Synthwave'
    },
    priceRanges: [{ min: 85, max: 350, currency: 'USD' }],
    venues: [
      {
        id: 'v-sofi',
        name: 'SoFi Stadium',
        city: 'Inglewood',
        state: 'CA',
        address: '1001 Stadium Dr',
        postalCode: '90301',
        country: 'United States',
        location: { latitude: 33.9534, longitude: -118.3387 }
      }
    ],
    attractions: [
      {
        id: 'att-weeknd',
        name: 'The Weeknd',
        genre: 'R&B / Pop',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'att-kaytranada',
        name: 'Kaytranada',
        genre: 'Electronic / R&B',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
      }
    ],
    info: 'Spectacular stadium concert with immersive cinematic production, laser displays, and high-energy hits.'
  },
  {
    id: 'demo-103',
    name: 'Lollapalooza Music Festival 2026',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    isFestival: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
        ratio: '16_9',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      startDate: '2026-08-01',
      startTime: '12:00:00',
      startDateTime: '2026-08-01T12:00:00Z',
      formattedDate: 'Sat, Aug 1, 2026',
      status: 'onsale'
    },
    classifications: {
      segment: 'Music',
      genre: 'Festival',
      subGenre: 'Rock / Hip-Hop / EDM'
    },
    priceRanges: [{ min: 385, max: 950, currency: 'USD' }],
    venues: [
      {
        id: 'v-grantpark',
        name: 'Grant Park',
        city: 'Chicago',
        state: 'IL',
        address: '337 E Randolph St',
        postalCode: '60601',
        country: 'United States',
        location: { latitude: 41.8756, longitude: -87.6244 }
      }
    ],
    attractions: [
      {
        id: 'att-arctic',
        name: 'Arctic Monkeys',
        genre: 'Indie Rock',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'att-sza',
        name: 'SZA',
        genre: 'R&B',
        image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80'
      }
    ],
    info: 'Annual 4-day music festival in Grant Park, Chicago featuring over 170 bands across 8 stages.'
  },
  {
    id: 'demo-104',
    name: 'Billie Eilish - Hit Me Hard and Soft: The Tour',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    isFestival: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
        ratio: '16_9',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      startDate: '2026-09-10',
      startTime: '20:00:00',
      startDateTime: '2026-09-10T20:00:00Z',
      formattedDate: 'Thu, Sep 10, 2026',
      status: 'onsale'
    },
    classifications: {
      segment: 'Music',
      genre: 'Alternative',
      subGenre: 'Pop'
    },
    priceRanges: [{ min: 65, max: 280, currency: 'USD' }],
    venues: [
      {
        id: 'v-msg',
        name: 'Madison Square Garden',
        city: 'New York',
        state: 'NY',
        address: '4 Pennsylvania Plaza',
        postalCode: '10001',
        country: 'United States',
        location: { latitude: 40.7505, longitude: -73.9934 }
      }
    ],
    attractions: [
      {
        id: 'att-billie',
        name: 'Billie Eilish',
        genre: 'Alternative Pop',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
      }
    ],
    info: 'Arena arena tour experience featuring 360-degree stage visuals and acoustic renditions.'
  },
  {
    id: 'demo-105',
    name: 'Kendrick Lamar & Friends Live in Concert',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    isFestival: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
        ratio: '16_9',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      startDate: '2026-09-18',
      startTime: '19:00:00',
      startDateTime: '2026-09-18T19:00:00Z',
      formattedDate: 'Fri, Sep 18, 2026',
      status: 'onsale'
    },
    classifications: {
      segment: 'Music',
      genre: 'Hip-Hop/Rap',
      subGenre: 'Urban'
    },
    priceRanges: [{ min: 95, max: 450, currency: 'USD' }],
    venues: [
      {
        id: 'v-crypto',
        name: 'Crypto.com Arena',
        city: 'Los Angeles',
        state: 'CA',
        address: '1111 S Figueroa St',
        postalCode: '90015',
        country: 'United States',
        location: { latitude: 34.043, longitude: -118.2673 }
      }
    ],
    attractions: [
      {
        id: 'att-kendrick',
        name: 'Kendrick Lamar',
        genre: 'Hip-Hop',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80'
      }
    ],
    info: 'Pulitzer prize-winning artist performs live with full band and special guest appearances.'
  },
  {
    id: 'demo-106',
    name: 'Electric Daisy Carnival (EDC) Las Vegas 2026',
    type: 'event',
    url: 'https://www.ticketmaster.com',
    isFestival: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        ratio: '16_9',
        width: 1200,
        height: 675
      }
    ],
    dates: {
      startDate: '2026-10-02',
      startTime: '17:00:00',
      startDateTime: '2026-10-02T17:00:00Z',
      formattedDate: 'Fri, Oct 2, 2026',
      status: 'onsale'
    },
    classifications: {
      segment: 'Music',
      genre: 'Festival',
      subGenre: 'Electronic / Dance'
    },
    priceRanges: [{ min: 380, max: 890, currency: 'USD' }],
    venues: [
      {
        id: 'v-speedway',
        name: 'Las Vegas Motor Speedway',
        city: 'Las Vegas',
        state: 'NV',
        address: '7000 Las Vegas Blvd N',
        postalCode: '89115',
        country: 'United States',
        location: { latitude: 36.2718, longitude: -115.0108 }
      }
    ],
    attractions: [
      {
        id: 'att-tiesto',
        name: 'Tiësto',
        genre: 'Electronic',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'att-skrillex',
        name: 'Skrillex',
        genre: 'Dubstep / Electronic',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
      }
    ],
    info: 'Premier electronic dance music festival Under the Electric Sky with pyrotechnics, art cars, and stage designs.'
  }
];

export const DEMO_ARTISTS: TMAttraction[] = [
  {
    id: 'att-1',
    name: 'Tame Impala',
    genre: 'Psychedelic Rock',
    subGenre: 'Indie Rock',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    upcomingEventsCount: 4,
    externalLinks: {
      spotify: 'https://open.spotify.com',
      youtube: 'https://youtube.com',
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'att-2',
    name: 'Dua Lipa',
    genre: 'Pop',
    subGenre: 'Dance Pop',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    upcomingEventsCount: 8,
    externalLinks: {
      spotify: 'https://open.spotify.com',
      instagram: 'https://instagram.com'
    }
  },
  {
    id: 'att-weeknd',
    name: 'The Weeknd',
    genre: 'R&B',
    subGenre: 'Synthpop',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    upcomingEventsCount: 12,
    externalLinks: {
      spotify: 'https://open.spotify.com',
      youtube: 'https://youtube.com'
    }
  },
  {
    id: 'att-billie',
    name: 'Billie Eilish',
    genre: 'Alternative',
    subGenre: 'Pop',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    upcomingEventsCount: 6
  },
  {
    id: 'att-kendrick',
    name: 'Kendrick Lamar',
    genre: 'Hip-Hop/Rap',
    subGenre: 'Conscious Hip-Hop',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
    upcomingEventsCount: 5
  },
  {
    id: 'att-3',
    name: 'Fred again..',
    genre: 'Electronic',
    subGenre: 'House / UK Garage',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    upcomingEventsCount: 7
  }
];
