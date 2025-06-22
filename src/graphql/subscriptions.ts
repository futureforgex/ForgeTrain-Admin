/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateTutorial = /* GraphQL */ `subscription OnCreateTutorial(
  $filter: ModelSubscriptionTutorialFilterInput
  $owner: String
) {
  onCreateTutorial(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTutorialSubscriptionVariables,
  APITypes.OnCreateTutorialSubscription
>;
export const onUpdateTutorial = /* GraphQL */ `subscription OnUpdateTutorial(
  $filter: ModelSubscriptionTutorialFilterInput
  $owner: String
) {
  onUpdateTutorial(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTutorialSubscriptionVariables,
  APITypes.OnUpdateTutorialSubscription
>;
export const onDeleteTutorial = /* GraphQL */ `subscription OnDeleteTutorial(
  $filter: ModelSubscriptionTutorialFilterInput
  $owner: String
) {
  onDeleteTutorial(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTutorialSubscriptionVariables,
  APITypes.OnDeleteTutorialSubscription
>;
export const onCreateDrive = /* GraphQL */ `subscription OnCreateDrive(
  $filter: ModelSubscriptionDriveFilterInput
  $owner: String
) {
  onCreateDrive(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDriveSubscriptionVariables,
  APITypes.OnCreateDriveSubscription
>;
export const onUpdateDrive = /* GraphQL */ `subscription OnUpdateDrive(
  $filter: ModelSubscriptionDriveFilterInput
  $owner: String
) {
  onUpdateDrive(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDriveSubscriptionVariables,
  APITypes.OnUpdateDriveSubscription
>;
export const onDeleteDrive = /* GraphQL */ `subscription OnDeleteDrive(
  $filter: ModelSubscriptionDriveFilterInput
  $owner: String
) {
  onDeleteDrive(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDriveSubscriptionVariables,
  APITypes.OnDeleteDriveSubscription
>;
export const onCreateQuiz = /* GraphQL */ `subscription OnCreateQuiz(
  $filter: ModelSubscriptionQuizFilterInput
  $owner: String
) {
  onCreateQuiz(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateQuizSubscriptionVariables,
  APITypes.OnCreateQuizSubscription
>;
export const onUpdateQuiz = /* GraphQL */ `subscription OnUpdateQuiz(
  $filter: ModelSubscriptionQuizFilterInput
  $owner: String
) {
  onUpdateQuiz(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateQuizSubscriptionVariables,
  APITypes.OnUpdateQuizSubscription
>;
export const onDeleteQuiz = /* GraphQL */ `subscription OnDeleteQuiz(
  $filter: ModelSubscriptionQuizFilterInput
  $owner: String
) {
  onDeleteQuiz(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteQuizSubscriptionVariables,
  APITypes.OnDeleteQuizSubscription
>;
export const onCreateCollege = /* GraphQL */ `subscription OnCreateCollege(
  $filter: ModelSubscriptionCollegeFilterInput
  $owner: String
) {
  onCreateCollege(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCollegeSubscriptionVariables,
  APITypes.OnCreateCollegeSubscription
>;
export const onUpdateCollege = /* GraphQL */ `subscription OnUpdateCollege(
  $filter: ModelSubscriptionCollegeFilterInput
  $owner: String
) {
  onUpdateCollege(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCollegeSubscriptionVariables,
  APITypes.OnUpdateCollegeSubscription
>;
export const onDeleteCollege = /* GraphQL */ `subscription OnDeleteCollege(
  $filter: ModelSubscriptionCollegeFilterInput
  $owner: String
) {
  onDeleteCollege(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCollegeSubscriptionVariables,
  APITypes.OnDeleteCollegeSubscription
>;
export const onCreateAnnouncement = /* GraphQL */ `subscription OnCreateAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
  $owner: String
) {
  onCreateAnnouncement(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAnnouncementSubscriptionVariables,
  APITypes.OnCreateAnnouncementSubscription
>;
export const onUpdateAnnouncement = /* GraphQL */ `subscription OnUpdateAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
  $owner: String
) {
  onUpdateAnnouncement(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAnnouncementSubscriptionVariables,
  APITypes.OnUpdateAnnouncementSubscription
>;
export const onDeleteAnnouncement = /* GraphQL */ `subscription OnDeleteAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
  $owner: String
) {
  onDeleteAnnouncement(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAnnouncementSubscriptionVariables,
  APITypes.OnDeleteAnnouncementSubscription
>;
export const onCreateLeaderboard = /* GraphQL */ `subscription OnCreateLeaderboard(
  $filter: ModelSubscriptionLeaderboardFilterInput
  $owner: String
) {
  onCreateLeaderboard(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLeaderboardSubscriptionVariables,
  APITypes.OnCreateLeaderboardSubscription
>;
export const onUpdateLeaderboard = /* GraphQL */ `subscription OnUpdateLeaderboard(
  $filter: ModelSubscriptionLeaderboardFilterInput
  $owner: String
) {
  onUpdateLeaderboard(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLeaderboardSubscriptionVariables,
  APITypes.OnUpdateLeaderboardSubscription
>;
export const onDeleteLeaderboard = /* GraphQL */ `subscription OnDeleteLeaderboard(
  $filter: ModelSubscriptionLeaderboardFilterInput
  $owner: String
) {
  onDeleteLeaderboard(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLeaderboardSubscriptionVariables,
  APITypes.OnDeleteLeaderboardSubscription
>;
export const onCreateAnalytics = /* GraphQL */ `subscription OnCreateAnalytics(
  $filter: ModelSubscriptionAnalyticsFilterInput
  $owner: String
) {
  onCreateAnalytics(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAnalyticsSubscriptionVariables,
  APITypes.OnCreateAnalyticsSubscription
>;
export const onUpdateAnalytics = /* GraphQL */ `subscription OnUpdateAnalytics(
  $filter: ModelSubscriptionAnalyticsFilterInput
  $owner: String
) {
  onUpdateAnalytics(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAnalyticsSubscriptionVariables,
  APITypes.OnUpdateAnalyticsSubscription
>;
export const onDeleteAnalytics = /* GraphQL */ `subscription OnDeleteAnalytics(
  $filter: ModelSubscriptionAnalyticsFilterInput
  $owner: String
) {
  onDeleteAnalytics(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAnalyticsSubscriptionVariables,
  APITypes.OnDeleteAnalyticsSubscription
>;
export const onCreateModule = /* GraphQL */ `subscription OnCreateModule(
  $filter: ModelSubscriptionModuleFilterInput
  $owner: String
) {
  onCreateModule(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateModuleSubscriptionVariables,
  APITypes.OnCreateModuleSubscription
>;
export const onUpdateModule = /* GraphQL */ `subscription OnUpdateModule(
  $filter: ModelSubscriptionModuleFilterInput
  $owner: String
) {
  onUpdateModule(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateModuleSubscriptionVariables,
  APITypes.OnUpdateModuleSubscription
>;
export const onDeleteModule = /* GraphQL */ `subscription OnDeleteModule(
  $filter: ModelSubscriptionModuleFilterInput
  $owner: String
) {
  onDeleteModule(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteModuleSubscriptionVariables,
  APITypes.OnDeleteModuleSubscription
>;
export const onCreateLesson = /* GraphQL */ `subscription OnCreateLesson(
  $filter: ModelSubscriptionLessonFilterInput
  $owner: String
) {
  onCreateLesson(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLessonSubscriptionVariables,
  APITypes.OnCreateLessonSubscription
>;
export const onUpdateLesson = /* GraphQL */ `subscription OnUpdateLesson(
  $filter: ModelSubscriptionLessonFilterInput
  $owner: String
) {
  onUpdateLesson(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLessonSubscriptionVariables,
  APITypes.OnUpdateLessonSubscription
>;
export const onDeleteLesson = /* GraphQL */ `subscription OnDeleteLesson(
  $filter: ModelSubscriptionLessonFilterInput
  $owner: String
) {
  onDeleteLesson(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLessonSubscriptionVariables,
  APITypes.OnDeleteLessonSubscription
>;
export const onCreateChallenge = /* GraphQL */ `subscription OnCreateChallenge(
  $filter: ModelSubscriptionChallengeFilterInput
  $owner: String
) {
  onCreateChallenge(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateChallengeSubscriptionVariables,
  APITypes.OnCreateChallengeSubscription
>;
export const onUpdateChallenge = /* GraphQL */ `subscription OnUpdateChallenge(
  $filter: ModelSubscriptionChallengeFilterInput
  $owner: String
) {
  onUpdateChallenge(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateChallengeSubscriptionVariables,
  APITypes.OnUpdateChallengeSubscription
>;
export const onDeleteChallenge = /* GraphQL */ `subscription OnDeleteChallenge(
  $filter: ModelSubscriptionChallengeFilterInput
  $owner: String
) {
  onDeleteChallenge(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteChallengeSubscriptionVariables,
  APITypes.OnDeleteChallengeSubscription
>;
