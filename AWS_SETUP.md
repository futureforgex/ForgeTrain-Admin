# AWS Aurora Migration Setup Guide

This guide explains how to set up AWS Aurora DSQL and S3 to replace Firebase in the ForgeTrain Admin application.

## Prerequisites

1. AWS Account with appropriate permissions
2. Aurora PostgreSQL cluster with Data API enabled
3. S3 bucket for file storage
4. AWS credentials with RDS Data API and S3 permissions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Aurora DSQL Configuration
VITE_AURORA_RESOURCE_ARN=arn:aws:rds:us-east-1:123456789012:cluster:your-aurora-cluster
VITE_AURORA_SECRET_ARN=arn:aws:secretsmanager:us-east-1:123456789012:secret:your-secret-name
VITE_AURORA_DATABASE=forgetrain
VITE_AURORA_SCHEMA=public

# S3 Configuration
VITE_S3_BUCKET_NAME=forgetrain-storage
```

## Database Setup

1. Create an Aurora PostgreSQL cluster
2. Enable the Data API for the cluster
3. Create a Secrets Manager secret for database credentials
4. Run the SQL schema from `database/schema.sql` to create the required tables

## S3 Setup

1. Create an S3 bucket for file storage
2. Configure CORS for the bucket if needed
3. Set appropriate bucket policies for public read access

## Authentication

The current implementation uses a placeholder authentication system. To implement proper authentication:

1. Set up AWS Cognito User Pool
2. Update the AuthProvider component to use Cognito
3. Implement proper JWT token handling

## Migration Steps

1. Install AWS SDK dependencies:
   ```bash
   npm install @aws-sdk/client-rds-data @aws-sdk/client-s3
   ```

2. Remove Firebase dependencies:
   ```bash
   npm uninstall firebase firebase-admin react-firebase-hooks
   ```

3. Update environment variables
4. Test the application with AWS services

## File Structure

- `src/lib/aws.ts` - AWS Aurora DSQL and S3 configuration
- `database/schema.sql` - Database schema for Aurora
- `src/pages/admin/TextTutorials.tsx` - Updated to use AWS services

## Troubleshooting

1. **Data API not enabled**: Ensure the Aurora cluster has Data API enabled
2. **Permission errors**: Check IAM roles and policies
3. **Connection issues**: Verify the resource ARN and secret ARN are correct
4. **S3 upload failures**: Check bucket permissions and CORS configuration 