import React, { useState } from 'react';
import { Check, Copy, Laptop, RefreshCw, Smartphone, Tablet, X } from 'lucide-react';
import { UserProfile } from '../types';
import { loadProfileFromCloud, syncProfileToCloud } from '../utils/storage';

interface DeviceSyncModalProps {
  profile: UserProfile;
  onProfileUpdated: (newProfile: UserProfile) => void;
  onClose: () => void;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  profile,
  onProfileUpdated,
  onClose,
}) => {
  const [inputCode, setInputCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToCloud = async () => {
    setLoading(true);
    setMessage(null);
    const result = await syncProfileToCloud(profile);
    setLoading(false);
    if (result.success) {
      setMessage({ type: 'success', text: `Saved profile to cloud for code ${profile.syncCode}!` });
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to sync to cloud.' });
    }
  };

  const handleRestoreFromCloud = async () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-character sync code (e.g., CM-8421).' });
      return;
    }

    setLoading(true);
    setMessage(null);
    const result = await loadProfileFromCloud(code);
    setLoading(false);

    if (result.success && result.profile) {
      onProfileUpdated(result.profile);
      setMessage({ type: 'success', text: `Successfully loaded profile for code ${code}!` });
    } else {
      setMessage({ type: 'error', text: result.message || 'Sync code not found.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-lg border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b border-slate-100 text-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E293B]">Cross-Device Cloud Sync</h3>
              <p className="text-xs text-slate-400">Seamless learning anywhere, anytime</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Device Icons Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-around text-slate-700 text-xs font-bold text-center">
            <div className="flex flex-col items-center gap-1">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              <span>Mobile</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex flex-col items-center gap-1">
              <Tablet className="w-5 h-5 text-indigo-600" />
              <span>Tablet</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex flex-col items-center gap-1">
              <Laptop className="w-5 h-5 text-indigo-600" />
              <span>Desktop</span>
            </div>
          </div>

          {/* User's Sync Code Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Device Sync Code
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="font-mono font-bold text-xl text-indigo-600 tracking-wider">
                {profile.syncCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Save this code or type it on another device to seamlessly sync your level, streak, XP, and badges.
            </p>

            <button
              onClick={handleSaveToCloud}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Save Progress to Cloud</span>
            </button>
          </div>

          {/* Connect Another Device Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              Load Progress From Another Device
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Enter Sync Code (e.g. CM-8A4F)"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-mono font-bold uppercase text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                onClick={handleRestoreFromCloud}
                disabled={loading}
                className="px-5 py-2.5 rounded-2xl bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              >
                {loading ? 'Syncing...' : 'Restore'}
              </button>
            </div>
          </div>

          {/* Status Alert Message */}
          {message && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/80'
              }`}
            >
              <span>{message.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
