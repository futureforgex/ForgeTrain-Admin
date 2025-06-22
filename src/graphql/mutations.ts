/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createTutorial = /* GraphQL */ `mutation CreateTutorial(
  $input: CreateTutorialInput!
  $condition: ModelTutorialConditionInput
) {
  createTutorial(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTutorialMutationVariables,
  APITypes.CreateTutorialMutation
>;
export const updateTutorial = /* GraphQL */ `mutation UpdateTutorial(
  $input: UpdateTutorialInput!
  $condition: ModelTutorialConditionInput
) {
  updateTutorial(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTutorialMutationVariables,
  APITypes.UpdateTutorialMutation
>;
export const deleteTutorial = /* GraphQL */ `mutation DeleteTutorial(
  $input: DeleteTutorialInput!
  $condition: ModelTutorialConditionInput
) {
  deleteTutorial(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTutorialMutationVariables,
  APITypes.DeleteTutorialMutation
>;
export const createDrive = /* GraphQL */ `mutation CreateDrive(
  $input: CreateDriveInput!
  $condition: ModelDriveConditionInput
) {
  createDrive(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDriveMutationVariables,
  APITypes.CreateDriveMutation
>;
export const updateDrive = /* GraphQL */ `mutation UpdateDrive(
  $input: UpdateDriveInput!
  $condition: ModelDriveConditionInput
) {
  updateDrive(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDriveMutationVariables,
  APITypes.UpdateDriveMutation
>;
export const deleteDrive = /* GraphQL */ `mutation DeleteDrive(
  $input: DeleteDriveInput!
  $condition: ModelDriveConditionInput
) {
  deleteDrive(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDriveMutationVariables,
  APITypes.DeleteDriveMutation
>;
export const createQuiz = /* GraphQL */ `mutation CreateQuiz(
  $input: CreateQuizInput!
  $condition: ModelQuizConditionInput
) {
  createQuiz(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateQuizMutationVariables,
  APITypes.CreateQuizMutation
>;
export const updateQuiz = /* GraphQL */ `mutation UpdateQuiz(
  $input: UpdateQuizInput!
  $condition: ModelQuizConditionInput
) {
  updateQuiz(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateQuizMutationVariables,
  APITypes.UpdateQuizMutation
>;
export const deleteQuiz = /* GraphQL */ `mutation DeleteQuiz(
  $input: DeleteQuizInput!
  $condition: ModelQuizConditionInput
) {
  deleteQuiz(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteQuizMutationVariables,
  APITypes.DeleteQuizMutation
>;
export const createCollege = /* GraphQL */ `mutation CreateCollege(
  $input: CreateCollegeInput!
  $condition: ModelCollegeConditionInput
) {
  createCollege(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCollegeMutationVariables,
  APITypes.CreateCollegeMutation
>;
export const updateCollege = /* GraphQL */ `mutation UpdateCollege(
  $input: UpdateCollegeInput!
  $condition: ModelCollegeConditionInput
) {
  updateCollege(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCollegeMutationVariables,
  APITypes.UpdateCollegeMutation
>;
export const deleteCollege = /* GraphQL */ `mutation DeleteCollege(
  $input: DeleteCollegeInput!
  $condition: ModelCollegeConditionInput
) {
  deleteCollege(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCollegeMutationVariables,
  APITypes.DeleteCollegeMutation
>;
export const createAnnouncement = /* GraphQL */ `mutation CreateAnnouncement(
  $input: CreateAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  createAnnouncement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAnnouncementMutationVariables,
  APITypes.CreateAnnouncementMutation
>;
export const updateAnnouncement = /* GraphQL */ `mutation UpdateAnnouncement(
  $input: UpdateAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  updateAnnouncement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAnnouncementMutationVariables,
  APITypes.UpdateAnnouncementMutation
>;
export const deleteAnnouncement = /* GraphQL */ `mutation DeleteAnnouncement(
  $input: DeleteAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  deleteAnnouncement(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAnnouncementMutationVariables,
  APITypes.DeleteAnnouncementMutation
>;
export const createLeaderboard = /* GraphQL */ `mutation CreateLeaderboard(
  $input: CreateLeaderboardInput!
  $condition: ModelLeaderboardConditionInput
) {
  createLeaderboard(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateLeaderboardMutationVariables,
  APITypes.CreateLeaderboardMutation
>;
export const updateLeaderboard = /* GraphQL */ `mutation UpdateLeaderboard(
  $input: UpdateLeaderboardInput!
  $condition: ModelLeaderboardConditionInput
) {
  updateLeaderboard(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateLeaderboardMutationVariables,
  APITypes.UpdateLeaderboardMutation
>;
export const deleteLeaderboard = /* GraphQL */ `mutation DeleteLeaderboard(
  $input: DeleteLeaderboardInput!
  $condition: ModelLeaderboardConditionInput
) {
  deleteLeaderboard(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteLeaderboardMutationVariables,
  APITypes.DeleteLeaderboardMutation
>;
export const createAnalytics = /* GraphQL */ `mutation CreateAnalytics(
  $input: CreateAnalyticsInput!
  $condition: ModelAnalyticsConditionInput
) {
  createAnalytics(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAnalyticsMutationVariables,
  APITypes.CreateAnalyticsMutation
>;
export const updateAnalytics = /* GraphQL */ `mutation UpdateAnalytics(
  $input: UpdateAnalyticsInput!
  $condition: ModelAnalyticsConditionInput
) {
  updateAnalytics(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAnalyticsMutationVariables,
  APITypes.UpdateAnalyticsMutation
>;
export const deleteAnalytics = /* GraphQL */ `mutation DeleteAnalytics(
  $input: DeleteAnalyticsInput!
  $condition: ModelAnalyticsConditionInput
) {
  deleteAnalytics(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAnalyticsMutationVariables,
  APITypes.DeleteAnalyticsMutation
>;
export const createModule = /* GraphQL */ `mutation CreateModule(
  $input: CreateModuleInput!
  $condition: ModelModuleConditionInput
) {
  createModule(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateModuleMutationVariables,
  APITypes.CreateModuleMutation
>;
export const updateModule = /* GraphQL */ `mutation UpdateModule(
  $input: UpdateModuleInput!
  $condition: ModelModuleConditionInput
) {
  updateModule(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateModuleMutationVariables,
  APITypes.UpdateModuleMutation
>;
export const deleteModule = /* GraphQL */ `mutation DeleteModule(
  $input: DeleteModuleInput!
  $condition: ModelModuleConditionInput
) {
  deleteModule(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteModuleMutationVariables,
  APITypes.DeleteModuleMutation
>;
export const createLesson = /* GraphQL */ `mutation CreateLesson(
  $input: CreateLessonInput!
  $condition: ModelLessonConditionInput
) {
  createLesson(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateLessonMutationVariables,
  APITypes.CreateLessonMutation
>;
export const updateLesson = /* GraphQL */ `mutation UpdateLesson(
  $input: UpdateLessonInput!
  $condition: ModelLessonConditionInput
) {
  updateLesson(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateLessonMutationVariables,
  APITypes.UpdateLessonMutation
>;
export const deleteLesson = /* GraphQL */ `mutation DeleteLesson(
  $input: DeleteLessonInput!
  $condition: ModelLessonConditionInput
) {
  deleteLesson(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteLessonMutationVariables,
  APITypes.DeleteLessonMutation
>;
export const createChallenge = /* GraphQL */ `mutation CreateChallenge(
  $input: CreateChallengeInput!
  $condition: ModelChallengeConditionInput
) {
  createChallenge(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateChallengeMutationVariables,
  APITypes.CreateChallengeMutation
>;
export const updateChallenge = /* GraphQL */ `mutation UpdateChallenge(
  $input: UpdateChallengeInput!
  $condition: ModelChallengeConditionInput
) {
  updateChallenge(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateChallengeMutationVariables,
  APITypes.UpdateChallengeMutation
>;
export const deleteChallenge = /* GraphQL */ `mutation DeleteChallenge(
  $input: DeleteChallengeInput!
  $condition: ModelChallengeConditionInput
) {
  deleteChallenge(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteChallengeMutationVariables,
  APITypes.DeleteChallengeMutation
>;
