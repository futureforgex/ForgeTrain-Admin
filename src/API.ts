/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateTutorialInput = {
  id?: string | null,
  tutorialId: string,
  topicId: string,
  title: string,
  subtitle?: string | null,
  coverImageUrl?: string | null,
  altText?: string | null,
  estimatedTimeMins?: number | null,
  readingLevel?: string | null,
  preferredLearningStyle?: Array< string | null > | null,
  storyContext?: string | null,
  learningObjectives?: Array< string | null > | null,
  prerequisites?: Array< string | null > | null,
  biteSizeSections?: Array< BiteSizeSectionInput | null > | null,
  keyTakeaways?: Array< string | null > | null,
  funFact?: string | null,
  reflectionPrompt?: string | null,
  discussionThreadUrl?: string | null,
  progressBadge?: string | null,
  xpPoints?: number | null,
  streakMultiplier?: boolean | null,
  milestoneBadges?: Array< string | null > | null,
  spacedRepetitionId?: string | null,
  nextTutorialId?: string | null,
  body?: string | null,
  metaDescription?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  status?: string | null,
  publishDate?: string | null,
  introduction?: string | null,
  conclusion?: string | null,
  images?: Array< ImageInput | null > | null,
  diagrams?: Array< ImageInput | null > | null,
  downloadableAssets?: Array< AssetInput | null > | null,
  codeSnippets?: Array< CodeSnippetInput | null > | null,
  slug?: string | null,
  estimatedReadTime?: number | null,
  filledSummary?: string | null,
  builtInPoints?: Array< string | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type BiteSizeSectionInput = {
  sectionId: string,
  heading: string,
  contentMd?: string | null,
  humorTip?: string | null,
  mnemonic?: string | null,
  codeSnippet?: CodeSnippetDataInput | null,
  challengePrompt?: string | null,
  sectionQuiz?: Array< QuizQuestionInput | null > | null,
  playgroundEmbedId?: string | null,
  autoCheckSnippet?: boolean | null,
};

export type CodeSnippetDataInput = {
  language?: string | null,
  code?: string | null,
  explanations?: Array< string | null > | null,
};

export type QuizQuestionInput = {
  question: string,
  options: Array< string | null >,
  correctAnswer: number,
  explanation?: string | null,
};

export type ImageInput = {
  url: string,
  alt: string,
};

export type AssetInput = {
  url: string,
  name: string,
  type: string,
};

export type CodeSnippetInput = {
  url: string,
  name: string,
};

export type ModelTutorialConditionInput = {
  tutorialId?: ModelStringInput | null,
  topicId?: ModelStringInput | null,
  title?: ModelStringInput | null,
  subtitle?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  altText?: ModelStringInput | null,
  estimatedTimeMins?: ModelIntInput | null,
  readingLevel?: ModelStringInput | null,
  preferredLearningStyle?: ModelStringInput | null,
  storyContext?: ModelStringInput | null,
  learningObjectives?: ModelStringInput | null,
  prerequisites?: ModelStringInput | null,
  keyTakeaways?: ModelStringInput | null,
  funFact?: ModelStringInput | null,
  reflectionPrompt?: ModelStringInput | null,
  discussionThreadUrl?: ModelStringInput | null,
  progressBadge?: ModelStringInput | null,
  xpPoints?: ModelIntInput | null,
  streakMultiplier?: ModelBooleanInput | null,
  milestoneBadges?: ModelStringInput | null,
  spacedRepetitionId?: ModelStringInput | null,
  nextTutorialId?: ModelStringInput | null,
  body?: ModelStringInput | null,
  metaDescription?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  status?: ModelStringInput | null,
  publishDate?: ModelStringInput | null,
  introduction?: ModelStringInput | null,
  conclusion?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  estimatedReadTime?: ModelIntInput | null,
  filledSummary?: ModelStringInput | null,
  builtInPoints?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelTutorialConditionInput | null > | null,
  or?: Array< ModelTutorialConditionInput | null > | null,
  not?: ModelTutorialConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Tutorial = {
  __typename: "Tutorial",
  id: string,
  tutorialId: string,
  topicId: string,
  title: string,
  subtitle?: string | null,
  coverImageUrl?: string | null,
  altText?: string | null,
  estimatedTimeMins?: number | null,
  readingLevel?: string | null,
  preferredLearningStyle?: Array< string | null > | null,
  storyContext?: string | null,
  learningObjectives?: Array< string | null > | null,
  prerequisites?: Array< string | null > | null,
  biteSizeSections?:  Array<BiteSizeSection | null > | null,
  keyTakeaways?: Array< string | null > | null,
  funFact?: string | null,
  reflectionPrompt?: string | null,
  discussionThreadUrl?: string | null,
  progressBadge?: string | null,
  xpPoints?: number | null,
  streakMultiplier?: boolean | null,
  milestoneBadges?: Array< string | null > | null,
  spacedRepetitionId?: string | null,
  nextTutorialId?: string | null,
  body?: string | null,
  metaDescription?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  status?: string | null,
  publishDate?: string | null,
  introduction?: string | null,
  conclusion?: string | null,
  images?:  Array<Image | null > | null,
  diagrams?:  Array<Image | null > | null,
  downloadableAssets?:  Array<Asset | null > | null,
  codeSnippets?:  Array<CodeSnippet | null > | null,
  slug?: string | null,
  estimatedReadTime?: number | null,
  filledSummary?: string | null,
  builtInPoints?: Array< string | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type BiteSizeSection = {
  __typename: "BiteSizeSection",
  sectionId: string,
  heading: string,
  contentMd?: string | null,
  humorTip?: string | null,
  mnemonic?: string | null,
  codeSnippet?: CodeSnippetData | null,
  challengePrompt?: string | null,
  sectionQuiz?:  Array<QuizQuestion | null > | null,
  playgroundEmbedId?: string | null,
  autoCheckSnippet?: boolean | null,
};

export type CodeSnippetData = {
  __typename: "CodeSnippetData",
  language?: string | null,
  code?: string | null,
  explanations?: Array< string | null > | null,
};

export type QuizQuestion = {
  __typename: "QuizQuestion",
  question: string,
  options: Array< string | null >,
  correctAnswer: number,
  explanation?: string | null,
};

export type Image = {
  __typename: "Image",
  url: string,
  alt: string,
};

export type Asset = {
  __typename: "Asset",
  url: string,
  name: string,
  type: string,
};

export type CodeSnippet = {
  __typename: "CodeSnippet",
  url: string,
  name: string,
};

export type UpdateTutorialInput = {
  id: string,
  tutorialId?: string | null,
  topicId?: string | null,
  title?: string | null,
  subtitle?: string | null,
  coverImageUrl?: string | null,
  altText?: string | null,
  estimatedTimeMins?: number | null,
  readingLevel?: string | null,
  preferredLearningStyle?: Array< string | null > | null,
  storyContext?: string | null,
  learningObjectives?: Array< string | null > | null,
  prerequisites?: Array< string | null > | null,
  biteSizeSections?: Array< BiteSizeSectionInput | null > | null,
  keyTakeaways?: Array< string | null > | null,
  funFact?: string | null,
  reflectionPrompt?: string | null,
  discussionThreadUrl?: string | null,
  progressBadge?: string | null,
  xpPoints?: number | null,
  streakMultiplier?: boolean | null,
  milestoneBadges?: Array< string | null > | null,
  spacedRepetitionId?: string | null,
  nextTutorialId?: string | null,
  body?: string | null,
  metaDescription?: string | null,
  category?: string | null,
  tags?: Array< string | null > | null,
  status?: string | null,
  publishDate?: string | null,
  introduction?: string | null,
  conclusion?: string | null,
  images?: Array< ImageInput | null > | null,
  diagrams?: Array< ImageInput | null > | null,
  downloadableAssets?: Array< AssetInput | null > | null,
  codeSnippets?: Array< CodeSnippetInput | null > | null,
  slug?: string | null,
  estimatedReadTime?: number | null,
  filledSummary?: string | null,
  builtInPoints?: Array< string | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteTutorialInput = {
  id: string,
};

export type CreateDriveInput = {
  id?: string | null,
  company?: string | null,
  driveTitle?: string | null,
  driveType?: string | null,
  description?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  location?: string | null,
  remote?: boolean | null,
  appLink?: string | null,
  branches?: Array< string | null > | null,
  years?: Array< string | null > | null,
  cgpa?: string | null,
  backlog?: string | null,
  regWindow?: string | null,
  seatCap?: string | null,
  notify?: boolean | null,
  notifTemplate?: string | null,
  reminders?: Array< string | null > | null,
  approval?: string | null,
  visibility?: string | null,
  module?: string | null,
  thumbnailUrl?: string | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type ModelDriveConditionInput = {
  company?: ModelStringInput | null,
  driveTitle?: ModelStringInput | null,
  driveType?: ModelStringInput | null,
  description?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  location?: ModelStringInput | null,
  remote?: ModelBooleanInput | null,
  appLink?: ModelStringInput | null,
  branches?: ModelStringInput | null,
  years?: ModelStringInput | null,
  cgpa?: ModelStringInput | null,
  backlog?: ModelStringInput | null,
  regWindow?: ModelStringInput | null,
  seatCap?: ModelStringInput | null,
  notify?: ModelBooleanInput | null,
  notifTemplate?: ModelStringInput | null,
  reminders?: ModelStringInput | null,
  approval?: ModelStringInput | null,
  visibility?: ModelStringInput | null,
  module?: ModelStringInput | null,
  thumbnailUrl?: ModelStringInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelDriveConditionInput | null > | null,
  or?: Array< ModelDriveConditionInput | null > | null,
  not?: ModelDriveConditionInput | null,
};

export type Drive = {
  __typename: "Drive",
  id: string,
  company?: string | null,
  driveTitle?: string | null,
  driveType?: string | null,
  description?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  location?: string | null,
  remote?: boolean | null,
  appLink?: string | null,
  branches?: Array< string | null > | null,
  years?: Array< string | null > | null,
  cgpa?: string | null,
  backlog?: string | null,
  regWindow?: string | null,
  seatCap?: string | null,
  notify?: boolean | null,
  notifTemplate?: string | null,
  reminders?: Array< string | null > | null,
  approval?: string | null,
  visibility?: string | null,
  module?: string | null,
  thumbnailUrl?: string | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type UpdateDriveInput = {
  id: string,
  company?: string | null,
  driveTitle?: string | null,
  driveType?: string | null,
  description?: string | null,
  startDate?: string | null,
  endDate?: string | null,
  location?: string | null,
  remote?: boolean | null,
  appLink?: string | null,
  branches?: Array< string | null > | null,
  years?: Array< string | null > | null,
  cgpa?: string | null,
  backlog?: string | null,
  regWindow?: string | null,
  seatCap?: string | null,
  notify?: boolean | null,
  notifTemplate?: string | null,
  reminders?: Array< string | null > | null,
  approval?: string | null,
  visibility?: string | null,
  module?: string | null,
  thumbnailUrl?: string | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteDriveInput = {
  id: string,
};

export type CreateQuizInput = {
  id?: string | null,
  title: string,
  slug?: string | null,
  description?: string | null,
  category?: string | null,
  totalTime?: number | null,
  passingScore?: number | null,
  tags?: Array< string | null > | null,
  questions?: Array< QuizQuestionInput | null > | null,
  settings?: QuizSettingsInput | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type QuizSettingsInput = {
  allowRetake?: boolean | null,
  showResults?: boolean | null,
  timeLimit?: number | null,
  shuffleQuestions?: boolean | null,
};

export type ModelQuizConditionInput = {
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  description?: ModelStringInput | null,
  category?: ModelStringInput | null,
  totalTime?: ModelIntInput | null,
  passingScore?: ModelIntInput | null,
  tags?: ModelStringInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelQuizConditionInput | null > | null,
  or?: Array< ModelQuizConditionInput | null > | null,
  not?: ModelQuizConditionInput | null,
};

export type Quiz = {
  __typename: "Quiz",
  id: string,
  title: string,
  slug?: string | null,
  description?: string | null,
  category?: string | null,
  totalTime?: number | null,
  passingScore?: number | null,
  tags?: Array< string | null > | null,
  questions?:  Array<QuizQuestion | null > | null,
  settings?: QuizSettings | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type QuizSettings = {
  __typename: "QuizSettings",
  allowRetake?: boolean | null,
  showResults?: boolean | null,
  timeLimit?: number | null,
  shuffleQuestions?: boolean | null,
};

export type UpdateQuizInput = {
  id: string,
  title?: string | null,
  slug?: string | null,
  description?: string | null,
  category?: string | null,
  totalTime?: number | null,
  passingScore?: number | null,
  tags?: Array< string | null > | null,
  questions?: Array< QuizQuestionInput | null > | null,
  settings?: QuizSettingsInput | null,
  status?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteQuizInput = {
  id: string,
};

export type CreateCollegeInput = {
  id?: string | null,
  name: string,
  code: string,
  type: string,
  website?: string | null,
  logo?: string | null,
  address?: AddressInput | null,
  contact?: ContactInput | null,
  status: string,
  hasDepartments: boolean,
  notes?: string | null,
  departments?: Array< DepartmentInput | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type AddressInput = {
  line1: string,
  line2?: string | null,
  city: string,
  state: string,
  pinCode: string,
};

export type ContactInput = {
  name: string,
  email: string,
  phone: string,
};

export type DepartmentInput = {
  id: string,
  name: string,
  level: string,
  hod: string,
  status: string,
};

export type ModelCollegeConditionInput = {
  name?: ModelStringInput | null,
  code?: ModelStringInput | null,
  type?: ModelStringInput | null,
  website?: ModelStringInput | null,
  logo?: ModelStringInput | null,
  status?: ModelStringInput | null,
  hasDepartments?: ModelBooleanInput | null,
  notes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelCollegeConditionInput | null > | null,
  or?: Array< ModelCollegeConditionInput | null > | null,
  not?: ModelCollegeConditionInput | null,
};

export type College = {
  __typename: "College",
  id: string,
  name: string,
  code: string,
  type: string,
  website?: string | null,
  logo?: string | null,
  address?: Address | null,
  contact?: Contact | null,
  status: string,
  hasDepartments: boolean,
  notes?: string | null,
  departments?:  Array<Department | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type Address = {
  __typename: "Address",
  line1: string,
  line2?: string | null,
  city: string,
  state: string,
  pinCode: string,
};

export type Contact = {
  __typename: "Contact",
  name: string,
  email: string,
  phone: string,
};

export type Department = {
  __typename: "Department",
  id: string,
  name: string,
  level: string,
  hod: string,
  status: string,
};

export type UpdateCollegeInput = {
  id: string,
  name?: string | null,
  code?: string | null,
  type?: string | null,
  website?: string | null,
  logo?: string | null,
  address?: AddressInput | null,
  contact?: ContactInput | null,
  status?: string | null,
  hasDepartments?: boolean | null,
  notes?: string | null,
  departments?: Array< DepartmentInput | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteCollegeInput = {
  id: string,
};

export type CreateAnnouncementInput = {
  id?: string | null,
  title: string,
  content: string,
  category?: string | null,
  priority?: string | null,
  targetAudience?: Array< string | null > | null,
  publishDate?: string | null,
  expiryDate?: string | null,
  status?: string | null,
  createdBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type ModelAnnouncementConditionInput = {
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  category?: ModelStringInput | null,
  priority?: ModelStringInput | null,
  targetAudience?: ModelStringInput | null,
  publishDate?: ModelStringInput | null,
  expiryDate?: ModelStringInput | null,
  status?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelAnnouncementConditionInput | null > | null,
  or?: Array< ModelAnnouncementConditionInput | null > | null,
  not?: ModelAnnouncementConditionInput | null,
};

export type Announcement = {
  __typename: "Announcement",
  id: string,
  title: string,
  content: string,
  category?: string | null,
  priority?: string | null,
  targetAudience?: Array< string | null > | null,
  publishDate?: string | null,
  expiryDate?: string | null,
  status?: string | null,
  createdBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type UpdateAnnouncementInput = {
  id: string,
  title?: string | null,
  content?: string | null,
  category?: string | null,
  priority?: string | null,
  targetAudience?: Array< string | null > | null,
  publishDate?: string | null,
  expiryDate?: string | null,
  status?: string | null,
  createdBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteAnnouncementInput = {
  id: string,
};

export type CreateLeaderboardInput = {
  id?: string | null,
  userId: string,
  username: string,
  totalPoints?: number | null,
  rank?: number | null,
  badges?: Array< string | null > | null,
  achievements?: Array< string | null > | null,
  streakDays?: number | null,
  lastActivity?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type ModelLeaderboardConditionInput = {
  userId?: ModelStringInput | null,
  username?: ModelStringInput | null,
  totalPoints?: ModelIntInput | null,
  rank?: ModelIntInput | null,
  badges?: ModelStringInput | null,
  achievements?: ModelStringInput | null,
  streakDays?: ModelIntInput | null,
  lastActivity?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelLeaderboardConditionInput | null > | null,
  or?: Array< ModelLeaderboardConditionInput | null > | null,
  not?: ModelLeaderboardConditionInput | null,
};

export type Leaderboard = {
  __typename: "Leaderboard",
  id: string,
  userId: string,
  username: string,
  totalPoints?: number | null,
  rank?: number | null,
  badges?: Array< string | null > | null,
  achievements?: Array< string | null > | null,
  streakDays?: number | null,
  lastActivity?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type UpdateLeaderboardInput = {
  id: string,
  userId?: string | null,
  username?: string | null,
  totalPoints?: number | null,
  rank?: number | null,
  badges?: Array< string | null > | null,
  achievements?: Array< string | null > | null,
  streakDays?: number | null,
  lastActivity?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type DeleteLeaderboardInput = {
  id: string,
};

export type CreateAnalyticsInput = {
  id?: string | null,
  eventType: string,
  userId?: string | null,
  sessionId?: string | null,
  pageUrl?: string | null,
  referrer?: string | null,
  userAgent?: string | null,
  ipAddress?: string | null,
  eventData?: string | null,
  createdAt?: string | null,
  owner?: string | null,
};

export type ModelAnalyticsConditionInput = {
  eventType?: ModelStringInput | null,
  userId?: ModelStringInput | null,
  sessionId?: ModelStringInput | null,
  pageUrl?: ModelStringInput | null,
  referrer?: ModelStringInput | null,
  userAgent?: ModelStringInput | null,
  ipAddress?: ModelStringInput | null,
  eventData?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelAnalyticsConditionInput | null > | null,
  or?: Array< ModelAnalyticsConditionInput | null > | null,
  not?: ModelAnalyticsConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Analytics = {
  __typename: "Analytics",
  id: string,
  eventType: string,
  userId?: string | null,
  sessionId?: string | null,
  pageUrl?: string | null,
  referrer?: string | null,
  userAgent?: string | null,
  ipAddress?: string | null,
  eventData?: string | null,
  createdAt?: string | null,
  owner?: string | null,
  updatedAt: string,
};

export type UpdateAnalyticsInput = {
  id: string,
  eventType?: string | null,
  userId?: string | null,
  sessionId?: string | null,
  pageUrl?: string | null,
  referrer?: string | null,
  userAgent?: string | null,
  ipAddress?: string | null,
  eventData?: string | null,
  createdAt?: string | null,
  owner?: string | null,
};

export type DeleteAnalyticsInput = {
  id: string,
};

export type CreateModuleInput = {
  id?: string | null,
  title: string,
  subtitle?: string | null,
  description?: string | null,
  track?: string | null,
  difficulty?: string | null,
  estimatedTime?: number | null,
  tags?: Array< string | null > | null,
  thumbnailUrl?: string | null,
  status?: string | null,
  goLiveDate?: string | null,
  prerequisites?: Array< string | null > | null,
  visibility?: string | null,
  completionCriteria?: CompletionCriteriaInput | null,
  is_archived?: boolean | null,
  created_at?: string | null,
  updated_at?: string | null,
  owner?: string | null,
};

export type CompletionCriteriaInput = {
  allLessonsComplete?: boolean | null,
  passQuiz?: boolean | null,
  projectComplete?: boolean | null,
};

export type ModelModuleConditionInput = {
  title?: ModelStringInput | null,
  subtitle?: ModelStringInput | null,
  description?: ModelStringInput | null,
  track?: ModelStringInput | null,
  difficulty?: ModelStringInput | null,
  estimatedTime?: ModelIntInput | null,
  tags?: ModelStringInput | null,
  thumbnailUrl?: ModelStringInput | null,
  status?: ModelStringInput | null,
  goLiveDate?: ModelStringInput | null,
  prerequisites?: ModelStringInput | null,
  visibility?: ModelStringInput | null,
  is_archived?: ModelBooleanInput | null,
  created_at?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelModuleConditionInput | null > | null,
  or?: Array< ModelModuleConditionInput | null > | null,
  not?: ModelModuleConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Module = {
  __typename: "Module",
  id: string,
  title: string,
  subtitle?: string | null,
  description?: string | null,
  track?: string | null,
  difficulty?: string | null,
  estimatedTime?: number | null,
  tags?: Array< string | null > | null,
  thumbnailUrl?: string | null,
  status?: string | null,
  goLiveDate?: string | null,
  prerequisites?: Array< string | null > | null,
  visibility?: string | null,
  completionCriteria?: CompletionCriteria | null,
  is_archived?: boolean | null,
  created_at?: string | null,
  updated_at?: string | null,
  lessons?: ModelLessonConnection | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type CompletionCriteria = {
  __typename: "CompletionCriteria",
  allLessonsComplete?: boolean | null,
  passQuiz?: boolean | null,
  projectComplete?: boolean | null,
};

export type ModelLessonConnection = {
  __typename: "ModelLessonConnection",
  items:  Array<Lesson | null >,
  nextToken?: string | null,
};

export type Lesson = {
  __typename: "Lesson",
  id: string,
  title: string,
  type?: string | null,
  status?: string | null,
  resourceId?: string | null,
  module?: Module | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
  moduleLessonsId?: string | null,
};

export type UpdateModuleInput = {
  id: string,
  title?: string | null,
  subtitle?: string | null,
  description?: string | null,
  track?: string | null,
  difficulty?: string | null,
  estimatedTime?: number | null,
  tags?: Array< string | null > | null,
  thumbnailUrl?: string | null,
  status?: string | null,
  goLiveDate?: string | null,
  prerequisites?: Array< string | null > | null,
  visibility?: string | null,
  completionCriteria?: CompletionCriteriaInput | null,
  is_archived?: boolean | null,
  created_at?: string | null,
  updated_at?: string | null,
  owner?: string | null,
};

export type DeleteModuleInput = {
  id: string,
};

export type CreateLessonInput = {
  id?: string | null,
  title: string,
  type?: string | null,
  status?: string | null,
  resourceId?: string | null,
  owner?: string | null,
  moduleLessonsId?: string | null,
};

export type ModelLessonConditionInput = {
  title?: ModelStringInput | null,
  type?: ModelStringInput | null,
  status?: ModelStringInput | null,
  resourceId?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelLessonConditionInput | null > | null,
  or?: Array< ModelLessonConditionInput | null > | null,
  not?: ModelLessonConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  moduleLessonsId?: ModelIDInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateLessonInput = {
  id: string,
  title?: string | null,
  type?: string | null,
  status?: string | null,
  resourceId?: string | null,
  owner?: string | null,
  moduleLessonsId?: string | null,
};

export type DeleteLessonInput = {
  id: string,
};

export type CreateChallengeInput = {
  id?: string | null,
  title: string,
  slug: string,
  description?: string | null,
  tags?: Array< string | null > | null,
  difficulty?: string | null,
  xp_points?: number | null,
  code_templates?: string | null,
  time_limit_ms?: number | null,
  memory_limit_mb?: number | null,
  input_constraints?: string | null,
  examples?: Array< ExampleInput | null > | null,
  sample_tests?: Array< TestCaseInput | null > | null,
  hidden_tests?: Array< TestCaseInput | null > | null,
  hints?: Array< string | null > | null,
  algorithm_overview?: string | null,
  step_by_step_solution?: Array< SolutionStepInput | null > | null,
  full_editorial?: string | null,
  discussion_enabled?: boolean | null,
  discussion_threads?: Array< string | null > | null,
  comments_count?: number | null,
  submissions_count?: number | null,
  accepted_count?: number | null,
  acceptance_rate?: number | null,
  average_runtime_ms?: number | null,
  average_memory_mb?: number | null,
  company_tags?: Array< string | null > | null,
  contest_id?: string | null,
  premium_only?: boolean | null,
  translations?: string | null,
  diagram_images?: Array< string | null > | null,
  solution_videos?: Array< string | null > | null,
  created_at?: string | null,
  updated_at?: string | null,
  version?: number | null,
  owner?: string | null,
};

export type ExampleInput = {
  input?: string | null,
  output?: string | null,
  explanation?: string | null,
};

export type TestCaseInput = {
  input?: string | null,
  output?: string | null,
};

export type SolutionStepInput = {
  step_number?: number | null,
  explanation?: string | null,
  pseudocode?: string | null,
};

export type ModelChallengeConditionInput = {
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  description?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  difficulty?: ModelStringInput | null,
  xp_points?: ModelIntInput | null,
  code_templates?: ModelStringInput | null,
  time_limit_ms?: ModelIntInput | null,
  memory_limit_mb?: ModelIntInput | null,
  input_constraints?: ModelStringInput | null,
  hints?: ModelStringInput | null,
  algorithm_overview?: ModelStringInput | null,
  full_editorial?: ModelStringInput | null,
  discussion_enabled?: ModelBooleanInput | null,
  discussion_threads?: ModelStringInput | null,
  comments_count?: ModelIntInput | null,
  submissions_count?: ModelIntInput | null,
  accepted_count?: ModelIntInput | null,
  acceptance_rate?: ModelFloatInput | null,
  average_runtime_ms?: ModelIntInput | null,
  average_memory_mb?: ModelIntInput | null,
  company_tags?: ModelStringInput | null,
  contest_id?: ModelStringInput | null,
  premium_only?: ModelBooleanInput | null,
  translations?: ModelStringInput | null,
  diagram_images?: ModelStringInput | null,
  solution_videos?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  version?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelChallengeConditionInput | null > | null,
  or?: Array< ModelChallengeConditionInput | null > | null,
  not?: ModelChallengeConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Challenge = {
  __typename: "Challenge",
  id: string,
  title: string,
  slug: string,
  description?: string | null,
  tags?: Array< string | null > | null,
  difficulty?: string | null,
  xp_points?: number | null,
  code_templates?: string | null,
  time_limit_ms?: number | null,
  memory_limit_mb?: number | null,
  input_constraints?: string | null,
  examples?:  Array<Example | null > | null,
  sample_tests?:  Array<TestCase | null > | null,
  hidden_tests?:  Array<TestCase | null > | null,
  hints?: Array< string | null > | null,
  algorithm_overview?: string | null,
  step_by_step_solution?:  Array<SolutionStep | null > | null,
  full_editorial?: string | null,
  discussion_enabled?: boolean | null,
  discussion_threads?: Array< string | null > | null,
  comments_count?: number | null,
  submissions_count?: number | null,
  accepted_count?: number | null,
  acceptance_rate?: number | null,
  average_runtime_ms?: number | null,
  average_memory_mb?: number | null,
  company_tags?: Array< string | null > | null,
  contest_id?: string | null,
  premium_only?: boolean | null,
  translations?: string | null,
  diagram_images?: Array< string | null > | null,
  solution_videos?: Array< string | null > | null,
  created_at?: string | null,
  updated_at?: string | null,
  version?: number | null,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type Example = {
  __typename: "Example",
  input?: string | null,
  output?: string | null,
  explanation?: string | null,
};

export type TestCase = {
  __typename: "TestCase",
  input?: string | null,
  output?: string | null,
};

export type SolutionStep = {
  __typename: "SolutionStep",
  step_number?: number | null,
  explanation?: string | null,
  pseudocode?: string | null,
};

export type UpdateChallengeInput = {
  id: string,
  title?: string | null,
  slug?: string | null,
  description?: string | null,
  tags?: Array< string | null > | null,
  difficulty?: string | null,
  xp_points?: number | null,
  code_templates?: string | null,
  time_limit_ms?: number | null,
  memory_limit_mb?: number | null,
  input_constraints?: string | null,
  examples?: Array< ExampleInput | null > | null,
  sample_tests?: Array< TestCaseInput | null > | null,
  hidden_tests?: Array< TestCaseInput | null > | null,
  hints?: Array< string | null > | null,
  algorithm_overview?: string | null,
  step_by_step_solution?: Array< SolutionStepInput | null > | null,
  full_editorial?: string | null,
  discussion_enabled?: boolean | null,
  discussion_threads?: Array< string | null > | null,
  comments_count?: number | null,
  submissions_count?: number | null,
  accepted_count?: number | null,
  acceptance_rate?: number | null,
  average_runtime_ms?: number | null,
  average_memory_mb?: number | null,
  company_tags?: Array< string | null > | null,
  contest_id?: string | null,
  premium_only?: boolean | null,
  translations?: string | null,
  diagram_images?: Array< string | null > | null,
  solution_videos?: Array< string | null > | null,
  created_at?: string | null,
  updated_at?: string | null,
  version?: number | null,
  owner?: string | null,
};

export type DeleteChallengeInput = {
  id: string,
};

export type ModelTutorialFilterInput = {
  id?: ModelIDInput | null,
  tutorialId?: ModelStringInput | null,
  topicId?: ModelStringInput | null,
  title?: ModelStringInput | null,
  subtitle?: ModelStringInput | null,
  coverImageUrl?: ModelStringInput | null,
  altText?: ModelStringInput | null,
  estimatedTimeMins?: ModelIntInput | null,
  readingLevel?: ModelStringInput | null,
  preferredLearningStyle?: ModelStringInput | null,
  storyContext?: ModelStringInput | null,
  learningObjectives?: ModelStringInput | null,
  prerequisites?: ModelStringInput | null,
  keyTakeaways?: ModelStringInput | null,
  funFact?: ModelStringInput | null,
  reflectionPrompt?: ModelStringInput | null,
  discussionThreadUrl?: ModelStringInput | null,
  progressBadge?: ModelStringInput | null,
  xpPoints?: ModelIntInput | null,
  streakMultiplier?: ModelBooleanInput | null,
  milestoneBadges?: ModelStringInput | null,
  spacedRepetitionId?: ModelStringInput | null,
  nextTutorialId?: ModelStringInput | null,
  body?: ModelStringInput | null,
  metaDescription?: ModelStringInput | null,
  category?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  status?: ModelStringInput | null,
  publishDate?: ModelStringInput | null,
  introduction?: ModelStringInput | null,
  conclusion?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  estimatedReadTime?: ModelIntInput | null,
  filledSummary?: ModelStringInput | null,
  builtInPoints?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelTutorialFilterInput | null > | null,
  or?: Array< ModelTutorialFilterInput | null > | null,
  not?: ModelTutorialFilterInput | null,
};

export type ModelTutorialConnection = {
  __typename: "ModelTutorialConnection",
  items:  Array<Tutorial | null >,
  nextToken?: string | null,
};

export type ModelDriveFilterInput = {
  id?: ModelIDInput | null,
  company?: ModelStringInput | null,
  driveTitle?: ModelStringInput | null,
  driveType?: ModelStringInput | null,
  description?: ModelStringInput | null,
  startDate?: ModelStringInput | null,
  endDate?: ModelStringInput | null,
  location?: ModelStringInput | null,
  remote?: ModelBooleanInput | null,
  appLink?: ModelStringInput | null,
  branches?: ModelStringInput | null,
  years?: ModelStringInput | null,
  cgpa?: ModelStringInput | null,
  backlog?: ModelStringInput | null,
  regWindow?: ModelStringInput | null,
  seatCap?: ModelStringInput | null,
  notify?: ModelBooleanInput | null,
  notifTemplate?: ModelStringInput | null,
  reminders?: ModelStringInput | null,
  approval?: ModelStringInput | null,
  visibility?: ModelStringInput | null,
  module?: ModelStringInput | null,
  thumbnailUrl?: ModelStringInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelDriveFilterInput | null > | null,
  or?: Array< ModelDriveFilterInput | null > | null,
  not?: ModelDriveFilterInput | null,
};

export type ModelDriveConnection = {
  __typename: "ModelDriveConnection",
  items:  Array<Drive | null >,
  nextToken?: string | null,
};

export type ModelQuizFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  description?: ModelStringInput | null,
  category?: ModelStringInput | null,
  totalTime?: ModelIntInput | null,
  passingScore?: ModelIntInput | null,
  tags?: ModelStringInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelQuizFilterInput | null > | null,
  or?: Array< ModelQuizFilterInput | null > | null,
  not?: ModelQuizFilterInput | null,
};

export type ModelQuizConnection = {
  __typename: "ModelQuizConnection",
  items:  Array<Quiz | null >,
  nextToken?: string | null,
};

export type ModelCollegeFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  code?: ModelStringInput | null,
  type?: ModelStringInput | null,
  website?: ModelStringInput | null,
  logo?: ModelStringInput | null,
  status?: ModelStringInput | null,
  hasDepartments?: ModelBooleanInput | null,
  notes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelCollegeFilterInput | null > | null,
  or?: Array< ModelCollegeFilterInput | null > | null,
  not?: ModelCollegeFilterInput | null,
};

export type ModelCollegeConnection = {
  __typename: "ModelCollegeConnection",
  items:  Array<College | null >,
  nextToken?: string | null,
};

export type ModelAnnouncementFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  category?: ModelStringInput | null,
  priority?: ModelStringInput | null,
  targetAudience?: ModelStringInput | null,
  publishDate?: ModelStringInput | null,
  expiryDate?: ModelStringInput | null,
  status?: ModelStringInput | null,
  createdBy?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelAnnouncementFilterInput | null > | null,
  or?: Array< ModelAnnouncementFilterInput | null > | null,
  not?: ModelAnnouncementFilterInput | null,
};

export type ModelAnnouncementConnection = {
  __typename: "ModelAnnouncementConnection",
  items:  Array<Announcement | null >,
  nextToken?: string | null,
};

export type ModelLeaderboardFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelStringInput | null,
  username?: ModelStringInput | null,
  totalPoints?: ModelIntInput | null,
  rank?: ModelIntInput | null,
  badges?: ModelStringInput | null,
  achievements?: ModelStringInput | null,
  streakDays?: ModelIntInput | null,
  lastActivity?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelLeaderboardFilterInput | null > | null,
  or?: Array< ModelLeaderboardFilterInput | null > | null,
  not?: ModelLeaderboardFilterInput | null,
};

export type ModelLeaderboardConnection = {
  __typename: "ModelLeaderboardConnection",
  items:  Array<Leaderboard | null >,
  nextToken?: string | null,
};

export type ModelAnalyticsFilterInput = {
  id?: ModelIDInput | null,
  eventType?: ModelStringInput | null,
  userId?: ModelStringInput | null,
  sessionId?: ModelStringInput | null,
  pageUrl?: ModelStringInput | null,
  referrer?: ModelStringInput | null,
  userAgent?: ModelStringInput | null,
  ipAddress?: ModelStringInput | null,
  eventData?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAnalyticsFilterInput | null > | null,
  or?: Array< ModelAnalyticsFilterInput | null > | null,
  not?: ModelAnalyticsFilterInput | null,
};

export type ModelAnalyticsConnection = {
  __typename: "ModelAnalyticsConnection",
  items:  Array<Analytics | null >,
  nextToken?: string | null,
};

export type ModelModuleFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  subtitle?: ModelStringInput | null,
  description?: ModelStringInput | null,
  track?: ModelStringInput | null,
  difficulty?: ModelStringInput | null,
  estimatedTime?: ModelIntInput | null,
  tags?: ModelStringInput | null,
  thumbnailUrl?: ModelStringInput | null,
  status?: ModelStringInput | null,
  goLiveDate?: ModelStringInput | null,
  prerequisites?: ModelStringInput | null,
  visibility?: ModelStringInput | null,
  is_archived?: ModelBooleanInput | null,
  created_at?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelModuleFilterInput | null > | null,
  or?: Array< ModelModuleFilterInput | null > | null,
  not?: ModelModuleFilterInput | null,
};

export type ModelModuleConnection = {
  __typename: "ModelModuleConnection",
  items:  Array<Module | null >,
  nextToken?: string | null,
};

export type ModelLessonFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  type?: ModelStringInput | null,
  status?: ModelStringInput | null,
  resourceId?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelLessonFilterInput | null > | null,
  or?: Array< ModelLessonFilterInput | null > | null,
  not?: ModelLessonFilterInput | null,
  moduleLessonsId?: ModelIDInput | null,
};

export type ModelChallengeFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  slug?: ModelStringInput | null,
  description?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  difficulty?: ModelStringInput | null,
  xp_points?: ModelIntInput | null,
  code_templates?: ModelStringInput | null,
  time_limit_ms?: ModelIntInput | null,
  memory_limit_mb?: ModelIntInput | null,
  input_constraints?: ModelStringInput | null,
  hints?: ModelStringInput | null,
  algorithm_overview?: ModelStringInput | null,
  full_editorial?: ModelStringInput | null,
  discussion_enabled?: ModelBooleanInput | null,
  discussion_threads?: ModelStringInput | null,
  comments_count?: ModelIntInput | null,
  submissions_count?: ModelIntInput | null,
  accepted_count?: ModelIntInput | null,
  acceptance_rate?: ModelFloatInput | null,
  average_runtime_ms?: ModelIntInput | null,
  average_memory_mb?: ModelIntInput | null,
  company_tags?: ModelStringInput | null,
  contest_id?: ModelStringInput | null,
  premium_only?: ModelBooleanInput | null,
  translations?: ModelStringInput | null,
  diagram_images?: ModelStringInput | null,
  solution_videos?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  updated_at?: ModelStringInput | null,
  version?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelChallengeFilterInput | null > | null,
  or?: Array< ModelChallengeFilterInput | null > | null,
  not?: ModelChallengeFilterInput | null,
};

export type ModelChallengeConnection = {
  __typename: "ModelChallengeConnection",
  items:  Array<Challenge | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionTutorialFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  tutorialId?: ModelSubscriptionStringInput | null,
  topicId?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  subtitle?: ModelSubscriptionStringInput | null,
  coverImageUrl?: ModelSubscriptionStringInput | null,
  altText?: ModelSubscriptionStringInput | null,
  estimatedTimeMins?: ModelSubscriptionIntInput | null,
  readingLevel?: ModelSubscriptionStringInput | null,
  preferredLearningStyle?: ModelSubscriptionStringInput | null,
  storyContext?: ModelSubscriptionStringInput | null,
  learningObjectives?: ModelSubscriptionStringInput | null,
  prerequisites?: ModelSubscriptionStringInput | null,
  keyTakeaways?: ModelSubscriptionStringInput | null,
  funFact?: ModelSubscriptionStringInput | null,
  reflectionPrompt?: ModelSubscriptionStringInput | null,
  discussionThreadUrl?: ModelSubscriptionStringInput | null,
  progressBadge?: ModelSubscriptionStringInput | null,
  xpPoints?: ModelSubscriptionIntInput | null,
  streakMultiplier?: ModelSubscriptionBooleanInput | null,
  milestoneBadges?: ModelSubscriptionStringInput | null,
  spacedRepetitionId?: ModelSubscriptionStringInput | null,
  nextTutorialId?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  metaDescription?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  publishDate?: ModelSubscriptionStringInput | null,
  introduction?: ModelSubscriptionStringInput | null,
  conclusion?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  estimatedReadTime?: ModelSubscriptionIntInput | null,
  filledSummary?: ModelSubscriptionStringInput | null,
  builtInPoints?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTutorialFilterInput | null > | null,
  or?: Array< ModelSubscriptionTutorialFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionDriveFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  company?: ModelSubscriptionStringInput | null,
  driveTitle?: ModelSubscriptionStringInput | null,
  driveType?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  startDate?: ModelSubscriptionStringInput | null,
  endDate?: ModelSubscriptionStringInput | null,
  location?: ModelSubscriptionStringInput | null,
  remote?: ModelSubscriptionBooleanInput | null,
  appLink?: ModelSubscriptionStringInput | null,
  branches?: ModelSubscriptionStringInput | null,
  years?: ModelSubscriptionStringInput | null,
  cgpa?: ModelSubscriptionStringInput | null,
  backlog?: ModelSubscriptionStringInput | null,
  regWindow?: ModelSubscriptionStringInput | null,
  seatCap?: ModelSubscriptionStringInput | null,
  notify?: ModelSubscriptionBooleanInput | null,
  notifTemplate?: ModelSubscriptionStringInput | null,
  reminders?: ModelSubscriptionStringInput | null,
  approval?: ModelSubscriptionStringInput | null,
  visibility?: ModelSubscriptionStringInput | null,
  module?: ModelSubscriptionStringInput | null,
  thumbnailUrl?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDriveFilterInput | null > | null,
  or?: Array< ModelSubscriptionDriveFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionQuizFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  totalTime?: ModelSubscriptionIntInput | null,
  passingScore?: ModelSubscriptionIntInput | null,
  tags?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionQuizFilterInput | null > | null,
  or?: Array< ModelSubscriptionQuizFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionCollegeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  code?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
  logo?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  hasDepartments?: ModelSubscriptionBooleanInput | null,
  notes?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCollegeFilterInput | null > | null,
  or?: Array< ModelSubscriptionCollegeFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionAnnouncementFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  content?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  priority?: ModelSubscriptionStringInput | null,
  targetAudience?: ModelSubscriptionStringInput | null,
  publishDate?: ModelSubscriptionStringInput | null,
  expiryDate?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdBy?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAnnouncementFilterInput | null > | null,
  or?: Array< ModelSubscriptionAnnouncementFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionLeaderboardFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionStringInput | null,
  totalPoints?: ModelSubscriptionIntInput | null,
  rank?: ModelSubscriptionIntInput | null,
  badges?: ModelSubscriptionStringInput | null,
  achievements?: ModelSubscriptionStringInput | null,
  streakDays?: ModelSubscriptionIntInput | null,
  lastActivity?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLeaderboardFilterInput | null > | null,
  or?: Array< ModelSubscriptionLeaderboardFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionAnalyticsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  eventType?: ModelSubscriptionStringInput | null,
  userId?: ModelSubscriptionStringInput | null,
  sessionId?: ModelSubscriptionStringInput | null,
  pageUrl?: ModelSubscriptionStringInput | null,
  referrer?: ModelSubscriptionStringInput | null,
  userAgent?: ModelSubscriptionStringInput | null,
  ipAddress?: ModelSubscriptionStringInput | null,
  eventData?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAnalyticsFilterInput | null > | null,
  or?: Array< ModelSubscriptionAnalyticsFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionModuleFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  subtitle?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  track?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionStringInput | null,
  estimatedTime?: ModelSubscriptionIntInput | null,
  tags?: ModelSubscriptionStringInput | null,
  thumbnailUrl?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  goLiveDate?: ModelSubscriptionStringInput | null,
  prerequisites?: ModelSubscriptionStringInput | null,
  visibility?: ModelSubscriptionStringInput | null,
  is_archived?: ModelSubscriptionBooleanInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  updated_at?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionModuleFilterInput | null > | null,
  or?: Array< ModelSubscriptionModuleFilterInput | null > | null,
  moduleLessonsId?: ModelSubscriptionIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionLessonFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  resourceId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionLessonFilterInput | null > | null,
  or?: Array< ModelSubscriptionLessonFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionChallengeFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  slug?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  difficulty?: ModelSubscriptionStringInput | null,
  xp_points?: ModelSubscriptionIntInput | null,
  code_templates?: ModelSubscriptionStringInput | null,
  time_limit_ms?: ModelSubscriptionIntInput | null,
  memory_limit_mb?: ModelSubscriptionIntInput | null,
  input_constraints?: ModelSubscriptionStringInput | null,
  hints?: ModelSubscriptionStringInput | null,
  algorithm_overview?: ModelSubscriptionStringInput | null,
  full_editorial?: ModelSubscriptionStringInput | null,
  discussion_enabled?: ModelSubscriptionBooleanInput | null,
  discussion_threads?: ModelSubscriptionStringInput | null,
  comments_count?: ModelSubscriptionIntInput | null,
  submissions_count?: ModelSubscriptionIntInput | null,
  accepted_count?: ModelSubscriptionIntInput | null,
  acceptance_rate?: ModelSubscriptionFloatInput | null,
  average_runtime_ms?: ModelSubscriptionIntInput | null,
  average_memory_mb?: ModelSubscriptionIntInput | null,
  company_tags?: ModelSubscriptionStringInput | null,
  contest_id?: ModelSubscriptionStringInput | null,
  premium_only?: ModelSubscriptionBooleanInput | null,
  translations?: ModelSubscriptionStringInput | null,
  diagram_images?: ModelSubscriptionStringInput | null,
  solution_videos?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  updated_at?: ModelSubscriptionStringInput | null,
  version?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionChallengeFilterInput | null > | null,
  or?: Array< ModelSubscriptionChallengeFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateTutorialMutationVariables = {
  input: CreateTutorialInput,
  condition?: ModelTutorialConditionInput | null,
};

export type CreateTutorialMutation = {
  createTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateTutorialMutationVariables = {
  input: UpdateTutorialInput,
  condition?: ModelTutorialConditionInput | null,
};

export type UpdateTutorialMutation = {
  updateTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteTutorialMutationVariables = {
  input: DeleteTutorialInput,
  condition?: ModelTutorialConditionInput | null,
};

export type DeleteTutorialMutation = {
  deleteTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateDriveMutationVariables = {
  input: CreateDriveInput,
  condition?: ModelDriveConditionInput | null,
};

export type CreateDriveMutation = {
  createDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateDriveMutationVariables = {
  input: UpdateDriveInput,
  condition?: ModelDriveConditionInput | null,
};

export type UpdateDriveMutation = {
  updateDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteDriveMutationVariables = {
  input: DeleteDriveInput,
  condition?: ModelDriveConditionInput | null,
};

export type DeleteDriveMutation = {
  deleteDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateQuizMutationVariables = {
  input: CreateQuizInput,
  condition?: ModelQuizConditionInput | null,
};

export type CreateQuizMutation = {
  createQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateQuizMutationVariables = {
  input: UpdateQuizInput,
  condition?: ModelQuizConditionInput | null,
};

export type UpdateQuizMutation = {
  updateQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteQuizMutationVariables = {
  input: DeleteQuizInput,
  condition?: ModelQuizConditionInput | null,
};

export type DeleteQuizMutation = {
  deleteQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateCollegeMutationVariables = {
  input: CreateCollegeInput,
  condition?: ModelCollegeConditionInput | null,
};

export type CreateCollegeMutation = {
  createCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateCollegeMutationVariables = {
  input: UpdateCollegeInput,
  condition?: ModelCollegeConditionInput | null,
};

export type UpdateCollegeMutation = {
  updateCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteCollegeMutationVariables = {
  input: DeleteCollegeInput,
  condition?: ModelCollegeConditionInput | null,
};

export type DeleteCollegeMutation = {
  deleteCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateAnnouncementMutationVariables = {
  input: CreateAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type CreateAnnouncementMutation = {
  createAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateAnnouncementMutationVariables = {
  input: UpdateAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type UpdateAnnouncementMutation = {
  updateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteAnnouncementMutationVariables = {
  input: DeleteAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type DeleteAnnouncementMutation = {
  deleteAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateLeaderboardMutationVariables = {
  input: CreateLeaderboardInput,
  condition?: ModelLeaderboardConditionInput | null,
};

export type CreateLeaderboardMutation = {
  createLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateLeaderboardMutationVariables = {
  input: UpdateLeaderboardInput,
  condition?: ModelLeaderboardConditionInput | null,
};

export type UpdateLeaderboardMutation = {
  updateLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteLeaderboardMutationVariables = {
  input: DeleteLeaderboardInput,
  condition?: ModelLeaderboardConditionInput | null,
};

export type DeleteLeaderboardMutation = {
  deleteLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateAnalyticsMutationVariables = {
  input: CreateAnalyticsInput,
  condition?: ModelAnalyticsConditionInput | null,
};

export type CreateAnalyticsMutation = {
  createAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateAnalyticsMutationVariables = {
  input: UpdateAnalyticsInput,
  condition?: ModelAnalyticsConditionInput | null,
};

export type UpdateAnalyticsMutation = {
  updateAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteAnalyticsMutationVariables = {
  input: DeleteAnalyticsInput,
  condition?: ModelAnalyticsConditionInput | null,
};

export type DeleteAnalyticsMutation = {
  deleteAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateModuleMutationVariables = {
  input: CreateModuleInput,
  condition?: ModelModuleConditionInput | null,
};

export type CreateModuleMutation = {
  createModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateModuleMutationVariables = {
  input: UpdateModuleInput,
  condition?: ModelModuleConditionInput | null,
};

export type UpdateModuleMutation = {
  updateModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteModuleMutationVariables = {
  input: DeleteModuleInput,
  condition?: ModelModuleConditionInput | null,
};

export type DeleteModuleMutation = {
  deleteModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateLessonMutationVariables = {
  input: CreateLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type CreateLessonMutation = {
  createLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type UpdateLessonMutationVariables = {
  input: UpdateLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type UpdateLessonMutation = {
  updateLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type DeleteLessonMutationVariables = {
  input: DeleteLessonInput,
  condition?: ModelLessonConditionInput | null,
};

export type DeleteLessonMutation = {
  deleteLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type CreateChallengeMutationVariables = {
  input: CreateChallengeInput,
  condition?: ModelChallengeConditionInput | null,
};

export type CreateChallengeMutation = {
  createChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateChallengeMutationVariables = {
  input: UpdateChallengeInput,
  condition?: ModelChallengeConditionInput | null,
};

export type UpdateChallengeMutation = {
  updateChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteChallengeMutationVariables = {
  input: DeleteChallengeInput,
  condition?: ModelChallengeConditionInput | null,
};

export type DeleteChallengeMutation = {
  deleteChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetTutorialQueryVariables = {
  id: string,
};

export type GetTutorialQuery = {
  getTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListTutorialsQueryVariables = {
  filter?: ModelTutorialFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTutorialsQuery = {
  listTutorials?:  {
    __typename: "ModelTutorialConnection",
    items:  Array< {
      __typename: "Tutorial",
      id: string,
      tutorialId: string,
      topicId: string,
      title: string,
      subtitle?: string | null,
      coverImageUrl?: string | null,
      altText?: string | null,
      estimatedTimeMins?: number | null,
      readingLevel?: string | null,
      preferredLearningStyle?: Array< string | null > | null,
      storyContext?: string | null,
      learningObjectives?: Array< string | null > | null,
      prerequisites?: Array< string | null > | null,
      keyTakeaways?: Array< string | null > | null,
      funFact?: string | null,
      reflectionPrompt?: string | null,
      discussionThreadUrl?: string | null,
      progressBadge?: string | null,
      xpPoints?: number | null,
      streakMultiplier?: boolean | null,
      milestoneBadges?: Array< string | null > | null,
      spacedRepetitionId?: string | null,
      nextTutorialId?: string | null,
      body?: string | null,
      metaDescription?: string | null,
      category?: string | null,
      tags?: Array< string | null > | null,
      status?: string | null,
      publishDate?: string | null,
      introduction?: string | null,
      conclusion?: string | null,
      slug?: string | null,
      estimatedReadTime?: number | null,
      filledSummary?: string | null,
      builtInPoints?: Array< string | null > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDriveQueryVariables = {
  id: string,
};

export type GetDriveQuery = {
  getDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListDrivesQueryVariables = {
  filter?: ModelDriveFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDrivesQuery = {
  listDrives?:  {
    __typename: "ModelDriveConnection",
    items:  Array< {
      __typename: "Drive",
      id: string,
      company?: string | null,
      driveTitle?: string | null,
      driveType?: string | null,
      description?: string | null,
      startDate?: string | null,
      endDate?: string | null,
      location?: string | null,
      remote?: boolean | null,
      appLink?: string | null,
      branches?: Array< string | null > | null,
      years?: Array< string | null > | null,
      cgpa?: string | null,
      backlog?: string | null,
      regWindow?: string | null,
      seatCap?: string | null,
      notify?: boolean | null,
      notifTemplate?: string | null,
      reminders?: Array< string | null > | null,
      approval?: string | null,
      visibility?: string | null,
      module?: string | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetQuizQueryVariables = {
  id: string,
};

export type GetQuizQuery = {
  getQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListQuizzesQueryVariables = {
  filter?: ModelQuizFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListQuizzesQuery = {
  listQuizzes?:  {
    __typename: "ModelQuizConnection",
    items:  Array< {
      __typename: "Quiz",
      id: string,
      title: string,
      slug?: string | null,
      description?: string | null,
      category?: string | null,
      totalTime?: number | null,
      passingScore?: number | null,
      tags?: Array< string | null > | null,
      status?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCollegeQueryVariables = {
  id: string,
};

export type GetCollegeQuery = {
  getCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListCollegesQueryVariables = {
  filter?: ModelCollegeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCollegesQuery = {
  listColleges?:  {
    __typename: "ModelCollegeConnection",
    items:  Array< {
      __typename: "College",
      id: string,
      name: string,
      code: string,
      type: string,
      website?: string | null,
      logo?: string | null,
      status: string,
      hasDepartments: boolean,
      notes?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAnnouncementQueryVariables = {
  id: string,
};

export type GetAnnouncementQuery = {
  getAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListAnnouncementsQueryVariables = {
  filter?: ModelAnnouncementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAnnouncementsQuery = {
  listAnnouncements?:  {
    __typename: "ModelAnnouncementConnection",
    items:  Array< {
      __typename: "Announcement",
      id: string,
      title: string,
      content: string,
      category?: string | null,
      priority?: string | null,
      targetAudience?: Array< string | null > | null,
      publishDate?: string | null,
      expiryDate?: string | null,
      status?: string | null,
      createdBy?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetLeaderboardQueryVariables = {
  id: string,
};

export type GetLeaderboardQuery = {
  getLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListLeaderboardsQueryVariables = {
  filter?: ModelLeaderboardFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLeaderboardsQuery = {
  listLeaderboards?:  {
    __typename: "ModelLeaderboardConnection",
    items:  Array< {
      __typename: "Leaderboard",
      id: string,
      userId: string,
      username: string,
      totalPoints?: number | null,
      rank?: number | null,
      badges?: Array< string | null > | null,
      achievements?: Array< string | null > | null,
      streakDays?: number | null,
      lastActivity?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAnalyticsQueryVariables = {
  id: string,
};

export type GetAnalyticsQuery = {
  getAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type ListAnalyticsQueryVariables = {
  filter?: ModelAnalyticsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAnalyticsQuery = {
  listAnalytics?:  {
    __typename: "ModelAnalyticsConnection",
    items:  Array< {
      __typename: "Analytics",
      id: string,
      eventType: string,
      userId?: string | null,
      sessionId?: string | null,
      pageUrl?: string | null,
      referrer?: string | null,
      userAgent?: string | null,
      ipAddress?: string | null,
      eventData?: string | null,
      createdAt?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetModuleQueryVariables = {
  id: string,
};

export type GetModuleQuery = {
  getModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListModulesQueryVariables = {
  filter?: ModelModuleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListModulesQuery = {
  listModules?:  {
    __typename: "ModelModuleConnection",
    items:  Array< {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetLessonQueryVariables = {
  id: string,
};

export type GetLessonQuery = {
  getLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type ListLessonsQueryVariables = {
  filter?: ModelLessonFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLessonsQuery = {
  listLessons?:  {
    __typename: "ModelLessonConnection",
    items:  Array< {
      __typename: "Lesson",
      id: string,
      title: string,
      type?: string | null,
      status?: string | null,
      resourceId?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
      moduleLessonsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetChallengeQueryVariables = {
  id: string,
};

export type GetChallengeQuery = {
  getChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListChallengesQueryVariables = {
  filter?: ModelChallengeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChallengesQuery = {
  listChallenges?:  {
    __typename: "ModelChallengeConnection",
    items:  Array< {
      __typename: "Challenge",
      id: string,
      title: string,
      slug: string,
      description?: string | null,
      tags?: Array< string | null > | null,
      difficulty?: string | null,
      xp_points?: number | null,
      code_templates?: string | null,
      time_limit_ms?: number | null,
      memory_limit_mb?: number | null,
      input_constraints?: string | null,
      hints?: Array< string | null > | null,
      algorithm_overview?: string | null,
      full_editorial?: string | null,
      discussion_enabled?: boolean | null,
      discussion_threads?: Array< string | null > | null,
      comments_count?: number | null,
      submissions_count?: number | null,
      accepted_count?: number | null,
      acceptance_rate?: number | null,
      average_runtime_ms?: number | null,
      average_memory_mb?: number | null,
      company_tags?: Array< string | null > | null,
      contest_id?: string | null,
      premium_only?: boolean | null,
      translations?: string | null,
      diagram_images?: Array< string | null > | null,
      solution_videos?: Array< string | null > | null,
      created_at?: string | null,
      updated_at?: string | null,
      version?: number | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateTutorialSubscriptionVariables = {
  filter?: ModelSubscriptionTutorialFilterInput | null,
  owner?: string | null,
};

export type OnCreateTutorialSubscription = {
  onCreateTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateTutorialSubscriptionVariables = {
  filter?: ModelSubscriptionTutorialFilterInput | null,
  owner?: string | null,
};

export type OnUpdateTutorialSubscription = {
  onUpdateTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteTutorialSubscriptionVariables = {
  filter?: ModelSubscriptionTutorialFilterInput | null,
  owner?: string | null,
};

export type OnDeleteTutorialSubscription = {
  onDeleteTutorial?:  {
    __typename: "Tutorial",
    id: string,
    tutorialId: string,
    topicId: string,
    title: string,
    subtitle?: string | null,
    coverImageUrl?: string | null,
    altText?: string | null,
    estimatedTimeMins?: number | null,
    readingLevel?: string | null,
    preferredLearningStyle?: Array< string | null > | null,
    storyContext?: string | null,
    learningObjectives?: Array< string | null > | null,
    prerequisites?: Array< string | null > | null,
    biteSizeSections?:  Array< {
      __typename: "BiteSizeSection",
      sectionId: string,
      heading: string,
      contentMd?: string | null,
      humorTip?: string | null,
      mnemonic?: string | null,
      challengePrompt?: string | null,
      playgroundEmbedId?: string | null,
      autoCheckSnippet?: boolean | null,
    } | null > | null,
    keyTakeaways?: Array< string | null > | null,
    funFact?: string | null,
    reflectionPrompt?: string | null,
    discussionThreadUrl?: string | null,
    progressBadge?: string | null,
    xpPoints?: number | null,
    streakMultiplier?: boolean | null,
    milestoneBadges?: Array< string | null > | null,
    spacedRepetitionId?: string | null,
    nextTutorialId?: string | null,
    body?: string | null,
    metaDescription?: string | null,
    category?: string | null,
    tags?: Array< string | null > | null,
    status?: string | null,
    publishDate?: string | null,
    introduction?: string | null,
    conclusion?: string | null,
    images?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    diagrams?:  Array< {
      __typename: "Image",
      url: string,
      alt: string,
    } | null > | null,
    downloadableAssets?:  Array< {
      __typename: "Asset",
      url: string,
      name: string,
      type: string,
    } | null > | null,
    codeSnippets?:  Array< {
      __typename: "CodeSnippet",
      url: string,
      name: string,
    } | null > | null,
    slug?: string | null,
    estimatedReadTime?: number | null,
    filledSummary?: string | null,
    builtInPoints?: Array< string | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateDriveSubscriptionVariables = {
  filter?: ModelSubscriptionDriveFilterInput | null,
  owner?: string | null,
};

export type OnCreateDriveSubscription = {
  onCreateDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateDriveSubscriptionVariables = {
  filter?: ModelSubscriptionDriveFilterInput | null,
  owner?: string | null,
};

export type OnUpdateDriveSubscription = {
  onUpdateDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteDriveSubscriptionVariables = {
  filter?: ModelSubscriptionDriveFilterInput | null,
  owner?: string | null,
};

export type OnDeleteDriveSubscription = {
  onDeleteDrive?:  {
    __typename: "Drive",
    id: string,
    company?: string | null,
    driveTitle?: string | null,
    driveType?: string | null,
    description?: string | null,
    startDate?: string | null,
    endDate?: string | null,
    location?: string | null,
    remote?: boolean | null,
    appLink?: string | null,
    branches?: Array< string | null > | null,
    years?: Array< string | null > | null,
    cgpa?: string | null,
    backlog?: string | null,
    regWindow?: string | null,
    seatCap?: string | null,
    notify?: boolean | null,
    notifTemplate?: string | null,
    reminders?: Array< string | null > | null,
    approval?: string | null,
    visibility?: string | null,
    module?: string | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateQuizSubscriptionVariables = {
  filter?: ModelSubscriptionQuizFilterInput | null,
  owner?: string | null,
};

export type OnCreateQuizSubscription = {
  onCreateQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateQuizSubscriptionVariables = {
  filter?: ModelSubscriptionQuizFilterInput | null,
  owner?: string | null,
};

export type OnUpdateQuizSubscription = {
  onUpdateQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteQuizSubscriptionVariables = {
  filter?: ModelSubscriptionQuizFilterInput | null,
  owner?: string | null,
};

export type OnDeleteQuizSubscription = {
  onDeleteQuiz?:  {
    __typename: "Quiz",
    id: string,
    title: string,
    slug?: string | null,
    description?: string | null,
    category?: string | null,
    totalTime?: number | null,
    passingScore?: number | null,
    tags?: Array< string | null > | null,
    questions?:  Array< {
      __typename: "QuizQuestion",
      question: string,
      options: Array< string | null >,
      correctAnswer: number,
      explanation?: string | null,
    } | null > | null,
    settings?:  {
      __typename: "QuizSettings",
      allowRetake?: boolean | null,
      showResults?: boolean | null,
      timeLimit?: number | null,
      shuffleQuestions?: boolean | null,
    } | null,
    status?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateCollegeSubscriptionVariables = {
  filter?: ModelSubscriptionCollegeFilterInput | null,
  owner?: string | null,
};

export type OnCreateCollegeSubscription = {
  onCreateCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateCollegeSubscriptionVariables = {
  filter?: ModelSubscriptionCollegeFilterInput | null,
  owner?: string | null,
};

export type OnUpdateCollegeSubscription = {
  onUpdateCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteCollegeSubscriptionVariables = {
  filter?: ModelSubscriptionCollegeFilterInput | null,
  owner?: string | null,
};

export type OnDeleteCollegeSubscription = {
  onDeleteCollege?:  {
    __typename: "College",
    id: string,
    name: string,
    code: string,
    type: string,
    website?: string | null,
    logo?: string | null,
    address?:  {
      __typename: "Address",
      line1: string,
      line2?: string | null,
      city: string,
      state: string,
      pinCode: string,
    } | null,
    contact?:  {
      __typename: "Contact",
      name: string,
      email: string,
      phone: string,
    } | null,
    status: string,
    hasDepartments: boolean,
    notes?: string | null,
    departments?:  Array< {
      __typename: "Department",
      id: string,
      name: string,
      level: string,
      hod: string,
      status: string,
    } | null > | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
  owner?: string | null,
};

export type OnCreateAnnouncementSubscription = {
  onCreateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAnnouncementSubscription = {
  onUpdateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAnnouncementSubscription = {
  onDeleteAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    content: string,
    category?: string | null,
    priority?: string | null,
    targetAudience?: Array< string | null > | null,
    publishDate?: string | null,
    expiryDate?: string | null,
    status?: string | null,
    createdBy?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateLeaderboardSubscriptionVariables = {
  filter?: ModelSubscriptionLeaderboardFilterInput | null,
  owner?: string | null,
};

export type OnCreateLeaderboardSubscription = {
  onCreateLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateLeaderboardSubscriptionVariables = {
  filter?: ModelSubscriptionLeaderboardFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLeaderboardSubscription = {
  onUpdateLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteLeaderboardSubscriptionVariables = {
  filter?: ModelSubscriptionLeaderboardFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLeaderboardSubscription = {
  onDeleteLeaderboard?:  {
    __typename: "Leaderboard",
    id: string,
    userId: string,
    username: string,
    totalPoints?: number | null,
    rank?: number | null,
    badges?: Array< string | null > | null,
    achievements?: Array< string | null > | null,
    streakDays?: number | null,
    lastActivity?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
  owner?: string | null,
};

export type OnCreateAnalyticsSubscription = {
  onCreateAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateAnalyticsSubscription = {
  onUpdateAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteAnalyticsSubscriptionVariables = {
  filter?: ModelSubscriptionAnalyticsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteAnalyticsSubscription = {
  onDeleteAnalytics?:  {
    __typename: "Analytics",
    id: string,
    eventType: string,
    userId?: string | null,
    sessionId?: string | null,
    pageUrl?: string | null,
    referrer?: string | null,
    userAgent?: string | null,
    ipAddress?: string | null,
    eventData?: string | null,
    createdAt?: string | null,
    owner?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateModuleSubscriptionVariables = {
  filter?: ModelSubscriptionModuleFilterInput | null,
  owner?: string | null,
};

export type OnCreateModuleSubscription = {
  onCreateModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateModuleSubscriptionVariables = {
  filter?: ModelSubscriptionModuleFilterInput | null,
  owner?: string | null,
};

export type OnUpdateModuleSubscription = {
  onUpdateModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteModuleSubscriptionVariables = {
  filter?: ModelSubscriptionModuleFilterInput | null,
  owner?: string | null,
};

export type OnDeleteModuleSubscription = {
  onDeleteModule?:  {
    __typename: "Module",
    id: string,
    title: string,
    subtitle?: string | null,
    description?: string | null,
    track?: string | null,
    difficulty?: string | null,
    estimatedTime?: number | null,
    tags?: Array< string | null > | null,
    thumbnailUrl?: string | null,
    status?: string | null,
    goLiveDate?: string | null,
    prerequisites?: Array< string | null > | null,
    visibility?: string | null,
    completionCriteria?:  {
      __typename: "CompletionCriteria",
      allLessonsComplete?: boolean | null,
      passQuiz?: boolean | null,
      projectComplete?: boolean | null,
    } | null,
    is_archived?: boolean | null,
    created_at?: string | null,
    updated_at?: string | null,
    lessons?:  {
      __typename: "ModelLessonConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateLessonSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFilterInput | null,
  owner?: string | null,
};

export type OnCreateLessonSubscription = {
  onCreateLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type OnUpdateLessonSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLessonSubscription = {
  onUpdateLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type OnDeleteLessonSubscriptionVariables = {
  filter?: ModelSubscriptionLessonFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLessonSubscription = {
  onDeleteLesson?:  {
    __typename: "Lesson",
    id: string,
    title: string,
    type?: string | null,
    status?: string | null,
    resourceId?: string | null,
    module?:  {
      __typename: "Module",
      id: string,
      title: string,
      subtitle?: string | null,
      description?: string | null,
      track?: string | null,
      difficulty?: string | null,
      estimatedTime?: number | null,
      tags?: Array< string | null > | null,
      thumbnailUrl?: string | null,
      status?: string | null,
      goLiveDate?: string | null,
      prerequisites?: Array< string | null > | null,
      visibility?: string | null,
      is_archived?: boolean | null,
      created_at?: string | null,
      updated_at?: string | null,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
    moduleLessonsId?: string | null,
  } | null,
};

export type OnCreateChallengeSubscriptionVariables = {
  filter?: ModelSubscriptionChallengeFilterInput | null,
  owner?: string | null,
};

export type OnCreateChallengeSubscription = {
  onCreateChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateChallengeSubscriptionVariables = {
  filter?: ModelSubscriptionChallengeFilterInput | null,
  owner?: string | null,
};

export type OnUpdateChallengeSubscription = {
  onUpdateChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteChallengeSubscriptionVariables = {
  filter?: ModelSubscriptionChallengeFilterInput | null,
  owner?: string | null,
};

export type OnDeleteChallengeSubscription = {
  onDeleteChallenge?:  {
    __typename: "Challenge",
    id: string,
    title: string,
    slug: string,
    description?: string | null,
    tags?: Array< string | null > | null,
    difficulty?: string | null,
    xp_points?: number | null,
    code_templates?: string | null,
    time_limit_ms?: number | null,
    memory_limit_mb?: number | null,
    input_constraints?: string | null,
    examples?:  Array< {
      __typename: "Example",
      input?: string | null,
      output?: string | null,
      explanation?: string | null,
    } | null > | null,
    sample_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hidden_tests?:  Array< {
      __typename: "TestCase",
      input?: string | null,
      output?: string | null,
    } | null > | null,
    hints?: Array< string | null > | null,
    algorithm_overview?: string | null,
    step_by_step_solution?:  Array< {
      __typename: "SolutionStep",
      step_number?: number | null,
      explanation?: string | null,
      pseudocode?: string | null,
    } | null > | null,
    full_editorial?: string | null,
    discussion_enabled?: boolean | null,
    discussion_threads?: Array< string | null > | null,
    comments_count?: number | null,
    submissions_count?: number | null,
    accepted_count?: number | null,
    acceptance_rate?: number | null,
    average_runtime_ms?: number | null,
    average_memory_mb?: number | null,
    company_tags?: Array< string | null > | null,
    contest_id?: string | null,
    premium_only?: boolean | null,
    translations?: string | null,
    diagram_images?: Array< string | null > | null,
    solution_videos?: Array< string | null > | null,
    created_at?: string | null,
    updated_at?: string | null,
    version?: number | null,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
