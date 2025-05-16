import { Timestamp } from 'firebase/firestore';

export interface Drive {
  id: string;
  company: string;
  driveTitle: string;
  driveType: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  remote: boolean;
  appLink: string;
  branches: string[];
  years: string[];
  cgpa: string;
  backlog: string;
  regWindow: string;
  seatCap: string;
  notify: boolean;
  notifTemplate: string;
  reminders: string[];
  approval: string;
  visibility: string;
  module: string;
  thumbnailUrl: string;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FormState extends Omit<Drive, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
  thumbnail?: File;
} 