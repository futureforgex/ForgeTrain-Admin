import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Check if amplifyconfiguration.json already exists
const configFile = 'src/amplifyconfiguration.json';

if (fs.existsSync(configFile)) {
  console.log('Amplify configuration found, skipping pull step...');
  
  try {
    console.log('Building with Vite...');
    
    // Run the Vite build
    execSync('vite build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
} else {
  // Get AWS credentials from environment variables
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!awsAccessKeyId || !awsSecretAccessKey) {
    console.error('Error: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required');
    process.exit(1);
  }

  // Helper function to safely remove directory
  function removeDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Removed directory: ${dirPath}`);
      } catch (error) {
        console.warn(`Warning: Could not remove ${dirPath}: ${error.message}`);
      }
    }
  }

  try {
    console.log('Cleaning up any existing Amplify directories...');
    
    // Clean up any existing amplify directories that might be causing conflicts
    removeDirectory('amplify-backup');
    removeDirectory('amplify');
    
    console.log('Setting up AWS credentials for Amplify CLI...');
    
    // Set AWS credentials in the environment for the child process
    const env = {
      ...process.env,
      AWS_ACCESS_KEY_ID: awsAccessKeyId,
      AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
      AWS_DEFAULT_REGION: 'us-east-1',
      PATH: process.env.PATH + ';C:\\Program Files\\Amazon\\AWSCLIV2'
    };
    
    console.log('Pulling Amplify configuration...');
    
    // Run the Amplify pull command with explicit environment variables
    const amplifyCommand = `npx @aws-amplify/cli pull --appId dhl17lat108sr --envName main --yes`;
    execSync(amplifyCommand, { 
      stdio: 'inherit',
      env: env
    });
    
    // Move the configuration file to src directory
    const sourceFile = 'amplifyconfiguration.json';
    const targetFile = 'src/amplifyconfiguration.json';
    
    if (fs.existsSync(sourceFile)) {
      // Ensure src directory exists
      if (!fs.existsSync('src')) {
        fs.mkdirSync('src');
      }
      
      // Move the file
      fs.renameSync(sourceFile, targetFile);
      console.log(`Moved ${sourceFile} to ${targetFile}`);
    } else {
      console.warn(`Warning: ${sourceFile} not found, skipping move operation`);
    }
    
    console.log('Building with Vite...');
    
    // Run the Vite build
    execSync('vite build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    
    // Clean up on failure
    console.log('Cleaning up after build failure...');
    removeDirectory('amplify-backup');
    removeDirectory('amplify');
    
    process.exit(1);
  }
} 