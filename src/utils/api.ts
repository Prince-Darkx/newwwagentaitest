import {
  CallerProfile,
  CallRecord,
  KnowledgeBaseItem,
  HandoffTicket,
  AnalyticsSummary,
  AgentVoiceSettings,
  TranscriptMessage
} from '../types.js';

export async function fetchHealth() {
  const res = await fetch('/api/health');
  return res.json();
}

export async function postAgentInteraction(payload: {
  callerName: string;
  callerPhone: string;
  callerRole: string;
  interestProgram?: string;
  userSpeech: string;
  conversationHistory: TranscriptMessage[];
  selectedLanguage?: string;
  callDirection?: 'inbound' | 'outbound';
}) {
  const res = await fetch('/api/agent/interact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Agent interaction failed: ${res.statusText}`);
  }
  return res.json();
}

export async function postGenerateSummary(transcript: TranscriptMessage[], caller: any) {
  const res = await fetch('/api/agent/summarize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, caller })
  });
  return res.json();
}

export async function fetchKnowledgeBase(query?: string, category?: string): Promise<KnowledgeBaseItem[]> {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (category && category !== 'all') params.append('category', category);
  const res = await fetch(`/api/knowledge-base?${params.toString()}`);
  return res.json();
}

export async function createKnowledgeItem(item: Partial<KnowledgeBaseItem>): Promise<KnowledgeBaseItem> {
  const res = await fetch('/api/knowledge-base', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function updateKnowledgeItem(id: string, updates: Partial<KnowledgeBaseItem>): Promise<KnowledgeBaseItem> {
  const res = await fetch(`/api/knowledge-base/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deleteKnowledgeItem(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/knowledge-base/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchStudents(search?: string, status?: string): Promise<CallerProfile[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  const res = await fetch(`/api/students?${params.toString()}`);
  return res.json();
}

export async function createStudent(student: Partial<CallerProfile>): Promise<CallerProfile> {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  return res.json();
}

export async function updateStudent(id: string, updates: Partial<CallerProfile>): Promise<CallerProfile> {
  const res = await fetch(`/api/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function fetchCalls(status?: string, search?: string): Promise<CallRecord[]> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  const res = await fetch(`/api/calls?${params.toString()}`);
  return res.json();
}

export async function saveCallRecord(record: CallRecord): Promise<CallRecord> {
  const res = await fetch('/api/calls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  return res.json();
}

export async function fetchHandoffQueue(status?: string): Promise<HandoffTicket[]> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  const res = await fetch(`/api/handoff/queue?${params.toString()}`);
  return res.json();
}

export const fetchHandoffs = fetchHandoffQueue;

export async function createHandoffTicket(ticket: Partial<HandoffTicket>): Promise<HandoffTicket> {
  const res = await fetch('/api/handoff/queue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket)
  });
  return res.json();
}

export async function updateHandoffTicket(id: string, updates: Partial<HandoffTicket>): Promise<HandoffTicket> {
  const res = await fetch(`/api/handoff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch('/api/analytics');
  return res.json();
}

export async function fetchSettings(): Promise<AgentVoiceSettings> {
  const res = await fetch('/api/agent/settings');
  return res.json();
}

export async function updateSettings(settings: Partial<AgentVoiceSettings>): Promise<AgentVoiceSettings> {
  const res = await fetch('/api/agent/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
}

export async function sendActionIntegration(payload: {
  type: 'whatsapp' | 'sms' | 'email' | 'payment_link';
  recipient: string;
  details: string;
  title?: string;
  callId?: string;
}) {
  const res = await fetch('/api/integrations/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

// ----------------------------------------------------
// Authentication & Multi-College API Handlers
// ----------------------------------------------------

export async function loginAdmin(email: string, password?: string) {
  const res = await fetch('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Admin login failed');
  }
  return data;
}

export async function fetchPlans(): Promise<Record<string, any>> {
  const res = await fetch('/api/plans');
  return res.json();
}

export async function registerCollege(payload: {
  collegeName: string;
  collegeCode: string;
  email: string;
  password?: string;
  affiliation: string;
  phone: string;
  city: string;
  state: string;
  website?: string;
  contactPerson: string;
  contactDesignation?: string;
  departments?: string[];
  subscriptionTier?: 'Starter' | 'Pro' | 'Enterprise';
  billingCycle?: 'monthly' | 'yearly';
}) {
  const res = await fetch('/api/auth/college/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'College registration failed');
  }
  return data;
}

export async function loginCollege(emailOrCode: string, password?: string) {
  const res = await fetch('/api/auth/college/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrCode, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'College login failed');
  }
  return data;
}

export async function fetchColleges() {
  const res = await fetch('/api/auth/colleges');
  return res.json();
}

export async function updateCollegeStatus(id: string, status: 'Active' | 'Pending_Approval' | 'Suspended' | 'Expired') {
  const res = await fetch(`/api/auth/colleges/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function approveCollegeSubscription(id: string, tier?: string, billingCycle?: string, customCredits?: number) {
  const res = await fetch(`/api/admin/colleges/${id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, billingCycle, customCredits })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Approval failed');
  }
  return data;
}

export async function refillCollegeCredits(id: string, amount: number, note?: string) {
  const res = await fetch(`/api/admin/colleges/${id}/refill-credits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, note })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Credit refill failed');
  }
  return data;
}

export async function impersonateCollege(id: string) {
  const res = await fetch(`/api/admin/impersonate/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to access college dashboard');
  }
  return data;
}

export async function deductCollegeCredits(id: string, minutes: number = 1) {
  const res = await fetch(`/api/colleges/${id}/deduct-credits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutes })
  });
  return res.json();
}

export async function updateCollegePlan(id: string, tier: string, billingCycle: string) {
  const res = await fetch(`/api/colleges/${id}/update-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, billingCycle })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Plan update failed');
  }
  return data;
}
