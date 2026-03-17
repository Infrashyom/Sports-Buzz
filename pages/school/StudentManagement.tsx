import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { MOCK_STUDENTS } from '../../services/mockData';
import { Search, Plus, User, Ban, Edit2, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Student } from '../../types';
import toast from 'react-hot-toast';
import api from '../../services/api';

// Mock config from Admin (flexible grades)
const ALLOWED_GRADES = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

export const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [banId, setBanId] = useState<string | null>(null);
  const [selectedStudentForBan, setSelectedStudentForBan] = useState<Student | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Student> & { password?: string }>({
      name: '',
      studentId: '',
      grade: '9th',
      gender: 'Male',
      dob: '',
      sports: [] as string[],
      password: ''
  });
  
  const [sportInput, setSportInput] = useState('Cricket');

  // Filter logic
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = student.name.toLowerCase().includes(term) || 
                          student.studentId.toLowerCase().includes(term);
    const matchesSport = filterSport === 'All' || student.sports.includes(filterSport);
    return matchesSearch && matchesSport;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddSport = () => {
      const currentSports = formData.sports || [];
      if (!currentSports.includes(sportInput)) {
          setFormData({ ...formData, sports: [...currentSports, sportInput] });
      }
  };

  const handleRemoveSport = (sport: string) => {
      const currentSports = formData.sports || [];
      setFormData({ ...formData, sports: currentSports.filter(s => s !== sport) });
  };

  const openAddModal = () => {
      setModalMode('ADD');
      setFormData({ name: '', studentId: '', grade: '9th', gender: 'Male', dob: '', sports: [], password: '' });
      setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
      setModalMode('EDIT');
      setFormData({ ...student, password: '' });
      setIsModalOpen(true);
  };

  const handleSubmit = async () => {
      if (!formData.name || !formData.studentId || !formData.dob || (modalMode === 'ADD' && !formData.password)) {
          toast.error("Please fill all mandatory fields.");
          return;
      }

      if (modalMode === 'ADD') {
        try {
            await api.post('/auth/register', {
                name: formData.name,
                email: `${formData.studentId}@springfield.edu`, // Mock email for student
                password: formData.password,
                role: 'STUDENT'
            });

            const student: Student = {
                id: `new${Date.now()}`,
                name: formData.name!,
                studentId: formData.studentId!,
                grade: formData.grade!,
                dob: formData.dob!,
                gender: formData.gender as 'Male' | 'Female' | 'Other',
                schoolId: 's1',
                sports: formData.sports!,
                status: 'Active'
            };
            setStudents([student, ...students]);
            toast.success("Athlete registered successfully. Credentials sent to email.");
            setIsModalOpen(false);
        } catch {
            // Fallback for demo
            const student: Student = {
                id: `new${Date.now()}`,
                name: formData.name!,
                studentId: formData.studentId!,
                grade: formData.grade!,
                dob: formData.dob!,
                gender: formData.gender as 'Male' | 'Female' | 'Other',
                schoolId: 's1',
                sports: formData.sports!,
                status: 'Active'
            };
            setStudents([student, ...students]);
            toast.success("Athlete registered locally (Demo mode).");
            setIsModalOpen(false);
        }
      } else {
        // Edit Mode
        setStudents(students.map(s => s.id === formData.id ? { ...s, ...formData } as Student : s));
        toast.success("Athlete details updated.");
        setIsModalOpen(false);
      }
  };

  const initiateBan = (student: Student) => {
      setSelectedStudentForBan(student);
      setBanId(student.id);
  }

  const handleToggleBan = () => {
    if (banId) {
        setStudents(students.map(s => {
            if (s.id === banId) {
                // Toggle between Active and Suspended (using 'Injured' or adding a new status in real app)
                const newStatus = s.status === 'Active' ? 'Injured' : 'Active';
                toast.success(`Athlete status changed to ${newStatus}.`);
                return { ...s, status: newStatus }; 
            }
            return s;
        }));
        setBanId(null);
        setSelectedStudentForBan(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Athletes</h1>
          <p className="text-slate-500">Manage rosters, medical status, and profiles.</p>
        </div>
        <Button className="flex items-center" onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" /> Add Athlete
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by name or Student ID..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 outline-none font-medium"
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
          >
            <option value="All">All Sports</option>
            <option value="Basketball">Basketball</option>
            <option value="Cricket">Cricket</option>
            <option value="Badminton">Badminton</option>
          </select>
        </div>
      </Card>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Athlete</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID & Grade</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sports</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                        {student.avatar ? (
                            <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={student.avatar} alt="" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-500" />
                            </div>
                        )}
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.gender} • {new Date(student.dob).getFullYear() ? new Date().getFullYear() - new Date(student.dob).getFullYear() : 'N/A'} yrs</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 font-mono font-medium">{student.studentId}</div>
                    <div className="text-xs text-slate-500">{student.grade} Grade</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                        {student.sports.map((sport, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
                            {sport}
                        </span>
                        ))}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {student.status === 'Active' ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-700 border border-green-200">
                        Active
                        </span>
                    ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                        Banned
                        </span>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                            <button 
                                onClick={() => openEditModal(student)}
                                className="text-slate-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                title="Edit Details"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => initiateBan(student)}
                                className={`p-1 rounded-full transition-colors ${
                                    student.status === 'Active' 
                                    ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' 
                                    : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                                }`}
                                title={student.status === 'Active' ? "Ban Student" : "Unban Student"}
                            >
                                {student.status === 'Active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-900">{Math.min(indexOfLastItem, filteredStudents.length)}</span> of {filteredStudents.length} athletes
            </span>
            <div className="flex space-x-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No students found matching your filters.
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'ADD' ? "Register New Athlete" : "Edit Athlete Details"}
      >
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">School ID <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                        value={formData.studentId}
                        onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                    <select 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value as Student['gender']})}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Grade / Class <span className="text-red-500">*</span></label>
                    <select 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    >
                        {ALLOWED_GRADES.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                        ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">Available grades are configured by the Tournament Admin.</p>
                </div>
                {modalMode === 'ADD' && (
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password <span className="text-red-500">*</span></label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 focus:bg-white outline-none transition-colors"
                            placeholder="Set initial password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                )}
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sports Played</label>
                <div className="flex gap-2 mb-2">
                    <select 
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900"
                        value={sportInput}
                        onChange={(e) => setSportInput(e.target.value)}
                    >
                        <option value="Cricket">Cricket</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Football">Football</option>
                        <option value="Tennis">Tennis</option>
                    </select>
                    <Button onClick={handleAddSport} size="sm" type="button"><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.sports?.map(s => (
                        <span key={s} className="inline-flex items-center px-2 py-1 rounded bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                            {s} <button onClick={() => handleRemoveSport(s)} className="ml-1 text-slate-400 hover:text-red-500">&times;</button>
                        </span>
                    ))}
                    {(!formData.sports || formData.sports.length === 0) && <span className="text-xs text-slate-400 italic">No sports selected</span>}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={!formData.name || !formData.studentId || !formData.dob}>
                    {modalMode === 'ADD' ? 'Register' : 'Save Changes'}
                </Button>
            </div>
        </div>
      </Modal>

      <ConfirmationModal 
        isOpen={!!banId}
        onClose={() => setBanId(null)}
        onConfirm={handleToggleBan}
        title={selectedStudentForBan?.status === 'Active' ? "Ban Student" : "Unban Student"}
        message={selectedStudentForBan?.status === 'Active' 
            ? "Are you sure you want to ban this student? They will not be able to participate in matches until unbanned."
            : "Are you sure you want to reactivate this student account?"}
        confirmLabel={selectedStudentForBan?.status === 'Active' ? "Ban Athlete" : "Reactivate"}
        variant={selectedStudentForBan?.status === 'Active' ? "danger" : "primary"}
      />
    </DashboardLayout>
  );
};