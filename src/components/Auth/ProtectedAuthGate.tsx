import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Lock,
  Building2,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  KeyRound,
  FileCheck2,
  Users,
  Headphones,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface ProtectedAuthGateProps {
  moduleName: string;
  moduleType: 'counselor' | 'crm' | 'analytics' | 'knowledge' | 'admin';
  onNavigateToCollegeLogin: () => void;
  onNavigateToAdminLogin: () => void;
  onNavigateToPublicCaller: () => void;
}

export const ProtectedAuthGate: React.FC<ProtectedAuthGateProps> = ({
  moduleName,
  moduleType,
  onNavigateToCollegeLogin,
  onNavigateToAdminLogin,
  onNavigateToPublicCaller
}) => {
  const getModuleMeta = () => {
    switch (moduleType) {
      case 'counselor':
        return {
          icon: Headphones,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          title: 'Human Counselor Escalation Queue',
          description: 'Contains active student tickets, live emotion telemetry scores, transcript escalations, and counselor assignments protected by institutional privacy standards.'
        };
      case 'crm':
        return {
          icon: Users,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          title: 'Student Admissions Directory (CRM)',
          description: 'Contains personally identifiable information (PII) including applicant contact details, high school grade percentiles, fee status, and private counselor interview notes.'
        };
      case 'analytics':
        return {
          icon: BarChart3,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          title: 'Telephony Audit Logs & Analytics',
          description: 'Contains full-length audio call records, verbatim conversation transcripts, student phone numbers, sentiment traces, and institutional audit trails.'
        };
      case 'knowledge':
        return {
          icon: BookOpen,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          title: 'Institutional Knowledge Base Engine',
          description: 'Restricted to verified faculty and admissions officers for modifying official program cutoffs, tuition fee charts, and admission policies.'
        };
      default:
        return {
          icon: ShieldAlert,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Institutional Protected Section',
          description: 'Restricted by Role-Based Access Control (RBAC) to protect sensitive institutional records and student privacy.'
        };
    }
  };

  const meta = getModuleMeta();
  const IconComponent = meta.icon;

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
      >
        {/* Top Warning Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl ${meta.bgColor} ${meta.borderColor} border flex items-center justify-center ${meta.color} shadow-sm shrink-0`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Authentication Required
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    RBAC Level: Tier-2 Protected
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                  {meta.title}
                </h1>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-300 font-mono flex items-center gap-1.5 shrink-0">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>FERPA / UGC Shield</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold">Student Data Privacy Protection Active</p>
              <p className="text-amber-800/90 leading-relaxed">
                {meta.description} To prevent unauthorized exposure of student phone numbers, transcripts, or academic dossiers, this view is restricted to authenticated college counselors and super administrators.
              </p>
            </div>
          </div>

          {/* Action Choice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: College Login */}
            <div className="p-5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-2xl transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  College Admissions Staff
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Log in with your institution credentials (e.g. Apex, IIT Bombay, SPPU) to manage student CRM, claim priority tickets, and configure knowledge bases.
                </p>
              </div>

              <button
                onClick={onNavigateToCollegeLogin}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
              >
                <span>College Counselor Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Card 2: Super Admin Login */}
            <div className="p-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-2xl transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  National Directorate
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Super Admin portal for higher education officers to oversee multi-tenant university nodes, credit allocations, and system telemetry.
                </p>
              </div>

              <button
                onClick={onNavigateToAdminLogin}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer mt-2"
              >
                <span>Super Admin Login</span>
                <KeyRound className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Fallback to Public Voice Studio */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Are you a student or applicant trying to ask admission questions?</span>
            <button
              onClick={onNavigateToPublicCaller}
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Launch Public Voice Studio</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
