'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StudentRecord } from '@/lib/types';
import {
  subscribeToStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  seedInitialStudentIfEmpty,
} from '@/lib/student-service';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { StudentTable } from '@/components/StudentTable';
import { StudentModal } from '@/components/StudentModal';
import { StudentDossier } from '@/components/StudentDossier';
import { DeleteModal } from '@/components/DeleteModal';
import { LoginBanner } from '@/components/LoginBanner';
import { AlertCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

export default function HomePage() {
  const { user, profile, loading: authLoading, loginWithGoogle } = useAuth();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Seed sample record on initial login if empty
  useEffect(() => {
    if (user && user.uid && user.email) {
      seedInitialStudentIfEmpty(user.uid, user.email);
    }
  }, [user]);

  // Subscribe to Firestore students collection
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // We can listen to students
    try {
      unsubscribe = subscribeToStudents(
        (data) => {
          setStudents(data);
          setLoading(false);
          setFirestoreError(null);
        },
        (error) => {
          console.error('Subscription error:', error);
          // Only show error if authenticated, or permission issue
          setFirestoreError(error.message);
          setLoading(false);
        }
      );
    } catch (err: unknown) {
      console.error('Failed to attach snapshot:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save student (create or update)
  const handleSaveStudent = async (data: Partial<StudentRecord>) => {
    if (!user) {
      await loginWithGoogle();
      return;
    }

    if (studentToEdit && studentToEdit.id) {
      await updateStudent(studentToEdit.id, data, studentToEdit.authorId || user.uid);
    } else {
      await createStudent(data as Omit<StudentRecord, 'id'>, user.uid, user.email || '');
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      alert('បរាជ័យក្នុងការលុប៖ ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setDeleting(false);
    }
  };

  // Export to CSV with UTF-8 BOM so Khmer characters render properly in Excel
  const handleExportCsv = useCallback(() => {
    if (students.length === 0) {
      alert('មិនទាន់មានទិន្នន័យសម្រាប់ទាញយកទេ');
      return;
    }

    const headers = [
      'អត្តលេខ',
      'គោត្តនាម',
      'នាម',
      'ភេទ',
      'ថ្ងៃខែឆ្នាំកំណើត',
      'ទូរស័ព្ទ',
      'សញ្ជាតិ',
      'ទីកន្លែងកំណើត-ខេត្ត',
      'ទីកន្លែងកំណើត-ស្រុក',
      'ទីកន្លែងកំណើត-ឃុំ',
      'ទីកន្លែងកំណើត-ភូមិ',
      'អាសយដ្ឋានបច្ចុប្បន្ន-ខេត្ត',
      'អាសយដ្ឋានបច្ចុប្បន្ន-ស្រុក',
      'អាសយដ្ឋានបច្ចុប្បន្ន-ឃុំ',
      'អាសយដ្ឋានបច្ចុប្បន្ន-ភូមិ',
      'ឆ្នាំសិក្សា',
      'ថ្នាក់ឆ្នាំមុន',
      'ថ្ងៃចុះឈ្មោះ',
      'ពិការភាព',
      'កញ្ចប់អំណាន',
      'កញ្ចប់គណិត',
      'សៀវភៅជំនួយភាសាខ្មែរ',
      'សៀវភៅជំនួយគណិតវិទ្យា',
      'គ្រួសារក្រីក្រ',
      'បណ្ណសមធម៌',
      'ជនជាតិភាគតិច',
      'លក្ខណៈពិសេស',
      'ទម្ងន់ ឆ១ (kg)',
      'កម្ពស់ ឆ១ (cm)',
      'ទម្ងន់ ឆ២ (kg)',
      'កម្ពស់ ឆ២ (cm)',
      'ភ្នែក ឆ្វេង',
      'ភ្នែក ស្ដាំ',
      'ភ្នែក ទាំងពីរ',
      'ភ្នែក លទ្ធផល',
      'ភ្នែក ឧបករណ៍',
      'ត្រចៀក ឆ្វេង',
      'ត្រចៀក ស្ដាំ',
      'ត្រចៀក ទាំងពីរ',
      'ត្រចៀក លទ្ធផល',
      'ត្រចៀក ឧបករណ៍',
      'វ៉ាក់សាំង',
      'ឪពុក-គោត្តនាម',
      'ឪពុក-នាម',
      'ឪពុក-ទូរស័ព្ទ',
      'ឪពុក-មុខរបរ',
      'ម្ដាយ-គោត្តនាម',
      'ម្ដាយ-នាម',
      'ម្ដាយ-ទូរស័ព្ទ',
      'ម្ដាយ-មុខរបរ',
      'អាណាព្យាបាល-ប្រភេទ',
      'អាណាព្យាបាល-គោត្តនាម',
      'អាណាព្យាបាល-នាម',
      'អាណាព្យាបាល-ទូរស័ព្ទ',
      'អាណាព្យាបាល-អាសយដ្ឋាន',
    ];

    const rows = students.map((s) => [
      s.studentCode || '',
      s.lastName || '',
      s.firstName || '',
      s.gender || '',
      s.dob || '',
      s.phone || '',
      s.nationality || '',
      s.pobProvince || '',
      s.pobDistrict || '',
      s.pobCommune || '',
      s.pobVillage || '',
      s.curProvince || '',
      s.curDistrict || '',
      s.curCommune || '',
      s.curVillage || '',
      s.academicYear || '',
      s.previousGrade || '',
      s.enrollmentDate || '',
      s.disabilityType || '',
      s.supportReading || '',
      s.supportMath || '',
      s.bookKhmer || '',
      s.bookMath || '',
      s.isPoorFamily || '',
      s.equityCard || '',
      s.ethnicMinority || '',
      s.specialCharacteristics || '',
      s.weightS1 || '',
      s.heightS1 || '',
      s.weightS2 || '',
      s.heightS2 || '',
      s.eyeLeft || '',
      s.eyeRight || '',
      s.eyeBoth || '',
      s.eyeResult || '',
      s.eyeDevice || '',
      s.earLeft || '',
      s.earRight || '',
      s.earBoth || '',
      s.earResult || '',
      s.earDevice || '',
      s.vaccineList || '',
      s.fatherLastName || '',
      s.fatherFirstName || '',
      s.fatherPhone || '',
      s.fatherOccupation || '',
      s.motherLastName || '',
      s.motherFirstName || '',
      s.motherPhone || '',
      s.motherOccupation || '',
      s.guardianType || '',
      s.guardianLastName || '',
      s.guardianFirstName || '',
      s.guardianPhone || '',
      s.guardianAddress || '',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `បញ្ជីព័ត៌មាននិងសុខភាពសិស្ស_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [students]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* App Header */}
      <Header
        onOpenAddModal={() => {
          if (!user) {
            loginWithGoogle();
          } else {
            setStudentToEdit(null);
            setIsAddModalOpen(true);
          }
        }}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
        totalStudents={students.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Login Callout if user is not yet signed in */}
        <LoginBanner />

        {/* Firestore Error Alert */}
        {firestoreError && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                បញ្ហាតភ្ជាប់ Firestore: {firestoreError}
                {!user && ' (សូមចូលគណនី Google ដើម្បីទទួលបានសិទ្ធិអាននិងសរសេរ)'}
              </span>
            </div>
            {!user && (
              <button
                onClick={loginWithGoogle}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-md text-[11px] font-semibold hover:bg-rose-700"
              >
                ចូលគណនី
              </button>
            )}
          </div>
        )}

        {/* Quick Stats Overview */}
        <StatsOverview students={students} />

        {/* Table Container */}
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="inline-flex items-center gap-2 text-indigo-600 text-sm font-semibold">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>កំពុងទាញយកទិន្នន័យពី Firestore Database...</span>
            </div>
          </div>
        ) : (
          <StudentTable
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onEditStudent={(student) => {
              setStudentToEdit(student);
              setIsAddModalOpen(true);
            }}
            onDeleteStudent={(id, name) => setDeleteTarget({ id, name })}
          />
        )}
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Student Dossier / Health Card Modal */}
      <StudentDossier
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={(student) => {
          setSelectedStudent(null);
          setStudentToEdit(student);
          setIsAddModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        studentName={deleteTarget?.name || ''}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </div>
  );
}
