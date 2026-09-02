import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, ActiveTab } from './components/Navbar.js';
import { LandingPage } from './components/Landing/LandingPage.js';
import { VoiceCallerStudio } from './components/VoiceCaller/VoiceCallerStudio.js';
import { HumanAgentDesk } from './components/HumanAgentDesk/HumanAgentDesk.js';
import { KnowledgeBaseManager } from './components/KnowledgeBase/KnowledgeBaseManager.js';
import { StudentDirectory } from './components/CRM/StudentDirectory.js';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard.js';
import { SettingsModal } from './components/Settings/SettingsModal.js';
import { AdminLoginPage } from './components/Auth/AdminLoginPage.js';
import { CollegeLoginPage } from './components/Auth/CollegeLoginPage.js';
import { CollegeRegisterPage } from './components/Auth/CollegeRegisterPage.js';
import { AdminDashboard } from './components/Admin/AdminDashboard.js';
import { BCAProjectDocs } from './components/Documentation/BCAProjectDocs.js';
import { ProtectedAuthGate } from './components/Auth/ProtectedAuthGate.js';
import {
  CallerProfile,
  CallRecord,
  HandoffTicket,
  KnowledgeBaseItem,
  AnalyticsSummary,
  AgentVoiceSettings,
  UserSession,
  CollegeAccount
} from './types.js';
import {
  fetchKnowledgeBase,
  fetchStudents,
  fetchCalls,
  fetchHandoffs,
  fetchAnalytics,
  fetchSettings,
  deductCollegeCredits
} from './utils/api.js';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // User Session Management (Super Admin, College Admin, Guest Caller)
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('eduvoice_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      isAuthenticated: false,
      role: 'guest'
    };
  });

  // Core Application Data State
  const [students, setStudents] = useState<CallerProfile[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseItem[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [handoffTickets, setHandoffTickets] = useState<HandoffTicket[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [settings, setSettings] = useState<AgentVoiceSettings>({
    agentName: 'Maya (AI Voice Advisor)',
    speed: 1.0,
    pitch: 1.0,
    selectedLanguage: 'en-US',
    autoGreeting: true,
    voiceProfile: 'warm-female',
    institutionName: 'Apex Institute of Higher Education & Technology',
    tollFreeNumber: '+1 (800) 555-APEX',
    handoffThresholdSensitivity: 'high'
  });

  // Save session changes
  const updateSession = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('eduvoice_session', JSON.stringify(newSession));
  };

  const handleLogout = () => {
    const defaultSession: UserSession = { isAuthenticated: false, role: 'guest' };
    setSession(defaultSession);
    localStorage.removeItem('eduvoice_session');
    localStorage.removeItem('eduvoice_admin_backup');
    setActiveTab('landing');
  };

  // Exit Impersonation Mode back to Super Admin Master Console
  const handleExitImpersonation = () => {
    const backup = localStorage.getItem('eduvoice_admin_backup');
    if (backup) {
      try {
        const adminSession = JSON.parse(backup);
        updateSession(adminSession);
        localStorage.removeItem('eduvoice_admin_backup');
        setActiveTab('admin_dashboard');
        return;
      } catch (e) {}
    }
    // Default fallback super admin session
    updateSession({
      isAuthenticated: true,
      role: 'super_admin',
      user: {
        id: 'super-admin-01',
        name: 'Dr. Rajesh Verma',
        email: 'directorate@higheredu.gov.in',
        role: 'super_admin',
        designation: 'Chief Directorate Officer',
        department: 'National Higher Education Accreditation'
      }
    });
    setActiveTab('admin_dashboard');
  };

  // Load initial backend database state
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [kbRes, studentsRes, callsRes, handoffsRes, analyticsRes, settingsRes] = await Promise.all([
          fetchKnowledgeBase(),
          fetchStudents(),
          fetchCalls(),
          fetchHandoffs(),
          fetchAnalytics(),
          fetchSettings()
        ]);

        if (kbRes) setKnowledgeItems(kbRes);
        if (studentsRes) setStudents(studentsRes);
        if (callsRes) setCalls(callsRes);
        if (handoffsRes) setHandoffTickets(handoffsRes);
        if (analyticsRes) setAnalytics(analyticsRes);
        if (settingsRes) setSettings(settingsRes);
      } catch (err) {
        console.error('Failed to load initial application state:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Compute pending handoff count
  const pendingHandoffCount = handoffTickets.filter(t => t.status === 'pending').length;

  // Handle call completion with real credit deduction
  const handleCallCompleted = async (record: CallRecord) => {
    setCalls(prev => [record, ...prev]);

    // If a college is logged in, deduct minutes from their credit quota
    if (session.user?.collegeId) {
      const minutesToDeduct = Math.max(1, Math.ceil((record.durationSeconds || 60) / 60));
      try {
        const res = await deductCollegeCredits(session.user.collegeId, minutesToDeduct);
        if (res && res.success) {
          updateSession({
            ...session,
            user: {
              ...session.user,
              creditsRemaining: res.creditsRemaining
            }
          });
        }
      } catch (e) {
        console.error('Failed to deduct college credits:', e);
      }
    }

    // Refresh analytics from server
    try {
      const freshAnalytics = await fetchAnalytics();
      setAnalytics(freshAnalytics);
      const freshCalls = await fetchCalls();
      setCalls(freshCalls);
      const freshStudents = await fetchStudents();
      setStudents(freshStudents);
    } catch (e) {}
  };

  // Handle handoff triggered during call
  const handleHandoffTriggered = (ticket: HandoffTicket) => {
    setHandoffTickets(prev => [ticket, ...prev.filter(t => t.id !== ticket.id)]);
  };

  // Handle handoff ticket updated in counselor desk
  const handleTicketUpdated = (updated: HandoffTicket) => {
    setHandoffTickets(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  // 1-Click Launch Outbound Call from CRM
  const handleLaunchOutboundCall = (student: CallerProfile) => {
    setActiveTab('caller');
  };

  // Switch to specific college context from Super Admin Dashboard (Direct Impersonation)
  const handleSwitchToCollegeContext = (college: CollegeAccount) => {
    // Save current super admin session for 1-click restore
    if (session.role === 'super_admin') {
      localStorage.setItem('eduvoice_admin_backup', JSON.stringify(session));
    }

    updateSession({
      isAuthenticated: true,
      role: 'college_admin',
      isSuperAdminImpersonating: true,
      user: {
        id: college.id,
        name: college.contactPerson,
        email: college.email,
        role: 'college_admin',
        collegeId: college.id,
        collegeName: college.collegeName,
        collegeCode: college.collegeCode,
        subscriptionTier: college.subscriptionTier,
        subscriptionStatus: college.status,
        status: college.status,
        creditsRemaining: college.creditsRemaining,
        monthlyCreditAllowance: college.monthlyCreditAllowance,
        totalCreditsAllocated: college.monthlyCreditAllowance
      }
    });

    setSettings(prev => ({
      ...prev,
      institutionName: college.collegeName,
      tollFreeNumber: college.phone || '+1 (800) 555-COLLEGE'
    }));

    setActiveTab('caller');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingHandoffCount={pendingHandoffCount}
        isCallActive={false}
        onOpenSettings={() => setIsSettingsOpen(true)}
        session={session}
        onLogout={handleLogout}
        onExitImpersonation={handleExitImpersonation}
      />

      {/* Main Content Area with Animated Tab Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              Connecting to National Telephony Network & Autonomous Database...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {/* 0. Home / Landing Page */}
              {activeTab === 'landing' && (
                <LandingPage
                  session={session}
                  onNavigateToCaller={() => setActiveTab('caller')}
                  onNavigateToHandoff={() => setActiveTab('handoff')}
                  onNavigateToKnowledge={() => setActiveTab('knowledge')}
                  onNavigateToCRM={() => setActiveTab('crm')}
                  onNavigateToAnalytics={() => setActiveTab('analytics')}
                  onNavigateToDocs={() => setActiveTab('bca_docs')}
                  onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                  onNavigateToCollegeRegister={() => setActiveTab('college_register')}
                  onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                />
              )}

              {/* 1. Voice Caller Simulation Tab */}
              {activeTab === 'caller' && (
                <VoiceCallerStudio
                  students={students}
                  settings={settings}
                  session={session}
                  onCallCompleted={handleCallCompleted}
                  onHandoffTriggered={handleHandoffTriggered}
                  onNavigateToHandoff={() => setActiveTab('handoff')}
                />
              )}

              {/* 2. Counselor Agent Desk Tab (RBAC Protected) */}
              {activeTab === 'handoff' && (
                session.isAuthenticated ? (
                  <HumanAgentDesk
                    tickets={handoffTickets}
                    onTicketUpdated={handleTicketUpdated}
                  />
                ) : (
                  <ProtectedAuthGate
                    moduleName="Counselor Escalation Queue"
                    moduleType="counselor"
                    onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                    onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                    onNavigateToPublicCaller={() => setActiveTab('caller')}
                  />
                )
              )}

              {/* 3. Knowledge Base Manager Tab (RBAC Protected) */}
              {activeTab === 'knowledge' && (
                session.isAuthenticated ? (
                  <KnowledgeBaseManager
                    items={knowledgeItems}
                    onItemsChange={setKnowledgeItems}
                  />
                ) : (
                  <ProtectedAuthGate
                    moduleName="Institutional Knowledge Base"
                    moduleType="knowledge"
                    onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                    onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                    onNavigateToPublicCaller={() => setActiveTab('caller')}
                  />
                )
              )}

              {/* 4. Student CRM Directory Tab (RBAC Protected) */}
              {activeTab === 'crm' && (
                session.isAuthenticated ? (
                  <StudentDirectory
                    students={students}
                    calls={calls}
                    onStudentsChange={setStudents}
                    onLaunchOutboundCall={handleLaunchOutboundCall}
                  />
                ) : (
                  <ProtectedAuthGate
                    moduleName="Student Admissions Directory"
                    moduleType="crm"
                    onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                    onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                    onNavigateToPublicCaller={() => setActiveTab('caller')}
                  />
                )
              )}

              {/* 5. Analytics & Audit Logs Tab (RBAC Protected) */}
              {activeTab === 'analytics' && (
                session.isAuthenticated ? (
                  analytics && (
                    <AnalyticsDashboard
                      analytics={analytics}
                      calls={calls}
                    />
                  )
                ) : (
                  <ProtectedAuthGate
                    moduleName="Telephony Audit Logs & Analytics"
                    moduleType="analytics"
                    onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                    onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                    onNavigateToPublicCaller={() => setActiveTab('caller')}
                  />
                )
              )}

              {/* 6. Multi-Stream Higher Ed & BCA Docs */}
              {activeTab === 'bca_docs' && (
                <BCAProjectDocs />
              )}

              {/* 7. Super Admin Command Center (Super Admin Role Required) */}
              {activeTab === 'admin_dashboard' && (
                session.role === 'super_admin' ? (
                  <AdminDashboard
                    onSwitchToCollege={handleSwitchToCollegeContext}
                    onNavigateToCaller={() => setActiveTab('caller')}
                  />
                ) : (
                  <ProtectedAuthGate
                    moduleName="National Directorate Command Center"
                    moduleType="admin"
                    onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                    onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                    onNavigateToPublicCaller={() => setActiveTab('caller')}
                  />
                )
              )}

              {/* 8. Super Admin Login Page */}
              {activeTab === 'admin_login' && (
                <AdminLoginPage
                  onLoginSuccess={(newSession) => {
                    updateSession(newSession);
                    setActiveTab('admin_dashboard');
                  }}
                  onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                  onNavigateToCollegeRegister={() => setActiveTab('college_register')}
                  onNavigateToStudentMode={() => setActiveTab('caller')}
                />
              )}

              {/* 9. College & Institute Login Page */}
              {activeTab === 'college_login' && (
                <CollegeLoginPage
                  onLoginSuccess={(newSession) => {
                    updateSession(newSession);
                    if (newSession.user?.collegeName) {
                      setSettings(prev => ({
                        ...prev,
                        institutionName: newSession.user?.collegeName || prev.institutionName
                      }));
                    }
                    setActiveTab('caller');
                  }}
                  onNavigateToCollegeRegister={() => setActiveTab('college_register')}
                  onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                  onNavigateToStudentMode={() => setActiveTab('caller')}
                />
              )}

              {/* 10. College Registration Page */}
              {activeTab === 'college_register' && (
                <CollegeRegisterPage
                  onRegisterSuccess={(newSession) => {
                    updateSession(newSession);
                    if (newSession.user?.collegeName) {
                      setSettings(prev => ({
                        ...prev,
                        institutionName: newSession.user?.collegeName || prev.institutionName
                      }));
                    }
                    setActiveTab('caller');
                  }}
                  onNavigateToCollegeLogin={() => setActiveTab('college_login')}
                  onNavigateToAdminLogin={() => setActiveTab('admin_login')}
                  onNavigateToStudentMode={() => setActiveTab('caller')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer Info */}
      <footer className="h-10 bg-slate-900 text-slate-300 border-t border-slate-800 px-6 flex items-center justify-between text-[11px] shrink-0 font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">
              {session.user?.collegeName || settings.institutionName || 'National Higher Education Telephony Gateway'}
            </span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400">Helpline: {settings.tollFreeNumber}</span>
          <span className="hidden lg:inline text-slate-600">•</span>
          <span className="hidden lg:inline text-slate-400">AISHE / UGC Multi-Stream Accreditation</span>
        </div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
          <span>Security Clearance:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">LEVEL-4 ENCRYPTED</span>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={setSettings}
      />
    </div>
  );
}
export default App;
