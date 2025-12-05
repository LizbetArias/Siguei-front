export type SupportType = 'COGNITIVO' | 'MOTOR' | 'SENSORIAL' | 'EMOCIONAL' | 'LENGUAJE' | 'CONDUCTUAL';

export type SupportStatus = 'ACTIVE' | 'INACTIVE';

export type SpecialNeedsSupport = {
  id: string;
  studentId: string;
  classroomId: string;
  institutionId: string;
  academicYear: number;
  diagnosis: string;
  diagnosisDate: string;
  diagnosedBy: string;
  supportType: SupportType;
  description: string;
  adaptationsRequired: string[];
  supportMaterials: string[];
  specialistInvolved: string;
  progressNotes: string;
  lastReviewDate: string;
  nextReviewDate: string;
  status: SupportStatus;
};