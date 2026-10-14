'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogIn, ShieldCheck, Database, Users, Sparkles } from 'lucide-react';

export function LoginBanner() {
  const { user, loginWithGoogle, loading } = useAuth();

  if (loading || user) return null;

  return (
    <div className="mb-5 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-700/60 text-indigo-200 text-xs font-semibold mb-2 border border-indigo-500/30">
            <Database className="w-3.5 h-3.5 text-cyan-300" />
            <span>ភ្ជាប់ជាមួយ Firestore Authentication រួចរាល់</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            សូមចូលប្រើប្រាស់គណនី Google ដើម្បីគ្រប់គ្រងទិន្នន័យសិស្ស
          </h2>
          <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
            ទិន្នន័យសិស្សទាំងអស់ត្រូវបានការពារដោយ Firestore Security Rules និងធ្វើសមកាលកម្ម (Real-time Sync) ដោយស្វ័យប្រវត្ត។ លោកគ្រូ-អ្នកគ្រូអាចបន្ថែម កែប្រែ និងពិនិត្យបណ្ណសុខភាពសិស្សបានគ្រប់ពេលវេលា។
          </p>
        </div>

        <button
          onClick={loginWithGoogle}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold text-xs shadow-md transition-all flex-shrink-0 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-indigo-600" />
          <span>ចូលគណនី Google (Sign in)</span>
        </button>
      </div>
    </div>
  );
}
