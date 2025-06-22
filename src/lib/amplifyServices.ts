import { API, graphqlOperation } from 'aws-amplify';
import { Storage } from 'aws-amplify/storage';
import { Auth } from 'aws-amplify/auth';
import { 
  createTutorial, 
  updateTutorial, 
  deleteTutorial, 
  listTutorials,
  getTutorial,
  createDrive,
  updateDrive,
  deleteDrive,
  listDrives,
  getDrive,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  listQuizzes,
  getQuiz,
  createCollege,
  updateCollege,
  deleteCollege,
  listColleges,
  getCollege,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  getAnnouncement,
  createLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
  listLeaderboards,
  getLeaderboard,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
  listAnalytics,
  getAnalytics
} from '../graphql/mutations';
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
      const result = await API.graphql(graphqlOperation(`
        mutation CreateTutorial($input: CreateTutorialInput!) {
          createTutorial(input: $input) {
            id
            title
            subtitle
            status
            createdAt
            updatedAt
          }
        }
      `, { input: tutorial }));
      return result.data.createTutorial;
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw error;
    }
  },

  async update(tutorial: any) {
    try {
      const result = await API.graphql(graphqlOperation(`
        mutation UpdateTutorial($input: UpdateTutorialInput!) {
          updateTutorial(input: $input) {
            id
            title
            subtitle
            status
            updatedAt
          }
        }
      `, { input: tutorial }));
      return result.data.updateTutorial;
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(`
        mutation DeleteTutorial($input: DeleteTutorialInput!) {
          deleteTutorial(input: $input) {
            id
          }
        }
      `, { input: { id } }));
      return result.data.deleteTutorial;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(`
        query ListTutorials {
          listTutorials {
            items {
              id
              tutorialId
              topicId
              title
              subtitle
              coverImageUrl
              altText
              estimatedTimeMins
              readingLevel
              preferredLearningStyle
              storyContext
              learningObjectives
              prerequisites
              biteSizeSections
              keyTakeaways
              funFact
              reflectionPrompt
              discussionThreadUrl
              progressBadge
              xpPoints
              streakMultiplier
              milestoneBadges
              spacedRepetitionId
              nextTutorialId
              body
              metaDescription
              category
              tags
              status
              publishDate
              introduction
              conclusion
              images
              diagrams
              downloadableAssets
              codeSnippets
              slug
              estimatedReadTime
              filledSummary
              builtInPoints
              createdAt
              updatedAt
              owner
            }
          }
        }
      `));
      return result.data.listTutorials.items;
    } catch (error) {
      console.error('Error listing tutorials:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(`
        query GetTutorial($id: ID!) {
          getTutorial(id: $id) {
            id
            tutorialId
            topicId
            title
            subtitle
            coverImageUrl
            altText
            estimatedTimeMins
            readingLevel
            preferredLearningStyle
            storyContext
            learningObjectives
            prerequisites
            biteSizeSections
            keyTakeaways
            funFact
            reflectionPrompt
            discussionThreadUrl
            progressBadge
            xpPoints
            streakMultiplier
            milestoneBadges
            spacedRepetitionId
            nextTutorialId
            body
            metaDescription
            category
            tags
            status
            publishDate
            introduction
            conclusion
            images
            diagrams
            downloadableAssets
            codeSnippets
            slug
            estimatedReadTime
            filledSummary
            builtInPoints
            createdAt
            updatedAt
            owner
          }
        }
      `, { id }));
      return result.data.getTutorial;
    } catch (error) {
      console.error('Error getting tutorial:', error);
      throw error;
    }
  },

  subscribeToChanges(callback: (tutorial: any) => void) {
    return API.graphql(graphqlOperation(onCreateTutorial)).subscribe({
      next: ({ value }: any) => callback(value.data.onCreateTutorial),
      error: (error: any) => console.error('Subscription error:', error)
    });
  }
};

// Drive Services
export const driveService = {
  async create(drive: any) {
    try {
      const result = await API.graphql(graphqlOperation(`
        mutation CreateDrive($input: CreateDriveInput!) {
          createDrive(input: $input) {
            id
            company
            driveTitle
            status
            createdAt
            updatedAt
          }
        }
      `, { input: drive }));
      return result.data.createDrive;
    } catch (error) {
      console.error('Error creating drive:', error);
      throw error;
    }
  },

  async update(drive: any) {
    try {
      const result = await API.graphql(graphqlOperation(`
        mutation UpdateDrive($input: UpdateDriveInput!) {
          updateDrive(input: $input) {
            id
            company
            driveTitle
            status
            updatedAt
          }
        }
      `, { input: drive }));
      return result.data.updateDrive;
    } catch (error) {
      console.error('Error updating drive:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(`
        mutation DeleteDrive($input: DeleteDriveInput!) {
          deleteDrive(input: $input) {
            id
          }
        }
      `, { input: { id } }));
      return result.data.deleteDrive;
    } catch (error) {
      console.error('Error deleting drive:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(`
        query ListDrives {
          listDrives {
            items {
              id
              company
              driveTitle
              driveType
              description
              startDate
              endDate
              location
              remote
              appLink
              branches
              years
              cgpa
              backlog
              regWindow
              seatCap
              notify
              notifTemplate
              reminders
              approval
              visibility
              module
              thumbnailUrl
              status
              createdAt
              updatedAt
              owner
            }
          }
        }
      `));
      return result.data.listDrives.items;
    } catch (error) {
      console.error('Error listing drives:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(`
        query GetDrive($id: ID!) {
          getDrive(id: $id) {
            id
            company
            driveTitle
            driveType
            description
            startDate
            endDate
            location
            remote
            appLink
            branches
            years
            cgpa
            backlog
            regWindow
            seatCap
            notify
            notifTemplate
            reminders
            approval
            visibility
            module
            thumbnailUrl
            status
            createdAt
            updatedAt
            owner
          }
        }
      `, { id }));
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
      const result = await API.graphql(graphqlOperation(createQuiz, { input: quiz }));
      return result.data.createQuiz;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async update(quiz: any) {
    try {
      const result = await API.graphql(graphqlOperation(updateQuiz, { input: quiz }));
      return result.data.updateQuiz;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(deleteQuiz, { input: { id } }));
      return result.data.deleteQuiz;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(listQuizzes));
      return result.data.listQuizzes.items;
    } catch (error) {
      console.error('Error listing quizzes:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(getQuiz, { id }));
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
      const result = await API.graphql(graphqlOperation(createCollege, { input: college }));
      return result.data.createCollege;
    } catch (error) {
      console.error('Error creating college:', error);
      throw error;
    }
  },

  async update(college: any) {
    try {
      const result = await API.graphql(graphqlOperation(updateCollege, { input: college }));
      return result.data.updateCollege;
    } catch (error) {
      console.error('Error updating college:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(deleteCollege, { input: { id } }));
      return result.data.deleteCollege;
    } catch (error) {
      console.error('Error deleting college:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(listColleges));
      return result.data.listColleges.items;
    } catch (error) {
      console.error('Error listing colleges:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(getCollege, { id }));
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
      const result = await API.graphql(graphqlOperation(createAnnouncement, { input: announcement }));
      return result.data.createAnnouncement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  async update(announcement: any) {
    try {
      const result = await API.graphql(graphqlOperation(updateAnnouncement, { input: announcement }));
      return result.data.updateAnnouncement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(deleteAnnouncement, { input: { id } }));
      return result.data.deleteAnnouncement;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(listAnnouncements));
      return result.data.listAnnouncements.items;
    } catch (error) {
      console.error('Error listing announcements:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(getAnnouncement, { id }));
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
      const result = await API.graphql(graphqlOperation(createLeaderboard, { input: leaderboard }));
      return result.data.createLeaderboard;
    } catch (error) {
      console.error('Error creating leaderboard:', error);
      throw error;
    }
  },

  async update(leaderboard: any) {
    try {
      const result = await API.graphql(graphqlOperation(updateLeaderboard, { input: leaderboard }));
      return result.data.updateLeaderboard;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(deleteLeaderboard, { input: { id } }));
      return result.data.deleteLeaderboard;
    } catch (error) {
      console.error('Error deleting leaderboard:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(listLeaderboards));
      return result.data.listLeaderboards.items;
    } catch (error) {
      console.error('Error listing leaderboards:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(getLeaderboard, { id }));
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
      const result = await API.graphql(graphqlOperation(createAnalytics, { input: analytics }));
      return result.data.createAnalytics;
    } catch (error) {
      console.error('Error creating analytics:', error);
      throw error;
    }
  },

  async update(analytics: any) {
    try {
      const result = await API.graphql(graphqlOperation(updateAnalytics, { input: analytics }));
      return result.data.updateAnalytics;
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(deleteAnalytics, { input: { id } }));
      return result.data.deleteAnalytics;
    } catch (error) {
      console.error('Error deleting analytics:', error);
      throw error;
    }
  },

  async list() {
    try {
      const result = await API.graphql(graphqlOperation(listAnalytics));
      return result.data.listAnalytics.items;
    } catch (error) {
      console.error('Error listing analytics:', error);
      throw error;
    }
  },

  async get(id: string) {
    try {
      const result = await API.graphql(graphqlOperation(getAnalytics, { id }));
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
      const result = await Storage.put(key, file, {
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
      return await Storage.get(key);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  async deleteFile(key: string): Promise<void> {
    try {
      await Storage.remove(key);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};

// Auth Services
export const authService = {
  async signIn(email: string, password: string) {
    try {
      const user = await Auth.signIn(email, password);
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await Auth.getCurrentUser();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async getCurrentAuthenticatedUser() {
    try {
      return await Auth.getCurrentAuthenticatedUser();
    } catch (error) {
      console.error('Error getting authenticated user:', error);
      return null;
    }
  },

  async getCurrentUserInfo() {
    try {
      return await Auth.getCurrentUserInfo();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}; 