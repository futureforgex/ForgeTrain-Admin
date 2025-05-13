
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'placement' | 'event' | 'update' | 'urgent';
  audience: 'all' | 'students' | 'mentors' | 'officers';
  publishedAt: string;
  expiresAt?: string;
  status: 'draft' | 'published' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  linkText?: string;
  recipientIds: string[];
  isRead: boolean;
  createdAt: string;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to the New ForgeTrain Platform',
    content: '<p>We are excited to announce the launch of our completely redesigned ForgeTrain platform. The new interface offers improved navigation, personalized learning paths, and enhanced collaboration features.</p><p>Take some time to explore the new features and let us know your feedback!</p>',
    category: 'general',
    audience: 'all',
    publishedAt: '2025-05-01T09:00:00Z',
    expiresAt: '2025-06-01T09:00:00Z',
    status: 'published',
    createdBy: 'Admin',
    createdAt: '2025-04-28T15:30:00Z',
    updatedAt: '2025-05-01T08:45:00Z',
  },
  {
    id: '2',
    title: 'TechSolutions Placement Drive Registration Open',
    content: '<p>Registration for the upcoming TechSolutions placement drive is now open. This is an excellent opportunity for final-year Computer Science and IT students.</p><p><strong>Key Details:</strong></p><ul><li>Date: June 15, 2025</li><li>Roles: Software Development Engineer</li><li>Eligibility: 7.5 CGPA and above</li></ul><p>Register through your dashboard before June 1, 2025.</p>',
    category: 'placement',
    audience: 'students',
    publishedAt: '2025-05-02T10:15:00Z',
    expiresAt: '2025-06-01T23:59:59Z',
    status: 'published',
    createdBy: 'Placement Officer',
    createdAt: '2025-05-01T16:20:00Z',
    updatedAt: '2025-05-02T09:50:00Z',
  },
  {
    id: '3',
    title: 'New DSA Learning Track Available',
    content: '<p>We have just released a comprehensive new learning track on Advanced Data Structures and Algorithms. This track includes:</p><ul><li>20+ interactive lessons</li><li>50+ practice problems</li><li>5 real-world projects</li></ul><p>The track is designed to prepare you for technical interviews at top tech companies.</p>',
    category: 'update',
    audience: 'students',
    publishedAt: '2025-04-20T14:00:00Z',
    status: 'published',
    createdBy: 'Content Team',
    createdAt: '2025-04-15T11:30:00Z',
    updatedAt: '2025-04-20T13:45:00Z',
  },
  {
    id: '4',
    title: 'System Maintenance: May 15',
    content: '<p>ForgeTrain will be undergoing scheduled maintenance on May 15, 2025, from 2:00 AM to 6:00 AM IST. During this time, the platform may be unavailable or experience intermittent issues.</p><p>We apologize for any inconvenience and appreciate your understanding as we work to improve the platform.</p>',
    category: 'urgent',
    audience: 'all',
    publishedAt: '2025-05-08T10:00:00Z',
    expiresAt: '2025-05-15T06:00:00Z',
    status: 'published',
    createdBy: 'Admin',
    createdAt: '2025-05-05T09:15:00Z',
    updatedAt: '2025-05-08T09:45:00Z',
  },
  {
    id: '5',
    title: 'Mentor Workshop: Effective Code Reviews',
    content: '<p>We are organizing a workshop for mentors on "Effective Code Review Techniques" to enhance the quality of feedback provided to students.</p><p><strong>Workshop Details:</strong></p><ul><li>Date: May 20, 2025</li><li>Time: 3:00 PM - 5:00 PM IST</li><li>Platform: Zoom (link will be shared via email)</li></ul><p>Attendance is highly recommended for all mentors.</p>',
    category: 'event',
    audience: 'mentors',
    publishedAt: '2025-05-10T12:00:00Z',
    expiresAt: '2025-05-20T17:00:00Z',
    status: 'published',
    createdBy: 'Mentor Coordinator',
    createdAt: '2025-05-08T14:30:00Z',
    updatedAt: '2025-05-10T11:45:00Z',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New placement drive',
    message: 'TechSolutions placement drive registration is now open',
    type: 'info',
    link: '/admin/drives/1',
    linkText: 'View Details',
    recipientIds: ['1', '2', '5', '6', '9', '10'],
    isRead: false,
    createdAt: '2025-05-02T10:20:00Z',
  },
  {
    id: '2',
    title: 'Quiz submission deadline',
    message: 'Reminder: Technical Aptitude Quiz submissions due tomorrow',
    type: 'warning',
    link: '/admin/quizzes/3',
    linkText: 'Check Status',
    recipientIds: ['1', '2', '5', '6', '9', '10'],
    isRead: true,
    createdAt: '2025-05-09T09:30:00Z',
  },
  {
    id: '3',
    title: 'New student registrations',
    message: '5 new students have registered and require approval',
    type: 'info',
    link: '/admin/users?status=pending',
    linkText: 'Review Registrations',
    recipientIds: ['4', '7', '11'],
    isRead: false,
    createdAt: '2025-05-10T14:15:00Z',
  },
  {
    id: '4',
    title: 'System update complete',
    message: 'The scheduled system maintenance has been completed successfully',
    type: 'success',
    recipientIds: ['3', '4', '7', '8', '11'],
    isRead: false,
    createdAt: '2025-05-10T06:10:00Z',
  },
];

export { mockAnnouncements, mockNotifications };
