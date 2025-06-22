/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getTutorial = /* GraphQL */ `query GetTutorial($id: ID!) {
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
    biteSizeSections {
      sectionId
      heading
      contentMd
      humorTip
      mnemonic
      challengePrompt
      playgroundEmbedId
      autoCheckSnippet
      __typename
    }
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
    images {
      url
      alt
      __typename
    }
    diagrams {
      url
      alt
      __typename
    }
    downloadableAssets {
      url
      name
      type
      __typename
    }
    codeSnippets {
      url
      name
      __typename
    }
    slug
    estimatedReadTime
    filledSummary
    builtInPoints
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTutorialQueryVariables,
  APITypes.GetTutorialQuery
>;
export const listTutorials = /* GraphQL */ `query ListTutorials(
  $filter: ModelTutorialFilterInput
  $limit: Int
  $nextToken: String
) {
  listTutorials(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      biteSizeSections {
        sectionId
        heading
        contentMd
        humorTip
        mnemonic
        codeSnippet {
          language
          code
          explanations
        }
        challengePrompt
        sectionQuiz {
          question
          options
          correctAnswer
          explanation
        }
        playgroundEmbedId
        autoCheckSnippet
      }
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
      images {
        url
        alt
      }
      diagrams {
        url
        alt
      }
      downloadableAssets {
        url
        name
        type
      }
      codeSnippets {
        url
        name
      }
      slug
      estimatedReadTime
      filledSummary
      builtInPoints
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTutorialsQueryVariables,
  APITypes.ListTutorialsQuery
>;
export const getDrive = /* GraphQL */ `query GetDrive($id: ID!) {
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
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDriveQueryVariables, APITypes.GetDriveQuery>;
export const listDrives = /* GraphQL */ `query ListDrives(
  $filter: ModelDriveFilterInput
  $limit: Int
  $nextToken: String
) {
  listDrives(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDrivesQueryVariables,
  APITypes.ListDrivesQuery
>;
export const getQuiz = /* GraphQL */ `query GetQuiz($id: ID!) {
  getQuiz(id: $id) {
    id
    title
    slug
    description
    category
    totalTime
    passingScore
    tags
    questions {
      question
      options
      correctAnswer
      explanation
      __typename
    }
    settings {
      allowRetake
      showResults
      timeLimit
      shuffleQuestions
      __typename
    }
    status
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetQuizQueryVariables, APITypes.GetQuizQuery>;
export const listQuizzes = /* GraphQL */ `query ListQuizzes(
  $filter: ModelQuizFilterInput
  $limit: Int
  $nextToken: String
) {
  listQuizzes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      slug
      description
      category
      totalTime
      passingScore
      tags
      status
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListQuizzesQueryVariables,
  APITypes.ListQuizzesQuery
>;
export const getCollege = /* GraphQL */ `query GetCollege($id: ID!) {
  getCollege(id: $id) {
    id
    name
    code
    type
    website
    logo
    address {
      line1
      line2
      city
      state
      pinCode
      __typename
    }
    contact {
      name
      email
      phone
      __typename
    }
    status
    hasDepartments
    notes
    departments {
      id
      name
      level
      hod
      status
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCollegeQueryVariables,
  APITypes.GetCollegeQuery
>;
export const listColleges = /* GraphQL */ `query ListColleges(
  $filter: ModelCollegeFilterInput
  $limit: Int
  $nextToken: String
) {
  listColleges(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      code
      type
      website
      logo
      status
      hasDepartments
      notes
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCollegesQueryVariables,
  APITypes.ListCollegesQuery
>;
export const getAnnouncement = /* GraphQL */ `query GetAnnouncement($id: ID!) {
  getAnnouncement(id: $id) {
    id
    title
    content
    category
    priority
    targetAudience
    publishDate
    expiryDate
    status
    createdBy
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAnnouncementQueryVariables,
  APITypes.GetAnnouncementQuery
>;
export const listAnnouncements = /* GraphQL */ `query ListAnnouncements(
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      content
      category
      priority
      targetAudience
      publishDate
      expiryDate
      status
      createdBy
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnnouncementsQueryVariables,
  APITypes.ListAnnouncementsQuery
>;
export const getLeaderboard = /* GraphQL */ `query GetLeaderboard($id: ID!) {
  getLeaderboard(id: $id) {
    id
    userId
    username
    totalPoints
    rank
    badges
    achievements
    streakDays
    lastActivity
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLeaderboardQueryVariables,
  APITypes.GetLeaderboardQuery
>;
export const listLeaderboards = /* GraphQL */ `query ListLeaderboards(
  $filter: ModelLeaderboardFilterInput
  $limit: Int
  $nextToken: String
) {
  listLeaderboards(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      username
      totalPoints
      rank
      badges
      achievements
      streakDays
      lastActivity
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLeaderboardsQueryVariables,
  APITypes.ListLeaderboardsQuery
>;
export const getAnalytics = /* GraphQL */ `query GetAnalytics($id: ID!) {
  getAnalytics(id: $id) {
    id
    eventType
    userId
    sessionId
    pageUrl
    referrer
    userAgent
    ipAddress
    eventData
    createdAt
    owner
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAnalyticsQueryVariables,
  APITypes.GetAnalyticsQuery
>;
export const listAnalytics = /* GraphQL */ `query ListAnalytics(
  $filter: ModelAnalyticsFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnalytics(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      eventType
      userId
      sessionId
      pageUrl
      referrer
      userAgent
      ipAddress
      eventData
      createdAt
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalyticsQueryVariables,
  APITypes.ListAnalyticsQuery
>;
export const getModule = /* GraphQL */ `query GetModule($id: ID!) {
  getModule(id: $id) {
    id
    title
    subtitle
    description
    track
    difficulty
    estimatedTime
    tags
    thumbnailUrl
    status
    goLiveDate
    prerequisites
    visibility
    completionCriteria {
      allLessonsComplete
      passQuiz
      projectComplete
      __typename
    }
    is_archived
    created_at
    updated_at
    lessons {
      nextToken
      __typename
    }
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetModuleQueryVariables, APITypes.GetModuleQuery>;
export const listModules = /* GraphQL */ `query ListModules(
  $filter: ModelModuleFilterInput
  $limit: Int
  $nextToken: String
) {
  listModules(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      subtitle
      description
      track
      difficulty
      estimatedTime
      tags
      thumbnailUrl
      status
      goLiveDate
      prerequisites
      visibility
      is_archived
      created_at
      updated_at
      owner
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListModulesQueryVariables,
  APITypes.ListModulesQuery
>;
export const getLesson = /* GraphQL */ `query GetLesson($id: ID!) {
  getLesson(id: $id) {
    id
    title
    type
    status
    resourceId
    module {
      id
      title
      subtitle
      description
      track
      difficulty
      estimatedTime
      tags
      thumbnailUrl
      status
      goLiveDate
      prerequisites
      visibility
      is_archived
      created_at
      updated_at
      owner
      createdAt
      updatedAt
      __typename
    }
    owner
    createdAt
    updatedAt
    moduleLessonsId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetLessonQueryVariables, APITypes.GetLessonQuery>;
export const listLessons = /* GraphQL */ `query ListLessons(
  $filter: ModelLessonFilterInput
  $limit: Int
  $nextToken: String
) {
  listLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      type
      status
      resourceId
      owner
      createdAt
      updatedAt
      moduleLessonsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLessonsQueryVariables,
  APITypes.ListLessonsQuery
>;
export const getChallenge = /* GraphQL */ `query GetChallenge($id: ID!) {
  getChallenge(id: $id) {
    id
    title
    slug
    description
    tags
    difficulty
    xp_points
    code_templates
    time_limit_ms
    memory_limit_mb
    input_constraints
    examples {
      input
      output
      explanation
      __typename
    }
    sample_tests {
      input
      output
      __typename
    }
    hidden_tests {
      input
      output
      __typename
    }
    hints
    algorithm_overview
    step_by_step_solution {
      step_number
      explanation
      pseudocode
      __typename
    }
    full_editorial
    discussion_enabled
    discussion_threads
    comments_count
    submissions_count
    accepted_count
    acceptance_rate
    average_runtime_ms
    average_memory_mb
    company_tags
    contest_id
    premium_only
    translations
    diagram_images
    solution_videos
    created_at
    updated_at
    version
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetChallengeQueryVariables,
  APITypes.GetChallengeQuery
>;
export const listChallenges = /* GraphQL */ `query ListChallenges(
  $filter: ModelChallengeFilterInput
  $limit: Int
  $nextToken: String
) {
  listChallenges(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      slug
      description
      tags
      difficulty
      xp_points
      code_templates
      time_limit_ms
      memory_limit_mb
      input_constraints
      hints
      algorithm_overview
      full_editorial
      discussion_enabled
      discussion_threads
      comments_count
      submissions_count
      accepted_count
      acceptance_rate
      average_runtime_ms
      average_memory_mb
      company_tags
      contest_id
      premium_only
      translations
      diagram_images
      solution_videos
      created_at
      updated_at
      version
      owner
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChallengesQueryVariables,
  APITypes.ListChallengesQuery
>;
