export enum FormType {
  INVITATION_GENERAL = 'invitation_general', // General / Student Affairs
  INVITATION_TEACHER = 'invitation_teacher', // Teacher meeting
  INVITATION_SUSPENSION = 'invitation_suspension', // Has checkbox for days
  ANNEX_3_ADVICE = 'annex_3_advice', // Advice Notification
  ANNEX_4_ALERT = 'annex_4_alert', // Alert Form
  ANNEX_5_WARNING = 'annex_5_warning', // Warning Form
  ANNEX_6_PLEDGE = 'annex_6_pledge', // Pledge Form
  ANNEX_14_SUSPENSION = 'annex_14_suspension' // Temp Suspension
}

export interface SchoolSettings {
  ministryLogo: string | null; // Base64 string
  schoolStamp: string | null;  // Base64 string
  principalSignature: string | null; // Base64 string
  committeeHeadSignature: string | null; // Base64 string
}

export const INITIAL_SETTINGS: SchoolSettings = {
  ministryLogo: null,
  schoolStamp: null,
  principalSignature: null,
  committeeHeadSignature: null,
};

export interface ArchiveRecord {
  id: string;
  timestamp: number;
  studentName: string;
  formType: FormType;
  grade: string;
  details: string; // Summary of the reason (e.g. "Lateness 3 days")
  data: StudentData; // The full snapshot of data to restore
}

export interface StudentData {
  studentName: string;
  guardianName: string;
  grade: string;
  civilId: string;
  guardianPhone: string;
  incidentDate: string;
  adminNumber: string; // Internal reference number
  
  // Specific checkboxes/reasons
  reasonLateness: boolean;
  reasonAbsence: boolean;
  reasonBehavior: boolean;
  
  // Details for the reasons
  latenessDates: string;
  absenceDates: string;
  behaviorDetails: string;

  // Invitation Specifics
  invitationDeadline: '1' | '2' | '3'; // 1 day, 2 days, 3 days
  
  // Teacher Invitation Specifics
  teacherName: string;
  subjectName: string;

  // Annex 3 Specifics
  annex3_articleNo: string;

  // Annex 4 Specifics
  annex4_letterNo: string;
  annex4_letterDate: string;
  annex4_regarding: string;
  annex4_articleNo: string;

  // Annex 5 Specifics (Exact match to image)
  annex5_letter1No: string;
  annex5_letter1Date: string;
  annex5_letter2No: string;
  annex5_letter2Date: string;
  annex5_articleNo: string; // "وعملاً بالمادة (...)"
  
  // Recipient Info (Bottom Right of Annex 5 & Annex 3 & Annex 4 & Annex 14)
  annex5_recipientName: string;
  annex5_recipientRelation: string;
  annex5_recipientCivilId: string;
  annex5_recipientPhone: string;
  annex5_recipientDate: string;

  // Annex 6 Specifics
  guardianCivilId: string;
  academicYear: string;

  // Annex 14 Specifics
  annex14_letter1No: string;
  annex14_letter1Date: string;
  annex14_letter1Subj: string;
  annex14_letter2No: string;
  annex14_letter2Date: string;
  annex14_letter2Subj: string;
  annex14_articleNo: string;
  annex14_suspensionDays: string;

  // Signatures
  adminName: string;
  socialWorkerName: string;
}

export interface ImportedStudent {
  name: string;
  grade: string;
  guardianPhone?: string;
}

export const INITIAL_DATA: StudentData = {
  studentName: '',
  guardianName: '',
  grade: '',
  civilId: '',
  guardianPhone: '',
  incidentDate: new Date().toISOString().split('T')[0],
  adminNumber: '',
  reasonLateness: false,
  reasonAbsence: false,
  reasonBehavior: false,
  latenessDates: '',
  absenceDates: '',
  behaviorDetails: '',
  
  invitationDeadline: '1',
  teacherName: '',
  subjectName: '',

  annex3_articleNo: '',

  annex4_letterNo: '',
  annex4_letterDate: '',
  annex4_regarding: '',
  annex4_articleNo: '',

  annex5_letter1No: '',
  annex5_letter1Date: '',
  annex5_letter2No: '',
  annex5_letter2Date: '',
  annex5_articleNo: '',
  annex5_recipientName: '',
  annex5_recipientRelation: '',
  annex5_recipientCivilId: '',
  annex5_recipientPhone: '',
  annex5_recipientDate: '',

  guardianCivilId: '',
  academicYear: '2024 / 2025',

  annex14_letter1No: '',
  annex14_letter1Date: '',
  annex14_letter1Subj: '',
  annex14_letter2No: '',
  annex14_letter2Date: '',
  annex14_letter2Subj: '',
  annex14_articleNo: '',
  annex14_suspensionDays: '',

  adminName: 'مدير المدرسة',
  socialWorkerName: ''
};

export const FORM_TITLES: Record<FormType, string> = {
  [FormType.INVITATION_GENERAL]: 'دعوة ولي أمر (عام)',
  [FormType.INVITATION_TEACHER]: 'دعوة ولي أمر (معلم)',
  [FormType.INVITATION_SUSPENSION]: 'استدعاء ولي أمر (مخالفة)',
  [FormType.ANNEX_3_ADVICE]: 'ملحق (3) إخطار بنصح',
  [FormType.ANNEX_4_ALERT]: 'ملحق (4) تنبيه طالب',
  [FormType.ANNEX_5_WARNING]: 'ملحق (5) استمارة إنذار طالب',
  [FormType.ANNEX_6_PLEDGE]: 'ملحق (6) تعهد طالب',
  [FormType.ANNEX_14_SUSPENSION]: 'ملحق (14) قرار فصل مؤقت',
};