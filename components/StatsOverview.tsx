'use client';

import React from 'react';
import { StudentRecord } from '@/lib/types';
import { Users, HeartPulse, Award, BookOpen, Eye, ShieldAlert } from 'lucide-react';

interface StatsOverviewProps {
  students: StudentRecord[];
}

export function StatsOverview({ students }: StatsOverviewProps) {
  const total = students.length;
  const femaleCount = students.filter(
    (s) => s.gender === 'ស្រី' || s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'f'
  ).length;
  const femalePct = total > 0 ? Math.round((femaleCount / total) * 100) : 0;

  const equityCount = students.filter(
    (s) => s.equityCard === 'មាន' || s.isPoorFamily === 'មាន' || (s.equityCard && s.equityCard !== 'គ្មាន' && s.equityCard !== '')
  ).length;

  const healthCheckedCount = students.filter(
    (s) => (s.weightS1 || s.heightS1 || s.eyeResult || s.earResult)
  ).length;

  const readingSupportCount = students.filter((s) => s.supportReading === 'មាន' || s.bookKhmer === 'មាន').length;
  const vaccinatedCount = students.filter((s) => s.vaccineList && s.vaccineList.trim().length > 0).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {/* Total Students */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide">សិស្សសរុប</span>
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500 font-medium">នាក់</span>
        </div>
      </div>

      {/* Female Proportion */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide">សិស្សស្រី</span>
          <div className="p-1.5 bg-pink-50 text-pink-600 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900">{femaleCount}</span>
          <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md">
            {femalePct}%
          </span>
        </div>
      </div>

      {/* Equity & IDPoor */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide">បណ្ណសមធម៌ / ក្រីក្រ</span>
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{equityCount}</span>
          <span className="text-xs text-slate-500 font-medium">គ្រួសារ</span>
        </div>
      </div>

      {/* Health Examined */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide">ពិនិត្យសុខភាព</span>
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{healthCheckedCount}</span>
          <span className="text-xs text-slate-500 font-medium">នាក់</span>
        </div>
      </div>

      {/* Vaccinations Recorded */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide">បានចាក់វ៉ាក់សាំង</span>
          <div className="p-1.5 bg-cyan-50 text-cyan-600 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{vaccinatedCount}</span>
          <span className="text-xs text-slate-500 font-medium">នាក់</span>
        </div>
      </div>

      {/* Support Reading Packages */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-[11px] font-semibold tracking-wide">កញ្ចប់សម្ភារជំនួយ</span>
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{readingSupportCount}</span>
          <span className="text-xs text-slate-500 font-medium">ទទួល</span>
        </div>
      </div>
    </div>
  );
}
