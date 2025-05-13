
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  college: string;
  rank: number;
  score: number;
  completedChallenges: number;
  completedQuizzes: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'achievement' | 'skill' | 'participation' | 'special';
  criteria: string;
  pointValue: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  createdAt: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'all-time' | 'contest';
  category: 'overall' | 'dsa' | 'quizzes' | 'projects';
  entries: LeaderboardEntry[];
  lastUpdated: string;
  nextReset?: string;
}

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first coding challenge',
    imageUrl: 'https://placeholder.com/badge1',
    category: 'achievement',
    criteria: 'Complete 1 coding challenge',
    pointValue: 10,
    rarity: 'common',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Python Master',
    description: 'Achieved excellence in Python programming',
    imageUrl: 'https://placeholder.com/badge2',
    category: 'skill',
    criteria: 'Complete all Python challenges with >90% score',
    pointValue: 50,
    rarity: 'rare',
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Quiz Wizard',
    description: 'Scored perfectly on 5 consecutive quizzes',
    imageUrl: 'https://placeholder.com/badge3',
    category: 'achievement',
    criteria: 'Score 100% on 5 quizzes in a row',
    pointValue: 75,
    rarity: 'epic',
    createdAt: '2024-02-05T09:15:00Z',
  },
  {
    id: '4',
    name: 'Community Helper',
    description: 'Helped fellow students by answering questions in the forum',
    imageUrl: 'https://placeholder.com/badge4',
    category: 'participation',
    criteria: 'Answer 25 questions in the community forum',
    pointValue: 30,
    rarity: 'uncommon',
    createdAt: '2024-02-10T16:45:00Z',
  },
  {
    id: '5',
    name: 'Hackathon Champion',
    description: 'Won first place in a ForgeTrain hackathon',
    imageUrl: 'https://placeholder.com/badge5',
    category: 'special',
    criteria: 'Win 1st place in any hackathon event',
    pointValue: 100,
    rarity: 'legendary',
    createdAt: '2024-03-15T12:30:00Z',
  },
];

const mockLeaderboards: Leaderboard[] = [
  {
    id: '1',
    title: 'Weekly Challenge',
    description: 'Top performers for this week\'s coding challenges',
    type: 'weekly',
    category: 'overall',
    entries: [
      {
        userId: '101',
        userName: 'Rahul Sharma',
        college: 'Delhi Technological University',
        rank: 1,
        score: 450,
        completedChallenges: 12,
        completedQuizzes: 8,
        streak: 7,
      },
      {
        userId: '102',
        userName: 'Priya Patel',
        college: 'IIT Mumbai',
        rank: 2,
        score: 425,
        completedChallenges: 11,
        completedQuizzes: 7,
        streak: 6,
      },
      // More entries...
    ],
    lastUpdated: '2025-05-10T23:59:59Z',
    nextReset: '2025-05-17T23:59:59Z',
  },
  {
    id: '2',
    title: 'DSA Champions',
    description: 'All-time top performers in Data Structures & Algorithms',
    type: 'all-time',
    category: 'dsa',
    entries: [
      {
        userId: '103',
        userName: 'Vikram Aditya',
        college: 'VIT Vellore',
        rank: 1,
        score: 1250,
        completedChallenges: 45,
        completedQuizzes: 20,
        streak: 15,
      },
      // More entries...
    ],
    lastUpdated: '2025-05-10T23:59:59Z',
  },
  {
    id: '3',
    title: 'Monthly Quiz Masters',
    description: 'Top scorers in this month\'s aptitude quizzes',
    type: 'monthly',
    category: 'quizzes',
    entries: [
      {
        userId: '104',
        userName: 'Shreya Reddy',
        college: 'Amrita University',
        rank: 1,
        score: 980,
        completedChallenges: 5,
        completedQuizzes: 30,
        streak: 10,
      },
      // More entries...
    ],
    lastUpdated: '2025-05-10T23:59:59Z',
    nextReset: '2025-05-31T23:59:59Z',
  },
];

export { mockBadges, mockLeaderboards };
