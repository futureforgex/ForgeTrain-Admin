
export interface Drive {
  id: string;
  companyName: string;
  role: string;
  description: string;
  location: string;
  driveDate: string;
  registrationDeadline: string;
  eligibilityCriteria: {
    cgpa: number;
    branches: string[];
    backlogs: number;
    additionalRequirements?: string;
  };
  package: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registeredStudents: number;
  createdAt: string;
  updatedAt: string;
}

const mockDrives: Drive[] = [
  {
    id: '1',
    companyName: 'TechSolutions India Pvt. Ltd.',
    role: 'Software Development Engineer',
    description: 'TechSolutions is hiring for entry-level software development roles. Selected candidates will work on cutting-edge technologies.',
    location: 'Bangalore',
    driveDate: '2025-06-15T09:00:00Z',
    registrationDeadline: '2025-06-01T23:59:59Z',
    eligibilityCriteria: {
      cgpa: 7.5,
      branches: ['Computer Science', 'Information Technology', 'Electronics'],
      backlogs: 0,
      additionalRequirements: 'Knowledge of at least one programming language (Java/Python/C++)',
    },
    package: {
      min: 8.5,
      max: 12.0,
      currency: 'LPA',
    },
    status: 'upcoming',
    registeredStudents: 120,
    createdAt: '2025-05-01T10:30:00Z',
    updatedAt: '2025-05-05T14:15:00Z',
  },
  {
    id: '2',
    companyName: 'Global Innovations Inc.',
    role: 'Associate Data Analyst',
    description: 'Global Innovations is looking for talented data analysts to join their growing analytics team.',
    location: 'Hyderabad',
    driveDate: '2025-06-20T10:00:00Z',
    registrationDeadline: '2025-06-05T23:59:59Z',
    eligibilityCriteria: {
      cgpa: 8.0,
      branches: ['Computer Science', 'Data Science', 'Mathematics', 'Statistics'],
      backlogs: 0,
    },
    package: {
      min: 7.0,
      max: 9.0,
      currency: 'LPA',
    },
    status: 'upcoming',
    registeredStudents: 85,
    createdAt: '2025-05-02T11:45:00Z',
    updatedAt: '2025-05-06T09:30:00Z',
  },
  {
    id: '3',
    companyName: 'Fintech Horizons',
    role: 'Software Engineer',
    description: 'Fintech Horizons is recruiting software engineers for their core banking platform development team.',
    location: 'Mumbai',
    driveDate: '2025-05-05T09:30:00Z',
    registrationDeadline: '2025-04-20T23:59:59Z',
    eligibilityCriteria: {
      cgpa: 7.0,
      branches: ['Computer Science', 'Information Technology'],
      backlogs: 1,
      additionalRequirements: 'Basic understanding of financial systems is a plus',
    },
    package: {
      min: 9.0,
      max: 14.0,
      currency: 'LPA',
    },
    status: 'completed',
    registeredStudents: 95,
    createdAt: '2025-04-01T13:20:00Z',
    updatedAt: '2025-05-06T18:10:00Z',
  },
  {
    id: '4',
    companyName: 'CloudNet Technologies',
    role: 'Cloud Support Engineer',
    description: 'CloudNet is hiring Cloud Support Engineers to join their technical support team.',
    location: 'Pune',
    driveDate: '2025-06-10T10:00:00Z',
    registrationDeadline: '2025-05-25T23:59:59Z',
    eligibilityCriteria: {
      cgpa: 6.5,
      branches: ['Computer Science', 'Information Technology', 'Electronics', 'Electrical'],
      backlogs: 2,
    },
    package: {
      min: 5.0,
      max: 7.0,
      currency: 'LPA',
    },
    status: 'upcoming',
    registeredStudents: 65,
    createdAt: '2025-04-15T09:45:00Z',
    updatedAt: '2025-05-01T11:30:00Z',
  },
  {
    id: '5',
    companyName: 'EduTech Learning Labs',
    role: 'Content Developer',
    description: 'EduTech is looking for Content Developers specializing in technical education content.',
    location: 'Delhi NCR',
    driveDate: '2025-05-12T11:00:00Z',
    registrationDeadline: '2025-04-28T23:59:59Z',
    eligibilityCriteria: {
      cgpa: 7.0,
      branches: ['Any Branch'],
      backlogs: 3,
      additionalRequirements: 'Strong written and verbal communication skills',
    },
    package: {
      min: 4.5,
      max: 6.0,
      currency: 'LPA',
    },
    status: 'ongoing',
    registeredStudents: 50,
    createdAt: '2025-04-10T14:30:00Z',
    updatedAt: '2025-05-12T08:15:00Z',
  },
];

export default mockDrives;
