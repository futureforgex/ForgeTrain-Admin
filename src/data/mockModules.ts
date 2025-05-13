
export interface Module {
  id: string;
  title: string;
  description: string;
  category: 'syntax' | 'dsa' | 'project';
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: number;
  estimatedHours: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const mockModules: Module[] = [
  {
    id: '1',
    title: 'Introduction to Python',
    description: 'Learn the basics of Python programming language',
    category: 'syntax',
    level: 'beginner',
    lessons: 10,
    estimatedHours: 8,
    status: 'published',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-04-20T14:15:00Z',
    tags: ['python', 'programming', 'basics'],
  },
  {
    id: '2',
    title: 'Data Structures Fundamentals',
    description: 'Understanding core data structures like arrays, linked lists, and trees',
    category: 'dsa',
    level: 'intermediate',
    lessons: 12,
    estimatedHours: 15,
    status: 'published',
    createdAt: '2024-02-10T09:45:00Z',
    updatedAt: '2024-05-05T11:30:00Z',
    tags: ['data structures', 'algorithms', 'computer science'],
  },
  {
    id: '3',
    title: 'Web Development with React',
    description: 'Build modern web applications using React framework',
    category: 'project',
    level: 'intermediate',
    lessons: 14,
    estimatedHours: 20,
    status: 'published',
    createdAt: '2024-03-05T13:20:00Z',
    updatedAt: '2024-04-30T16:45:00Z',
    tags: ['react', 'web development', 'javascript', 'frontend'],
  },
  {
    id: '4',
    title: 'Advanced Algorithms',
    description: 'Deep dive into complex algorithms and problem-solving techniques',
    category: 'dsa',
    level: 'advanced',
    lessons: 8,
    estimatedHours: 16,
    status: 'published',
    createdAt: '2024-02-25T15:10:00Z',
    updatedAt: '2024-04-18T10:25:00Z',
    tags: ['algorithms', 'problem solving', 'competitive programming'],
  },
  {
    id: '5',
    title: 'Java Programming Basics',
    description: 'Introduction to Java language and object-oriented programming',
    category: 'syntax',
    level: 'beginner',
    lessons: 12,
    estimatedHours: 10,
    status: 'published',
    createdAt: '2023-12-20T11:40:00Z',
    updatedAt: '2024-03-15T09:30:00Z',
    tags: ['java', 'oop', 'programming'],
  },
  {
    id: '6',
    title: 'Backend Development with Node.js',
    description: 'Learn to build scalable backend systems with Node.js',
    category: 'project',
    level: 'intermediate',
    lessons: 10,
    estimatedHours: 18,
    status: 'draft',
    createdAt: '2024-04-05T14:30:00Z',
    updatedAt: '2024-05-01T13:45:00Z',
    tags: ['node.js', 'backend', 'javascript', 'express'],
  },
  {
    id: '7',
    title: 'Database Design',
    description: 'Fundamentals of database design and SQL',
    category: 'project',
    level: 'intermediate',
    lessons: 8,
    estimatedHours: 12,
    status: 'published',
    createdAt: '2024-01-30T09:20:00Z',
    updatedAt: '2024-04-10T15:50:00Z',
    tags: ['database', 'sql', 'data modeling'],
  },
  {
    id: '8',
    title: 'Dynamic Programming',
    description: 'Master the art of solving complex problems using dynamic programming',
    category: 'dsa',
    level: 'advanced',
    lessons: 6,
    estimatedHours: 14,
    status: 'published',
    createdAt: '2024-03-15T10:15:00Z',
    updatedAt: '2024-04-25T11:20:00Z',
    tags: ['dynamic programming', 'algorithms', 'problem solving'],
  },
  {
    id: '9',
    title: 'Mobile App Development with Flutter',
    description: 'Create cross-platform mobile applications with Flutter',
    category: 'project',
    level: 'advanced',
    lessons: 15,
    estimatedHours: 25,
    status: 'draft',
    createdAt: '2024-04-10T16:30:00Z',
    updatedAt: '2024-05-08T14:15:00Z',
    tags: ['flutter', 'mobile development', 'dart', 'cross-platform'],
  },
  {
    id: '10',
    title: 'C++ Fundamentals',
    description: 'Learn the basics of C++ programming language',
    category: 'syntax',
    level: 'beginner',
    lessons: 12,
    estimatedHours: 10,
    status: 'archived',
    createdAt: '2023-11-10T08:45:00Z',
    updatedAt: '2024-02-20T13:30:00Z',
    tags: ['c++', 'programming', 'basics'],
  },
];

export default mockModules;
