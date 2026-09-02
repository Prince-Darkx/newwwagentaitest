import React, { useState } from 'react';
import {
  PhoneCall,
  Bot,
  Headphones,
  BookOpen,
  Database,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Globe,
  Radio,
  FileSpreadsheet,
  Activity
} from 'lucide-react';

interface ArchitectureMapProps {
  onNavigateToTab: (tab: any) => void;
}

export const ArchitectureMap: React.FC<ArchitectureMapProps> = ({ onNavigateToTab }) => {
  const [activePillar, setActivePillar] = useState<number>(1);

  const pillars = [
    {
      id: 1,
      title: '1. Call Initiation',
      subtitle: 'Virtual Toll-Free & Outbound Telephony',
      tabTarget: 'caller',
      icon: PhoneCall,
      color: 'indigo',
      badge: 'Telephony Trunk',
      items: [
        { label: 'Inward / Inbound Call', desc: 'Prospective students or parents dial toll-free number +1 (800) 555-APEX with zero wait time' },
        { label: 'Outbound Voice Campaigns', desc: 'Automated AI outreach for fee deadlines, scholarship cutoffs, and counseling follow-ups' },
        { label: 'Caller Profile Recognition', desc: 'Automatic lookup against student CRM database via caller phone ID' },
        { label: 'Multilingual Detection', desc: 'Adaptive speech engine supporting English, Spanish, Hindi, French, and German' }
      ]
    },
    {
      id: 2,
      title: '2. AI Voice Caller Agent System',
      subtitle: 'Core Voice AI & Real RAG Engine',
      tabTarget: 'caller',
      icon: Bot,
      color: 'emerald',
      badge: 'Gemini 3.7 + WebSpeech',
      items: [
        { label: 'A. Call Answer', desc: '< 1.5s sub-second latency with natural persona greeting ("Maya AI Voice Advisor")' },
        { label: 'B. Speech to Text (STT)', desc: 'Real-time microphone listening, noise cancellation & continuous transcript streaming' },
        { label: 'C. Intent Recognition', desc: 'Identifies Fees, Admissions, Scholarships, Hostels, Eligibility, or Escalation' },
        { label: 'D. Knowledge Retrieval (RAG)', desc: 'Pulls verified paragraphs from institute repository without hallucination' },
        { label: 'E. Response Generation', desc: 'Gemini 3.7 generates conversational, empathetic, and accurate spoken guidance' },
        { label: 'F. Text to Speech (TTS)', desc: 'Synthesizes clear voice audio with responsive dynamic sound waveform feedback' },
        { label: 'G. Contextual Memory', desc: 'Maintains multi-turn context across questions and remembers past statements' },
        { label: 'H. Sentiment Barometer', desc: 'Real-time mood analysis (-1.0 to +1.0) alerting if caller is confused or frustrated' },
        { label: 'I. Integrated Actions', desc: 'Instantly dispatches fee payment links or PDF brochures to WhatsApp & SMS' }
      ]
    },
    {
      id: 3,
      title: '3. Smart Handoff to Human',
      subtitle: 'Zero-Wait Warm Transfer System',
      tabTarget: 'handoff',
      icon: Headphones,
      color: 'rose',
      badge: 'Live Counselor Desk',
      items: [
        { label: 'Handoff Triggers', desc: 'Complex query, caller request, negative sentiment / high frustration, repeated questions' },
        { label: 'Warm Live Transfer', desc: 'No caller repeating required — full transcript & contextual summary passed instantly' },
        { label: 'Human Counselor Console', desc: 'Live view of student details, emotional score, and direct voice/chat intervention' },
        { label: 'Resolution & Dispositions', desc: 'Record consultation outcomes, approved waivers, and automated follow-up dispatches' }
      ]
    },
    {
      id: 4,
      title: '4. Knowledge Base',
      subtitle: 'Education Industry Grounding Hub',
      tabTarget: 'knowledge',
      icon: BookOpen,
      color: 'amber',
      badge: 'Authoritative RAG Hub',
      items: [
        { label: 'College & Institute Info', desc: 'Accreditations, NAAC A++ ranking, campus infrastructure, leadership' },
        { label: 'Courses & Degree Programs', desc: 'B.Tech CSE/AI, MBA, BBA, BCA with specializations, credits & intake capacity' },
        { label: 'Fees & Scholarships', desc: 'Annual tuition, semester installments, Chairman 100% Merit & Sports waivers' },
        { label: 'Admissions & Eligibility', desc: '12th PCM cutoff criteria, entrance exam requirements, counseling dates' },
        { label: 'Timings, Location & Hostels', desc: 'Campus GPS, AC/Non-AC hostels, 24/7 security, organic dining mess plans' },
        { label: 'FAQs & Refund Policies', desc: 'Standardized UGC-compliant refund guidelines and document requirements' }
      ]
    },
    {
      id: 5,
      title: '5. Data Storage & Logging',
      subtitle: 'CRM Database, Logs & Analytics',
      tabTarget: 'crm',
      icon: Database,
      color: 'cyan',
      badge: 'Real In-Memory DB & CRM',
      items: [
        { label: 'Call Recordings & Transcripts', desc: 'Searchable multi-turn transcripts with sentiment and intent tagging' },
        { label: 'Student & Caller Database', desc: 'Applicant CRM profiles with test scores, phone numbers, and admissions stage' },
        { label: 'Analytics & Intelligence Reports', desc: 'Resolution rates, average speed to answer, intent breakdown, hourly load' },
        { label: 'Follow-up Integrations', desc: 'WhatsApp API, SMS gateway, CRM sync, and automated calendar reminders' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Complete 5-Pillar System Architecture & Data Flow
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                100% Implemented
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive architectural breakdown matching the education telephony flow blueprint.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
          <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Full-Stack Live System</span>
        </div>
      </div>

      {/* Horizontal Flow Diagram Ribbon */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          End-to-End Execution Pipeline
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isSelected = activePillar === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setActivePillar(p.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 relative ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">0{p.id}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{p.subtitle}</p>
                </div>

                <div className="pt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-blue-700 border border-blue-200 font-medium">
                    {p.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Pillar Details Card */}
      {(() => {
        const selected = pillars.find(p => p.id === activePillar) || pillars[0];
        const Icon = selected.icon;
        return (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selected.title}</h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                      {selected.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selected.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab(selected.tabTarget)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto cursor-pointer"
              >
                <span>Launch {selected.title.split('.')[1]} Live Tab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selected.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
