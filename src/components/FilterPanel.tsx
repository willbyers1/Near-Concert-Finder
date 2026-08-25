import React from 'react';
import { Filter, Calendar, Tag, DollarSign, ArrowUpDown, RefreshCw, X, Sparkles } from 'lucide-react';
import { EventFilterState } from '../types';

interface FilterPanelProps {
  filters: EventFilterState;
  onFilterChange: (updated: Partial<EventFilterState>) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const GENRES_LIST = [
  'All',
  'Rock',
  'Pop',
  'Hip-Hop/Rap',
  'Electronic',
  'Alternative',
  'R&B',
  'Country',
  'Metal',
  'Jazz',
  'Latin',
  'Classical'
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile,
  onCloseMobile
}) => {
  return (
    <div className={`bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-6 text-slate-200 ${
      isOpenMobile ? 'block' : 'hidden lg:block'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Filters & Sorting</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Date Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Date Range</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Anytime' },
            { id: 'today', label: 'Today' },
            { id: 'this_weekend', label: 'This Weekend' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'custom', label: 'Custom' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onFilterChange({ dateRange: item.id as any })}
              className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all cursor-pointer ${
                filters.dateRange === item.id
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Custom date range inputs */}
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Start Date</span>
              <input
                type="date"
                value={filters.customStartDate || ''}
                onChange={e => onFilterChange({ customStartDate: e.target.value })}
                className="w-full mt-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">End Date</span>
              <input
                type="date"
                value={filters.customEndDate || ''}
                onChange={e => onFilterChange({ customEndDate: e.target.value })}
                className="w-full mt-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-slate-200 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Classification / Event Type */}
      <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Event Type</span>
        </label>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Shows' },
            { id: 'Music', label: 'Concerts' },
            { id: 'Festival', label: 'Festivals' },
            { id: 'Arts & Theatre', label: 'Theater' },
            { id: 'Sports', label: 'Sports' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onFilterChange({ classification: item.id as any })}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                filters.classification === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Music Genre */}
      <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-violet-400" />
          <span>Genre</span>
        </label>
        <select
          value={filters.genre || 'All'}
          onChange={e => onFilterChange({ genre: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          {GENRES_LIST.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Price Category */}
      <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Price Range</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Any Price' },
            { id: 'under_25', label: 'Under $25' },
            { id: '25_50', label: '$25 - $50' },
            { id: '50_100', label: '$50 - $100' },
            { id: 'over_100', label: '$100+' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onFilterChange({ priceCategory: item.id as any })}
              className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all cursor-pointer ${
                filters.priceCategory === item.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
          <span>Sort By</span>
        </label>
        <select
          value={filters.sortBy || 'date,asc'}
          onChange={e => onFilterChange({ sortBy: e.target.value as any })}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="date,asc">Date (Soonest First)</option>
          <option value="date,desc">Date (Furthest First)</option>
          <option value="name,asc">Event Name (A-Z)</option>
          <option value="relevance,desc">Relevance</option>
        </select>
      </div>

    </div>
  );
};
