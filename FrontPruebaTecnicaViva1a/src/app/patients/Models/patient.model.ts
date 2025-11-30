export interface Patient {
  patientId: number;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;   // DateOnly → string
  phoneNumber?: string | null;
  email?: string | null;
  createdAt: string;
}
