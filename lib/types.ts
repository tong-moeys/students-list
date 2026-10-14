export interface StudentRecord {
  id?: string;
  // ព័ត៌មានសិស្ស (Student Info)
  studentCode: string; // អត្តលេខ (e.g. 123)
  lastName: string;    // គោត្តនាម (e.g. កើន)
  firstName: string;   // នាម (e.g. វីរៈនិច្ច)
  gender: string;      // ភេទ (ស្រី / ប្រុស)
  dob?: string;        // ថ្ងៃខែឆ្នាំកំណើត (e.g. 19-03-2019)
  phone?: string;      // ទូរស័ព្ទ
  nationality?: string;// សញ្ជាតិ (e.g. ខ្មែរ)

  // ទីកន្លែងកំណើត (Place of Birth)
  pobProvince?: string;// ខេត្ត/ក្រុង
  pobDistrict?: string;// ស្រុក/ខណ្ឌ
  pobCommune?: string; // ឃុំ/សង្កាត់
  pobVillage?: string; // ភូមិ

  // អាសយដ្ឋានបច្ចុប្បន្ន (Current Address)
  curProvince?: string;
  curDistrict?: string;
  curCommune?: string;
  curVillage?: string;

  // ព័ត៌មានសិក្សា (Academic Info)
  academicYear?: string;  // ឆ្នាំសិក្សា (e.g. 2025-2026)
  previousGrade?: string; // ថ្នាក់ឆ្នាំមុន (e.g. ថ្នាក់ទី2A)
  enrollmentDate?: string;// ថ្ងៃចុះឈ្មោះចូលរៀន (e.g. 01-10-2025)
  disabilityType?: string;// ប្រភេទពិការភាព (e.g. មិនមាន)

  // កញ្ចប់សម្ភារជំនួយ (Support Packages)
  supportReading?: string;// កញ្ចប់អំណាន (មាន / មិនមាន)
  supportMath?: string;   // កញ្ចប់គណិត (មាន / មិនមាន)
  bookKhmer?: string;     // សៀវភៅជំនួយភាសាខ្មែរ (មាន / មិនមាន)
  bookMath?: string;      // សៀវភៅជំនួយគណិតវិទ្យា (មាន / មិនមាន)

  // សមធម៌ (Equity)
  isPoorFamily?: string;  // គ្រួសារក្រីក្រ (មាន / គ្មាន)
  equityCard?: string;    // បណ្ណសមធម៌ (មាន / គ្មាន / លេខបណ្ណ)

  // ព័ត៌មានបន្ថែមសិស្ស (Additional Info)
  ethnicMinority?: string;        // ជនជាតិភាគតិច
  specialCharacteristics?: string;// លក្ខណៈពិសេស

  // ទម្ងន់/កម្ពស់ ឆមាស១ (Semester 1 Growth)
  weightS1?: string; // ទម្ងន់ (kg)
  heightS1?: string; // កម្ពស់ (cm)

  // ទម្ងន់/កម្ពស់ ឆមាស២ (Semester 2 Growth)
  weightS2?: string; // ទម្ងន់ (kg)
  heightS2?: string; // កម្ពស់ (cm)

  // ភ្នែក (Eye Health)
  eyeLeft?: string;        // ឆ្វេង
  eyeRight?: string;       // ស្ដាំ
  eyeBoth?: string;        // ទាំងពីរ
  eyeResult?: string;      // លទ្ធផល (ធម្មតា / មិនធម្មតា)
  eyePrescription?: string;// វេជ្ជបញ្ជា
  eyeDevice?: string;      // ឧបករណ៍ (គ្មាន / វ៉ែនតា)

  // ត្រចៀក (Ear Health)
  earLeft?: string;        // ឆ្វេង
  earRight?: string;       // ស្ដាំ
  earBoth?: string;        // ទាំងពីរ
  earResult?: string;      // លទ្ធផល (ធម្មតា / មិនធម្មតា)
  earPrescription?: string;// វេជ្ជបញ្ជា
  earDevice?: string;      // ឧបករណ៍

  // វ៉ាក់សាំង (Vaccines)
  vaccineList?: string;    // បញ្ជីវ៉ាក់សាំង (e.g. Hepatitis B, Measles)

  // ព័ត៌មានឪពុក (Father's Info)
  fatherLastName?: string;
  fatherFirstName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  fatherProvince?: string;
  fatherDistrict?: string;
  fatherCommune?: string;
  fatherVillage?: string;

  // ព័ត៌មានម្ដាយ (Mother's Info)
  motherLastName?: string;
  motherFirstName?: string;
  motherPhone?: string;
  motherOccupation?: string;
  motherProvince?: string;
  motherDistrict?: string;
  motherCommune?: string;
  motherVillage?: string;

  // អាណាព្យាបាល (Guardian)
  guardianType?: string;       // ប្រភេទ (ឪពុក / ម្ដាយ / សាច់ញាតិ / ផ្សេងៗ)
  guardianLastName?: string;
  guardianFirstName?: string;
  guardianGender?: string;
  guardianPhone?: string;
  guardianOccupation?: string;
  guardianAddress?: string;

  // Metadata
  authorId?: string;
  authorEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'teacher' | 'admin';
  createdAt: string;
}
