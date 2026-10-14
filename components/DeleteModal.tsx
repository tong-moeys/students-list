'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  deleting: boolean;
}

export function DeleteModal({
  isOpen,
  studentName,
  onConfirm,
  onClose,
  deleting,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សនេះមែនទេ?</h3>
            <p className="text-xs text-slate-500 mt-1">
              សិស្ស: <strong className="text-slate-800">{studentName}</strong>
              <br />
              ព័ត៌មាននិងកំណត់ត្រាសុខភាពទាំងអស់នឹងត្រូវបានលុបចេញពី Firestore Database ជាអចិន្ត្រៃយ៍។
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            បោះបង់
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {deleting ? (
              <span>កំពុងលុប...</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>លុបសិស្ស</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
