'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  GraduationCap,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  Download,
  Printer,
  Sparkles,
  CloudCheck,
} from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
  totalStudents: number;
}

export function Header({
  onOpenAddModal,
  onExportCsv,
  onPrint,
  totalStudents,
}: HeaderProps) {
  const { user, profile, isAdmin, loginWithGoogle, logout, loading } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  ប្រព័ន្ធគ្រប់គ្រងព័ត៌មាន និងសុខភាពសិស្ស
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Cambodia Student Information & Health Management System (EMIS / MoEYS Standard)
              </p>
            </div>
          </div>

          {/* Actions & User State */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Action Buttons */}
            <button
              onClick={onPrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="បោះពុម្ពតារាងសិស្ស"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>បោះពុម្ព</span>
            </button>

            <button
              onClick={onExportCsv}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="ទាញយកជាឯកសារ Excel/CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenAddModal}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ បន្ថែមសិស្សថ្មី</span>
            </button>

            {/* User Profile / Auth Button */}
            <div className="border-l border-slate-200 pl-2.5 ml-1 flex items-center">
              {loading ? (
                <div className="w-24 h-8 bg-slate-100 animate-pulse rounded-lg" />
              ) : user ? (
                <div className="flex items-center gap-2.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </div>

                  <div className="hidden sm:block text-left text-xs">
                    <div className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      {isAdmin ? (
                        <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> អ្នកគ្រប់គ្រង
                        </span>
                      ) : (
                        <span className="text-indigo-600 font-medium flex items-center gap-0.5">
                          <UserCheck className="w-2.5 h-2.5" /> គ្រូបង្រៀន
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                    title="ចាកចេញ (Sign Out)"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>ចូលគណនី Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
