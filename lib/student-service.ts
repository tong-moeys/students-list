import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { StudentRecord } from './types';

const COLLECTION_NAME = 'students';

// Initial sample student based on user's provided official register table
export const INITIAL_SAMPLE_STUDENT: Omit<StudentRecord, 'id' | 'authorId'> = {
  studentCode: '123',
  lastName: 'កើន',
  firstName: 'វីរៈនិច្ច',
  gender: 'ស្រី',
  dob: '19-03-2019',
  phone: '012345678',
  nationality: 'ខ្មែរ',
  pobProvince: 'បន្ទាយមានជ័យ',
  pobDistrict: 'ភ្នំស្រុក',
  pobCommune: 'ស្ពានស្រែង',
  pobVillage: 'មុខឈ្នាង',
  curProvince: 'បន្ទាយមានជ័យ',
  curDistrict: 'ភ្នំស្រុក',
  curCommune: 'ស្ពានស្រែង',
  curVillage: 'មុខឈ្នាង',
  academicYear: '2025-2026',
  previousGrade: 'ថ្នាក់ទី2A',
  enrollmentDate: '01-10-2025',
  disabilityType: 'មិនមាន',
  supportReading: 'មាន',
  supportMath: 'មិនមាន',
  bookKhmer: 'មាន',
  bookMath: 'មាន',
  isPoorFamily: 'គ្មាន',
  equityCard: 'មាន',
  ethnicMinority: '',
  specialCharacteristics: '',
  weightS1: '24.5',
  heightS1: '118',
  weightS2: '26',
  heightS2: '121',
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
  vaccineList: 'Hepatitis B, Measles',
  fatherLastName: '',
  fatherFirstName: '',
  fatherPhone: '011222333',
  fatherOccupation: 'កសិករ',
  fatherProvince: '',
  fatherDistrict: '',
  fatherCommune: '',
  fatherVillage: '',
  motherLastName: 'រ៉ម',
  motherFirstName: 'សុផាត់',
  motherPhone: '012333444',
  motherOccupation: 'លក់ទំនិញ',
  motherProvince: 'បន្ទាយមានជ័យ',
  motherDistrict: 'ភ្នំស្រុក',
  motherCommune: 'ស្ពានស្រែង',
  motherVillage: 'មុខឈ្នាង',
  guardianType: 'សាច់ញាតិ',
  guardianLastName: 'ហួក',
  guardianFirstName: 'តាក់',
  guardianGender: 'ស្រី',
  guardianPhone: '012555666',
  guardianOccupation: 'កសិករ',
  guardianAddress: 'បន្ទាយមានជ័យ, ភ្នំស្រុក, ស្ពានស្រែង, មុខឈ្នាង',
};

// Defensive length truncator matching blueprint limits
function sanitizeString(val: string | undefined, maxLen: number): string {
  if (!val) return '';
  return val.trim().slice(0, maxLen);
}

// Subscribe to students in real-time
export function subscribeToStudents(
  onData: (students: StudentRecord[]) => void,
  onError: (error: Error) => void
) {
  const colRef = collection(db, COLLECTION_NAME);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const records: StudentRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        records.push({
          id: docSnap.id,
          studentCode: data.studentCode || '',
          lastName: data.lastName || '',
          firstName: data.firstName || '',
          gender: data.gender || '',
          dob: data.dob || '',
          phone: data.phone || '',
          nationality: data.nationality || '',
          pobProvince: data.pobProvince || '',
          pobDistrict: data.pobDistrict || '',
          pobCommune: data.pobCommune || '',
          pobVillage: data.pobVillage || '',
          curProvince: data.curProvince || '',
          curDistrict: data.curDistrict || '',
          curCommune: data.curCommune || '',
          curVillage: data.curVillage || '',
          academicYear: data.academicYear || '',
          previousGrade: data.previousGrade || '',
          enrollmentDate: data.enrollmentDate || '',
          disabilityType: data.disabilityType || '',
          supportReading: data.supportReading || '',
          supportMath: data.supportMath || '',
          bookKhmer: data.bookKhmer || '',
          bookMath: data.bookMath || '',
          isPoorFamily: data.isPoorFamily || '',
          equityCard: data.equityCard || '',
          ethnicMinority: data.ethnicMinority || '',
          specialCharacteristics: data.specialCharacteristics || '',
          weightS1: data.weightS1 || '',
          heightS1: data.heightS1 || '',
          weightS2: data.weightS2 || '',
          heightS2: data.heightS2 || '',
          eyeLeft: data.eyeLeft || '',
          eyeRight: data.eyeRight || '',
          eyeBoth: data.eyeBoth || '',
          eyeResult: data.eyeResult || '',
          eyePrescription: data.eyePrescription || '',
          eyeDevice: data.eyeDevice || '',
          earLeft: data.earLeft || '',
          earRight: data.earRight || '',
          earBoth: data.earBoth || '',
          earResult: data.earResult || '',
          earPrescription: data.earPrescription || '',
          earDevice: data.earDevice || '',
          vaccineList: data.vaccineList || '',
          fatherLastName: data.fatherLastName || '',
          fatherFirstName: data.fatherFirstName || '',
          fatherPhone: data.fatherPhone || '',
          fatherOccupation: data.fatherOccupation || '',
          fatherProvince: data.fatherProvince || '',
          fatherDistrict: data.fatherDistrict || '',
          fatherCommune: data.fatherCommune || '',
          fatherVillage: data.fatherVillage || '',
          motherLastName: data.motherLastName || '',
          motherFirstName: data.motherFirstName || '',
          motherPhone: data.motherPhone || '',
          motherOccupation: data.motherOccupation || '',
          motherProvince: data.motherProvince || '',
          motherDistrict: data.motherDistrict || '',
          motherCommune: data.motherCommune || '',
          motherVillage: data.motherVillage || '',
          guardianType: data.guardianType || '',
          guardianLastName: data.guardianLastName || '',
          guardianFirstName: data.guardianFirstName || '',
          guardianGender: data.guardianGender || '',
          guardianPhone: data.guardianPhone || '',
          guardianOccupation: data.guardianOccupation || '',
          guardianAddress: data.guardianAddress || '',
          authorId: data.authorId || '',
          authorEmail: data.authorEmail || '',
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || '',
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || '',
        });
      });
      onData(records);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
      } catch (wrappedErr) {
        onError(wrappedErr as Error);
      }
    }
  );
}

// Add a new student record
export async function createStudent(
  record: Omit<StudentRecord, 'id'>,
  userId: string,
  userEmail: string
): Promise<string> {
  const payload = {
    studentCode: sanitizeString(record.studentCode, 64) || `STD-${Date.now()}`,
    lastName: sanitizeString(record.lastName, 100),
    firstName: sanitizeString(record.firstName, 100),
    gender: sanitizeString(record.gender, 20),
    dob: sanitizeString(record.dob, 30),
    phone: sanitizeString(record.phone, 50),
    nationality: sanitizeString(record.nationality, 50),
    pobProvince: sanitizeString(record.pobProvince, 100),
    pobDistrict: sanitizeString(record.pobDistrict, 100),
    pobCommune: sanitizeString(record.pobCommune, 100),
    pobVillage: sanitizeString(record.pobVillage, 100),
    curProvince: sanitizeString(record.curProvince, 100),
    curDistrict: sanitizeString(record.curDistrict, 100),
    curCommune: sanitizeString(record.curCommune, 100),
    curVillage: sanitizeString(record.curVillage, 100),
    academicYear: sanitizeString(record.academicYear, 30),
    previousGrade: sanitizeString(record.previousGrade, 50),
    enrollmentDate: sanitizeString(record.enrollmentDate, 30),
    disabilityType: sanitizeString(record.disabilityType, 100),
    supportReading: sanitizeString(record.supportReading, 20),
    supportMath: sanitizeString(record.supportMath, 20),
    bookKhmer: sanitizeString(record.bookKhmer, 20),
    bookMath: sanitizeString(record.bookMath, 20),
    isPoorFamily: sanitizeString(record.isPoorFamily, 20),
    equityCard: sanitizeString(record.equityCard, 50),
    ethnicMinority: sanitizeString(record.ethnicMinority, 50),
    specialCharacteristics: sanitizeString(record.specialCharacteristics, 250),
    weightS1: sanitizeString(record.weightS1, 20),
    heightS1: sanitizeString(record.heightS1, 20),
    weightS2: sanitizeString(record.weightS2, 20),
    heightS2: sanitizeString(record.heightS2, 20),
    eyeLeft: sanitizeString(record.eyeLeft, 30),
    eyeRight: sanitizeString(record.eyeRight, 30),
    eyeBoth: sanitizeString(record.eyeBoth, 30),
    eyeResult: sanitizeString(record.eyeResult, 100),
    eyePrescription: sanitizeString(record.eyePrescription, 200),
    eyeDevice: sanitizeString(record.eyeDevice, 100),
    earLeft: sanitizeString(record.earLeft, 30),
    earRight: sanitizeString(record.earRight, 30),
    earBoth: sanitizeString(record.earBoth, 30),
    earResult: sanitizeString(record.earResult, 100),
    earPrescription: sanitizeString(record.earPrescription, 200),
    earDevice: sanitizeString(record.earDevice, 100),
    vaccineList: sanitizeString(record.vaccineList, 500),
    fatherLastName: sanitizeString(record.fatherLastName, 100),
    fatherFirstName: sanitizeString(record.fatherFirstName, 100),
    fatherPhone: sanitizeString(record.fatherPhone, 50),
    fatherOccupation: sanitizeString(record.fatherOccupation, 100),
    fatherProvince: sanitizeString(record.fatherProvince, 100),
    fatherDistrict: sanitizeString(record.fatherDistrict, 100),
    fatherCommune: sanitizeString(record.fatherCommune, 100),
    fatherVillage: sanitizeString(record.fatherVillage, 100),
    motherLastName: sanitizeString(record.motherLastName, 100),
    motherFirstName: sanitizeString(record.motherFirstName, 100),
    motherPhone: sanitizeString(record.motherPhone, 50),
    motherOccupation: sanitizeString(record.motherOccupation, 100),
    motherProvince: sanitizeString(record.motherProvince, 100),
    motherDistrict: sanitizeString(record.motherDistrict, 100),
    motherCommune: sanitizeString(record.motherCommune, 100),
    motherVillage: sanitizeString(record.motherVillage, 100),
    guardianType: sanitizeString(record.guardianType, 50),
    guardianLastName: sanitizeString(record.guardianLastName, 100),
    guardianFirstName: sanitizeString(record.guardianFirstName, 100),
    guardianGender: sanitizeString(record.guardianGender, 20),
    guardianPhone: sanitizeString(record.guardianPhone, 50),
    guardianOccupation: sanitizeString(record.guardianOccupation, 100),
    guardianAddress: sanitizeString(record.guardianAddress, 300),
    authorId: userId,
    authorEmail: sanitizeString(userEmail, 256),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, COLLECTION_NAME);
  }
}

// Update student record
export async function updateStudent(studentId: string, record: Partial<StudentRecord>, authorId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, studentId);
  const payload: Record<string, unknown> = {
    authorId,
    updatedAt: new Date().toISOString(),
  };

  // Only assign defined fields
  const fields = [
    'studentCode', 'lastName', 'firstName', 'gender', 'dob', 'phone', 'nationality',
    'pobProvince', 'pobDistrict', 'pobCommune', 'pobVillage',
    'curProvince', 'curDistrict', 'curCommune', 'curVillage',
    'academicYear', 'previousGrade', 'enrollmentDate', 'disabilityType',
    'supportReading', 'supportMath', 'bookKhmer', 'bookMath',
    'isPoorFamily', 'equityCard', 'ethnicMinority', 'specialCharacteristics',
    'weightS1', 'heightS1', 'weightS2', 'heightS2',
    'eyeLeft', 'eyeRight', 'eyeBoth', 'eyeResult', 'eyePrescription', 'eyeDevice',
    'earLeft', 'earRight', 'earBoth', 'earResult', 'earPrescription', 'earDevice',
    'vaccineList',
    'fatherLastName', 'fatherFirstName', 'fatherPhone', 'fatherOccupation',
    'fatherProvince', 'fatherDistrict', 'fatherCommune', 'fatherVillage',
    'motherLastName', 'motherFirstName', 'motherPhone', 'motherOccupation',
    'motherProvince', 'motherDistrict', 'motherCommune', 'motherVillage',
    'guardianType', 'guardianLastName', 'guardianFirstName', 'guardianGender',
    'guardianPhone', 'guardianOccupation', 'guardianAddress',
  ] as const;

  for (const field of fields) {
    if (record[field] !== undefined) {
      payload[field] = sanitizeString(record[field] as string, 300);
    }
  }

  try {
    await updateDoc(docRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${studentId}`);
  }
}

// Delete student record
export async function deleteStudent(studentId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, studentId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${studentId}`);
  }
}

// Check and seed initial student from prompt if database is empty
export async function seedInitialStudentIfEmpty(userId: string, userEmail: string): Promise<void> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(query(colRef, limit(1)));
    if (snap.empty) {
      await createStudent(INITIAL_SAMPLE_STUDENT, userId, userEmail);
    }
  } catch (error) {
    console.warn('Seeding check skipped or permission waiting:', error);
  }
}
