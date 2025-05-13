
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'officer' | 'admin';
  college: string;
  department?: string;
  year?: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    role: 'student',
    college: 'Delhi Technological University',
    department: 'Computer Science',
    year: 3,
    status: 'active',
    createdAt: '2024-04-15T10:30:00Z',
    lastLogin: '2025-05-10T08:45:12Z',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    role: 'student',
    college: 'IIT Mumbai',
    department: 'Electronics',
    year: 4,
    status: 'active',
    createdAt: '2024-03-22T09:15:00Z',
    lastLogin: '2025-05-09T14:20:05Z',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit.k@example.com',
    role: 'mentor',
    college: 'BITS Pilani',
    status: 'active',
    createdAt: '2023-11-10T14:45:00Z',
    lastLogin: '2025-05-10T11:30:45Z',
  },
  {
    id: '4',
    name: 'Neha Singh',
    email: 'neha.s@example.com',
    role: 'officer',
    college: 'SRM University',
    status: 'active',
    createdAt: '2023-09-05T08:30:00Z',
    lastLogin: '2025-05-08T17:10:22Z',
  },
  {
    id: '5',
    name: 'Vikram Aditya',
    email: 'vikram.a@example.com',
    role: 'student',
    college: 'VIT Vellore',
    department: 'Computer Science',
    year: 2,
    status: 'inactive',
    createdAt: '2024-01-12T11:20:00Z',
    lastLogin: '2025-04-20T09:15:30Z',
  },
  {
    id: '6',
    name: 'Shreya Reddy',
    email: 'shreya.r@example.com',
    role: 'student',
    college: 'Amrita University',
    department: 'Information Technology',
    year: 3,
    status: 'active',
    createdAt: '2024-02-28T15:10:00Z',
    lastLogin: '2025-05-10T10:05:18Z',
  },
  {
    id: '7',
    name: 'Ravi Verma',
    email: 'ravi.v@example.com',
    role: 'admin',
    college: 'ForgeTrain HQ',
    status: 'active',
    createdAt: '2023-06-18T07:45:00Z',
    lastLogin: '2025-05-11T07:30:10Z',
  },
  {
    id: '8',
    name: 'Anjali Menon',
    email: 'anjali.m@example.com',
    role: 'mentor',
    college: 'NIT Trichy',
    status: 'active',
    createdAt: '2023-10-05T13:25:00Z',
    lastLogin: '2025-05-09T16:40:52Z',
  },
  {
    id: '9',
    name: 'Karthik Iyer',
    email: 'karthik.i@example.com',
    role: 'student',
    college: 'IIIT Hyderabad',
    department: 'Data Science',
    year: 4,
    status: 'pending',
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: '10',
    name: 'Divya Krishnan',
    email: 'divya.k@example.com',
    role: 'student',
    college: 'College of Engineering, Guindy',
    department: 'Mechanical Engineering',
    year: 3,
    status: 'active',
    createdAt: '2024-03-15T09:50:00Z',
    lastLogin: '2025-05-08T12:15:40Z',
  },
  {
    id: '11',
    name: 'Arjun Nair',
    email: 'arjun.n@example.com',
    role: 'officer',
    college: 'Manipal Institute of Technology',
    status: 'active',
    createdAt: '2023-08-20T16:15:00Z',
    lastLogin: '2025-05-10T14:50:33Z',
  },
];

export default mockUsers;
