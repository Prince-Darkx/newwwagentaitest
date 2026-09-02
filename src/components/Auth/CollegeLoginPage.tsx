import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  AlertCircle,
  KeyRound,
  GraduationCap,
  Award,
  Phone,
  CheckCircle2,
  ExternalLink,
  Layers,
  School
} from 'lucide-react';
import { loginCollege } from '../../utils/api.js';
import { UserSession } from '../../types.js';

interface CollegeLoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onNavigateToCollegeRegister: () => void;
  onNavigateToAdminLogin: () => void;
  onNavigateToStudentMode: () => void;
}

export const CollegeLoginPage: React.FC<CollegeLoginPageProps> = ({
  onLoginSuccess,
  onNavigateToCollegeRegister,
  onNavigateToAdminLogin,
  onNavigateToStudentMode
}) => {
  const [emailOrCode, setEmailOrCode] = useState('counselor@apex.edu');
  const [password, setPassword] = useState('apex123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginCollege(emailOrCode, password);
      if (res.success && res.user) {
        setIsSuccessAnim(true);
        setTimeout(() => {
          onLoginSuccess({
            isAuthenticated: true,
            role: 'college_admin',
            user: res.user
          });
        }, 700);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid college credentials. Please verify your institution code or email.');
      setIsLoading(false);
    }
  };

  const handleDemoFillApex = () => {
    setEmailOrCode('counselor@apex.edu');
    setPassword('apex123');
    setError(null);
  };

  const handleDemoFillMetro = () => {
    setEmailOrCode('MIST-109');
    setPassword('metro123');
    setError(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto my-6"
    >
      {/* Official Institutional Banner */}
      <div className="mb-4 bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <School className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                Autonomous Institutes & University Gateway
              </span>
              <span className="px-2 py-0.2 text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                AISHE Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              National AI Telephony Integration • Admissions Counselor Desk & Student Voice IVR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">AISHE Institutional Node:</span>
          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            ONLINE
          </span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: College Portal Features Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-6 text-white flex flex-col justify-between relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                <Award className="w-3 h-3 text-blue-400" />
                Institutional Console
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                College & University Desk
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Log into your autonomous institution to update admissions knowledge items, supervise AI caller logs, and handle student human-counselor escalations in real time.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">AI Voice Caller Agent</div>
                    <div className="text-[10px] text-blue-200">24/7 Automated Admissions IVR</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  Ready
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-300" />
                  <div>
                    <div className="text-xs font-bold text-white">Admissions Knowledge Base</div>
                    <div className="text-[10px] text-blue-200">BCA, MCA, B.Tech Fees & Syllabus</div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-blue-300" />
                  <div>
                    <div className="text-xs font-bold text-white">Live Counselor Handoff Desk</div>
                    <div className="text-[10px] text-blue-200">Priority Student Ticket Queue</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 text-[11px] text-blue-200/70 flex items-center justify-between">
            <span>UGC & NAAC Aligned</span>
            <span>AISHE Telephony Gateway</span>
          </div>
        </div>

        {/* Right Side: Institution Login Form */}
        <div className="lg:col-span-7 p-7 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Institutional Sign-In
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">College Admissions Portal</h2>
            <p className="text-xs text-slate-500">
              Access your college's dedicated AI telephony engine using your official institutional email or college code.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-semibold block">Authentication Error:</span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {isSuccessAnim && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>College verified! Loading your admissions workspace...</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>College Email or Unique Institute Code</span>
                <span className="text-[10px] text-slate-400 font-mono">e.g. AIHT-2026</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="college-login-identifier-input"
                  type="text"
                  required
                  value={emailOrCode}
                  onChange={(e) => setEmailOrCode(e.target.value)}
                  placeholder="counselor@apex.edu or AIHT-2026"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Account Password</span>
                <span className="text-[10px] text-slate-400 font-mono">Institutional Auth</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="college-login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              id="college-login-submit-btn"
              type="submit"
              disabled={isLoading || isSuccessAnim}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {isLoading || isSuccessAnim ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting to Institutional Node...
                </span>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  <span>Access College Admissions Console</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-filled Credentials */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Sample Institutional Accounts
              </span>
              <span className="text-[10px] text-slate-500">1-Click Test</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoFillApex}
                className="p-2.5 bg-white hover:bg-blue-50/70 border border-slate-200 rounded-lg text-left text-xs transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-900 group-hover:text-blue-700">Apex Institute</div>
                <div className="text-slate-500 font-mono text-[10px]">counselor@apex.edu</div>
              </button>
              <button
                type="button"
                onClick={handleDemoFillMetro}
                className="p-2.5 bg-white hover:bg-blue-50/70 border border-slate-200 rounded-lg text-left text-xs transition-all cursor-pointer group"
              >
                <div className="font-bold text-slate-900 group-hover:text-blue-700">Metropolitan Inst.</div>
                <div className="text-slate-500 font-mono text-[10px]">Code: MIST-109</div>
              </button>
            </div>
          </div>

          {/* Cross Navigation Switchers */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>New Institution?</span>
              <button
                onClick={onNavigateToCollegeRegister}
                className="text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
              >
                Register Your College
              </button>
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <button
                onClick={onNavigateToAdminLogin}
                className="hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Super Admin</span>
              </button>
              <span>•</span>
              <button
                onClick={onNavigateToStudentMode}
                className="hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                <span>Voice Caller</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
