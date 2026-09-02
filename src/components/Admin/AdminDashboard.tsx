import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  PhoneCall, 
  ExternalLink, 
  Users, 
  Layers, 
  Activity, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Download,
  CreditCard,
  PlusCircle,
  Zap,
  Radio,
  Server,
  ShieldAlert,
  Award,
  Eye,
  X,
  Check,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { CollegeAccount, SubscriptionTier, BillingCycle } from '../../types.js';
import { 
  fetchColleges, 
  updateCollegeStatus, 
  approveCollegeSubscription, 
  refillCollegeCredits, 
  impersonateCollege 
} from '../../utils/api.js';

interface AdminDashboardProps {
  onSwitchToCollege: (college: CollegeAccount) => void;
  onNavigateToCaller: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSwitchToCollege,
  onNavigateToCaller
}) => {
  const [colleges, setColleges] = useState<CollegeAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Pending_Approval' | 'Suspended'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'Starter' | 'Pro' | 'Enterprise'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [inspectCollege, setInspectCollege] = useState<CollegeAccount | null>(null);
  const [refillModalCollege, setRefillModalCollege] = useState<CollegeAccount | null>(null);
  const [refillAmount, setRefillAmount] = useState<number>(5000);
  const [refillNote, setRefillNote] = useState<string>('Monthly operational quota top-up');
  const [approveModalCollege, setApproveModalCollege] = useState<CollegeAccount | null>(null);
  const [approveTier, setApproveTier] = useState<SubscriptionTier>('Pro');
  const [approveCycle, setApproveCycle] = useState<BillingCycle>('monthly');
  const [approveCredits, setApproveCredits] = useState<number>(10000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadColleges = async () => {
    setIsLoading(true);
    try {
      const data = await fetchColleges();
      if (data) setColleges(data);
    } catch (e) {
      console.error('Failed to fetch colleges:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (id: string, newStatus: 'Active' | 'Pending_Approval' | 'Suspended') => {
    try {
      await updateCollegeStatus(id, newStatus);
      setColleges(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      if (inspectCollege && inspectCollege.id === id) {
        setInspectCollege(prev => prev ? { ...prev, status: newStatus } : null);
      }
      triggerToast(`Institution status updated to ${newStatus.replace('_', ' ')}`);
    } catch (e) {
      console.error('Failed to update college status:', e);
    }
  };

  const handleDirectAccess = async (college: CollegeAccount) => {
    try {
      const res = await impersonateCollege(college.id);
      if (res.success && res.college) {
        triggerToast(`Opening direct Admin Access for ${college.collegeName}...`);
        setTimeout(() => {
          onSwitchToCollege(res.college);
        }, 400);
      }
    } catch (e) {
      // Fallback
      onSwitchToCollege(college);
    }
  };

  const handleApproveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveModalCollege) return;
    try {
      const res = await approveCollegeSubscription(
        approveModalCollege.id,
        approveTier,
        approveCycle,
        approveCredits
      );
      if (res.success && res.college) {
        setColleges(prev => prev.map(c => c.id === res.college.id ? res.college : c));
        triggerToast(`Approved ${res.college.collegeName}! Allocated ${approveCredits.toLocaleString()} monthly voice credits.`);
        setApproveModalCollege(null);
      }
    } catch (err: any) {
      triggerToast(err.message || 'Failed to approve subscription');
    }
  };

  const handleRefillCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillModalCollege) return;
    try {
      const res = await refillCollegeCredits(refillModalCollege.id, refillAmount, refillNote);
      if (res.success && res.college) {
        setColleges(prev => prev.map(c => c.id === res.college.id ? res.college : c));
        triggerToast(`Added ${refillAmount.toLocaleString()} voice credits to ${res.college.collegeName}`);
        setRefillModalCollege(null);
      }
    } catch (err: any) {
      triggerToast(err.message || 'Credit refill failed');
    }
  };

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "College ID,College Name,Code,Tier,Billing,Remaining Credits,Monthly Allowance,Email,Phone,City,Status\n"
      + colleges.map(c => `"${c.id}","${c.collegeName}","${c.collegeCode}","${c.subscriptionTier || 'Pro'}","${c.billingCycle || 'monthly'}",${c.creditsRemaining || 0},${c.monthlyCreditAllowance || 10000},"${c.email}","${c.phone}","${c.city}","${c.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduVoice_Subscription_Audit_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Subscription & Telephony audit exported successfully");
  };

  // Filtered colleges
  const filteredColleges = colleges.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesTier = tierFilter === 'all' || (c.subscriptionTier || 'Pro') === tierFilter;
    const matchesSearch = !searchQuery || 
      c.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.collegeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesTier && matchesSearch;
  });

  const totalColleges = colleges.length;
  const activeColleges = colleges.filter(c => c.status === 'Active').length;
  const pendingCollegesList = colleges.filter(c => c.status === 'Pending_Approval');
  const pendingColleges = pendingCollegesList.length;
  const totalCreditsRemaining = colleges.reduce((sum, c) => sum + (c.creditsRemaining || 0), 0);
  const totalNetworkCalls = colleges.reduce((sum, c) => sum + (c.totalCallsCount || 0), 0) + 148;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Directorate Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Super Admin Master Directorate & Subscription Hub
              </h2>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-400/30 uppercase">
                Master Full Authority
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage all institutions across engineering, management, computer applications, commerce & law • Approve plans, refill voice credits, and access any college directly
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportReport}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Subscriptions CSV</span>
          </button>

          <button
            onClick={loadColleges}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Refresh All Colleges"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onNavigateToCaller}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Master Voice Studio</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Registered Colleges</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{totalColleges}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{activeColleges} Active Subscriptions</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">{pendingColleges} Pending Approval</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Pool Voice Credits</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{totalCreditsRemaining.toLocaleString()} mins</div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Real-Time Deduction Active</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Network Telephony Minutes</span>
            <PhoneCall className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{totalNetworkCalls.toLocaleString()} calls</div>
          <div className="text-[11px] text-slate-500">
            94.2% AI First-Contact Resolution
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Universal Stream Coverage</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 tracking-tight">All Streams</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Eng, IT, Mgmt, Health, Law, Com</span>
          </div>
        </motion.div>
      </div>

      {/* PENDING APPROVAL QUEUE (Highlight if colleges are waiting) */}
      {pendingCollegesList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  {pendingCollegesList.length} Institutional Registration{pendingCollegesList.length > 1 ? 's' : ''} Awaiting Admin Approval
                </h3>
                <p className="text-xs text-amber-700">
                  Colleges submitted subscription requests and require your approval to allocate monthly voice credits.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-amber-200/60 text-amber-800 rounded-lg">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingCollegesList.map((col) => (
              <div key={col.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-3">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{col.collegeName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{col.collegeCode} • {col.city}, {col.state}</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Requested Plan:</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                      {col.subscriptionTier || 'Pro'} ({col.billingCycle || 'monthly'})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Credits Request:</span>
                    <span className="font-semibold text-slate-800">{(col.monthlyCreditAllowance || 10000).toLocaleString()} mins/mo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="text-slate-700 truncate max-w-[150px]">{col.contactPerson}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setApproveModalCollege(col);
                      setApproveTier(col.subscriptionTier || 'Pro');
                      setApproveCycle(col.billingCycle || 'monthly');
                      setApproveCredits(col.monthlyCreditAllowance || 10000);
                    }}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Allot Credits</span>
                  </button>
                  <button
                    onClick={() => setInspectCollege(col)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                    title="View Registration Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* College Registry Directory Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Institutional Subscriptions, Telephony Credits & Direct Access</h3>
            <p className="text-xs text-slate-500">
              Complete administrative authority over all universities, monthly telephony credits, and 1-click direct portal entry.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, code, city..."
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-8 pr-3 py-1.5 text-xs w-44 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
            >
              <option value="all">All Plans</option>
              <option value="Starter">Starter ($149/mo)</option>
              <option value="Pro">Pro ($399/mo)</option>
              <option value="Enterprise">Enterprise ($899/mo)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Active">Active Subscriptions</option>
              <option value="Pending_Approval">Pending Review</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table of Colleges */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">College & Code</th>
                <th className="py-3 px-3">Subscription Plan</th>
                <th className="py-3 px-3">Voice Credit Balance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Master Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading University Directory & Subscription Ledgers...
                  </td>
                </tr>
              ) : filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    No higher education institutions match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredColleges.map((college) => {
                  const rem = college.creditsRemaining || 0;
                  const allowance = college.monthlyCreditAllowance || 10000;
                  const pct = Math.min(100, Math.round((rem / (allowance || 1)) * 100));

                  return (
                    <tr key={college.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{college.collegeName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                            {college.collegeCode}
                          </span>
                          <span className="text-[11px] text-slate-400">{college.city}, {college.state}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">
                            {college.subscriptionTier || 'Pro'}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.2 bg-slate-100 rounded">
                            {college.billingCycle || 'monthly'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Renews: {college.subscriptionRenewsAt ? new Date(college.subscriptionRenewsAt).toLocaleDateString() : 'Active'}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1 min-w-[140px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">{rem.toLocaleString()} mins</span>
                            <span className="text-slate-400 text-[10px]">/ {allowance.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {college.status === 'Active' && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active Plan
                          </span>
                        )}
                        {college.status === 'Pending_Approval' && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending Review
                          </span>
                        )}
                        {college.status === 'Suspended' && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 rounded-full border border-rose-200 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            Suspended
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Refill Credits Button */}
                          <button
                            onClick={() => {
                              setRefillModalCollege(college);
                              setRefillAmount(5000);
                            }}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Refill Voice Telephony Credits"
                          >
                            <PlusCircle className="w-3 h-3 text-amber-600" />
                            <span>Refill Credits</span>
                          </button>

                          {/* Approval / Status actions */}
                          {college.status === 'Pending_Approval' ? (
                            <button
                              onClick={() => {
                                setApproveModalCollege(college);
                                setApproveTier(college.subscriptionTier || 'Pro');
                                setApproveCycle(college.billingCycle || 'monthly');
                                setApproveCredits(college.monthlyCreditAllowance || 10000);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => setInspectCollege(college)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Inspect Institution"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          )}

                          {/* 1-Click DIRECT ACCESS BUTTON (Key Feature: Admin directly accesses added college) */}
                          <button
                            onClick={() => handleDirectAccess(college)}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                            title="Access this college's portal directly as Super Admin"
                          >
                            <span>Access Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* REFILL CREDITS MODAL */}
      <AnimatePresence>
        {refillModalCollege && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Refill Voice Telephony Credits</span>
                </div>
                <button
                  onClick={() => setRefillModalCollege(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRefillCredits} className="p-6 space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{refillModalCollege.collegeName}</h4>
                  <p className="text-slate-500 text-[11px]">Current Balance: {(refillModalCollege.creditsRemaining || 0).toLocaleString()} / {(refillModalCollege.monthlyCreditAllowance || 10000).toLocaleString()} mins</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Select Credit Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRefillAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          refillAmount === amt 
                            ? 'bg-blue-50 border-blue-600 text-blue-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        +{amt.toLocaleString()} mins
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={refillAmount}
                    onChange={(e) => setRefillAmount(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    placeholder="Custom credit amount"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Administrative Reason / Note</label>
                  <input
                    type="text"
                    value={refillNote}
                    onChange={(e) => setRefillNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    placeholder="e.g. Monthly top-up / Exam counseling bonus"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRefillModalCollege(null)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Authorize +{refillAmount.toLocaleString()} Credits</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPROVE SUBSCRIPTION MODAL */}
      <AnimatePresence>
        {approveModalCollege && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Approve Institutional Subscription</span>
                </div>
                <button
                  onClick={() => setApproveModalCollege(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApproveCollege} className="p-6 space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{approveModalCollege.collegeName}</h4>
                  <p className="text-slate-500 text-[11px]">Institute Code: {approveModalCollege.collegeCode} • Email: {approveModalCollege.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Subscription Tier</label>
                    <select
                      value={approveTier}
                      onChange={(e) => {
                        const t = e.target.value as SubscriptionTier;
                        setApproveTier(t);
                        setApproveCredits(t === 'Starter' ? 2500 : t === 'Pro' ? 10000 : 35000);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="Starter">Starter ($149/mo - 2,500 mins)</option>
                      <option value="Pro">Pro ($399/mo - 10,000 mins)</option>
                      <option value="Enterprise">Enterprise ($899/mo - 35,000 mins)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Billing Cycle</label>
                    <select
                      value={approveCycle}
                      onChange={(e) => setApproveCycle(e.target.value as BillingCycle)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="monthly">Monthly Billing</option>
                      <option value="yearly">Yearly Billing (20% Savings)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Initial Voice Telephony Credits Allotment</label>
                  <input
                    type="number"
                    value={approveCredits}
                    onChange={(e) => setApproveCredits(Math.max(500, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    College will receive these minutes immediately. Each call duration is deducted automatically in real-time.
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApproveModalCollege(null)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize & Activate College</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Institution Compliance Inspector Modal */}
      <AnimatePresence>
        {inspectCollege && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Institution Compliance & Subscription Dossier</span>
                </div>
                <button
                  onClick={() => setInspectCollege(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{inspectCollege.collegeName}</h4>
                  <p className="text-slate-500 font-mono text-[11px]">Institute Code: {inspectCollege.collegeCode} • ID: {inspectCollege.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Plan Tier</span>
                    <span className="font-semibold text-blue-700">{inspectCollege.subscriptionTier || 'Pro'} ({inspectCollege.billingCycle || 'monthly'})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Credits Remaining</span>
                    <span className="font-mono font-semibold text-slate-800">{(inspectCollege.creditsRemaining || 0).toLocaleString()} mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Helpline Phone</span>
                    <span className="font-mono font-semibold text-slate-800">{inspectCollege.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nodal Officer</span>
                    <span className="font-semibold text-slate-800">{inspectCollege.contactPerson} ({inspectCollege.contactDesignation})</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Approved Academic Departments</span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectCollege.departments?.map((dept, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-[10px] font-semibold">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold text-slate-900">{inspectCollege.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleDirectAccess(inspectCollege);
                        setInspectCollege(null);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Direct Access College Desk</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
