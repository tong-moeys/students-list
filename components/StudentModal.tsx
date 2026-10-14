'use client';

import React, { useState } from 'react';
import { StudentRecord } from '@/lib/types';
import {
  X,
  User,
  MapPin,
  GraduationCap,
  HeartPulse,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<StudentRecord>) => Promise<void>;
  studentToEdit?: StudentRecord | null;
}

const EMPTY_RECORD: Partial<StudentRecord> = {
  studentCode: '',
  lastName: '',
  firstName: '',
  gender: 'ស្រី',
  dob: '',
  phone: '',
  nationality: 'ខ្មែរ',

  pobProvince: 'បន្ទាយមានជ័យ',
  pobDistrict: '',
  pobCommune: '',
  pobVillage: '',

  curProvince: 'បន្ទាយមានជ័យ',
  curDistrict: '',
  curCommune: '',
  curVillage: '',

  academicYear: '2025-2026',
  previousGrade: 'ថ្នាក់ទី1A',
  enrollmentDate: new Date().toISOString().split('T')[0],
  disabilityType: 'មិនមាន',

  supportReading: 'មាន',
  supportMath: 'មាន',
  bookKhmer: 'មាន',
  bookMath: 'មាន',

  isPoorFamily: 'គ្មាន',
  equityCard: 'គ្មាន',
  ethnicMinority: '',
  specialCharacteristics: '',

  weightS1: '',
  heightS1: '',
  weightS2: '',
  heightS2: '',

  eyeLeft: '10/10',
  eyeRight: '10/10',
  eyeBoth: '10/10',
  eyeResult: 'ធម្មតា',
  eyePrescription: '',
  eyeDevice: 'គ្មាន',

  earLeft: '20',
  earRight: '20',
  earBoth: '20',
  earResult: 'ធម្មតា',
  earPrescription: '',
  earDevice: 'គ្មាន',

  vaccineList: 'Hepatitis B, Measles, BCG',

  fatherLastName: '',
  fatherFirstName: '',
  fatherPhone: '',
  fatherOccupation: '',
  fatherProvince: '',
  fatherDistrict: '',
  fatherCommune: '',
  fatherVillage: '',

  motherLastName: '',
  motherFirstName: '',
  motherPhone: '',
  motherOccupation: '',
  motherProvince: '',
  motherDistrict: '',
  motherCommune: '',
  motherVillage: '',

  guardianType: 'ឪពុក',
  guardianLastName: '',
  guardianFirstName: '',
  guardianGender: 'ប្រុស',
  guardianPhone: '',
  guardianOccupation: '',
  guardianAddress: '',
};

const COMMON_PROVINCES = [
  'បន្ទាយមានជ័យ',
  'បាត់ដំបង',
  'កំពង់ចាម',
  'កំពង់ឆ្នាំង',
  'កំពង់ស្ពឺ',
  'កំពង់ធំ',
  'កំពត',
  'កណ្ដាល',
  'កែប',
  'កោះកុង',
  'ក្រចេះ',
  'មណ្ឌលគិរី',
  'ឧត្ដរមានជ័យ',
  'ប៉ៃលិន',
  'ភ្នំពេញ',
  'ព្រះសីហនុ',
  'ព្រះវិហារ',
  'ពោធិ៍សាត់',
  'ព្រៃវែង',
  'រតនគិរី',
  'សៀមរាប',
  'ស្ទឹងត្រែង',
  'ស្វាយរៀង',
  'តាកែវ',
  'ត្បូងឃ្មុំ',
];

export function StudentModal({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}: StudentModalProps) {
  if (!isOpen) return null;

  return (
    <StudentModalDialog
      key={studentToEdit?.id || 'new'}
      onClose={onClose}
      onSave={onSave}
      studentToEdit={studentToEdit}
    />
  );
}

function StudentModalDialog({
  onClose,
  onSave,
  studentToEdit,
}: Omit<StudentModalProps, 'isOpen'>) {
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'academic' | 'health' | 'family'>('info');
  const [formData, setFormData] = useState<Partial<StudentRecord>>(() => {
    return studentToEdit || {
      ...EMPTY_RECORD,
      studentCode: String(Math.floor(100 + Math.random() * 900)),
    };
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: keyof StudentRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const copyPobToCurrent = () => {
    setFormData((prev) => ({
      ...prev,
      curProvince: prev.pobProvince,
      curDistrict: prev.pobDistrict,
      curCommune: prev.pobCommune,
      curVillage: prev.pobVillage,
    }));
  };

  const addVaccineChip = (vaccine: string) => {
    setFormData((prev) => {
      const current = prev.vaccineList ? prev.vaccineList.split(',').map((v) => v.trim()) : [];
      if (!current.includes(vaccine)) {
        current.push(vaccine);
      }
      return { ...prev, vaccineList: current.filter(Boolean).join(', ') };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.studentCode?.trim()) {
      setFormError('សូមបញ្ចូលអត្តលេខសិស្ស');
      setActiveTab('info');
      return;
    }
    if (!formData.lastName?.trim() || !formData.firstName?.trim()) {
      setFormError('សូមបញ្ចូលគោត្តនាម និងនាមសិស្ស');
      setActiveTab('info');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'បរាជ័យក្នុងការរក្សាទុកទិន្នន័យ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              {studentToEdit ? 'កែប្រែព័ត៌មានសិស្ស' : 'បន្ថែមសិស្សថ្មីចូលក្នុងប្រព័ន្ធ'}
            </h2>
            <p className="text-xs text-slate-500">
              {studentToEdit
                ? `អត្តលេខ: ${studentToEdit.studentCode} | ${studentToEdit.lastName} ${studentToEdit.firstName}`
                : 'ទិន្នន័យនឹងត្រូវរក្សាទុកក្នុង Firestore Database ភ្លាមៗ'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ព័ត៌មានសិស្ស</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'address'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>ទីកន្លែង & អាសយដ្ឋាន</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'academic'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>សិក្សា & សមធម៌</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'health'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>សុខភាព & វ៉ាក់សាំង</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'family'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ឪពុកម្ដាយ & អាណាព្យាបាល</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 text-xs">
          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              ⚠️ {formError}
            </div>
          )}

          {/* TAB 1: ព័ត៌មានសិស្ស */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  អត្តលេខសិស្ស (ID) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentCode || ''}
                  onChange={(e) => handleChange('studentCode', e.target.value)}
                  placeholder="ឧ. 123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  គោត្តនាម (Last Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="ឧ. កើន"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  នាម (First Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="ឧ. វីរៈនិច្ច"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ភេទ (Gender) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.gender || 'ស្រី'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="ស្រី">ស្រី (Female)</option>
                  <option value="ប្រុស">ប្រុស (Male)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ថ្ងៃខែឆ្នាំកំណើត (DOB)
                </label>
                <input
                  type="text"
                  value={formData.dob || ''}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  placeholder="ឧ. 19-03-2019"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">លេខទូរស័ព្ទ</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="ឧ. 012345678"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">សញ្ជាតិ</label>
                <input
                  type="text"
                  value={formData.nationality || 'ខ្មែរ'}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  placeholder="ឧ. ខ្មែរ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ទីកន្លែងកំណើត & អាសយដ្ឋាន */}
          {activeTab === 'address' && (
            <div className="space-y-5">
              {/* Place of Birth */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-3 text-xs flex items-center gap-1.5 text-indigo-700">
                  <MapPin className="w-3.5 h-3.5" /> ទីកន្លែងកំណើត (Place of Birth)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ខេត្ត/ក្រុង</label>
                    <input
                      type="text"
                      list="provinces-list"
                      value={formData.pobProvince || ''}
                      onChange={(e) => handleChange('pobProvince', e.target.value)}
                      placeholder="ឧ. បន្ទាយមានជ័យ"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ស្រុក/ខណ្ឌ</label>
                    <input
                      type="text"
                      value={formData.pobDistrict || ''}
                      onChange={(e) => handleChange('pobDistrict', e.target.value)}
                      placeholder="ឧ. ភ្នំស្រុក"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ឃុំ/សង្កាត់</label>
                    <input
                      type="text"
                      value={formData.pobCommune || ''}
                      onChange={(e) => handleChange('pobCommune', e.target.value)}
                      placeholder="ឧ. ស្ពានស្រែង"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ភូមិ</label>
                    <input
                      type="text"
                      value={formData.pobVillage || ''}
                      onChange={(e) => handleChange('pobVillage', e.target.value)}
                      placeholder="ឧ. មុខឈ្នាង"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Current Address */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 text-indigo-700">
                    <MapPin className="w-3.5 h-3.5" /> អាសយដ្ឋានបច្ចុប្បន្ន (Current Address)
                  </h3>
                  <button
                    type="button"
                    onClick={copyPobToCurrent}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    ដូចទីកន្លែងកំណើត
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ខេត្ត/ក្រុង</label>
                    <input
                      type="text"
                      list="provinces-list"
                      value={formData.curProvince || ''}
                      onChange={(e) => handleChange('curProvince', e.target.value)}
                      placeholder="ឧ. បន្ទាយមានជ័យ"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ស្រុក/ខណ្ឌ</label>
                    <input
                      type="text"
                      value={formData.curDistrict || ''}
                      onChange={(e) => handleChange('curDistrict', e.target.value)}
                      placeholder="ឧ. ភ្នំស្រុក"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ឃុំ/សង្កាត់</label>
                    <input
                      type="text"
                      value={formData.curCommune || ''}
                      onChange={(e) => handleChange('curCommune', e.target.value)}
                      placeholder="ឧ. ស្ពានស្រែង"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ភូមិ</label>
                    <input
                      type="text"
                      value={formData.curVillage || ''}
                      onChange={(e) => handleChange('curVillage', e.target.value)}
                      placeholder="ឧ. មុខឈ្នាង"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <datalist id="provinces-list">
                {COMMON_PROVINCES.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          )}

          {/* TAB 3: សិក្សា & សមធម៌ */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ឆ្នាំសិក្សា</label>
                  <input
                    type="text"
                    value={formData.academicYear || ''}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    placeholder="2025-2026"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ថ្នាក់ឆ្នាំមុន / បច្ចុប្បន្ន</label>
                  <input
                    type="text"
                    value={formData.previousGrade || ''}
                    onChange={(e) => handleChange('previousGrade', e.target.value)}
                    placeholder="ឧ. ថ្នាក់ទី2A"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ថ្ងៃចុះឈ្មោះចូលរៀន</label>
                  <input
                    type="text"
                    value={formData.enrollmentDate || ''}
                    onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                    placeholder="ឧ. 01-10-2025"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ប្រភេទពិការភាព</label>
                  <input
                    type="text"
                    value={formData.disabilityType || 'មិនមាន'}
                    onChange={(e) => handleChange('disabilityType', e.target.value)}
                    placeholder="មិនមាន"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Support Materials */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2.5">កញ្ចប់សម្ភារជំនួយ & សៀវភៅ</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">កញ្ចប់អំណាន</label>
                    <select
                      value={formData.supportReading || 'មាន'}
                      onChange={(e) => handleChange('supportReading', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="មាន">មាន</option>
                      <option value="មិនមាន">មិនមាន</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">កញ្ចប់គណិត</label>
                    <select
                      value={formData.supportMath || 'មាន'}
                      onChange={(e) => handleChange('supportMath', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="មាន">មាន</option>
                      <option value="មិនមាន">មិនមាន</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">សៀវភៅជំនួយភាសាខ្មែរ</label>
                    <select
                      value={formData.bookKhmer || 'មាន'}
                      onChange={(e) => handleChange('bookKhmer', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="មាន">មាន</option>
                      <option value="មិនមាន">មិនមាន</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">សៀវភៅជំនួយគណិតវិទ្យា</label>
                    <select
                      value={formData.bookMath || 'មាន'}
                      onChange={(e) => handleChange('bookMath', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="មាន">មាន</option>
                      <option value="មិនមាន">មិនមាន</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Equity & IDPoor */}
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-2.5">សមធម៌ & ភាពងាយរងគ្រោះ (Equity / IDPoor)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">គ្រួសារក្រីក្រ</label>
                    <select
                      value={formData.isPoorFamily || 'គ្មាន'}
                      onChange={(e) => handleChange('isPoorFamily', e.target.value)}
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                    >
                      <option value="គ្មាន">គ្មាន (No)</option>
                      <option value="មាន">មាន (Yes)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">បណ្ណសមធម៌ (Equity Card)</label>
                    <select
                      value={formData.equityCard || 'គ្មាន'}
                      onChange={(e) => handleChange('equityCard', e.target.value)}
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                    >
                      <option value="គ្មាន">គ្មាន (No)</option>
                      <option value="មាន">មាន (Yes)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ជនជាតិភាគតិច</label>
                    <input
                      type="text"
                      value={formData.ethnicMinority || ''}
                      onChange={(e) => handleChange('ethnicMinority', e.target.value)}
                      placeholder="ឧ. មិនមាន / ផ្សេងៗ"
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">លក្ខណៈពិសេស</label>
                    <input
                      type="text"
                      value={formData.specialCharacteristics || ''}
                      onChange={(e) => handleChange('specialCharacteristics', e.target.value)}
                      placeholder="ចំណាំបន្ថែម"
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: សុខភាព & វ៉ាក់សាំង */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              {/* Growth S1 & S2 */}
              <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-200">
                <h4 className="font-bold text-teal-900 mb-2.5">ការលូតលាស់ (ទម្ងន់ & កម្ពស់)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">ទម្ងន់ ឆមាស១ (kg)</label>
                    <input
                      type="text"
                      value={formData.weightS1 || ''}
                      onChange={(e) => handleChange('weightS1', e.target.value)}
                      placeholder="24.5"
                      className="w-full px-3 py-1.5 border border-teal-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">កម្ពស់ ឆមាស១ (cm)</label>
                    <input
                      type="text"
                      value={formData.heightS1 || ''}
                      onChange={(e) => handleChange('heightS1', e.target.value)}
                      placeholder="118"
                      className="w-full px-3 py-1.5 border border-teal-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ទម្ងន់ ឆមាស២ (kg)</label>
                    <input
                      type="text"
                      value={formData.weightS2 || ''}
                      onChange={(e) => handleChange('weightS2', e.target.value)}
                      placeholder="26"
                      className="w-full px-3 py-1.5 border border-teal-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">កម្ពស់ ឆមាស២ (cm)</label>
                    <input
                      type="text"
                      value={formData.heightS2 || ''}
                      onChange={(e) => handleChange('heightS2', e.target.value)}
                      placeholder="121"
                      className="w-full px-3 py-1.5 border border-teal-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Eye Health */}
              <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-200">
                <h4 className="font-bold text-sky-900 mb-2.5">ពិនិត្យភ្នែក (Vision / Eye Examination)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                  <div>
                    <label className="block text-slate-700 mb-1">ឆ្វេង</label>
                    <input
                      type="text"
                      value={formData.eyeLeft || '10/10'}
                      onChange={(e) => handleChange('eyeLeft', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ស្ដាំ</label>
                    <input
                      type="text"
                      value={formData.eyeRight || '10/10'}
                      onChange={(e) => handleChange('eyeRight', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ទាំងពីរ</label>
                    <input
                      type="text"
                      value={formData.eyeBoth || '10/10'}
                      onChange={(e) => handleChange('eyeBoth', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">លទ្ធផល</label>
                    <select
                      value={formData.eyeResult || 'ធម្មតា'}
                      onChange={(e) => handleChange('eyeResult', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white"
                    >
                      <option value="ធម្មតា">ធម្មតា</option>
                      <option value="មិនធម្មតា">មិនធម្មតា</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">វេជ្ជបញ្ជា</label>
                    <input
                      type="text"
                      value={formData.eyePrescription || ''}
                      onChange={(e) => handleChange('eyePrescription', e.target.value)}
                      placeholder="បើមាន"
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ឧបករណ៍</label>
                    <input
                      type="text"
                      value={formData.eyeDevice || 'គ្មាន'}
                      onChange={(e) => handleChange('eyeDevice', e.target.value)}
                      placeholder="វ៉ែនតា / គ្មាន"
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Ear Health */}
              <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-200">
                <h4 className="font-bold text-sky-900 mb-2.5">ពិនិត្យត្រចៀក (Hearing / Ear Examination)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                  <div>
                    <label className="block text-slate-700 mb-1">ឆ្វេង</label>
                    <input
                      type="text"
                      value={formData.earLeft || '20'}
                      onChange={(e) => handleChange('earLeft', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ស្ដាំ</label>
                    <input
                      type="text"
                      value={formData.earRight || '20'}
                      onChange={(e) => handleChange('earRight', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ទាំងពីរ</label>
                    <input
                      type="text"
                      value={formData.earBoth || '20'}
                      onChange={(e) => handleChange('earBoth', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">លទ្ធផល</label>
                    <select
                      value={formData.earResult || 'ធម្មតា'}
                      onChange={(e) => handleChange('earResult', e.target.value)}
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white"
                    >
                      <option value="ធម្មតា">ធម្មតា</option>
                      <option value="មិនធម្មតា">មិនធម្មតា</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">វេជ្ជបញ្ជា</label>
                    <input
                      type="text"
                      value={formData.earPrescription || ''}
                      onChange={(e) => handleChange('earPrescription', e.target.value)}
                      placeholder="បើមាន"
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ឧបករណ៍</label>
                    <input
                      type="text"
                      value={formData.earDevice || 'គ្មាន'}
                      onChange={(e) => handleChange('earDevice', e.target.value)}
                      placeholder="គ្មាន"
                      className="w-full px-2 py-1.5 border border-sky-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Vaccines */}
              <div className="bg-violet-50/50 p-3.5 rounded-xl border border-violet-200">
                <h4 className="font-bold text-violet-900 mb-2">បញ្ជីវ៉ាក់សាំង (Vaccination Records)</h4>
                <input
                  type="text"
                  value={formData.vaccineList || ''}
                  onChange={(e) => handleChange('vaccineList', e.target.value)}
                  placeholder="Hepatitis B, Measles, BCG, Polio..."
                  className="w-full px-3 py-2 border border-violet-300 rounded-lg bg-white mb-2"
                />
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-500 font-medium">ចុចជ្រើសរើសរហ័ស:</span>
                  {['Hepatitis B', 'Measles', 'BCG', 'Polio (OPV/IPV)', 'DTP-HepB-Hib', 'COVID-19', 'Tetanus', 'Japanese Encephalitis'].map(
                    (vac) => (
                      <button
                        key={vac}
                        type="button"
                        onClick={() => addVaccineChip(vac)}
                        className="px-2 py-0.5 rounded-md bg-violet-100 hover:bg-violet-200 text-violet-800 transition-colors cursor-pointer"
                      >
                        + {vac}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ឪពុកម្ដាយ & អាណាព្យាបាល */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              {/* Father */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2.5">ព័ត៌មានឪពុក</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">គោត្តនាម</label>
                    <input
                      type="text"
                      value={formData.fatherLastName || ''}
                      onChange={(e) => handleChange('fatherLastName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">នាម</label>
                    <input
                      type="text"
                      value={formData.fatherFirstName || ''}
                      onChange={(e) => handleChange('fatherFirstName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">ទូរស័ព្ទ</label>
                    <input
                      type="text"
                      value={formData.fatherPhone || ''}
                      onChange={(e) => handleChange('fatherPhone', e.target.value)}
                      placeholder="011222333"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">មុខរបរ</label>
                    <input
                      type="text"
                      value={formData.fatherOccupation || ''}
                      onChange={(e) => handleChange('fatherOccupation', e.target.value)}
                      placeholder="ឧ. កសិករ"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Mother */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2.5">ព័ត៌មានម្ដាយ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">គោត្តនាម</label>
                    <input
                      type="text"
                      value={formData.motherLastName || ''}
                      onChange={(e) => handleChange('motherLastName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">នាម</label>
                    <input
                      type="text"
                      value={formData.motherFirstName || ''}
                      onChange={(e) => handleChange('motherFirstName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">ទូរស័ព្ទ</label>
                    <input
                      type="text"
                      value={formData.motherPhone || ''}
                      onChange={(e) => handleChange('motherPhone', e.target.value)}
                      placeholder="012333444"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">មុខរបរ</label>
                    <input
                      type="text"
                      value={formData.motherOccupation || ''}
                      onChange={(e) => handleChange('motherOccupation', e.target.value)}
                      placeholder="ឧ. លក់ទំនិញ"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian */}
              <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200">
                <h4 className="font-bold text-rose-900 mb-2.5">អាណាព្យាបាល (Guardian)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-slate-700 mb-1">ប្រភេទ</label>
                    <select
                      value={formData.guardianType || 'សាច់ញាតិ'}
                      onChange={(e) => handleChange('guardianType', e.target.value)}
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white"
                    >
                      <option value="ឪពុក">ឪពុក</option>
                      <option value="ម្ដាយ">ម្ដាយ</option>
                      <option value="សាច់ញាតិ">សាច់ញាតិ (Relative)</option>
                      <option value="ផ្សេងៗ">ផ្សេងៗ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">គោត្តនាម</label>
                    <input
                      type="text"
                      value={formData.guardianLastName || ''}
                      onChange={(e) => handleChange('guardianLastName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">នាម</label>
                    <input
                      type="text"
                      value={formData.guardianFirstName || ''}
                      onChange={(e) => handleChange('guardianFirstName', e.target.value)}
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">ភេទ</label>
                    <select
                      value={formData.guardianGender || 'ស្រី'}
                      onChange={(e) => handleChange('guardianGender', e.target.value)}
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white"
                    >
                      <option value="ស្រី">ស្រី</option>
                      <option value="ប្រុស">ប្រុស</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">ទូរស័ព្ទ</label>
                    <input
                      type="text"
                      value={formData.guardianPhone || ''}
                      onChange={(e) => handleChange('guardianPhone', e.target.value)}
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">មុខរបរ</label>
                    <input
                      type="text"
                      value={formData.guardianOccupation || ''}
                      onChange={(e) => handleChange('guardianOccupation', e.target.value)}
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">អាសយដ្ឋាន</label>
                    <input
                      type="text"
                      value={formData.guardianAddress || ''}
                      onChange={(e) => handleChange('guardianAddress', e.target.value)}
                      placeholder="ខេត្ត, ស្រុក, ឃុំ, ភូមិ"
                      className="w-full px-3 py-1.5 border border-rose-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              បោះបង់ (Cancel)
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>កំពុងរក្សាទុក...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{studentToEdit ? 'រក្សាទុកការកែប្រែ' : 'បញ្ចូលសិស្សក្នុង Firestore'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
