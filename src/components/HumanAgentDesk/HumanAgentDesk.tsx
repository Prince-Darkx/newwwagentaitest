import React, { useState, useEffect } from 'react';
import {
  Headphones,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Send,
  MessageSquare,
  FileText,
  Sparkles,
  Share2,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { HandoffTicket, TranscriptMessage } from '../../types.js';
import { updateHandoffTicket, sendActionIntegration } from '../../utils/api.js';

interface HumanAgentDeskProps {
  tickets: HandoffTicket[];
  onTicketUpdated: (ticket: HandoffTicket) => void;
}

export const HumanAgentDesk: React.FC<HumanAgentDeskProps> = ({
  tickets,
  onTicketUpdated
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [counselorMessage, setCounselorMessage] = useState<string>('');
  const [dispositionNotes, setDispositionNotes] = useState<string>('');
  const [selectedDisposition, setSelectedDisposition] = useState<string>('Admission Consultation Scheduled');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'resolved'>('all');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Sync selected ticket
  useEffect(() => {
    if (!selectedTicketId && tickets.length > 0) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter(t => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const handleAcceptHandoff = async () => {
    if (!activeTicket) return;
    const updated = await updateHandoffTicket(activeTicket.id, {
      status: 'accepted',
      assignedCounselor: 'Senior Counselor Sarah Jenkins'
    });
    if (updated) {
      onTicketUpdated(updated);
      setFeedbackToast(`Ticket ${activeTicket.id} accepted by Senior Counselor Sarah Jenkins.`);
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  const handleSendCounselorMessage = async () => {
    if (!counselorMessage.trim() || !activeTicket) return;
    const newMessage: TranscriptMessage = {
      id: `c-msg-${Date.now()}`,
      sender: 'human_counselor',
      text: counselorMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTranscript = [...(activeTicket.transcriptSnapshot || []), newMessage];
    const updated = await updateHandoffTicket(activeTicket.id, {
      transcriptSnapshot: updatedTranscript,
      liveNotes: (activeTicket.liveNotes ? activeTicket.liveNotes + '\n' : '') + `[Counselor]: ${counselorMessage.trim()}`
    });

    if (updated) {
      onTicketUpdated(updated);
      setCounselorMessage('');
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket) return;
    const updated = await updateHandoffTicket(activeTicket.id, {
      status: 'resolved',
      liveNotes: (activeTicket.liveNotes || '') + `\nResolution [${selectedDisposition}]: ${dispositionNotes || 'Case completed successfully.'}`
    });

    if (updated) {
      onTicketUpdated(updated);
      setFeedbackToast(`Ticket marked Resolved with disposition: ${selectedDisposition}`);
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  const handleSendFollowUp = async (type: 'whatsapp' | 'sms' | 'email') => {
    if (!activeTicket) return;
    try {
      await sendActionIntegration({
        type,
        recipient: activeTicket.callerPhone,
        title: `Official Follow-up: ${selectedDisposition}`,
        details: `Senior Counselor Jenkins dispatched official counseling confirmation and direct helpline link.`
      });
      setFeedbackToast(`Dispatched follow-up via ${type.toUpperCase()} to ${activeTicket.callerPhone}`);
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (e) {
      console.warn('Action error:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Smart Human Agent Desk — Warm Transfer Console
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Pillar 3 Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Live handoff queue with contextual dossier, emotional trajectory, and zero-repeat caller continuation.
            </p>
          </div>
        </div>

        {feedbackToast && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 animate-fadeIn font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Live Handoff Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Live Handoff Queue ({filteredTickets.length})
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              {(['all', 'pending', 'accepted', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-md capitalize transition-colors ${
                    statusFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Queue List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  No tickets matching this status.
                </div>
              ) : (
                filteredTickets.map(ticket => {
                  const isSelected = activeTicket?.id === ticket.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-colors space-y-2 ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{ticket.callerName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium">
                            {ticket.callerRole}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ticket.status === 'pending' ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' :
                          ticket.status === 'accepted' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {ticket.reason}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                        <span>{new Date(ticket.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-blue-700 font-sans font-medium">{ticket.interestProgram?.split(' ')[0]}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Warm Transfer Dossier & Counselor Console (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeTicket ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-5 p-6">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    {activeTicket.callerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{activeTicket.callerName}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">
                        {activeTicket.callerRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{activeTicket.callerPhone} • {activeTicket.interestProgram}</p>
                  </div>
                </div>

                {/* Accept Button / Counselor Assignment */}
                <div className="flex items-center gap-2">
                  {activeTicket.status === 'pending' ? (
                    <button
                      onClick={handleAcceptHandoff}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Accept & Take Over Call</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Handled by: <strong className="text-slate-900">{activeTicket.assignedCounselor || 'Senior Counselor'}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Handoff Trigger & Context Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-rose-50 rounded-lg border border-rose-200 space-y-1">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Handoff Trigger Reason
                  </span>
                  <p className="text-xs text-slate-900 leading-relaxed font-medium">
                    {activeTicket.reason}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    AI Pre-Handoff Summary
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeTicket.summary}
                  </p>
                </div>
              </div>

              {/* Warm Transfer Transcript Stream */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  Pre-Handoff Conversation Timeline (Zero Repeat)
                </span>
                
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 max-h-[240px] overflow-y-auto space-y-3">
                  {activeTicket.transcriptSnapshot?.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-0.5 text-[10px] text-slate-500 font-medium">
                        <span>{msg.sender === 'user' ? activeTicket.callerName : msg.sender === 'human_counselor' ? 'Human Counselor (Live)' : 'Maya (AI Agent)'}</span>
                        <span className="font-mono text-slate-400">{msg.timestamp}</span>
                      </div>
                      <div className={`px-3.5 py-2 rounded-xl text-xs max-w-[85%] leading-relaxed shadow-xs ${
                        msg.sender === 'human_counselor' ? 'bg-emerald-600 text-white rounded-tr-xs' :
                        msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-xs' :
                        'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Counselor Response Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Send Direct Counselor Response / Offer to Student</span>
                  <span className="text-[10px] text-slate-400 font-normal">Live Voice & SMS Stream</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type counselor message (e.g. 'Hello Mr. Davis, I have reviewed your medical diet request and approved the room assignment...')"
                    value={counselorMessage}
                    onChange={(e) => setCounselorMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCounselorMessage()}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    onClick={handleSendCounselorMessage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

              {/* Resolution & Disposition Section */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Resolution & Disposition
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1 font-medium">Select Outcome Disposition</label>
                    <select
                      value={selectedDisposition}
                      onChange={(e) => setSelectedDisposition(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
                    >
                      <option value="Admission Consultation Scheduled">Admission Consultation Scheduled</option>
                      <option value="Scholarship Waiver Approved (50%)">Scholarship Waiver Approved (50%)</option>
                      <option value="Campus Walkthrough Tour Booked">Campus Walkthrough Tour Booked</option>
                      <option value="Hostel Dietary Plan Clearance Issued">Hostel Dietary Plan Clearance Issued</option>
                      <option value="Callback Required with Parents">Callback Required with Parents</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1 font-medium">Counselor Notes</label>
                    <input
                      type="text"
                      placeholder="Add final resolution notes..."
                      value={dispositionNotes}
                      onChange={(e) => setDispositionNotes(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendFollowUp('whatsapp')}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                    >
                      <Share2 className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp Follow-up</span>
                    </button>
                    <button
                      onClick={() => handleSendFollowUp('sms')}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3 text-blue-600" />
                      <span>SMS Confirmation</span>
                    </button>
                  </div>

                  <button
                    onClick={handleResolveTicket}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete & Mark Resolved</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3 shadow-xs">
              <Headphones className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No active handoff ticket selected.</p>
              <p className="text-xs text-slate-500">Incoming escalated calls from the AI voice engine will appear in the queue on the left.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
