import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  PhoneCall,
  Headphones,
  BookOpen,
  Users,
  BarChart3,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Radio,
  Activity,
  Cpu,
  Globe,
  Zap,
  Award,
  CheckCircle2,
  FileCode2,
  Layers,
  Phone,
  MessageSquare,
  Shield,
  Clock,
  ExternalLink,
  ChevronRight,
  Server,
  Play,
  Volume2,
  ChevronDown,
  Lock,
  ShieldAlert,
  FileCheck2,
  KeyRound
} from 'lucide-react';
import { speakText, stopSpeaking } from '../../utils/speech.js';
import { UserSession } from '../../types.js';

interface LandingPageProps {
  session?: UserSession;
  onNavigateToCaller: () => void;
  onNavigateToHandoff: () => void;
  onNavigateToKnowledge: () => void;
  onNavigateToCRM: () => void;
  onNavigateToAnalytics: () => void;
  onNavigateToDocs: () => void;
  onNavigateToCollegeLogin: () => void;
  onNavigateToCollegeRegister: () => void;
  onNavigateToAdminLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  session,
  onNavigateToCaller,
  onNavigateToHandoff,
  onNavigateToKnowledge,
  onNavigateToCRM,
  onNavigateToAnalytics,
  onNavigateToDocs,
  onNavigateToCollegeLogin,
  onNavigateToCollegeRegister,
  onNavigateToAdminLogin
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoPromptPlaying, setDemoPromptPlaying] = useState<string | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const isAuthenticated = Boolean(session?.isAuthenticated);

  const demoVoicePrompts = [
    {
      id: 'fees',
      label: 'BCA Fees & Scholarships',
      query: 'What is the annual fee structure for BCA and are there merit scholarships?',
      response: 'The annual tuition fee for BCA in Computer Applications is $4,800 per year. We offer up to 35% merit scholarships for students scoring above 85% in higher secondary examinations.',
      category: 'Finance'
    },
    {
      id: 'hostel',
      label: 'Hostel & Campus Facilities',
      query: 'Can you tell me about campus accommodation, mess food, and Wi-Fi?',
      response: 'Apex campus provides AC and Non-AC hostel rooms with high-speed Wi-Fi, 24/7 biometric security, and a 4-meal hygienic dining hall. Annual hostel fee is $2,200.',
      category: 'Campus'
    },
    {
      id: 'handoff',
      label: 'Human Counselor Escalation',
      query: 'My situation is complex regarding lateral entry. Can I speak to a real human counselor?',
      response: 'Certainly! I am escalating your session to our Senior Academic Admissions Counselor right now with your full inquiry context. Please hold.',
      category: 'Handoff'
    }
  ];

  const handlePlayVoiceDemo = (prompt: typeof demoVoicePrompts[0]) => {
    if (demoPromptPlaying === prompt.id) {
      stopSpeaking();
      setDemoPromptPlaying(null);
    } else {
      stopSpeaking();
      setDemoPromptPlaying(prompt.id);
      speakText(prompt.response, {
        rate: 1.0,
        pitch: 1.0,
        lang: 'en-US',
        onEnd: () => {
          setDemoPromptPlaying(null);
        },
        onError: () => {
          setDemoPromptPlaying(null);
        }
      });
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:py-12">
        {/* Colorful Glow Mesh Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/15 to-purple-600/15 blur-3xl rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Government / Higher Education Authority Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-md border border-slate-800"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              National Higher Education Telephony Gateway
            </span>
            <span className="bg-blue-500/30 text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border border-blue-400/30">
              AISHE • UGC Framework
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
          >
            Autonomous <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Voice Caller</span> & Smart Counselor Desk for Higher Education
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Empowering universities and autonomous institutes with 24/7 intelligent voice telephony, instant curriculum & fee guidance, live emotion analytics, and seamless zero-loss human counselor escalations.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <button
              onClick={onNavigateToCaller}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2.5 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Launch Voice Studio (Live Call)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToCollegeLogin}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>College Admissions Desk</span>
            </button>

            <button
              onClick={onNavigateToAdminLogin}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>National Directorate</span>
            </button>

            <button
              onClick={onNavigateToDocs}
              className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <FileCode2 className="w-4 h-4" />
              <span>BCA Viva Docs & Python Code</span>
            </button>
          </motion.div>
        </div>

        {/* Interactive Live Voice Teaser Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-10 p-5 sm:p-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Interactive Telephony Voice Demo</span>
                  <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200 uppercase">
                    Speech Synthesizer Online
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Click any student query below to hear how Maya (AI Admissions Advisor) responds in real time:
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToCaller}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Full Interactive Studio</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* 3 Interactive Voice Samples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {demoVoicePrompts.map((p) => {
              const isPlaying = demoPromptPlaying === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPlaying
                      ? 'bg-blue-50/90 border-blue-300 shadow-xs'
                      : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {p.category}
                    </span>
                    <button
                      onClick={() => handlePlayVoiceDemo(p)}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-rose-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Volume2 className="w-3 h-3 animate-bounce" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                    "{p.query}"
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                    AI Response: "{p.response}"
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* 2. REAL-TIME TELEMETRY & IMPACT METRICS */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Speech-to-Speech Latency</span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">&lt; 250ms</div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Real-Time Gemini 2.5 Flash</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Autonomous Resolution</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">94.2%</div>
            <div className="text-[11px] text-slate-500">
              Zero human escalation needed
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Network Calls Processed</span>
              <PhoneCall className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">148,500+</div>
            <div className="text-[11px] text-slate-500">
              Across accredited institutes
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Counselor Zero-Loss Queue</span>
              <Headphones className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">100%</div>
            <div className="text-[11px] text-slate-500">
              Full transcript & sentiment sync
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 4-STEP TELEPHONY PIPELINE */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
            <Cpu className="w-3.5 h-3.5" />
            Architecture Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How The AI Voice & Counselor Engine Operates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            From the moment a student dials the toll-free helpline to automated resolution or counselor transfer.
          </p>
        </div>

        {/* 4 Steps Interactive Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            {
              step: 1,
              title: '1. Voice Input & ASR',
              desc: 'Continuous speech recognition with background noise cancellation and multilingual transcription.',
              tech: 'Web Speech API / Whisper'
            },
            {
              step: 2,
              title: '2. NLU & Sentiment',
              desc: 'Intent categorization, frustration detection, and emotion telemetry scoring in real time.',
              tech: 'Gemini 2.5 Flash Engine'
            },
            {
              step: 3,
              title: '3. RAG Knowledge Graph',
              desc: 'Semantic retrieval across official fee charts, hostel rules, syllabus, and admission cutoffs.',
              tech: 'Vector Knowledge Store'
            },
            {
              step: 4,
              title: '4. Voice Synthesis / Handoff',
              desc: 'Crystal-clear speech synthesis or immediate zero-loss handoff to human counselor desk.',
              tech: 'Neural TTS & WebSocket'
            }
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => setActiveStepTab(item.step)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeStepTab === item.step
                  ? 'bg-blue-50/90 border-blue-400 shadow-sm'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  activeStepTab === item.step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  0{item.step}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.tech}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CORE FUNCTIONAL ECOSYSTEM (BENTO GRID) */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-200">
            <Layers className="w-3.5 h-3.5" />
            Ecosystem Modules
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Six Modular Engines Working in Sync
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
            Everything required to deliver production-grade admissions telephony and counselor collaboration.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Voice Studio (Public Accessible) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                Public Access
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Voice Caller Studio</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time interactive voice caller with live visualizer waveform, speech synthesis, live transcript logging, and instant escalation buttons.
            </p>
            <button
              onClick={onNavigateToCaller}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Launch Voice Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Counselor Desk (Protected) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                Staff Protected
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Human Counselor Desk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live priority ticket queue showing student frustration scores, caller profiles, conversation summaries, and instant resolution workflows.
            </p>
            <button
              onClick={isAuthenticated ? onNavigateToHandoff : onNavigateToCollegeLogin}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{isAuthenticated ? 'Open Counselor Desk' : 'Staff Login Required'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Knowledge Base Manager (Protected) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                Institutional
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Knowledge Base Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage fee charts, program cutoffs, hostel guidelines, and scholarship FAQs with instant vector search indexing.
            </p>
            <button
              onClick={isAuthenticated ? onNavigateToKnowledge : onNavigateToCollegeLogin}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{isAuthenticated ? 'Manage Knowledge Base' : 'College Login Required'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Student CRM (Protected) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-amber-600" />
                Private PII Shield
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Admissions CRM</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete caller registry with contact history, lead qualification flags, interest programs, and 1-click outbound calling.
            </p>
            <button
              onClick={isAuthenticated ? onNavigateToCRM : onNavigateToCollegeLogin}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{isAuthenticated ? 'View Student Directory' : 'Admissions Login Required'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Analytics & Telephony Logs (Protected) */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                Audit Logs
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Analytics & Audit Telemetry</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Detailed charts for call durations, sentiment breakdown, peak inquiry hours, resolution rates, and CSV audit exports.
            </p>
            <button
              onClick={isAuthenticated ? onNavigateToAnalytics : onNavigateToCollegeLogin}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>{isAuthenticated ? 'Inspect Telemetry' : 'Staff Login Required'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Multi-Tenant College Hub */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                Enrollment
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Multi-Tenant Portals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Accredit new autonomous universities, allocate dedicated toll-free IVR lines, and supervise national telephony nodes.
            </p>
            <button
              onClick={onNavigateToCollegeRegister}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Accredit New Institute</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security & Student Privacy Safeguards Banner */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700/80 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    FERPA & UGC Student Data Privacy Architecture
                  </span>
                  <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono font-bold uppercase">
                    RBAC Enforced
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 max-w-2xl leading-relaxed mt-0.5">
                  Private student phone numbers, academic scores, and confidential counselor escalation tickets are protected behind institutional authentication. Public visitors safely test the isolated Voice Studio without exposing student PII.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onNavigateToCollegeLogin}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <KeyRound className="w-3 h-3" />
                <span>Counselor Login</span>
              </button>
              <button
                onClick={onNavigateToAdminLogin}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Directorate Login</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIVA & ACADEMIC CODE RUBRIC SHOWCASE */}
      <section className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>BCA 3rd/5th Semester Mini-Project Certified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Viva Presentation & Python Backend Dossier
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Includes full architecture diagrams, database schemas, and runnable Python Flask + SQLite server code for university viva evaluations.
            </p>
          </div>

          <button
            onClick={onNavigateToDocs}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Open BCA Blueprint & Code</span>
          </button>
        </div>

        {/* 4 Evaluation Criteria Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <div className="text-base font-bold text-white">100%</div>
            <div className="text-[10px] text-slate-400">Viva Rubric Ready</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <div className="text-base font-bold text-white">Flask + SQLite</div>
            <div className="text-[10px] text-slate-400">Backend Blueprint</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <div className="text-base font-bold text-white">Zero Extra APIs</div>
            <div className="text-[10px] text-slate-400">Client-Side Ready</div>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <div className="text-base font-bold text-white">Multi-Role</div>
            <div className="text-[10px] text-slate-400">Admin/College/Caller</div>
          </div>
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Understand how the AI Voice Caller and Human Handoff Gateway function under the hood.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does the AI Voice Agent detect when to escalate to a human counselor?',
              a: 'The system runs real-time sentiment telemetry and keyword pattern matching on every caller statement. If frustration exceeds the threshold (e.g. repeated unanswered questions or explicit requests to speak with a human), a priority handoff ticket is generated with the full context transcript.'
            },
            {
              q: 'Can colleges customize their own fees, programs, and toll-free numbers?',
              a: 'Yes. Each registered college receives an autonomous institutional account where counselors can update their admissions knowledge base, assign academic departments, and monitor their custom IVR helpline.'
            },
            {
              q: 'Does this application support multilingual Indian and global languages?',
              a: 'Yes. The voice engine supports English (US/India/UK), Hindi, Spanish, French, German, Japanese, and regional language accents using standard Web Speech and Gemini multilingual capabilities.'
            },
            {
              q: 'What makes this project suitable for a BCA / MCA university viva?',
              a: 'It combines Speech Processing (ASR & TTS), Natural Language Understanding, RAG Knowledge Retrieval, Role-Based Access Control (Super Admin, College, Counselor, Student), and Real-time Telemetry into a clean, demonstrable full-stack package.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience the AI Admissions Telephony?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto">
            Test the live microphone voice caller or log in as a college admissions counselor right now.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 pt-2">
          <button
            onClick={onNavigateToCaller}
            className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Launch Live Call Simulation</span>
          </button>

          <button
            onClick={onNavigateToCollegeRegister}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Register College Helpline</span>
          </button>
        </div>
      </section>
    </div>
  );
};
