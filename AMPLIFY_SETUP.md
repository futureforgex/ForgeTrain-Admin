# AWS Amplify Migration Setup Guide

This guide explains how to migrate from Firebase to AWS Amplify for the ForgeTrain Admin application.

## Why AWS Amplify?

AWS Amplify is the best choice for Firebase migration because it provides:
- **Authentication** (Cognito User Pools) - Similar to Firebase Auth
- **Database** (AppSync GraphQL + DynamoDB) - More powerful than Firestore
- **Storage** (S3) - Similar to Firebase Storage
- **Hosting** (Amplify Hosting) - Similar to Firebase Hosting
- **Real-time subscriptions** - Similar to Firestore real-time updates
- **CLI tools** - Easy setup and deployment

## Prerequisites

1. AWS Account with appropriate permissions
2. Node.js and npm installed
3. AWS CLI configured with credentials

## Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

Follow the prompts to configure your AWS credentials.

## Step 2: Initialize Amplify in Your Project

```bash
cd ForgeTrainAdmin
amplify init
```

Choose the following options:
- Enter a name for the project: `forgetrain-admin`
- Enter a name for the environment: `dev`
- Choose your default editor: Your preferred editor
- Choose the type of app that you're building: `javascript`
- What JavaScript framework are you using: `react`
- Source Directory Path: `src`
- Distribution Directory Path: `dist`
- Build Command: `npm run build`
- Start Command: `npm run dev`
- Do you want to use an AWS profile? `Yes`
- Please choose the profile you want to use: `default`

## Step 3: Add Authentication

```bash
amplify add auth
```

Choose the following options:
- Do you want to use the default authentication and security configuration? `Default configuration`
- How do you want users to be able to sign in? `Email`
- Do you want to configure advanced settings? `No, I am done`

## Step 4: Add API (GraphQL)

```bash
amplify add api
```

Choose the following options:
- Please select from one of the below mentioned services: `GraphQL`
- Provide a friendly name for your resource to be used as a label for this category in the project: `forgetrain`
- Provide the AWS AppSync GraphQL API name: `forgetrain`
- Choose the default authorization type for the API: `Amazon Cognito User Pool`
- Do you want to configure advanced settings for the GraphQL API: `No, I am done`
- Do you have an annotated GraphQL schema? `No`
- Do you want a guided schema creation? `Yes`
- What best describes your project: `Single object with fields (e.g., "Todo" with ID, name, description)`
- Do you want to edit the schema now? `Yes`

## Step 5: Add Storage

```bash
amplify add storage
```

Choose the following options:
- Please select from one of the below mentioned services: `Content (S3)`
- Provide a friendly name for your resource that will be used to label this category in the project: `forgetrainStorage`
- Provide bucket name for the storage bucket: `forgetrain-storage`
- Who should have access: `Auth users only`
- What kind of access do you want for Authenticated users: `create, update, read, delete`
- Do you want to add a Lambda Trigger for your S3 Bucket? `No`

## Step 6: Update GraphQL Schema

Replace the generated schema with our comprehensive schema:

```bash
# Open amplify/backend/api/forgetrain/schema.graphql
# Replace the content with our schema from the file above
```

## Step 7: Push Changes to AWS

```bash
amplify push
```

This will create all the AWS resources (Cognito User Pool, AppSync API, DynamoDB tables, S3 bucket).

## Step 8: Update Environment Variables

After `amplify push`, you'll get configuration files. Update your `.env` file:

```env
# These values will be provided by amplify push
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_APPSYNC_ENDPOINT=https://xxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
VITE_S3_BUCKET_NAME=forgetrain-storage
```

## Step 9: Install Dependencies

```bash
npm install aws-amplify @aws-amplify/ui-react
```

## Step 10: Update Your Code

1. **Initialize Amplify** in your main.tsx:
```tsx
import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplifyconfiguration.json';

Amplify.configure(amplifyConfig);
```

2. **Use the service layer** we created in `src/lib/amplifyServices.ts`

3. **Update components** to use Amplify services instead of Firebase

## Step 11: Test the Application

```bash
npm run dev
```

## Step 12: Deploy to Production

```bash
amplify publish
```

This will build and deploy your application to AWS Amplify Hosting.

## Migration Checklist

### ✅ Completed
- [x] Amplify CLI installation and configuration
- [x] Authentication setup (Cognito)
- [x] API setup (AppSync GraphQL)
- [x] Storage setup (S3)
- [x] Service layer creation
- [x] TextTutorials component migration
- [x] AuthProvider migration
- [x] LoginPage migration

### 🔄 Still Needs Migration
- [ ] PlacementDrives component
- [ ] Quizzes component
- [ ] Colleges component
- [ ] VideoTutorials component
- [ ] CodeChallenges component
- [ ] LearningContent component
- [ ] ModulePage component
- [ ] ProjectTasks component
- [ ] Announcements component
- [ ] Leaderboard component
- [ ] Analytics component

## Benefits of This Migration

1. **Better Performance**: DynamoDB is faster than Firestore for complex queries
2. **More Flexible**: GraphQL provides better data fetching than Firestore
3. **Real-time**: AppSync subscriptions are more powerful than Firestore listeners
4. **Cost Effective**: AWS pricing is often better than Firebase for production apps
5. **Enterprise Ready**: Better integration with other AWS services
6. **Type Safety**: Generated TypeScript types from GraphQL schema

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Cognito User Pool configuration
   - Verify environment variables
   - Ensure user is confirmed in Cognito

2. **API Errors**
   - Check AppSync API configuration
   - Verify GraphQL schema syntax
   - Check DynamoDB table permissions

3. **Storage Errors**
   - Check S3 bucket permissions
   - Verify CORS configuration
   - Check file size limits

### Useful Commands

```bash
# View Amplify status
amplify status

# View backend resources
amplify console

# Remove a resource
amplify remove auth

# Update resources
amplify update auth

# Pull latest changes
amplify pull

# View logs
amplify console api
```

## Next Steps

1. Complete the migration of remaining components
2. Set up CI/CD pipeline with Amplify
3. Configure custom domain
4. Set up monitoring and analytics
5. Implement advanced features like real-time subscriptions 