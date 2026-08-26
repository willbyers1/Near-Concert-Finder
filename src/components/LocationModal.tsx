import React, { useState } from 'react';
import { X, MapPin, Navigation, Compass, Check } from 'lucide-react';
import { UserPreferences } from '../types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPreferences: UserPreferences;
  onSavePreferences: (updated: Partial<UserPreferences>) => void;
}

const POPULAR_CITIES = [
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.006 },
  { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { city: 'Austin', state: 'TX', lat: 30.2672, lng: -97.7431 },
  { city: 'Nashville', state: 'TN', lat: 36.1627, lng: -86.7816 },
  { city: 'London', state: 'UK', lat: 51.5074, lng: -0.1278 },
  { city: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398 },
  { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 }
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  userPreferences,
  onSavePreferences
}) => {
  if (!isOpen) return null;

  const [city, setCity] = useState(userPreferences.preferredLocation.city || '');
  const [state, setState] = useState(userPreferences.preferredLocation.state || '');
  const [radius, setRadius] = useState(userPreferences.preferredLocation.radius || 50);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const { latitude, longitude } = position.coords;
        onSavePreferences({
          preferredLocation: {
            city: 'Current Location',
            state: '',
            lat: latitude,
            lng: longitude,
            radius
          }
        });
        onClose();
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Geolocation permission was denied. You can select a city manually below.');
        } else {
          setGeoError('Unable to retrieve current location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    onSavePreferences({
      preferredLocation: {
        city: city.trim(),
        state: state.trim(),
        radius
      }
    });
    onClose();
  };

  const handleSelectPopularCity = (c: typeof POPULAR_CITIES[0]) => {
    setCity(c.city);
    setState(c.state);
    onSavePreferences({
      preferredLocation: {
        city: c.city,
        state: c.state,
        lat: c.lat,
        lng: c.lng,
        radius
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Select Event Discovery Location</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Geolocation Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleUseGeolocation}
            disabled={geoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
            <span>{geoLoading ? 'Detecting Location...' : 'Find Events Near Me (GPS)'}</span>
          </button>
          {geoError && <p className="text-[11px] text-rose-400 text-center">{geoError}</p>}
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Or Manual City</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Manual City Form */}
        <form onSubmit={handleManualSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Los Angeles"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State / Region</label>
              <input
                type="text"
                placeholder="CA"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Search Radius */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Search Radius</span>
              <span className="text-indigo-400 font-extrabold">{radius} Miles</span>
            </label>
            <input
              type="range"
              min="10"
              max="250"
              step="10"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full mt-2 accent-indigo-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Save Location & Radius
          </button>
        </form>

        {/* Popular Cities Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Popular Music Hubs</label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.city}
                type="button"
                onClick={() => handleSelectPopularCity(c)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {c.city}, {c.state}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
