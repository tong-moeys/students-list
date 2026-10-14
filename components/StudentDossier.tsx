'use client';

import React from 'react';
import { StudentRecord } from '@/lib/types';
import {
  X,
  Printer,
  HeartPulse,
  Eye,
  Ear,
  ShieldAlert,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  User,
  GraduationCap,
} from 'lucide-react';

interface StudentDossierProps {
  student: StudentRecord | null;
  onClose: () => void;
  onEdit: (student: StudentRecord) => void;
}

function calculateBmi(weightStr?: string, heightStr?: string) {
  if (!weightStr || !heightStr) return null;
  const weight = parseFloat(weightStr);
  const height = parseFloat(heightStr) / 100; // convert cm to m
  if (isNaN(weight) || isNaN(height) || height <= 0) return null;
  const bmi = weight / (height * height);
  let status = 'ធម្មតា (Normal)';
  let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (bmi < 16) {
    status = 'ស្គមខ្លាំង (Severe Thinness)';
    color = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (bmi < 18.5) {
    status = 'ស្គម (Underweight)';
    color = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi >= 25) {
    status = 'លើសទម្ងន់ (Overweight)';
    color = 'text-rose-700 bg-rose-50 border-rose-200';
  }
  return { bmi: bmi.toFixed(1), status, color };
}

export function StudentDossier({ student, onClose, onEdit }: StudentDossierProps) {
  if (!student) return null;

  const bmiS1 = calculateBmi(student.weightS1, student.heightS1);
  const bmiS2 = calculateBmi(student.weightS2, student.heightS2);

  const vaccines = student.vaccineList
    ? student.vaccineList.split(',').map((v) => v.trim()).filter(Boolean)
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="font-bold text-slate-800 text-sm">
              បណ្ណព័ត៌មាននិងសុខភាពសិស្ស (Student Health Passport)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>
            <button
              onClick={() => onEdit(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <span>កែប្រែ</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Student Dossier Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-6">
          {/* Student Profile Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-white border border-indigo-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {student.firstName ? student.firstName.charAt(0) : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {student.lastName} {student.firstName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {student.gender}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 mt-1 text-xs">
                  <span>អត្តលេខ: <strong className="text-slate-800">{student.studentCode}</strong></span>
                  <span>ថ្ងៃកំណើត: {student.dob || '-'}</span>
                  <span>សញ្ជាតិ: {student.nationality || 'ខ្មែរ'}</span>
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-indigo-100 sm:pl-4">
              <div className="text-xs font-medium text-slate-500">ឆ្នាំសិក្សា & ថ្នាក់</div>
              <div className="text-sm font-bold text-indigo-900">{student.academicYear || '2025-2026'}</div>
              <div className="text-xs text-slate-600">{student.previousGrade || '-'}</div>
            </div>
          </div>

          {/* Health & Growth Metrics Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 text-indigo-700">
              <HeartPulse className="w-4 h-4" />
              ស្ថានភាពលូតលាស់ & សន្ទស្សន៍ម៉ាសរាងកាយ (Growth & BMI)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Semester 1 */}
              <div className="p-3.5 rounded-lg bg-teal-50/60 border border-teal-200">
                <div className="font-bold text-teal-900 mb-2 flex items-center justify-between">
                  <span>ឆមាសទី១ (Semester 1)</span>
                  {bmiS1 && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bmiS1.color}`}>
                      {bmiS1.status}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-md border border-teal-100">
                    <div className="text-[10px] text-slate-400">ទម្ងន់</div>
                    <div className="font-bold text-slate-800 text-sm">{student.weightS1 ? `${student.weightS1} kg` : '-'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-md border border-teal-100">
                    <div className="text-[10px] text-slate-400">កម្ពស់</div>
                    <div className="font-bold text-slate-800 text-sm">{student.heightS1 ? `${student.heightS1} cm` : '-'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-md border border-teal-100">
                    <div className="text-[10px] text-slate-400">BMI</div>
                    <div className="font-bold text-teal-700 text-sm">{bmiS1 ? bmiS1.bmi : '-'}</div>
                  </div>
                </div>
              </div>

              {/* Semester 2 */}
              <div className="p-3.5 rounded-lg bg-teal-50/60 border border-teal-200">
                <div className="font-bold text-teal-900 mb-2 flex items-center justify-between">
                  <span>ឆមាសទី២ (Semester 2)</span>
                  {bmiS2 && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bmiS2.color}`}>
                      {bmiS2.status}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-md border border-teal-100">
                    <div className="text-[10px] text-slate-400">ទម្ងន់</div>
                    <div className="font-bold text-slate-800 text-sm">{student.weightS2 ? `${student.weightS2} kg` : '-'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-md border border-teal-100">
                    <div className="text-[10px] text-slate-400">កម្ពស់</div>
                    <div className="font-bold text-slate-800 text-sm">{student.heightS2 ? `${student.heightS2} cm` : '-'}</div>
                  </div>
                  <div className="bg-white p-2 rounded-md border border-teal-100">
                    <div className="text-[10px] text-slate-400">BMI</div>
                    <div className="font-bold text-teal-700 text-sm">{bmiS2 ? bmiS2.bmi : '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sensory Screening: Vision & Hearing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Eye Examination */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
              <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5 text-sky-700">
                <Eye className="w-4 h-4" />
                ការពិនិត្យគំហើញ (Eye Examination)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">គំហើញ (ឆ្វេង / ស្ដាំ / ទាំងពីរ):</span>
                  <span className="font-bold text-slate-800">
                    {student.eyeLeft || '-'} / {student.eyeRight || '-'} / {student.eyeBoth || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">លទ្ធផល:</span>
                  <span className={`font-semibold ${student.eyeResult === 'ធម្មតា' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {student.eyeResult || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">ឧបករណ៍ជំនួយ (Glasses):</span>
                  <span className="font-medium text-slate-800">{student.eyeDevice || 'គ្មាន'}</span>
                </div>
                {student.eyePrescription && (
                  <div className="py-1">
                    <span className="text-slate-500 block">វេជ្ជបញ្ជា:</span>
                    <span className="font-medium text-slate-800">{student.eyePrescription}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ear Examination */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
              <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5 text-sky-700">
                <Ear className="w-4 h-4" />
                ការពិនិត្យការស្តាប់ (Hearing Examination)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">កម្រិតស្តាប់ (ឆ្វេង / ស្ដាំ / ទាំងពីរ):</span>
                  <span className="font-bold text-slate-800">
                    {student.earLeft || '-'} / {student.earRight || '-'} / {student.earBoth || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">លទ្ធផល:</span>
                  <span className={`font-semibold ${student.earResult === 'ធម្មតា' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {student.earResult || '-'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">ឧបករណ៍ជំនួយ:</span>
                  <span className="font-medium text-slate-800">{student.earDevice || 'គ្មាន'}</span>
                </div>
                {student.earPrescription && (
                  <div className="py-1">
                    <span className="text-slate-500 block">វេជ្ជបញ្ជា:</span>
                    <span className="font-medium text-slate-800">{student.earPrescription}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vaccination Badges */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5 text-violet-700">
              <ShieldAlert className="w-4 h-4" />
              ប្រវត្តិវ៉ាក់សាំង (Vaccination History)
            </h4>
            {vaccines.length === 0 ? (
              <p className="text-slate-400 italic">មិនទាន់មានកត់ត្រាវ៉ាក់សាំងទេ</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {vaccines.map((v, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg text-xs font-semibold"
                  >
                    ✓ {v}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Support Packages & Equity Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
              <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5 text-amber-700">
                <Award className="w-4 h-4" />
                សមធម៌ & ភាពងាយរងគ្រោះ
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">បណ្ណសមធម៌:</span>
                  <span className="font-semibold text-slate-800">{student.equityCard || 'គ្មាន'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">ស្ថានភាពគ្រួសារក្រីក្រ:</span>
                  <span className="font-semibold text-slate-800">{student.isPoorFamily || 'គ្មាន'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">ជនជាតិភាគតិច:</span>
                  <span className="font-medium text-slate-800">{student.ethnicMinority || 'មិនមាន'}</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
              <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5 text-emerald-700">
                <BookOpen className="w-4 h-4" />
                កញ្ចប់សម្ភារជំនួយ & សៀវភៅ
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">កញ្ចប់អំណាន:</span>
                  <span className="font-semibold text-emerald-700">{student.supportReading || 'មិនមាន'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">កញ្ចប់គណិត:</span>
                  <span className="font-semibold text-emerald-700">{student.supportMath || 'មិនមាន'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">សៀវភៅភាសាខ្មែរ / គណិត:</span>
                  <span className="font-semibold text-emerald-700">
                    {student.bookKhmer || '-'} / {student.bookMath || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Family & Guardian Contacts */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
            <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5 text-indigo-700">
              <User className="w-4 h-4" />
              ព័ត៌មានអាណាព្យាបាល & ទំនាក់ទំនង
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Father */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">ឪពុក (Father)</div>
                <div className="font-bold text-slate-800">
                  {student.fatherLastName || student.fatherFirstName
                    ? `${student.fatherLastName || ''} ${student.fatherFirstName || ''}`
                    : 'មិនបានបញ្ជាក់'}
                </div>
                <div className="text-slate-500 mt-1">{student.fatherOccupation || '-'}</div>
                {student.fatherPhone && (
                  <a
                    href={`tel:${student.fatherPhone}`}
                    className="inline-flex items-center gap-1 text-indigo-600 font-mono mt-1 hover:underline"
                  >
                    <Phone className="w-3 h-3" /> {student.fatherPhone}
                  </a>
                )}
              </div>

              {/* Mother */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">ម្ដាយ (Mother)</div>
                <div className="font-bold text-slate-800">
                  {student.motherLastName || student.motherFirstName
                    ? `${student.motherLastName || ''} ${student.motherFirstName || ''}`
                    : 'មិនបានបញ្ជាក់'}
                </div>
                <div className="text-slate-500 mt-1">{student.motherOccupation || '-'}</div>
                {student.motherPhone && (
                  <a
                    href={`tel:${student.motherPhone}`}
                    className="inline-flex items-center gap-1 text-indigo-600 font-mono mt-1 hover:underline"
                  >
                    <Phone className="w-3 h-3" /> {student.motherPhone}
                  </a>
                )}
              </div>

              {/* Guardian */}
              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
                <div className="text-[10px] text-indigo-600 font-semibold mb-1">
                  អាណាព្យាបាល ({student.guardianType || 'សាច់ញាតិ'})
                </div>
                <div className="font-bold text-slate-900">
                  {student.guardianLastName} {student.guardianFirstName} ({student.guardianGender || '-'})
                </div>
                <div className="text-slate-600 mt-1">{student.guardianOccupation || '-'}</div>
                {student.guardianPhone && (
                  <a
                    href={`tel:${student.guardianPhone}`}
                    className="inline-flex items-center gap-1 text-indigo-700 font-mono mt-1 font-bold hover:underline"
                  >
                    <Phone className="w-3 h-3" /> {student.guardianPhone}
                  </a>
                )}
                {student.guardianAddress && (
                  <div className="text-[10px] text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span>{student.guardianAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="text-[11px] text-slate-400">
            កាលបរិច្ឆេទបង្កើត: {student.createdAt ? new Date(student.createdAt).toLocaleDateString('km-KH') : '-'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
}
