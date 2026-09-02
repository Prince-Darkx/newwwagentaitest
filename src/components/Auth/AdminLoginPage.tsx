import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  PhoneCall, 
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Shield,
  Activity,
  Cpu,
  Globe,
  Radio,
  FileCheck,
  Server
} from 'lucide-react';
import { loginAdmin } from '../../utils/api.js';
import { UserSession } from '../../types.js';

interface AdminLoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onNavigateToCollegeLogin: () => void;
  onNavigateToCollegeRegister: () => void;
  onNavigateToStudentMode: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateToCollegeLogin,
  onNavigateToCollegeRegister,
  onNavigateToStudentMode
}) => {
  const [email, setEmail] = useState('admin@eduvoice.ac.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaSimulated, setIsMfaSimulated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        setIsMfaSimulated(true);
        setTimeout(() => {
          onLoginSuccess({
            isAuthenticated: true,
            role: 'super_admin',
            user: res.user
          });
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please check security keys.');
      setIsLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@eduvoice.ac.in');
    setPassword('admin123');
    setError(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-4xl mx-auto my-6"
    >
      {/* Government Security Ribbon */}
      <div className="mb-4 bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                National Higher Education Digital Telephony Network
              </span>
              <span className="px-2 py-0.2 text-[9px] font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30 uppercase">
                Gov-Gov Gateway
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Department of Higher Education • Central Telephony Command & Institute Verification System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Clearance: Level-4 Super Admin
          </span>
        </div>
      </div>

      {/* Main Split Grid Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: National Telephony Telemetry Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Graphic Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
                Live Node Supervision
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                National Telephony Gateway
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Supervise AI voice nodes, verify accredited universities, and review real-time telephony throughput across national higher educational institutes.
              </p>
            </div>

            {/* Live Telemetry Chips */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Gateway Uptime</div>
                    <div className="text-xs font-bold text-white">99.98% Continuous</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  OPTIMAL
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Accreditation Protocols</div>
                    <div className="text-xs font-bold text-white">AISHE & UGC Compliant</div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Active SIP Trunks</div>
                    <div className="text-xs font-bold text-white">1,480 Concurrent Channels</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Security: 256-Bit TLS</span>
            <span>Ref: GOV-TEL-2026</span>
          </div>
        </div>

        {/* Right Side: Security Authentication Form */}
        <div className="lg:col-span-7 p-7 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Authorized Personnel Authentication
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Super Administrator Sign-In</h2>
            <p className="text-xs text-slate-500">
              Provide government clearance email credentials to access the master institutional supervisor console.
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
                <span className="font-semibold block">Authentication Rejection:</span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {isMfaSimulated && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity Verified. Initializing Super Admin Secure Session...</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Official Administrator Email</span>
                <span className="text-[10px] text-slate-400 font-mono">domain: eduvoice.ac.in</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@eduvoice.ac.in"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Passkey / Security Password</span>
                <span className="text-[10px] text-slate-400 font-mono">Encrypted Hash</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="admin-password-input"
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
              id="admin-login-submit-btn"
              type="submit"
              disabled={isLoading || isMfaSimulated}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {isLoading || isMfaSimulated ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Level-4 Clearance...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Launch Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                Project Evaluation Credentials
              </span>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded text-[11px] font-bold transition-colors cursor-pointer"
              >
                1-Click Autofill
              </button>
            </div>
            <div className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded border border-slate-200 flex items-center justify-between">
              <span>admin@eduvoice.ac.in</span>
              <span className="text-slate-400">Pass: admin123</span>
            </div>
          </div>

          {/* Cross-Portal Switcher Links */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              onClick={onNavigateToCollegeLogin}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>College Portal Login</span>
            </button>

            <button
              onClick={onNavigateToCollegeRegister}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Register New Institute
            </button>

            <button
              onClick={onNavigateToStudentMode}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              <span>Voice Caller Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
