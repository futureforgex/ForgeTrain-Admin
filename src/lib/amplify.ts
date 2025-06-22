import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_example',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'example',
      signUpVerificationMethod: 'code',
    }
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_APPSYNC_ENDPOINT || 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    }
  },
  Storage: {
    S3: {
      bucket: import.meta.env.VITE_S3_BUCKET_NAME || 'forgetrain-storage',
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    }
  }
};

Amplify.configure(amplifyConfig);

export default Amplify; 