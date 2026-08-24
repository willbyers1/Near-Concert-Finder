import React, { useState } from 'react';
import { Key, ShieldCheck, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle, ExternalLink, Trash2, RefreshCw, Lock } from 'lucide-react';
import { UserPreferences } from '../types';
import { validateAndEncryptKey } from '../services/ticketmaster';

interface ApiKeySettingsProps {
  userPreferences: UserPreferences;
  onSavePreferences: (updated: Partial<UserPreferences>) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({
  userPreferences,
  onSavePreferences
}) => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleValidateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid Ticketmaster API Key' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    const res = await validateAndEncryptKey(inputKey.trim());
    setLoading(false);

    if (res.valid) {
      onSavePreferences({
        byokKeyMasked: res.maskedKey,
        byokEncryptedToken: res.encryptedToken,
        isByokActive: true
      });
      setInputKey('');
      setStatusMessage({
        type: 'success',
        text: 'Ticketmaster API key verified and safely encrypted! Custom BYOK quota is now active.'
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message || 'Verification failed. Please check key validity.'
      });
    }
  };

  const handleRemoveKey = () => {
    onSavePreferences({
      byokKeyMasked: undefined,
      byokEncryptedToken: undefined,
      isByokActive: false
    });
    setInputKey('');
    setStatusMessage({
      type: 'info',
      text: 'BYOK API key removed. Reverted to standard application quota.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Title Header */}
      <div className="space-y-2 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Ticketmaster API Key (BYOK)</h1>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Bring Your Own Key (BYOK) allows you to use your personal Ticketmaster Developer credentials for custom event search quotas and rate limits.
        </p>
      </div>

      {/* Active Key Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current API Status</span>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${userPreferences.isByokActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-base font-bold text-white">
                {userPreferences.isByokActive ? 'Personal BYOK Key Active' : 'Default Application Shared Quota'}
              </span>
            </div>
            {userPreferences.byokKeyMasked && (
              <p className="text-xs font-mono text-indigo-300 pt-1">
                Active Key: <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{userPreferences.byokKeyMasked}</span>
              </p>
            )}
          </div>

          {userPreferences.isByokActive && (
            <button
              onClick={handleRemoveKey}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove BYOK Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Configure Key Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Configure Personal API Key</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Keys are encrypted server-side using AES-256 before persistence and decrypted only in RAM during live Ticketmaster API queries.
          </p>
        </div>

        <form onSubmit={handleValidateAndSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Ticketmaster Consumer Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="Enter your Ticketmaster Consumer Key..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full p-3 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                : statusMessage.type === 'error'
                  ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
                  : 'bg-indigo-950/60 border border-indigo-500/30 text-indigo-300'
            }`}>
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {statusMessage.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {statusMessage.type === 'info' && <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{loading ? 'Verifying with Ticketmaster...' : 'Validate & Save Key'}</span>
          </button>
        </form>

        {/* How to get a key helper */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <h3 className="font-bold text-indigo-300 flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>How to get a free Ticketmaster API Key (1-minute setup):</span>
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
            <li>Visit the <a href="https://developer.ticketmaster.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-semibold">Ticketmaster Developer Portal</a>.</li>
            <li>Create a free account or sign in with your Ticketmaster credentials.</li>
            <li>Go to <strong>My Apps</strong> and create a new project app.</li>
            <li>Copy your <strong>Consumer Key</strong> and paste it above.</li>
          </ol>
        </div>

      </div>

      {/* Security Architecture Info */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security & Privacy Architecture</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your credentials are never stored in plaintext in local storage or client-side logs. Keys are encrypted with a server-side 256-bit AES master key. The decrypted key exists only in short-lived Express RAM during upstream Ticketmaster requests and is discarded immediately after execution.
        </p>
      </div>

    </div>
  );
};
