import React from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  Headphones, 
  BookOpen, 
  Users, 
  BarChart3, 
  Layers, 
  Sparkles,
  Settings,
  Activity,
  ShieldCheck,
  Building2,
  UserCheck,
  LogOut,
  GraduationCap,
  FileCode2,
  LogIn,
  Shield,
  Radio,
  School,
  Home,
  ChevronRight,
  Zap,
  ArrowLeft,
  CreditCard,
  Lock
} from 'lucide-react';
import { UserSession } from '../types.js';

export type ActiveTab = 
  | 'landing'
  | 'caller' 
  | 'handoff' 
  | 'knowledge' 
  | 'crm' 
  | 'analytics' 
  | 'bca_docs'
  | 'admin_dashboard' 
  | 'admin_login' 
  | 'college_login' 
  | 'college_register';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingHandoffCount: number;
  isCallActive: boolean;
  onOpenSettings: () => void;
  session: UserSession;
  onLogout: () => void;
  onExitImpersonation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingHandoffCount,
  isCallActive,
  onOpenSettings,
  session,
  onLogout,
  onExitImpersonation
}) => {
  const isSuperAdmin = session.role === 'super_admin';
  const isCollegeAdmin = session.role === 'college_admin';
  const isImpersonating = !!session.isSuperAdminImpersonating;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shrink-0 shadow-xs">
      {/* Impersonation Banner (Super Admin accessing College Directly) */}
      {isImpersonating && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shadow-xs border-b border-amber-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>
              ⚡ Super Admin Direct Impersonation: Managing <span className="underline font-extrabold">{session.user?.collegeName || 'College Portal'}</span> ({session.user?.collegeCode})
            </span>
          </div>
          {onExitImpersonation && (
            <button
              onClick={onExitImpersonation}
              className="px-2.5 py-0.5 bg-slate-950 hover:bg-slate-900 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Exit to Master Directorate</span>
            </button>
          )}
        </div>
      )}

      {/* Top Official National Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[10px] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800 flex items-center justify-between font-medium">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-slate-200 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            National AI Telephony Gateway • Higher Education Framework
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            MeitY & UGC Compliant Standards • Multi-Stream Telephony (Eng, IT, Mgmt, Health, Law)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono hidden sm:inline">ISO/IEC 27001</span>
          <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded text-[9px] font-bold border border-blue-400/30 uppercase">
            Official Portal
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('landing')} 
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-xs group-hover:from-blue-500 group-hover:to-indigo-500 transition-all">
                <PhoneCall className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    EduVoice <span className="text-blue-600">AI</span>
                  </span>
                  {isSuperAdmin ? (
                    <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Super Admin
                    </span>
                  ) : isCollegeAdmin ? (
                    <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-bold tracking-wider border border-blue-200 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-600" />
                      {session.user?.collegeCode || 'College'}
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-slate-200">
                      National Gateway
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Universal AI Voice Telephony & Multi-Stream Admissions Desk
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              <button
                id="nav-tab-landing"
                onClick={() => setActiveTab('landing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'landing'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                id="nav-tab-caller"
                onClick={() => setActiveTab('caller')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'caller'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Voice Studio</span>
                {isCallActive && (
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping ml-0.5" />
                )}
              </button>

              <button
                id="nav-tab-handoff"
                onClick={() => setActiveTab('handoff')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === 'handoff'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Counselor Desk</span>
                {!session.isAuthenticated && (
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                )}
                {pendingHandoffCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white ml-0.5">
                    {pendingHandoffCount}
                  </span>
                )}
              </button>

              <button
                id="nav-tab-knowledge"
                onClick={() => setActiveTab('knowledge')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'knowledge'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Knowledge Base</span>
                {!session.isAuthenticated && (
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                )}
              </button>

              <button
                id="nav-tab-crm"
                onClick={() => setActiveTab('crm')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'crm'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Students CRM</span>
                {!session.isAuthenticated && (
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                )}
              </button>

              <button
                id="nav-tab-analytics"
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Telephony Logs</span>
                {!session.isAuthenticated && (
                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                )}
              </button>

              <button
                id="nav-tab-bca-docs"
                onClick={() => setActiveTab('bca_docs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'bca_docs'
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                <span>University Docs</span>
              </button>

              {/* National Command Tab: ONLY for Super Admin */}
              {isSuperAdmin && (
                <button
                  id="nav-tab-admin-dashboard"
                  onClick={() => setActiveTab('admin_dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'admin_dashboard'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>National Directorate</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls: Credits Badge, Portal Switcher & Settings */}
          <div className="flex items-center gap-2">
            {/* College Voice Credits Badge */}
            {isCollegeAdmin && (
              <div 
                className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs"
                title="Monthly Voice Telephony Minutes Balance"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
                <span className="font-extrabold text-amber-900">
                  {(session.user?.creditsRemaining || 8420).toLocaleString()}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">mins</span>
                <span className="text-[10px] font-bold bg-amber-200/60 text-amber-900 px-1.5 py-0.2 rounded">
                  {session.user?.subscriptionTier || 'Pro'}
                </span>
              </div>
            )}

            {/* Quick Portal Switcher */}
            <div className="hidden md:flex items-center gap-1.5 border-r border-slate-200 pr-3 mr-1">
              {!session.isAuthenticated && (
                <>
                  <button
                    onClick={() => setActiveTab('admin_login')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'admin_login'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                    title="Super Admin Government Login"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Admin Login</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('college_login')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'college_login'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                    title="College Admissions Desk Login"
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>College Login</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('college_register')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'college_register'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                    title="Subscribe & Register New College"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Subscribe College</span>
                  </button>
                </>
              )}
            </div>

            {/* Session Indicator / Logout */}
            {session.isAuthenticated && (
              <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 truncate max-w-[120px]">
                  {session.user?.name || 'Authorized'}
                </span>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Settings Trigger */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all border border-slate-200 shadow-xs cursor-pointer"
              title="Voice AI & Telephony Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Responsive Mobile / Medium Navigation Row */}
        <div className="xl:hidden flex items-center overflow-x-auto py-2 gap-1.5 scrollbar-none border-t border-slate-200">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
              activeTab === 'landing' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('caller')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
              activeTab === 'caller' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voice Caller
          </button>
          <button
            onClick={() => setActiveTab('handoff')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold flex items-center gap-1 cursor-pointer ${
              activeTab === 'handoff' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Counselor Desk {pendingHandoffCount > 0 && `(${pendingHandoffCount})`}
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
              activeTab === 'knowledge' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
              activeTab === 'crm' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Students CRM
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
              activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Telephony Logs
          </button>
          <button
            onClick={() => setActiveTab('bca_docs')}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold text-blue-600 cursor-pointer ${
              activeTab === 'bca_docs' ? 'bg-blue-50 text-blue-700' : 'hover:text-blue-800'
            }`}
          >
            University Docs
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold text-slate-900 cursor-pointer ${
                activeTab === 'admin_dashboard' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
              }`}
            >
              National Directorate
            </button>
          )}
          {!session.isAuthenticated && (
            <>
              <button
                onClick={() => setActiveTab('admin_login')}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
                  activeTab === 'admin_login' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Login
              </button>
              <button
                onClick={() => setActiveTab('college_login')}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
                  activeTab === 'college_login' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                College Login
              </button>
              <button
                onClick={() => setActiveTab('college_register')}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold cursor-pointer ${
                  activeTab === 'college_register' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                Subscribe College
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
