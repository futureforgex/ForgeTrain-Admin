import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { signIn, signOut, getCurrentUser, fetchUserAttributes, signUp, confirmSignUp as confirmSignUpAmplify } from 'aws-amplify/auth';
import { 
  createTutorial, 
  updateTutorial, 
  deleteTutorial,
  createDrive,
  updateDrive,
  deleteDrive,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createCollege,
  updateCollege,
  deleteCollege,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  createLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics
} from '../graphql/mutations';
import {
  listTutorials,
  getTutorial,
  listDrives,
  getDrive,
  listQuizzes,
  getQuiz,
  listColleges,
  getCollege,
  listAnnouncements,
  getAnnouncement,
  listLeaderboards,
  getLeaderboard,
  listAnalytics,
  getAnalytics
} from '../graphql/queries';
import { 
  onCreateTutorial,
  onUpdateTutorial,
  onDeleteTutorial,
  onCreateDrive,
  onUpdateDrive,
  onDeleteDrive,
  onCreateQuiz,
  onUpdateQuiz,
  onDeleteQuiz,
  onCreateCollege,
  onUpdateCollege,
  onDeleteCollege,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onCreateLeaderboard,
  onUpdateLeaderboard,
  onDeleteLeaderboard,
  onCreateAnalytics,
  onUpdateAnalytics,
  onDeleteAnalytics
} from '../graphql/subscriptions';

// Tutorial Services
export const tutorialService = {
  async create(tutorial: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createTutorial,
        variables: { input: tutorial },
        authMode: 'userPool'
      });
      return result.data.createTutorial;
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw error;
    }
  },

  async update(tutorial: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateTutorial,
        variables: { input: tutorial },
        authMode: 'userPool'
      });
      return result.data.updateTutorial;
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteTutorial,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteTutorial;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listTutorials
      });
      return result.data.listTutorials.items;
    } catch (error) {
      console.error('Error listing tutorials:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getTutorial,
        variables: { id }
      });
      return result.data.getTutorial;
    } catch (error) {
      console.error('Error getting tutorial:', error);
      throw error;
    }
  },

  subscribeToChanges(callback: (tutorial: any) => void) {
    return generateClient().graphql({
      query: onCreateTutorial
    }).subscribe({
      next: (result) => callback(result.data.onCreateTutorial),
      error: (error) => console.error('Subscription error:', error)
    });
  }
};

// Drive Services
export const driveService = {
  async create(drive: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createDrive,
        variables: { input: drive },
        authMode: 'userPool'
      });
      return result.data.createDrive;
    } catch (error) {
      console.error('Error creating drive:', error);
      throw error;
    }
  },

  async update(drive: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateDrive,
        variables: { input: drive },
        authMode: 'userPool'
      });
      return result.data.updateDrive;
    } catch (error) {
      console.error('Error updating drive:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteDrive,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteDrive;
    } catch (error) {
      console.error('Error deleting drive:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listDrives
      });
      return result.data.listDrives.items;
    } catch (error) {
      console.error('Error listing drives:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getDrive,
        variables: { id }
      });
      return result.data.getDrive;
    } catch (error) {
      console.error('Error getting drive:', error);
      throw error;
    }
  }
};

// Quiz Services
export const quizService = {
  async create(quiz: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createQuiz,
        variables: { input: quiz },
        authMode: 'userPool'
      });
      return result.data.createQuiz;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async update(quiz: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateQuiz,
        variables: { input: quiz },
        authMode: 'userPool'
      });
      return result.data.updateQuiz;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteQuiz,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteQuiz;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listQuizzes
      });
      return result.data.listQuizzes.items;
    } catch (error) {
      console.error('Error listing quizzes:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getQuiz,
        variables: { id }
      });
      return result.data.getQuiz;
    } catch (error) {
      console.error('Error getting quiz:', error);
      throw error;
    }
  }
};

// College Services
export const collegeService = {
  async create(college: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createCollege,
        variables: { input: college },
        authMode: 'userPool'
      });
      return result.data.createCollege;
    } catch (error) {
      console.error('Error creating college:', error);
      throw error;
    }
  },

  async update(college: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateCollege,
        variables: { input: college },
        authMode: 'userPool'
      });
      return result.data.updateCollege;
    } catch (error) {
      console.error('Error updating college:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteCollege,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteCollege;
    } catch (error) {
      console.error('Error deleting college:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listColleges
      });
      return result.data.listColleges.items;
    } catch (error) {
      console.error('Error listing colleges:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getCollege,
        variables: { id }
      });
      return result.data.getCollege;
    } catch (error) {
      console.error('Error getting college:', error);
      throw error;
    }
  }
};

// Announcement Services
export const announcementService = {
  async create(announcement: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createAnnouncement,
        variables: { input: announcement },
        authMode: 'userPool'
      });
      return result.data.createAnnouncement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  async update(announcement: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateAnnouncement,
        variables: { input: announcement },
        authMode: 'userPool'
      });
      return result.data.updateAnnouncement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteAnnouncement,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteAnnouncement;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listAnnouncements
      });
      return result.data.listAnnouncements.items;
    } catch (error) {
      console.error('Error listing announcements:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getAnnouncement,
        variables: { id }
      });
      return result.data.getAnnouncement;
    } catch (error) {
      console.error('Error getting announcement:', error);
      throw error;
    }
  }
};

// Leaderboard Services
export const leaderboardService = {
  async create(leaderboard: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createLeaderboard,
        variables: { input: leaderboard },
        authMode: 'userPool'
      });
      return result.data.createLeaderboard;
    } catch (error) {
      console.error('Error creating leaderboard:', error);
      throw error;
    }
  },

  async update(leaderboard: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateLeaderboard,
        variables: { input: leaderboard },
        authMode: 'userPool'
      });
      return result.data.updateLeaderboard;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteLeaderboard,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteLeaderboard;
    } catch (error) {
      console.error('Error deleting leaderboard:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listLeaderboards
      });
      return result.data.listLeaderboards.items;
    } catch (error) {
      console.error('Error listing leaderboards:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getLeaderboard,
        variables: { id }
      });
      return result.data.getLeaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
};

// Analytics Services
export const analyticsService = {
  async create(analytics: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: createAnalytics,
        variables: { input: analytics },
        authMode: 'userPool'
      });
      return result.data.createAnalytics;
    } catch (error) {
      console.error('Error creating analytics:', error);
      throw error;
    }
  },

  async update(analytics: any) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: updateAnalytics,
        variables: { input: analytics },
        authMode: 'userPool'
      });
      return result.data.updateAnalytics;
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: deleteAnalytics,
        variables: { input: { id } },
        authMode: 'userPool'
      });
      return result.data.deleteAnalytics;
    } catch (error) {
      console.error('Error deleting analytics:', error);
      throw error;
    }
  },

  async list() {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: listAnalytics
      });
      return result.data.listAnalytics.items;
    } catch (error) {
      console.error('Error listing analytics:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const client = generateClient();
      const result = await client.graphql({
        query: getAnalytics,
        variables: { id }
      });
      return result.data.getAnalytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
};

// Storage Services
export const storageService = {
  async uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
    try {
      const key = `${folder}/${Date.now()}_${file.name}`;
      const result = await uploadData(key, file, {
        contentType: file.type,
        level: 'public'
      });
      return result.key;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async getFileUrl(key: string): Promise<string> {
    try {
      return await getUrl(key);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  async deleteFile(key: string): Promise<void> {
    try {
      await remove(key);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// Auth Services
export const authService = {
  async signUp(email: string, password: string) {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async confirmSignUp(username: string, confirmationCode: string) {
    try {
      const result = await confirmSignUpAmplify({
        username,
        confirmationCode,
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const user = await signIn({ username: email, password });
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await getCurrentUser();
    } catch (error) {
      throw error;
    }
  },

  async getCurrentAuthenticatedUser() {
    try {
      return await getCurrentUser();
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUserInfo() {
    try {
      return await fetchUserAttributes();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}; 