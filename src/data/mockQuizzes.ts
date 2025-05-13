
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeAllowed: number; // in seconds
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'quantitative' | 'verbal' | 'logical' | 'technical';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  questions: QuizQuestion[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Basic Arithmetic',
    description: 'Test your knowledge of basic arithmetic operations',
    category: 'quantitative',
    difficulty: 'easy',
    timeLimit: 15,
    status: 'published',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-04-05T14:30:00Z',
    questions: [
      {
        id: '1-1',
        question: 'What is 25% of 80?',
        options: ['15', '20', '25', '30'],
        correctAnswer: 1,
        explanation: '25% of 80 = 0.25 × 80 = 20',
        difficulty: 'easy',
        timeAllowed: 60,
      },
      {
        id: '1-2',
        question: 'If x = 5 and y = 3, what is the value of 2x + 3y?',
        options: ['16', '19', '21', '25'],
        correctAnswer: 1,
        explanation: '2x + 3y = 2(5) + 3(3) = 10 + 9 = 19',
        difficulty: 'easy',
        timeAllowed: 60,
      },
      // More questions...
    ],
  },
  {
    id: '2',
    title: 'English Vocabulary',
    description: 'Expand your English vocabulary knowledge',
    category: 'verbal',
    difficulty: 'medium',
    timeLimit: 20,
    status: 'published',
    createdAt: '2024-02-15T11:30:00Z',
    updatedAt: '2024-04-10T13:45:00Z',
    questions: [
      {
        id: '2-1',
        question: 'What is the antonym of "benevolent"?',
        options: ['Malevolent', 'Generous', 'Kind', 'Charitable'],
        correctAnswer: 0,
        explanation: '"Benevolent" means wishing to do good, and "malevolent" means wishing to do harm.',
        difficulty: 'medium',
        timeAllowed: 90,
      },
      {
        id: '2-2',
        question: 'What does "ephemeral" mean?',
        options: ['Lasting forever', 'Lasting for a very short time', 'Very important', 'Very large'],
        correctAnswer: 1,
        explanation: '"Ephemeral" means lasting for a very short time.',
        difficulty: 'medium',
        timeAllowed: 90,
      },
      // More questions...
    ],
  },
  {
    id: '3',
    title: 'Logical Reasoning',
    description: 'Test your logical reasoning skills',
    category: 'logical',
    difficulty: 'hard',
    timeLimit: 25,
    status: 'published',
    createdAt: '2024-01-20T14:45:00Z',
    updatedAt: '2024-03-25T10:20:00Z',
    questions: [
      {
        id: '3-1',
        question: 'If all roses are flowers and some flowers fade quickly, which of the following statements must be true?',
        options: [
          'All roses fade quickly',
          'Some roses fade quickly',
          'No roses fade quickly',
          'None of the above'
        ],
        correctAnswer: 3,
        explanation: 'From the given statements, we cannot conclude whether roses fade quickly or not.',
        difficulty: 'hard',
        timeAllowed: 120,
      },
      // More questions...
    ],
  },
  // More quizzes...
];

export default mockQuizzes;
