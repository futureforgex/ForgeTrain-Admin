# AWS IAM Permissions Setup for Amplify

## 🚨 Issue: User Not Authorized

The error shows that your AWS user `futureforgex` doesn't have the necessary permissions to create Amplify apps.

## 🔧 Solution: Add Required Permissions

### Option 1: Attach Amplify Full Access Policy (Recommended for Development)

1. **Go to AWS IAM Console:**
   - Visit: https://console.aws.amazon.com/iam/
   - Navigate to Users → futureforgex

2. **Attach Policy:**
   - Click on the user `futureforgex`
   - Go to "Permissions" tab
   - Click "Add permissions"
   - Choose "Attach policies directly"
   - Search for and select `AdministratorAccess-Amplify`
   - Click "Next" and "Add permissions"

### Option 2: Create Custom Policy (More Secure for Production)

1. **Create Custom Policy:**
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "amplify:*",
                   "cloudformation:*",
                   "cognito-idp:*",
                   "dynamodb:*",
                   "appsync:*",
                   "s3:*",
                   "iam:CreateRole",
                   "iam:AttachRolePolicy",
                   "iam:PutRolePolicy",
                   "iam:GetRole",
                   "iam:PassRole"
               ],
               "Resource": "*"
           }
       ]
   }
   ```

2. **Attach to User:**
   - Go to IAM Console
   - Create the policy above
   - Attach it to your user `futureforgex`

### Option 3: Use AWS Amplify Gen 2 (Latest Approach)

Since Amplify CLI suggested Gen 2, let's use the newer approach:

```bash
# Install Amplify Gen 2
npm install @aws-amplify/cli@latest

# Initialize with Gen 2
npx create-amplify@latest
```

## 🚀 Quick Fix Commands

### For Option 1 (Recommended):
```bash
# After adding permissions in AWS Console, try again:
amplify init
```

### For Option 2 (Custom Policy):
```bash
# Create the policy file
cat > amplify-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "amplify:*",
                "cloudformation:*",
                "cognito-idp:*",
                "dynamodb:*",
                "appsync:*",
                "s3:*",
                "iam:CreateRole",
                "iam:AttachRolePolicy",
                "iam:PutRolePolicy",
                "iam:GetRole",
                "iam:PassRole"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Then manually create this policy in AWS Console and attach to your user
```

## 🔍 Alternative: Use Different AWS Profile

If you have another AWS account with proper permissions:

```bash
# Configure a different profile
aws configure --profile amplify-admin

# Use that profile
amplify init --profile amplify-admin
```

## 📋 Step-by-Step IAM Setup

1. **Login to AWS Console:**
   - Go to https://console.aws.amazon.com/
   - Navigate to IAM service

2. **Find Your User:**
   - Go to Users → futureforgex

3. **Add Permissions:**
   - Click "Add permissions"
   - Choose "Attach policies directly"
   - Search for "Amplify"
   - Select `AdministratorAccess-Amplify`
   - Click "Add permissions"

4. **Verify Permissions:**
   - Check that the policy is attached
   - Wait 1-2 minutes for permissions to propagate

5. **Try Again:**
   ```bash
   amplify init
   ```

## 🎯 Recommended Approach

For development purposes, I recommend **Option 1** (attaching `AdministratorAccess-Amplify` policy) as it's the quickest solution and provides all necessary permissions for Amplify development.

After fixing the permissions, you can proceed with:

```bash
amplify init
amplify add auth
amplify add api
amplify add storage
amplify push
```

## 🔒 Security Note

The `AdministratorAccess-Amplify` policy gives broad permissions for Amplify services. For production environments, consider creating a more restrictive custom policy that only grants the specific permissions your application needs. 