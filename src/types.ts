export type CallerRole = 'Student' | 'Parent' | 'Applicant' | 'Alumni' | 'Counselor';

export type ApplicationStatus = 
  | 'New Inquiry'
  | 'Application Submitted'
  | 'Documents Pending'
  | 'Counseling Scheduled'
  | 'Fee Pending'
  | 'Admitted'
  | 'Scholarship Applied';

export interface CallerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: CallerRole;
  interestProgram: string;
  location: string;
  applicationStatus: ApplicationStatus;
  highSchoolScore?: string;
  notes?: string;
  createdAt: string;
  totalCallsCount: number;
  lastContactedAt?: string;
}

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'ringing' | 'active' | 'handed_off' | 'completed' | 'missed';
export type SentimentState = 'Happy' | 'Inquisitive' | 'Neutral' | 'Confused' | 'Frustrated' | 'Angry';

export interface TranscriptMessage {
  id: string;
  sender: 'user' | 'agent' | 'human_counselor' | 'system';
  text: string;
  timestamp: string;
  sentiment?: SentimentState;
  sentimentScore?: number; // -1.0 to 1.0
  detectedIntent?: string;
  sourcesRetrieved?: string[];
  audioUrl?: string;
}

export interface CallRecord {
  id: string;
  callDirection: CallDirection;
  callerId?: string;
  callerName: string;
  callerPhone: string;
  callerRole: CallerRole;
  interestProgram?: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  status: CallStatus;
  language: string;
  primaryIntent: string;
  intentList: string[];
  sentimentAverage: SentimentState;
  sentimentScore: number;
  transcript: TranscriptMessage[];
  handoffDetails?: {
    triggered: boolean;
    reason?: string;
    priority?: 'normal' | 'high' | 'critical';
    transferredToAgent?: string;
    transferredAt?: string;
    resolvedBy?: string;
  };
  summary: string;
  keyActionItems: string[];
  disposition?: string;
  actionDispatched?: {
    type: 'whatsapp' | 'sms' | 'email' | 'payment_link';
    recipient: string;
    sentAt: string;
    details: string;
  };
}

export type KnowledgeCategory = 
  | 'institute_info'
  | 'courses'
  | 'fees_scholarships'
  | 'admission_eligibility'
  | 'timings_facilities'
  | 'faqs_policies';

export interface KnowledgeBaseItem {
  id: string;
  category: KnowledgeCategory;
  categoryName: string;
  title: string;
  keywords: string[];
  content: string;
  lastUpdated: string;
  tags: string[];
  confidenceScore?: number;
}

export interface HandoffTicket {
  id: string;
  callId: string;
  callerName: string;
  callerPhone: string;
  callerRole: CallerRole;
  interestProgram?: string;
  reason: string;
  priority: 'normal' | 'high' | 'critical';
  status: 'pending' | 'accepted' | 'resolved' | 'dismissed';
  assignedCounselor?: string;
  requestedAt: string;
  summary: string;
  transcriptSnapshot: TranscriptMessage[];
  liveNotes?: string;
}

export interface AnalyticsSummary {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  avgDurationSeconds: number;
  resolutionRatePercent: number;
  handoffRatePercent: number;
  avgSentimentScore: number;
  avgAnswerSpeedSec: number;
  intentBreakdown: { intent: string; count: number; percentage: number }[];
  sentimentBreakdown: { sentiment: SentimentState; count: number; percentage: number }[];
  hourlyCallVolume: { hour: string; calls: number }[];
  recentHandoffsCount: number;
}

export interface AgentVoiceSettings {
  voiceName?: string;
  agentName?: string;
  speed: number;
  pitch: number;
  selectedLanguage: string;
  greetingMessage?: string;
  autoGreeting?: boolean;
  voiceProfile?: string;
  autoAnswerDelaySec?: number;
  handoffFrustrationThreshold?: number; // 0.1 to 1.0
  handoffThresholdSensitivity?: 'low' | 'medium' | 'high';
  enableAudioVisualizer?: boolean;
  institutionName: string;
  tollFreeNumber?: string;
}

// ----------------------------------------------------
// Authentication, Subscriptions & Multi-Role Portal Types
// ----------------------------------------------------

export type UserRole = 'super_admin' | 'college_admin' | 'counselor' | 'student_guest' | 'guest';

export type SubscriptionTier = 'Starter' | 'Pro' | 'Enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'Active' | 'Pending_Approval' | 'Expired' | 'Suspended';

export interface PlanConfig {
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyCredits: number; // Voice telephony minutes/credits
  counselorSeats: number;
  voiceProfilesCount: number;
  features: string[];
}

export interface CreditTransaction {
  id: string;
  collegeId: string;
  type: 'monthly_allocation' | 'admin_refill' | 'call_deduction' | 'plan_upgrade';
  amount: number; // positive for addition, negative for deduction
  balanceAfter: number;
  timestamp: string;
  description: string;
  performedBy?: string;
}

export interface CollegeAccount {
  id: string;
  collegeName: string;
  collegeCode: string;
  email: string;
  password?: string;
  affiliation: string; // e.g. "Accredited NAAC A++ • Affiliated with State Technical University"
  phone: string;
  city: string;
  state: string;
  website: string;
  status: SubscriptionStatus;
  registeredAt: string;
  departments: string[];
  totalStudentsCount: number;
  totalCallsCount: number;
  contactPerson: string;
  contactDesignation: string;
  // Subscription & Credit fields
  subscriptionTier: SubscriptionTier;
  billingCycle: BillingCycle;
  monthlyCreditAllowance: number;
  creditsRemaining: number;
  creditsUsed: number;
  subscriptionRenewsAt: string;
  amountPaid: number;
  approvedAt?: string;
  approvedBy?: string;
  autoRechargeEnabled?: boolean;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin';
  lastLoginAt: string;
}

export interface UserSession {
  isAuthenticated: boolean;
  role: UserRole;
  isSuperAdminImpersonating?: boolean;
  impersonatedBy?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    designation?: string;
    department?: string;
    collegeId?: string;
    collegeName?: string;
    collegeCode?: string;
    subscriptionTier?: SubscriptionTier;
    subscriptionStatus?: SubscriptionStatus;
    status?: SubscriptionStatus;
    billingCycle?: BillingCycle;
    creditsRemaining?: number;
    monthlyCreditAllowance?: number;
    totalCreditsAllocated?: number;
    token?: string;
  };
}
