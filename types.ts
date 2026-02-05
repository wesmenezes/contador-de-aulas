
export type PackageSize = 4 | 8 | 12 | 16 | 20;

export interface Student {
  id: string;
  name: string;
  contractedPackage: PackageSize;
  lessonBalance: number;
  lastPaymentDate: string; // ISO format
  cycleExpiration: string; // ISO format
}

export interface AttendanceLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  action: 'CHECK_IN' | 'DEPOSIT';
  adjustment: number;
}
