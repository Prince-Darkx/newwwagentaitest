import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Globe, 
  User, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  PhoneCall,
  Layers,
  Award,
  Radio,
  FileBadge,
  ArrowLeft,
  School,
  Check
} from 'lucide-react';
import { registerCollege } from '../../utils/api.js';
import { UserSession } from '../../types.js';

interface CollegeRegisterPageProps {
  onRegisterSuccess: (session: UserSession) => void;
  onNavigateToCollegeLogin: () => void;
  onNavigateToAdminLogin: () => void;
  onNavigateToStudentMode: () => void;
}

export const CollegeRegisterPage: React.FC<CollegeRegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToCollegeLogin,
  onNavigateToAdminLogin,
  onNavigateToStudentMode
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeCode: '',
    email: '',
    password: '',
    affiliation: 'AICTE Approved • UGC Autonomous Tier-1',
    phone: '',
    city: '',
    state: '',
    website: '',
    contactPerson: '',
    contactDesignation: 'Director of Admissions & Counseling',
    departments: 'BCA (Computer Applications), B.Tech CSE, MCA, MBA Fintech, B.Sc Data Science'
  });

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const deptArray = formData.departments
        .split(',')
        .map(d => d.trim())
        .filter(Boolean);

      const res = await registerCollege({
        ...formData,
        departments: deptArray
      });

      if (res.success && res.user) {
        setSuccessMsg('Accreditation approved! National Telephony Gateway allocated. Loading your institution portal...');
        setTimeout(() => {
          onRegisterSuccess({
            isAuthenticated: true,
            role: 'college_admin',
            user: res.user
          });
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'College registration failed. Please check institutional credentials.');
      setIsLoading(false);
    }
  };

  const handleSampleFill = () => {
    setFormData({
      collegeName: 'National Institute of Technology & Advanced Applications',
      collegeCode: 'NITAA-2026',
      email: 'admissions@nitaa.ac.in',
      password: 'college123',
      affiliation: 'NAAC A++ Grade • AICTE Approved Autonomous Institute',
      phone: '+1 (800) 777-NITAA',
      city: 'Austin',
      state: 'Texas',
      website: 'https://nitaa.ac.in',
      contactPerson: 'Prof. Dr. Siddharth Rao',
      contactDesignation: 'Dean of Academic Admissions & BCA Chair',
      departments: 'BCA (Artificial Intelligence & Cloud), MCA, B.Tech CSE, MBA Information Systems, B.Sc Cyber Security'
    });
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.collegeName || !formData.collegeCode || !formData.email || !formData.password) {
      setError('Please fill in the College Name, Code, Email, and Password to proceed.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phone) {
      setError('Helpline Phone / Toll-Free Number is required for SIP Voice Trunking.');
      return false;
    }
    setError(null);
    return true;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-3xl mx-auto my-6"
    >
      {/* Government Protocol Banner */}
      <div className="mb-4 bg-slate-900 text-white rounded-xl p-3.5 border border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <School className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                Autonomous Higher Education Telephony Gateway
              </span>
              <span className="px-2 py-0.2 text-[9px] font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                AISHE Accreditation
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Instant Provisioning of AI Voice Caller & Smart Counselor Desk for Higher Education
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSampleFill}
          className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>Autofill Sample Institute</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Registration Steps Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Institute Onboarding & Voice Trunking</h2>
              <p className="text-xs text-slate-500">
                Configure your institution profile, admissions knowledge base, and live counselor routing.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-mono">
              Step {currentStep} of 3
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, title: 'Accreditation & Auth' },
              { num: 2, title: 'Telephony & Location' },
              { num: 3, title: 'Programs & Counselor' }
            ].map((step) => {
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div 
                  key={step.num}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                    isCurrent 
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-xs' 
                      : isDone 
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-semibold' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 font-medium'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : isDone 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? <Check className="w-3 h-3" /> : step.num}
                  </div>
                  <span className="truncate hidden sm:inline">{step.title}</span>
                </div>
              );
            })}
          </div>
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
              <span className="font-bold block">Validation Alert:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <span className="font-bold block">Provisioning Complete:</span>
              <span>{successMsg}</span>
            </div>
          </motion.div>
        )}

        {/* Multi-Step Interactive Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {/* STEP 1: Institutional Accreditation & Credentials */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      College / Institute Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-college-name"
                      type="text"
                      required
                      value={formData.collegeName}
                      onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                      placeholder="e.g. Apex Institute of Higher Technology"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      College Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-college-code"
                      type="text"
                      required
                      value={formData.collegeCode}
                      onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. AIHT-2026"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Official Admissions Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-college-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admissions@college.edu"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Portal Security Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-college-password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create strong password"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Accreditation & Affiliation Details
                  </label>
                  <input
                    id="reg-college-affiliation"
                    type="text"
                    value={formData.affiliation}
                    onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                    placeholder="e.g. NAAC A++ • AICTE Approved • Autonomous"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Proceed to Telephony Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Telephony SIP Trunking & Campus Location */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Toll-Free / IVR Admissions Helpline <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-blue-600 font-mono">Assigned to AI Agent</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="reg-college-phone"
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (800) 555-0199"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Campus City</label>
                    <input
                      id="reg-college-city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Austin"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">State / Region</label>
                    <input
                      id="reg-college-state"
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Texas"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Official Website</label>
                    <input
                      id="reg-college-website"
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://college.edu"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <div>
                      <span className="font-bold text-slate-800">Telephony Channel Auto-Routing</span>
                      <p className="text-[10px] text-slate-500">Gemini Flash Voice AI will initialize on this line</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Ready</span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setCurrentStep(3);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Proceed to Counselor Lead</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Department Programs & Counselor Officer */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Lead Nodal Admissions Officer</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="reg-college-contact-person"
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        placeholder="e.g. Dr. Ramesh Kumar"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Officer Designation</label>
                    <input
                      id="reg-college-contact-designation"
                      type="text"
                      value={formData.contactDesignation}
                      onChange={(e) => setFormData({ ...formData, contactDesignation: e.target.value })}
                      placeholder="e.g. Head of Admissions & BCA Chair"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Institutional Academic Programs (BCA, MCA, Engineering, etc.)
                  </label>
                  <textarea
                    id="reg-college-departments"
                    rows={2}
                    value={formData.departments}
                    onChange={(e) => setFormData({ ...formData, departments: e.target.value })}
                    placeholder="BCA (Computer Applications), B.Tech CSE, MCA, MBA Fintech, B.Sc Data Science"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    The Voice AI caller matches student questions against these programs to answer queries dynamically.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    id="register-college-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Accrediting Institution...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize Institution & Launch Dashboard</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Footer Navigation */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-600">
            <span>Already registered with AISHE?</span>
            <button
              onClick={onNavigateToCollegeLogin}
              className="text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
            >
              College Login
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
              <span>Student Voice Caller</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
