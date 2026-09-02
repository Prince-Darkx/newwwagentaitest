import React, { useState } from 'react';
import {
  Settings,
  X,
  Volume2,
  Globe,
  Sliders,
  CheckCircle2,
  Phone,
  Building,
  Sparkles
} from 'lucide-react';
import { AgentVoiceSettings } from '../../types.js';
import { updateSettings } from '../../utils/api.js';

interface SettingsModalProps {
  settings: AgentVoiceSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: AgentVoiceSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AgentVoiceSettings>(settings);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateSettings(formData);
    onSave(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Voice Agent & Telephony Settings</h3>
              <p className="text-[11px] text-slate-500">Configure AI Persona, speech synthesis rate, and institution branding</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Agent Persona Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">AI Voice Persona Name</label>
              <input
                type="text"
                required
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Voice Profile Style</label>
              <select
                value={formData.voiceProfile}
                onChange={(e) => setFormData({ ...formData, voiceProfile: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
              >
                <option value="warm-female">Warm & Empathetic Female (Maya)</option>
                <option value="authoritative-male">Professional Male (Alex)</option>
                <option value="cheerful-female">Cheerful Academic Advisor (Sarah)</option>
              </select>
            </div>
          </div>

          {/* Institution Name & Virtual Toll-Free */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Virtual Toll-Free Line</label>
              <input
                type="text"
                required
                value={formData.tollFreeNumber}
                onChange={(e) => setFormData({ ...formData, tollFreeNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Speech Rate (Speed) Slider */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                Speech Cadence (Rate / Speed)
              </span>
              <span className="font-mono text-blue-600 font-semibold">{formData.speed}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={formData.speed}
              onChange={(e) => setFormData({ ...formData, speed: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-medium">
              <span>0.8x (Deliberate)</span>
              <span>1.0x (Natural)</span>
              <span>1.3x (Fast)</span>
            </div>
          </div>

          {/* Speech Pitch Slider */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                Voice Tone Pitch
              </span>
              <span className="font-mono text-blue-600 font-semibold">{formData.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Smart Handoff Sensitivity */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-700 block">Smart Handoff Escalation Trigger Threshold</label>
            <select
              value={formData.handoffThresholdSensitivity}
              onChange={(e) => setFormData({ ...formData, handoffThresholdSensitivity: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
            >
              <option value="high">High Sensitivity (Trigger immediately on single complaint / keyword)</option>
              <option value="medium">Medium Sensitivity (Trigger on negative sentiment + explicit request)</option>
              <option value="low">Low Sensitivity (Only trigger on direct human counselor request)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Settings Applied!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
