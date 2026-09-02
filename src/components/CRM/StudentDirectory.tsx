import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  PhoneCall,
  Clock,
  ChevronRight,
  FileText,
  UserCheck,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { CallerProfile, ApplicationStatus, CallRecord } from '../../types.js';
import { createStudent, updateStudent } from '../../utils/api.js';

interface StudentDirectoryProps {
  students: CallerProfile[];
  calls: CallRecord[];
  onStudentsChange: (students: CallerProfile[]) => void;
  onLaunchOutboundCall: (student: CallerProfile) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students,
  calls,
  onStudentsChange,
  onLaunchOutboundCall
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<CallerProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'Student' as any,
    interestProgram: 'B.Tech Computer Science & AI',
    location: 'San Jose, CA',
    applicationStatus: 'New Inquiry' as ApplicationStatus,
    highSchoolScore: '92.5% PCM',
    notes: ''
  });

  const statuses: ApplicationStatus[] = [
    'New Inquiry',
    'Application Submitted',
    'Documents Pending',
    'Counseling Scheduled',
    'Fee Pending',
    'Admitted',
    'Scholarship Applied'
  ];

  const filteredStudents = students.filter(s => {
    if (statusFilter !== 'all' && s.applicationStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.interestProgram.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const created = await createStudent(formData);
    if (created) {
      onStudentsChange([created, ...students]);
      setShowAddModal(false);
    }
  };

  // Past calls for selected student
  const studentCalls = calls.filter(
    c => (c.callerId && c.callerId === selectedStudent?.id) || c.callerPhone === selectedStudent?.phone
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Student & Parent CRM Directory — Admissions Pipeline
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Pillar 5 Live
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage prospective applicants, track interaction histories, and launch 1-click AI outbound campaigns.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Student Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Leads ({students.length})
          </button>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, phone, program, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Students Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Student / Caller</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Interest Program</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Score / Merit</th>
                <th className="py-3 px-4">Calls Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    No student records match your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {student.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{student.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                        {student.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {student.interestProgram}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.applicationStatus === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        student.applicationStatus === 'Counseling Scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        student.applicationStatus === 'Fee Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {student.applicationStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">
                      {student.highSchoolScore || '—'}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {student.totalCallsCount || 0} calls
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLaunchOutboundCall(student);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        title="Start AI Outbound Call"
                      >
                        <Zap className="w-3 h-3" />
                        <span>AI Call</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedStudent.phone} • {selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Program</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{selectedStudent.interestProgram}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Status</span>
                <p className="font-bold text-blue-700 mt-0.5 truncate">{selectedStudent.applicationStatus}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Location</span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">{selectedStudent.location}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Merit Score</span>
                <p className="font-bold text-emerald-600 mt-0.5 truncate">{selectedStudent.highSchoolScore || 'N/A'}</p>
              </div>
            </div>

            {/* Counselor Notes */}
            {selectedStudent.notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admissions Notes</span>
                <p className="text-slate-700 leading-relaxed">{selectedStudent.notes}</p>
              </div>
            )}

            {/* Past Call History Stream */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                Past Telephony Records ({studentCalls.length})
              </span>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {studentCalls.length === 0 ? (
                  <p className="text-slate-400 text-xs py-4 text-center">No recorded calls yet for this student.</p>
                ) : (
                  studentCalls.map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{c.primaryIntent}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(c.startTime).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{c.summary}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => {
                  const s = selectedStudent;
                  setSelectedStudent(null);
                  onLaunchOutboundCall(s);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch AI Outbound Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Student Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Deshmukh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Applicant">Applicant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Interest Program</label>
                  <input
                    type="text"
                    placeholder="B.Tech CSE & AI"
                    value={formData.interestProgram}
                    onChange={(e) => setFormData({ ...formData, interestProgram: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Merit / 12th Score</label>
                  <input
                    type="text"
                    placeholder="94.2% PCM"
                    value={formData.highSchoolScore}
                    onChange={(e) => setFormData({ ...formData, highSchoolScore: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Initial Counselor Notes</label>
                <textarea
                  rows={2}
                  placeholder="Inquired about scholarship and hostel dining accommodations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
