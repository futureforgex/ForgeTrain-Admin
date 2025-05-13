
export interface MetricData {
  date: string;
  value: number;
}

export interface ChartData {
  id: string;
  name: string;
  data: MetricData[];
  color?: string;
}

export interface PieChartData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export const userRegistrationData: ChartData[] = [
  {
    id: 'registrations',
    name: 'New Registrations',
    data: [
      { date: '2025-04-01', value: 12 },
      { date: '2025-04-02', value: 15 },
      { date: '2025-04-03', value: 18 },
      { date: '2025-04-04', value: 14 },
      { date: '2025-04-05', value: 10 },
      { date: '2025-04-06', value: 8 },
      { date: '2025-04-07', value: 13 },
      { date: '2025-04-08', value: 17 },
      { date: '2025-04-09', value: 20 },
      { date: '2025-04-10', value: 22 },
      { date: '2025-04-11', value: 25 },
      { date: '2025-04-12', value: 19 },
      { date: '2025-04-13', value: 15 },
      { date: '2025-04-14', value: 16 },
      { date: '2025-04-15', value: 21 },
      { date: '2025-04-16', value: 24 },
      { date: '2025-04-17', value: 27 },
      { date: '2025-04-18', value: 25 },
      { date: '2025-04-19', value: 22 },
      { date: '2025-04-20', value: 18 },
      { date: '2025-04-21', value: 15 },
      { date: '2025-04-22', value: 20 },
      { date: '2025-04-23', value: 23 },
      { date: '2025-04-24', value: 26 },
      { date: '2025-04-25', value: 30 },
      { date: '2025-04-26', value: 28 },
      { date: '2025-04-27', value: 25 },
      { date: '2025-04-28', value: 22 },
      { date: '2025-04-29', value: 24 },
      { date: '2025-04-30', value: 26 },
      { date: '2025-05-01', value: 30 },
      { date: '2025-05-02', value: 33 },
      { date: '2025-05-03', value: 35 },
      { date: '2025-05-04', value: 32 },
      { date: '2025-05-05', value: 28 },
      { date: '2025-05-06', value: 25 },
      { date: '2025-05-07', value: 22 },
      { date: '2025-05-08', value: 26 },
      { date: '2025-05-09', value: 29 },
      { date: '2025-05-10', value: 31 },
    ],
    color: '#8B5CF6',
  },
  {
    id: 'activeUsers',
    name: 'Active Users',
    data: [
      { date: '2025-04-01', value: 150 },
      { date: '2025-04-02', value: 155 },
      { date: '2025-04-03', value: 160 },
      { date: '2025-04-04', value: 165 },
      { date: '2025-04-05', value: 170 },
      { date: '2025-04-06', value: 175 },
      { date: '2025-04-07', value: 180 },
      { date: '2025-04-08', value: 185 },
      { date: '2025-04-09', value: 190 },
      { date: '2025-04-10', value: 195 },
      { date: '2025-04-11', value: 200 },
      { date: '2025-04-12', value: 205 },
      { date: '2025-04-13', value: 210 },
      { date: '2025-04-14', value: 215 },
      { date: '2025-04-15', value: 220 },
      { date: '2025-04-16', value: 225 },
      { date: '2025-04-17', value: 230 },
      { date: '2025-04-18', value: 235 },
      { date: '2025-04-19', value: 240 },
      { date: '2025-04-20', value: 245 },
      { date: '2025-04-21', value: 250 },
      { date: '2025-04-22', value: 255 },
      { date: '2025-04-23', value: 260 },
      { date: '2025-04-24', value: 265 },
      { date: '2025-04-25', value: 270 },
      { date: '2025-04-26', value: 275 },
      { date: '2025-04-27', value: 280 },
      { date: '2025-04-28', value: 285 },
      { date: '2025-04-29', value: 290 },
      { date: '2025-04-30', value: 295 },
      { date: '2025-05-01', value: 300 },
      { date: '2025-05-02', value: 310 },
      { date: '2025-05-03', value: 320 },
      { date: '2025-05-04', value: 330 },
      { date: '2025-05-05', value: 340 },
      { date: '2025-05-06', value: 350 },
      { date: '2025-05-07', value: 360 },
      { date: '2025-05-08', value: 370 },
      { date: '2025-05-09', value: 380 },
      { date: '2025-05-10', value: 390 },
    ],
    color: '#4F46E5',
  },
];

export const contentEngagementData: ChartData[] = [
  {
    id: 'syntaxBootcamp',
    name: 'Syntax Bootcamp',
    data: [
      { date: '2025-04-01', value: 45 },
      { date: '2025-04-08', value: 52 },
      { date: '2025-04-15', value: 60 },
      { date: '2025-04-22', value: 67 },
      { date: '2025-04-29', value: 75 },
      { date: '2025-05-06', value: 83 },
    ],
    color: '#10B981',
  },
  {
    id: 'dsaTracks',
    name: 'DSA Tracks',
    data: [
      { date: '2025-04-01', value: 30 },
      { date: '2025-04-08', value: 35 },
      { date: '2025-04-15', value: 42 },
      { date: '2025-04-22', value: 50 },
      { date: '2025-04-29', value: 60 },
      { date: '2025-05-06', value: 72 },
    ],
    color: '#F59E0B',
  },
  {
    id: 'projects',
    name: 'Projects',
    data: [
      { date: '2025-04-01', value: 20 },
      { date: '2025-04-08', value: 22 },
      { date: '2025-04-15', value: 25 },
      { date: '2025-04-22', value: 28 },
      { date: '2025-04-29', value: 33 },
      { date: '2025-05-06', value: 40 },
    ],
    color: '#6366F1',
  },
];

export const quizPerformanceData: ChartData[] = [
  {
    id: 'averageScore',
    name: 'Average Quiz Score',
    data: [
      { date: '2025-04-01', value: 68 },
      { date: '2025-04-08', value: 70 },
      { date: '2025-04-15', value: 72 },
      { date: '2025-04-22', value: 75 },
      { date: '2025-04-29', value: 74 },
      { date: '2025-05-06', value: 76 },
    ],
    color: '#EF4444',
  },
  {
    id: 'completionRate',
    name: 'Quiz Completion Rate',
    data: [
      { date: '2025-04-01', value: 76 },
      { date: '2025-04-08', value: 78 },
      { date: '2025-04-15', value: 80 },
      { date: '2025-04-22', value: 82 },
      { date: '2025-04-29', value: 83 },
      { date: '2025-05-06', value: 85 },
    ],
    color: '#8B5CF6',
  },
];

export const driveParticipationData: ChartData[] = [
  {
    id: 'applicants',
    name: 'Number of Applicants',
    data: [
      { date: '2025-01', value: 120 },
      { date: '2025-02', value: 135 },
      { date: '2025-03', value: 150 },
      { date: '2025-04', value: 165 },
      { date: '2025-05', value: 180 },
    ],
    color: '#4F46E5',
  },
  {
    id: 'selections',
    name: 'Selected Candidates',
    data: [
      { date: '2025-01', value: 25 },
      { date: '2025-02', value: 30 },
      { date: '2025-03', value: 40 },
      { date: '2025-04', value: 45 },
      { date: '2025-05', value: 50 },
    ],
    color: '#10B981',
  },
];

export const userDistributionData: PieChartData[] = [
  { id: 'student', label: 'Students', value: 750, color: '#4F46E5' },
  { id: 'mentor', label: 'Mentors', value: 50, color: '#10B981' },
  { id: 'officer', label: 'Placement Officers', value: 20, color: '#F59E0B' },
  { id: 'admin', label: 'Admins', value: 10, color: '#EF4444' },
];

export const collegeDistributionData: PieChartData[] = [
  { id: 'dtu', label: 'Delhi Technological University', value: 120, color: '#4F46E5' },
  { id: 'iit', label: 'IIT Mumbai', value: 105, color: '#10B981' },
  { id: 'bits', label: 'BITS Pilani', value: 90, color: '#F59E0B' },
  { id: 'srm', label: 'SRM University', value: 75, color: '#EF4444' },
  { id: 'vit', label: 'VIT Vellore', value: 70, color: '#8B5CF6' },
  { id: 'others', label: 'Others', value: 370, color: '#6366F1' },
];

export const contentTypeDistributionData: PieChartData[] = [
  { id: 'syntax', label: 'Syntax Bootcamp', value: 25, color: '#4F46E5' },
  { id: 'dsa', label: 'DSA Tracks', value: 35, color: '#10B981' },
  { id: 'project', label: 'Projects', value: 20, color: '#F59E0B' },
  { id: 'quizzes', label: 'Aptitude Quizzes', value: 20, color: '#EF4444' },
];
