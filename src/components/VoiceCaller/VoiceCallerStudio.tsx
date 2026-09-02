import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  User,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  Share2,
  Zap,
  Globe,
  Radio,
  BookOpen,
  DollarSign,
  Award,
  Building,
  RefreshCw,
  Info
} from 'lucide-react';
import {
  CallerProfile,
  CallRecord,
  TranscriptMessage,
  SentimentState,
  AgentVoiceSettings,
  HandoffTicket,
  UserSession
} from '../../types.js';
import {
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeaking,
  generateWaveformLevels,
  SpeechRecognitionInstance
} from '../../utils/speech.js';
import {
  postAgentInteraction,
  postGenerateSummary,
  saveCallRecord,
  createHandoffTicket,
  sendActionIntegration
} from '../../utils/api.js';

interface VoiceCallerStudioProps {
  students: CallerProfile[];
  settings: AgentVoiceSettings;
  session?: UserSession;
  onCallCompleted: (record: CallRecord) => void;
  onHandoffTriggered: (ticket: HandoffTicket) => void;
  onNavigateToHandoff: () => void;
}

export const VoiceCallerStudio: React.FC<VoiceCallerStudioProps> = ({
  students,
  settings,
  session,
  onCallCompleted,
  onHandoffTriggered,
  onNavigateToHandoff
}) => {
  const isAuthenticated = Boolean(session?.isAuthenticated);

  // Call Configuration State
  const [callMode, setCallMode] = useState<'inbound' | 'outbound'>('inbound');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [customCaller, setCustomCaller] = useState({
    name: 'Priya Sharma',
    phone: '+1 (555) 432-1098',
    role: 'Student' as any,
    interestProgram: 'B.Tech Computer Science & AI'
  });
  const [selectedLanguage, setSelectedLanguage] = useState<string>(settings.selectedLanguage || 'en-US');

  // Call Active State
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'dialing' | 'connected' | 'handed_off' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessingAi, setIsProcessingAi] = useState<boolean>(false);

  // Audio Controls
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);

  // Real-time Conversation Data
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [currentSentiment, setCurrentSentiment] = useState<SentimentState>('Neutral');
  const [currentSentimentScore, setCurrentSentimentScore] = useState<number>(0.5);
  const [currentIntent, setCurrentIntent] = useState<string>('Academic Inquiry');
  const [retrievedSources, setRetrievedSources] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>('');

  // Handoff Alert State
  const [handoffActive, setHandoffActive] = useState<boolean>(false);
  const [handoffReason, setHandoffReason] = useState<string>('');
  const [createdHandoffTicket, setCreatedHandoffTicket] = useState<HandoffTicket | null>(null);

  // Post-Call Summary Modal
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [latestCallRecord, setLatestCallRecord] = useState<CallRecord | null>(null);
  const [dispatchedActionFeedback, setDispatchedActionFeedback] = useState<string | null>(null);

  // Waveform Animation Seed
  const [waveSeed, setWaveSeed] = useState<number>(0);

  // Refs
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const durationTimerRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const currentCallIdRef = useRef<string>('');

  // Selected Caller computation
  const activeCaller = selectedStudentId === 'custom' || !selectedStudentId
    ? customCaller
    : students.find(s => s.id === selectedStudentId) || customCaller;

  // Waveform tick
  useEffect(() => {
    let interval: any;
    if (isCalling && (isAiSpeaking || isListening)) {
      interval = setInterval(() => {
        setWaveSeed(prev => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isCalling, isAiSpeaking, isListening]);

  // Auto-scroll transcript
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [transcript, isProcessingAi]);

  // Handle Duration Timer
  useEffect(() => {
    if (isCalling && callStatus === 'connected') {
      durationTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [isCalling, callStatus]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      const rec = createSpeechRecognition();
      if (rec) {
        rec.lang = selectedLanguage;
        rec.onstart = () => {
          setIsListening(true);
        };
        rec.onend = () => {
          setIsListening(false);
        };
        rec.onerror = (e: any) => {
          console.warn('Speech recognition error:', e);
          setIsListening(false);
        };
        rec.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (final.trim()) {
            handleUserSpeechInput(final.trim());
          }
        };
        recognitionRef.current = rec;
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [selectedLanguage]);

  // Start Call Function
  const handleStartCall = () => {
    const newCallId = `call-${Date.now().toString(36)}`;
    currentCallIdRef.current = newCallId;
    setIsCalling(true);
    setCallStatus('dialing');
    setCallDuration(0);
    setTranscript([]);
    setHandoffActive(false);
    setCreatedHandoffTicket(null);
    setCurrentSentiment('Neutral');
    setCurrentSentimentScore(0.5);
    setCurrentIntent(callMode === 'inbound' ? 'Admissions Inquiry' : 'Admissions Follow-up');
    setRetrievedSources(['About Apex Institute (AIHT)', 'Annual Tuition Fee Structure']);

    // Answer delay (< 1.5s)
    setTimeout(() => {
      setCallStatus('connected');
      
      const greeting = callMode === 'inbound'
        ? `Hello! Thank you for calling Apex Institute Admissions. I am Maya, your AI Voice Advisor. How can I help you today with programs, fees, scholarships, or campus visits?`
        : `Hello ${activeCaller.name}! This is Maya calling from Apex Institute of Higher Education regarding your application for ${activeCaller.interestProgram || 'our degree programs'}. Do you have a quick moment to discuss your admission counseling?`;

      const greetingMessage: TranscriptMessage = {
        id: `msg-${Date.now()}`,
        sender: 'agent',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sentiment: 'Neutral',
        detectedIntent: 'Greeting & Introduction'
      };

      setTranscript([greetingMessage]);

      // Speak Greeting
      if (!isSpeakerMuted) {
        setIsAiSpeaking(true);
        speakText(greeting, {
          lang: selectedLanguage,
          rate: settings.speed || 1.0,
          pitch: settings.pitch || 1.0,
          onStart: () => setIsAiSpeaking(true),
          onEnd: () => {
            setIsAiSpeaking(false);
            startListeningIfAllowed();
          }
        });
      } else {
        startListeningIfAllowed();
      }
    }, 1200);
  };

  // Start Listening helper
  const startListeningIfAllowed = () => {
    if (!isMuted && recognitionRef.current && !isAiSpeaking) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Recognition may already be running
      }
    }
  };

  // Stop Listening helper
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Process User Speech Input
  const handleUserSpeechInput = async (spokenText: string) => {
    if (!spokenText || !spokenText.trim() || isProcessingAi) return;

    // Stop ongoing speech & listening
    stopSpeaking();
    stopListening();

    const userMessage: TranscriptMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    const updatedHistory = [...transcript, userMessage];
    setTranscript(updatedHistory);
    setTextInput('');
    setIsProcessingAi(true);

    try {
      const response = await postAgentInteraction({
        callerName: activeCaller.name,
        callerPhone: activeCaller.phone,
        callerRole: activeCaller.role || 'Student',
        interestProgram: activeCaller.interestProgram,
        userSpeech: spokenText,
        conversationHistory: updatedHistory,
        selectedLanguage,
        callDirection: callMode
      });

      // Update state with AI analytics
      setCurrentSentiment(response.sentiment || 'Inquisitive');
      setCurrentSentimentScore(response.sentimentScore || 0.6);
      setCurrentIntent(response.detectedIntent || 'Admissions');
      if (response.sourcesRetrieved && response.sourcesRetrieved.length > 0) {
        setRetrievedSources(response.sourcesRetrieved);
      }

      const agentMessage: TranscriptMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sentiment: response.sentiment,
        sentimentScore: response.sentimentScore,
        detectedIntent: response.detectedIntent,
        sourcesRetrieved: response.sourcesRetrieved
      };

      setTranscript([...updatedHistory, agentMessage]);
      setIsProcessingAi(false);

      // Check for Smart Handoff Trigger
      if (response.handoffRecommended) {
        triggerSmartHandoff(response.handoffReason || 'Caller requested human assistance', response.handoffPriority || 'high');
      }

      // Handle Suggested Action (WhatsApp / SMS / Payment Link)
      if (response.suggestedAction) {
        handleDispatchedAction(response.suggestedAction);
      }

      // Speak AI response
      if (!isSpeakerMuted && !handoffActive) {
        setIsAiSpeaking(true);
        speakText(response.replyText, {
          lang: selectedLanguage,
          rate: settings.speed || 1.0,
          pitch: settings.pitch || 1.0,
          onStart: () => setIsAiSpeaking(true),
          onEnd: () => {
            setIsAiSpeaking(false);
            if (!handoffActive && isCalling) {
              startListeningIfAllowed();
            }
          }
        });
      } else {
        if (!handoffActive && isCalling) {
          startListeningIfAllowed();
        }
      }
    } catch (err) {
      console.error('Agent voice turn error:', err);
      setIsProcessingAi(false);
      const fallbackMsg: TranscriptMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: `At Apex Institute, we are happy to guide your admissions journey. Would you like me to send the official prospectus to your phone or connect you with a counselor?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTranscript([...updatedHistory, fallbackMsg]);
    }
  };

  // Trigger Smart Handoff to Human
  const triggerSmartHandoff = async (reason: string, priority: 'normal' | 'high' | 'critical' = 'high') => {
    setHandoffActive(true);
    setHandoffReason(reason);
    setCallStatus('handed_off');

    const ticket = await createHandoffTicket({
      callId: currentCallIdRef.current,
      callerName: activeCaller.name,
      callerPhone: activeCaller.phone,
      callerRole: activeCaller.role || 'Student',
      interestProgram: activeCaller.interestProgram,
      reason,
      priority,
      status: 'pending',
      summary: `Caller ${activeCaller.name} escalated during call. Inquiry: ${currentIntent}. Frustration Score: ${currentSentimentScore < 0 ? Math.abs(currentSentimentScore) : 0.2}`,
      transcriptSnapshot: transcript
    });

    setCreatedHandoffTicket(ticket);
    onHandoffTriggered(ticket);
  };

  // Handle Dispatched Action
  const handleDispatchedAction = async (action: { type: any; title: string; details: string }) => {
    try {
      const res = await sendActionIntegration({
        type: action.type,
        recipient: activeCaller.phone,
        details: action.details,
        title: action.title,
        callId: currentCallIdRef.current
      });
      setDispatchedActionFeedback(`${action.type.toUpperCase()}: ${action.title} sent to ${activeCaller.phone}`);
      setTimeout(() => setDispatchedActionFeedback(null), 5000);
    } catch (e) {
      console.warn('Action dispatch error:', e);
    }
  };

  // End Call & Generate Summary
  const handleEndCall = async () => {
    stopSpeaking();
    stopListening();
    setIsCalling(false);
    setCallStatus('ended');

    // Generate AI Summary
    const summaryRes = await postGenerateSummary(transcript, activeCaller);

    const completedRecord: CallRecord = {
      id: currentCallIdRef.current,
      callDirection: callMode,
      callerId: activeCaller.id || undefined,
      callerName: activeCaller.name,
      callerPhone: activeCaller.phone,
      callerRole: activeCaller.role || 'Student',
      interestProgram: activeCaller.interestProgram,
      startTime: new Date(Date.now() - callDuration * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: callDuration,
      status: handoffActive ? 'handed_off' : 'completed',
      language: selectedLanguage,
      primaryIntent: currentIntent,
      intentList: [currentIntent, 'Admissions Inquiry'],
      sentimentAverage: currentSentiment,
      sentimentScore: currentSentimentScore,
      transcript: transcript,
      summary: summaryRes.summary || `Call completed with ${activeCaller.name}. Discussed admissions, eligibility, and program specifics.`,
      keyActionItems: summaryRes.keyActionItems || ['Send admissions brochure', 'Follow up on counseling appointment'],
      disposition: summaryRes.disposition || 'Admissions Consultation Completed',
      handoffDetails: handoffActive
        ? {
            triggered: true,
            reason: handoffReason,
            priority: 'high',
            transferredToAgent: 'Admissions Human Counselor Desk'
          }
        : undefined
    };

    await saveCallRecord(completedRecord);
    setLatestCallRecord(completedRecord);
    onCallCompleted(completedRecord);
    setShowSummaryModal(true);
  };

  // Quick Query Prompts for user
  const quickVoicePrompts = [
    { label: '💰 B.Tech CSE Fees & Installments', text: 'What is the annual fee for B.Tech Computer Science and what installment plans are available?' },
    { label: '🎓 Merit Scholarship with 94% PCM', text: 'I scored 94.2% in my 12th PCM. Do I qualify for the Chairman Merit Scholarship?' },
    { label: '🏢 Girls Hostel Security & Mess', text: 'What are the hostel room options, security measures, and food quality for female students?' },
    { label: '🚀 2025 Placement Highest Package', text: 'What were the highest and average placement salary packages for 2025?' },
    { label: '👩‍💼 Connect to Human Counselor', text: 'I would like to speak directly with an admissions advisor or human counselor.' },
    { label: '📱 Send WhatsApp Brochure', text: 'Can you send the complete fee structure and application link to my WhatsApp?' }
  ];

  const waveformBars = generateWaveformLevels(isAiSpeaking || isListening, waveSeed);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Real Architecture Summary */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                AI Voice Caller Studio — Education Telephony Engine
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Pillars 1 & 2 Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive Inbound & Outbound Calling with Real Speech-to-Text, Gemini Intelligence, RAG Retrieval, and Smart Handoff.
            </p>
          </div>
        </div>

        {/* Action feedback toast */}
        {dispatchedActionFeedback && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{dispatchedActionFeedback}</span>
          </div>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Call Setup & Dialer (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Dialing Console Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                1. Call Initiation Config
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Toll-Free SIP Trunk</span>
            </div>

            {/* Inbound vs Outbound Toggle */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                id="btn-mode-inbound"
                onClick={() => !isCalling && setCallMode('inbound')}
                disabled={isCalling}
                className={`py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  callMode === 'inbound'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Inbound Call</span>
              </button>
              <button
                id="btn-mode-outbound"
                onClick={() => !isCalling && setCallMode('outbound')}
                disabled={isCalling}
                className={`py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  callMode === 'outbound'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Outbound</span>
              </button>
            </div>

            {/* Virtual Toll-Free Number Display */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {callMode === 'inbound' ? 'Dialing Institutional Toll-Free' : 'AI Outbound Campaign Trunk'}
                </p>
                <p className="text-sm font-mono font-bold text-slate-900">
                  +1 (800) 555-APEX <span className="text-xs text-blue-600 font-sans font-medium">(Line 1)</span>
                </p>
              </div>
              <div className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-700 font-semibold">
                SIP 24/7
              </div>
            </div>

            {/* Select Caller Profile */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Caller Profile</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isAuthenticated ? 'Live Student Record' : 'Public Test Persona'}
                </span>
              </label>
              <select
                id="select-caller-profile"
                disabled={isCalling}
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
              >
                {isAuthenticated ? (
                  students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role} - {s.interestProgram.split(' ')[0]})
                    </option>
                  ))
                ) : (
                  <>
                    <option value={students[0]?.id || 'guest-demo'}>
                      Priya Sharma (Prospective Applicant - B.Tech CS)
                    </option>
                    <option value={students[1]?.id || 'guest-demo-2'}>
                      Rahul Verma (Inquiry - BCA Program)
                    </option>
                  </>
                )}
                <option value="custom">✏️ Custom Caller Input / Test Your Name...</option>
              </select>
            </div>

            {/* Custom Caller Fields if selected */}
            {selectedStudentId === 'custom' && (
              <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <input
                  type="text"
                  placeholder="Caller Full Name"
                  value={customCaller.name}
                  onChange={(e) => setCustomCaller({ ...customCaller, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 text-xs shadow-xs focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  placeholder="Phone Number (+1...)"
                  value={customCaller.phone}
                  onChange={(e) => setCustomCaller({ ...customCaller, phone: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 text-xs shadow-xs focus:outline-none focus:border-blue-600"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={customCaller.role}
                    onChange={(e) => setCustomCaller({ ...customCaller, role: e.target.value as any })}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 text-xs shadow-xs focus:outline-none focus:border-blue-600"
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Applicant">Applicant</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Interest Program"
                    value={customCaller.interestProgram}
                    onChange={(e) => setCustomCaller({ ...customCaller, interestProgram: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 text-xs shadow-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Multilingual Support</span>
              </label>
              <select
                id="select-call-language"
                disabled={isCalling}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
              >
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="hi-IN">Hindi (हिंदी - India)</option>
                <option value="es-ES">Spanish (Español)</option>
                <option value="fr-FR">French (Français)</option>
                <option value="de-DE">German (Deutsch)</option>
              </select>
            </div>

            {/* Start / End Call Button */}
            {!isCalling ? (
              <button
                id="btn-initiate-call"
                onClick={handleStartCall}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{callMode === 'inbound' ? 'Initiate Incoming Call' : 'Launch AI Outbound Call'}</span>
              </button>
            ) : (
              <button
                id="btn-hangup-call"
                onClick={handleEndCall}
                className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call & Generate Summary</span>
              </button>
            )}
          </div>

          {/* Caller Context Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                {isAuthenticated ? 'Caller Dossier' : 'Simulated Caller Profile'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">
                {activeCaller.role}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-900">{activeCaller.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-mono text-slate-800">
                  {isAuthenticated ? activeCaller.phone : '+1 (555) •••-1098'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Program</span>
                <span className="font-semibold text-blue-700 truncate max-w-[180px]">
                  {activeCaller.interestProgram}
                </span>
              </div>
              {isAuthenticated && 'highSchoolScore' in activeCaller && activeCaller.highSchoolScore && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Score / Cutoff</span>
                  <span className="font-semibold text-emerald-700">{activeCaller.highSchoolScore}</span>
                </div>
              )}
              {isAuthenticated && 'applicationStatus' in activeCaller && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status</span>
                  <span className="font-semibold text-slate-900">{activeCaller.applicationStatus}</span>
                </div>
              )}
              {!isAuthenticated && (
                <div className="pt-1 text-[10px] text-slate-400 italic">
                  * Student PII masked in public demo mode
                </div>
              )}
            </div>
          </div>

          {/* Smart Handoff Manual Trigger */}
          {isCalling && (
            <div className="bg-rose-50 rounded-xl border border-rose-200 p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                <Headphones className="w-4 h-4 text-rose-600" />
                <span>3. Smart Handoff to Human</span>
              </div>
              <p className="text-[11px] text-rose-700">
                Instantly transfer this live caller to the Senior Counselor Desk with zero hold time and full context.
              </p>
              <button
                id="btn-manual-handoff"
                onClick={() => triggerSmartHandoff('Manual operator handoff triggered from studio', 'high')}
                className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Warm Transfer to Human Agent</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Calling Stage, Visualizer & Conversation (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Active Call Stage Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            
            {/* Stage Header */}
            <div className="bg-slate-50/70 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${isCalling ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {isCalling && (
                    <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">
                      {isCalling ? (callStatus === 'dialing' ? 'Dialing & Connecting...' : `Active Call with ${activeCaller.name}`) : 'Call Studio Standby'}
                    </h3>
                    {isCalling && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                        {formatTime(callDuration)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isCalling ? `Maya AI (Agent) ↔ ${activeCaller.name} (${activeCaller.role})` : 'Click Initiate Call on left panel to begin live voice interaction'}
                  </p>
                </div>
              </div>

              {/* Audio Controls */}
              {isCalling && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (isMuted) {
                        setIsMuted(false);
                        startListeningIfAllowed();
                      } else {
                        setIsMuted(true);
                        stopListening();
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-colors shadow-xs ${
                      isMuted ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                  >
                    {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      if (isSpeakerMuted) {
                        setIsSpeakerMuted(false);
                      } else {
                        setIsSpeakerMuted(true);
                        stopSpeaking();
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-colors shadow-xs ${
                      isSpeakerMuted ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={isSpeakerMuted ? 'Unmute Speaker Output' : 'Mute Speaker Output'}
                  >
                    {isSpeakerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Stage Body: Sound Waveform & Live Telemetry */}
            <div className="p-5 bg-white border-b border-slate-200 space-y-4">
              
              {/* Animated Waveform Visualizer */}
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <div className="flex items-center gap-1.5 h-12">
                  {waveformBars.map((level, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${Math.max(8, level * 48)}px`,
                        transition: 'height 0.1s ease-in-out'
                      }}
                      className={`w-1.5 rounded-full ${
                        isAiSpeaking
                          ? 'bg-blue-600'
                          : isListening
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {isAiSpeaking && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium">
                      <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                      Maya AI Speaking (Voice Output)
                    </span>
                  )}
                  {isListening && !isAiSpeaking && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-medium">
                      <Mic className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                      Microphone Active (Listening to Caller...)
                    </span>
                  )}
                  {isProcessingAi && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      Gemini 3.7 & RAG Generating Response...
                    </span>
                  )}
                  {!isCalling && (
                    <span className="text-slate-400 text-xs font-medium">
                      Ready to answer in &lt; 1.5 seconds with zero queue time
                    </span>
                  )}
                </div>
              </div>

              {/* Real-time Telemetry Bar: Sentiment, Intent, Knowledge Sources */}
              {isCalling && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                  {/* Sentiment Barometer */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Caller Sentiment</span>
                      <span className={`font-bold ${
                        currentSentiment === 'Happy' ? 'text-emerald-700' :
                        currentSentiment === 'Inquisitive' ? 'text-blue-700' :
                        currentSentiment === 'Frustrated' ? 'text-rose-700' : 'text-slate-700'
                      }`}>
                        {currentSentiment} ({currentSentimentScore > 0 ? `+${currentSentimentScore}` : currentSentimentScore})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(10, (currentSentimentScore + 1) * 50)}%` }}
                        className={`h-full rounded-full transition-all ${
                          currentSentimentScore >= 0.3 ? 'bg-emerald-500' :
                          currentSentimentScore >= 0 ? 'bg-blue-600' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Detected Intent */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium block">Recognized Intent</span>
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {currentIntent}
                    </span>
                  </div>

                  {/* RAG Knowledge Grounding */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[11px] text-slate-500 font-medium block">RAG Knowledge Retrieved</span>
                    <span className="text-[11px] text-blue-700 font-semibold truncate block">
                      {retrievedSources[0] || 'Institution Catalog'}
                    </span>
                  </div>
                </div>
              )}

              {/* Smart Handoff Active Banner */}
              {handoffActive && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
                      <Headphones className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-rose-900">Smart Warm Transfer in Progress</p>
                      <p className="text-[11px] text-rose-700">{handoffReason}</p>
                    </div>
                  </div>

                  <button
                    onClick={onNavigateToHandoff}
                    className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-500 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Open Counselor Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Stage Body: Live Transcript Feed */}
            <div
              ref={chatScrollRef}
              className="p-5 max-h-[360px] min-h-[220px] overflow-y-auto space-y-3.5 bg-white"
            >
              {transcript.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-medium text-slate-500">Live conversation transcript will stream here in real-time.</p>
                  <p className="text-[11px] text-slate-400">Supports speech recognition, sentiment tracking, and source citations.</p>
                </div>
              ) : (
                transcript.map((msg) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          {isAgent ? 'Maya (AI Voice Advisor)' : activeCaller.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                        {msg.sentiment && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            msg.sentiment === 'Happy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            msg.sentiment === 'Frustrated' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {msg.sentiment}
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                          isAgent
                            ? 'bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-xs'
                            : 'bg-blue-600 text-white rounded-tr-xs'
                        }`}
                      >
                        {msg.text}

                        {/* RAG Sources Pill if Agent */}
                        {isAgent && msg.sourcesRetrieved && msg.sourcesRetrieved.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-[10px] text-blue-700 font-medium">
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            <span>Grounded in:</span>
                            {msg.sourcesRetrieved.map((src, idx) => (
                              <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Voice Questions Prompt Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Quick Voice Queries (Test Real Scenarios)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Instant One-Click Input</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quickVoicePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    disabled={!isCalling || isProcessingAi}
                    onClick={() => handleUserSpeechInput(p.text)}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 hover:text-slate-900 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Text/Voice Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                id="input-voice-text"
                type="text"
                disabled={!isCalling || isProcessingAi}
                placeholder={isCalling ? "Type what the caller says (or speak into your microphone)..." : "Start call above to begin speaking"}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && textInput.trim()) {
                    handleUserSpeechInput(textInput.trim());
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none disabled:opacity-50"
              />

              <button
                id="btn-send-speech"
                disabled={!isCalling || !textInput.trim() || isProcessingAi}
                onClick={() => handleUserSpeechInput(textInput.trim())}
                className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                title="Send Input"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Post-Call Summary Modal */}
      {showSummaryModal && latestCallRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Call Completed & Auto-Logged to CRM</h3>
                  <p className="text-xs text-slate-500">Call ID: {latestCallRecord.id}</p>
                </div>
              </div>

              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-500 hover:text-slate-900 text-xs font-medium px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Close
              </button>
            </div>

            {/* Summary details */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">AI Executive Summary</span>
                <p className="text-slate-800 leading-relaxed">{latestCallRecord.summary}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Next Action Items</span>
                <ul className="space-y-1">
                  {latestCallRecord.keyActionItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disposition and Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Duration</span>
                  <p className="text-xs font-bold text-slate-900 font-mono mt-0.5">{formatTime(latestCallRecord.durationSeconds)}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Sentiment</span>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">{latestCallRecord.sentimentAverage}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Disposition</span>
                  <p className="text-xs font-bold text-blue-700 mt-0.5 truncate">{latestCallRecord.disposition}</p>
                </div>
              </div>
            </div>

            {/* Quick dispatch buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => {
                  handleDispatchedAction({
                    type: 'whatsapp',
                    title: 'Post-Call Summary & Brochure',
                    details: latestCallRecord.summary
                  });
                }}
                className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Send WhatsApp Summary</span>
              </button>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
