'use client';

import React, { useState, useMemo } from 'react';
import { StudentRecord } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  FileText,
  UserCheck,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface StudentTableProps {
  students: StudentRecord[];
  onSelectStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (studentId: string, studentName: string) => void;
}

export function StudentTable({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [equityFilter, setEquityFilter] = useState('ALL');
  const [academicYearFilter, setAcademicYearFilter] = useState('ALL');

  // Academic years present in data
  const availableYears = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.academicYear) set.add(s.academicYear);
    });
    return Array.from(set);
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          s.studentCode.toLowerCase().includes(query) ||
          s.lastName.toLowerCase().includes(query) ||
          s.firstName.toLowerCase().includes(query) ||
          `${s.lastName} ${s.firstName}`.toLowerCase().includes(query) ||
          (s.phone && s.phone.includes(query)) ||
          (s.curProvince && s.curProvince.toLowerCase().includes(query)) ||
          (s.pobProvince && s.pobProvince.toLowerCase().includes(query)) ||
          (s.previousGrade && s.previousGrade.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Gender filter
      if (genderFilter !== 'ALL') {
        if (genderFilter === 'ស្រី' && !(s.gender === 'ស្រី' || s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'f')) {
          return false;
        }
        if (genderFilter === 'ប្រុស' && !(s.gender === 'ប្រុស' || s.gender?.toLowerCase() === 'male' || s.gender?.toLowerCase() === 'm')) {
          return false;
        }
      }

      // Equity filter
      if (equityFilter === 'EQUITY_ONLY') {
        const hasEquity = s.equityCard === 'មាន' || s.isPoorFamily === 'មាន' || (s.equityCard && s.equityCard !== 'គ្មាន' && s.equityCard !== '');
        if (!hasEquity) return false;
      }

      // Academic Year filter
      if (academicYearFilter !== 'ALL' && s.academicYear !== academicYearFilter) {
        return false;
      }

      return true;
    });
  }, [students, searchTerm, genderFilter, equityFilter, academicYearFilter]);

  const canModify = (student: StudentRecord) => {
    if (!user) return false;
    if (isAdmin) return true;
    return student.authorId === user.uid;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar & Search */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាម អត្តលេខ, គោត្តនាម-នាម, លេខទូរស័ព្ទ, ខេត្ត..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Gender */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400 text-[11px]">ភេទ:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">ទាំងអស់</option>
              <option value="ស្រី">ស្រី (Female)</option>
              <option value="ប្រុស">ប្រុស (Male)</option>
            </select>
          </div>

          {/* Equity */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400 text-[11px]">សមធម៌:</span>
            <select
              value={equityFilter}
              onChange={(e) => setEquityFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">ទាំងអស់</option>
              <option value="EQUITY_ONLY">មានបណ្ណសមធម៌ / ក្រីក្រ</option>
            </select>
          </div>

          {/* Academic Year */}
          {availableYears.length > 0 && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
              <span className="text-slate-400 text-[11px]">ឆ្នាំសិក្សា:</span>
              <select
                value={academicYearFilter}
                onChange={(e) => setAcademicYearFilter(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">ទាំងអស់</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-[11px] text-slate-500 font-medium pl-1">
            បង្ហាញ: <strong className="text-slate-800">{filteredStudents.length}</strong> / {students.length}
          </div>
        </div>
      </div>

      {/* Main Multi-tiered Scrollable Khmer Standard Table */}
      <div className="khmer-table-container overflow-x-auto overflow-y-auto max-h-[68vh] border-b border-slate-200 relative">
        <table className="w-full border-collapse text-[11px] whitespace-nowrap text-slate-700">
          {/* Multi-tier Header */}
          <thead className="sticky top-0 z-20 bg-slate-100 text-slate-800 font-semibold select-none shadow-xs">
            {/* Tier 1 Header */}
            <tr className="bg-slate-200/90 text-slate-900 border-b border-slate-300">
              <th colSpan={7} className="border-r border-slate-300 px-3 py-1.5 text-center bg-blue-50/90 text-blue-900 font-bold">
                ព័ត៌មានសិស្ស
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-indigo-50/90 text-indigo-900 font-bold">
                ទីកន្លែងកំណើត
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-slate-100 text-slate-800 font-bold">
                អាសយដ្ឋានបច្ចុប្បន្ន
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-amber-50/90 text-amber-900 font-bold">
                ព័ត៌មានសិក្សា
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-emerald-50/90 text-emerald-900 font-bold">
                កញ្ចប់សម្ភារជំនួយ
              </th>
              <th colSpan={2} className="border-r border-slate-300 px-3 py-1.5 text-center bg-yellow-50/90 text-yellow-900 font-bold">
                សមធម៌
              </th>
              <th colSpan={2} className="border-r border-slate-300 px-3 py-1.5 text-center bg-slate-100 text-slate-800 font-bold">
                ព័ត៌មានបន្ថែមសិស្ស
              </th>
              <th colSpan={2} className="border-r border-slate-300 px-3 py-1.5 text-center bg-teal-50/90 text-teal-900 font-bold">
                ទម្ងន់/កម្ពស់ ឆមាស១
              </th>
              <th colSpan={2} className="border-r border-slate-300 px-3 py-1.5 text-center bg-teal-50/90 text-teal-900 font-bold">
                ទម្ងន់/កម្ពស់ ឆមាស២
              </th>
              <th colSpan={6} className="border-r border-slate-300 px-3 py-1.5 text-center bg-sky-50/90 text-sky-900 font-bold">
                ភ្នែក (Eye)
              </th>
              <th colSpan={6} className="border-r border-slate-300 px-3 py-1.5 text-center bg-sky-50/90 text-sky-900 font-bold">
                ត្រចៀក (Ear)
              </th>
              <th className="border-r border-slate-300 px-3 py-1.5 text-center bg-violet-50/90 text-violet-900 font-bold">
                វ៉ាក់សាំង
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-slate-100 text-slate-800 font-bold">
                ព័ត៌មានឪពុក
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-slate-100 text-slate-800 font-bold">
                អាសយដ្ឋានឪពុក
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-slate-100 text-slate-800 font-bold">
                ព័ត៌មានម្ដាយ
              </th>
              <th colSpan={4} className="border-r border-slate-300 px-3 py-1.5 text-center bg-slate-100 text-slate-800 font-bold">
                អាសយដ្ឋានម្ដាយ
              </th>
              <th colSpan={7} className="border-r border-slate-300 px-3 py-1.5 text-center bg-rose-50/90 text-rose-900 font-bold">
                អាណាព្យាបាល
              </th>
              <th className="px-3 py-1.5 text-center bg-slate-200 text-slate-800 font-bold sticky right-0 z-30">
                សកម្មភាព
              </th>
            </tr>

            {/* Tier 2 Sub-headers */}
            <tr className="border-b border-slate-300 text-[10px] bg-slate-50">
              {/* Sticky Columns */}
              <th className="border-r border-slate-300 px-2 py-2 text-center sticky left-0 z-20 bg-slate-100 min-w-[55px] max-w-[55px] shadow-xs">
                អត្តលេខ
              </th>
              <th className="border-r border-slate-300 px-2 py-2 text-center sticky left-[55px] z-20 bg-slate-100 min-w-[70px] max-w-[70px] shadow-xs">
                គោត្តនាម *
              </th>
              <th className="border-r border-slate-300 px-2 py-2 text-center sticky left-[125px] z-20 bg-slate-100 min-w-[75px] max-w-[75px] shadow-xs">
                នាម *
              </th>

              {/* Rest of Student Info */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ភេទ *</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ថ្ងៃខែឆ្នាំកំណើត</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទូរស័ព្ទ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">សញ្ជាតិ</th>

              {/* Place of Birth */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ខេត្ត/ក្រុង</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ស្រុក/ខណ្ឌ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឃុំ/សង្កាត់</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ភូមិ</th>

              {/* Current Address */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ខេត្ត/ក្រុង</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ស្រុក/ខណ្ឌ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឃុំ/សង្កាត់</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ភូមិ</th>

              {/* Academic Info */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឆ្នាំសិក្សា</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ថ្នាក់ឆ្នាំមុន</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ថ្ងៃចុះឈ្មោះចូលរៀន</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ប្រភេទពិការភាព</th>

              {/* Support Package */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">កញ្ចប់អំណាន</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">កញ្ចប់គណិត</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">សៀវភៅជំនួយភាសាខ្មែរ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">សៀវភៅជំនួយគណិតវិទ្យា</th>

              {/* Equity */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">គ្រួសារក្រីក្រ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">បណ្ណសមធម៌</th>

              {/* Additional Student Info */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ជនជាតិភាគតិច</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">លក្ខណៈពិសេស</th>

              {/* Growth S1 */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទម្ងន់</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">កម្ពស់</th>

              {/* Growth S2 */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទម្ងន់</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">កម្ពស់</th>

              {/* Eye Examination */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឆ្វេង</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ស្ដាំ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទាំងពីរ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">លទ្ធផល</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">វេជ្ជបញ្ជា</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឧបករណ៍</th>

              {/* Ear Examination */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឆ្វេង</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ស្ដាំ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទាំងពីរ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">លទ្ធផល</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">វេជ្ជបញ្ជា</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឧបករណ៍</th>

              {/* Vaccine */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">បញ្ជី</th>

              {/* Father Info */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">គោត្តនាម</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">នាម</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទូរស័ព្ទ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">មុខរបរ</th>

              {/* Father Address */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ខេត្ត/ក្រុង</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ស្រុក/ខណ្ឌ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឃុំ/សង្កាត់</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ភូមិ</th>

              {/* Mother Info */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">គោត្តនាម</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">នាម</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទូរស័ព្ទ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">មុខរបរ</th>

              {/* Mother Address */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ខេត្ត/ក្រុង</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ស្រុក/ខណ្ឌ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ឃុំ/សង្កាត់</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ភូមិ</th>

              {/* Guardian Info */}
              <th className="border-r border-slate-300 px-2 py-2 text-center">ប្រភេទ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">គោត្តនាម</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">នាម</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ភេទ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">ទូរស័ព្ទ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">មុខរបរ</th>
              <th className="border-r border-slate-300 px-2 py-2 text-center">អាសយដ្ឋាន</th>

              {/* Actions Header */}
              <th className="px-2 py-2 text-center sticky right-0 z-20 bg-slate-100 shadow-xs">
                សកម្មភាព
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={70} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium">មិនមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ</p>
                    <span className="text-xs text-slate-400">សូមចុច &quot;+ បន្ថែមសិស្សថ្មី&quot; ដើម្បីបញ្ចូលព័ត៌មាន</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => {
                const isFemale =
                  student.gender === 'ស្រី' ||
                  student.gender?.toLowerCase() === 'female' ||
                  student.gender?.toLowerCase() === 'f';

                return (
                  <tr
                    key={student.id || idx}
                    className="hover:bg-indigo-50/40 transition-colors group"
                  >
                    {/* Sticky Column 1: អត្តលេខ */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center sticky left-0 z-10 bg-white group-hover:bg-indigo-50/70 font-semibold text-slate-800 min-w-[55px] max-w-[55px]">
                      {student.studentCode || '-'}
                    </td>

                    {/* Sticky Column 2: គោត្តនាម */}
                    <td className="border-r border-slate-200 px-2 py-2 text-left sticky left-[55px] z-10 bg-white group-hover:bg-indigo-50/70 font-medium text-slate-900 min-w-[70px] max-w-[70px]">
                      {student.lastName || '-'}
                    </td>

                    {/* Sticky Column 3: នាម */}
                    <td className="border-r border-slate-200 px-2 py-2 text-left sticky left-[125px] z-10 bg-white group-hover:bg-indigo-50/70 font-semibold text-slate-900 min-w-[75px] max-w-[75px]">
                      {student.firstName || '-'}
                    </td>

                    {/* Gender */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isFemale ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {student.gender || '-'}
                      </span>
                    </td>

                    {/* DOB */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.dob || '-'}</td>

                    {/* Phone */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-mono text-[10px]">
                      {student.phone || '-'}
                    </td>

                    {/* Nationality */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.nationality || '-'}</td>

                    {/* POB Province, District, Commune, Village */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.pobProvince || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.pobDistrict || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.pobCommune || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.pobVillage || '-'}</td>

                    {/* Current Address */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.curProvince || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.curDistrict || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.curCommune || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.curVillage || '-'}</td>

                    {/* Academic */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-mono">{student.academicYear || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.previousGrade || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.enrollmentDate || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.disabilityType || 'មិនមាន'}</td>

                    {/* Support Packages */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.supportReading === 'មាន' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {student.supportReading || 'មិនមាន'}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.supportMath === 'មាន' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {student.supportMath || 'មិនមាន'}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.bookKhmer === 'មាន' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {student.bookKhmer || 'មិនមាន'}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.bookMath === 'មាន' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {student.bookMath || 'មិនមាន'}
                      </span>
                    </td>

                    {/* Equity */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.isPoorFamily === 'មាន' ? 'text-amber-700 font-bold bg-amber-50 px-1 py-0.5 rounded' : 'text-slate-400'}>
                        {student.isPoorFamily || 'គ្មាន'}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.equityCard === 'មាន' ? 'text-amber-700 font-bold bg-amber-50 px-1 py-0.5 rounded' : 'text-slate-400'}>
                        {student.equityCard || 'គ្មាន'}
                      </span>
                    </td>

                    {/* Additional */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.ethnicMinority || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.specialCharacteristics || '-'}</td>

                    {/* S1 Health */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-medium">{student.weightS1 ? `${student.weightS1} kg` : '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-medium">{student.heightS1 ? `${student.heightS1} cm` : '-'}</td>

                    {/* S2 Health */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-medium">{student.weightS2 ? `${student.weightS2} kg` : '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-medium">{student.heightS2 ? `${student.heightS2} cm` : '-'}</td>

                    {/* Eye Examination */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.eyeLeft || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.eyeRight || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-bold text-slate-800">{student.eyeBoth || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.eyeResult === 'ធម្មតា' ? 'text-emerald-600' : student.eyeResult ? 'text-rose-600' : 'text-slate-400'}>
                        {student.eyeResult || '-'}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.eyePrescription || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.eyeDevice || 'គ្មាន'}</td>

                    {/* Ear Examination */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.earLeft || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.earRight || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-bold text-slate-800">{student.earBoth || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className={student.earResult === 'ធម្មតា' ? 'text-emerald-600' : student.earResult ? 'text-rose-600' : 'text-slate-400'}>
                        {student.earResult || '-'}
                      </span>
                    </td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.earPrescription || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center text-slate-500">{student.earDevice || 'គ្មាន'}</td>

                    {/* Vaccines */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">
                      <span className="inline-block max-w-[140px] truncate font-medium text-slate-700" title={student.vaccineList}>
                        {student.vaccineList || '-'}
                      </span>
                    </td>

                    {/* Father Info */}
                    <td className="border-r border-slate-200 px-2 py-2 text-left">{student.fatherLastName || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-left">{student.fatherFirstName || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-mono text-[10px]">{student.fatherPhone || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.fatherOccupation || '-'}</td>

                    {/* Father Address */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.fatherProvince || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.fatherDistrict || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.fatherCommune || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.fatherVillage || '-'}</td>

                    {/* Mother Info */}
                    <td className="border-r border-slate-200 px-2 py-2 text-left">{student.motherLastName || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-left">{student.motherFirstName || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-mono text-[10px]">{student.motherPhone || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.motherOccupation || '-'}</td>

                    {/* Mother Address */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.motherProvince || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.motherDistrict || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.motherCommune || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.motherVillage || '-'}</td>

                    {/* Guardian Info */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-semibold text-slate-800">{student.guardianType || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-left">{student.guardianLastName || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-left">{student.guardianFirstName || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.guardianGender || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center font-mono text-[10px]">{student.guardianPhone || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-center">{student.guardianOccupation || '-'}</td>
                    <td className="border-r border-slate-200 px-2 py-2 text-left max-w-[200px] truncate" title={student.guardianAddress}>
                      {student.guardianAddress || '-'}
                    </td>

                    {/* Action buttons */}
                    <td className="px-2 py-2 text-center sticky right-0 z-10 bg-white group-hover:bg-indigo-50/70 shadow-xs">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="p-1 rounded text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                          title="មើលព័ត៌មានលម្អិត & សៀវភៅសុខភាព (Health Passport)"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {canModify(student) && (
                          <>
                            <button
                              onClick={() => onEditStudent(student)}
                              className="p-1 rounded text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
                              title="កែប្រែព័ត៌មាន (Edit)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (student.id) {
                                  onDeleteStudent(student.id, `${student.lastName} ${student.firstName}`);
                                }
                              }}
                              className="p-1 rounded text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="លុបសិស្ស (Delete)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span>* ព័ត៌មានចាំបាច់ (Required fields)</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-600 font-medium">ចុចរូបភ្នែក <Eye className="w-3 h-3 inline" /> ដើម្បីមើលបណ្ណសុខភាពសិស្ស</span>
        </div>
        <div>
          <span>សរុបសិស្សក្នុងប្រព័ន្ធ: <strong className="text-slate-800">{students.length} នាក់</strong></span>
        </div>
      </div>
    </div>
  );
}
