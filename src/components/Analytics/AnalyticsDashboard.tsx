import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  CheckCircle2,
  Headphones,
  Smile,
  Search,
  FileText,
  Play,
  Volume2,
  Share2,
  Filter,
  X,
  Sparkles
} from 'lucide-react';
import { AnalyticsSummary, CallRecord } from '../../types.js';

interface AnalyticsDashboardProps {
  analytics: AnalyticsSummary;
  calls: CallRecord[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  calls
}) => {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCalls = calls.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.callerName.toLowerCase().includes(q) ||
        c.callerPhone.toLowerCase().includes(q) ||
        c.primaryIntent.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Telephony Analytics & Intelligence Reports
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Live Metrics
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live operational metrics, intent clustering, sentiment distribution, and full audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time DB Sync Active</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Calls */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Total Calls</span>
          <p className="text-xl font-bold text-slate-900 font-mono">{analytics.totalCalls}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <PhoneIncoming className="w-3 h-3 text-blue-600" />
            <span>{analytics.inboundCalls} In / {analytics.outboundCalls} Out</span>
          </div>
        </div>

        {/* Answer Speed */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Answer Speed</span>
          <p className="text-xl font-bold text-emerald-600 font-mono">&lt; {analytics.avgAnswerSpeedSec}s</p>
          <span className="text-[10px] text-emerald-700 font-medium">Zero Call Queue</span>
        </div>

        {/* Resolution Rate */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">AI Resolution Rate</span>
          <p className="text-xl font-bold text-blue-600 font-mono">{analytics.resolutionRatePercent}%</p>
          <span className="text-[10px] text-blue-700 font-medium">First-call closed</span>
        </div>

        {/* Smart Handoff Rate */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Handoff to Human</span>
          <p className="text-xl font-bold text-rose-600 font-mono">{analytics.handoffRatePercent}%</p>
          <span className="text-[10px] text-rose-700 font-medium">Warm Escalation</span>
        </div>

        {/* Average Duration */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Avg Call Length</span>
          <p className="text-xl font-bold text-slate-900 font-mono">{formatSec(analytics.avgDurationSeconds)}</p>
          <span className="text-[10px] text-slate-500 font-medium">Voice Interaction</span>
        </div>

        {/* Average Sentiment */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Avg Sentiment</span>
          <p className="text-xl font-bold text-emerald-600 font-mono">+{analytics.avgSentimentScore}</p>
          <span className="text-[10px] text-emerald-700 font-medium">High Satisfaction</span>
        </div>

      </div>

      {/* Visual Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Intent Distribution Breakdown (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Caller Intent Distribution
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Education Inquiries</span>
          </div>

          <div className="space-y-3">
            {analytics.intentBreakdown.slice(0, 5).map((it, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{it.intent}</span>
                  <span className="font-mono text-slate-500">{it.count} calls ({it.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, Math.max(8, it.percentage))}%` }}
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-blue-600' :
                      idx === 1 ? 'bg-emerald-500' :
                      idx === 2 ? 'bg-amber-500' : 'bg-purple-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment & Hourly Volume (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-emerald-600" />
              Caller Sentiment & Peak Hourly Load
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Real-Time Mood</span>
          </div>

          {/* Sentiment Bar Badges */}
          <div className="grid grid-cols-3 gap-2">
            {analytics.sentimentBreakdown.map((s, idx) => (
              <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">{s.sentiment}</span>
                <p className="text-xs font-bold text-slate-900 font-mono mt-0.5">{s.count} ({s.percentage}%)</p>
              </div>
            ))}
          </div>

          {/* Hourly Call Bars */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[11px] text-slate-600 font-semibold block">Hourly Call Volume (Peak Admissions Hours)</span>
            <div className="flex items-end justify-between h-20 bg-slate-50 p-3 rounded-lg border border-slate-200 gap-2">
              {analytics.hourlyCallVolume.map((vol, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{ height: `${(vol.calls / 90) * 100}%` }}
                    className="w-full bg-blue-600 hover:bg-blue-500 transition-colors rounded-t-xs"
                    title={`${vol.hour}: ${vol.calls} calls`}
                  />
                  <span className="text-[9px] text-slate-400 font-mono">{vol.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Complete Call Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Telephony Call Records & Transcripts Audit Log
            </h3>
            <p className="text-[11px] text-slate-500">Click any row to inspect complete multi-turn voice transcript and CRM disposition.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
            >
              <option value="all">All Call Statuses</option>
              <option value="completed">Completed by AI</option>
              <option value="handed_off">Handed off to Human</option>
            </select>

            <div className="relative min-w-[200px]">
              <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transcript..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Caller</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Primary Intent</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Status / Handoff</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No call records found.
                  </td>
                </tr>
              ) : (
                filteredCalls.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCall(c)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {c.callerName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">{c.callerPhone}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                        c.callDirection === 'inbound' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {c.callDirection}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {c.primaryIntent}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatSec(c.durationSeconds)}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`font-semibold ${
                        c.sentimentAverage === 'Happy' ? 'text-emerald-600' :
                        c.sentimentAverage === 'Frustrated' ? 'text-rose-600' : 'text-slate-600'
                      }`}>
                        {c.sentimentAverage}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        c.status === 'handed_off' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status === 'handed_off' ? 'Transferred to Counselor' : 'Resolved by Maya'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-blue-600 group-hover:underline font-semibold">
                        View Transcript →
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Review Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Call Transcript Dossier</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {selectedCall.id} • {selectedCall.callerName} ({selectedCall.callerRole})</p>
              </div>
              <button onClick={() => setSelectedCall(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Summary Card */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">AI Executive Summary</span>
              <p className="text-slate-700 leading-relaxed">{selectedCall.summary}</p>
            </div>

            {/* Multi-turn conversation transcript */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Voice Stream</span>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-[260px] overflow-y-auto space-y-3">
                {selectedCall.transcript?.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-0.5 text-[10px] text-slate-500 font-medium">
                      <span>{msg.sender === 'user' ? selectedCall.callerName : 'Maya (AI Agent)'}</span>
                      <span className="font-mono text-slate-400">{msg.timestamp}</span>
                      {msg.sentiment && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-semibold">
                          {msg.sentiment}
                        </span>
                      )}
                    </div>
                    <div className={`px-3.5 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed shadow-xs ${
                      msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-xs' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
