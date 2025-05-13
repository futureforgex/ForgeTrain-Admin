export interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'quiz' | 'tutorial' | 'external';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFormData {
  title: string;
  description: string;
  url: string;
  type: 'project' | 'quiz' | 'tutorial' | 'external';
  category: string;
  tags: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedTime: string;
  components: ModuleComponent[];
  createdAt: string;
  updatedAt: string;
}

export interface ModuleComponent {
  id: string;
  type: 'tutorial' | 'quiz' | 'code-challenge' | 'project';
  title: string;
  description: string;
  content: {
    tutorial?: {
      videoUrl?: string;
      readingContent?: string;
      duration: string;
    };
    quiz?: {
      questions: QuizQuestion[];
      passingScore: number;
      duration: string;
    };
    codeChallenge?: {
      problemStatement: string;
      starterCode: string;
      testCases: string[];
      duration: string;
    };
    project?: {
      requirements: string[];
      starterCode: string;
      rubric: string[];
      duration: string;
    };
  };
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
} 