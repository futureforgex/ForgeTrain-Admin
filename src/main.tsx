import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplifyconfiguration.json'

Amplify.configure({
  ...amplifyconfig,
  Auth: {
    Cognito: {
      userPoolId: amplifyconfig.aws_user_pools_id,
      userPoolClientId: amplifyconfig.aws_user_pools_web_client_id,
      identityPoolId: amplifyconfig.aws_cognito_identity_pool_id,
    },
  },
  Storage: {
    S3: {
      bucket: amplifyconfig.aws_user_files_s3_bucket,
      region: amplifyconfig.aws_user_files_s3_bucket_region,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
