#!/usr/bin/env node

/**
 * Migration Script: Firebase to AWS Amplify
 * 
 * This script helps migrate remaining Firebase components to AWS Amplify
 * Run this script after setting up Amplify infrastructure
 */

const fs = require('fs');
const path = require('path');

// Files that need migration
const filesToMigrate = [
  'src/components/admin/AddCodeChallengePanel.tsx',
  'src/components/admin/NewDriveWizard.tsx',
  'src/components/admin/ModuleForm.tsx',
  'src/components/admin/LessonPanel.tsx',
  'src/pages/admin/ModulePage.tsx',
  'src/pages/admin/ProjectTasks.tsx',
  'src/pages/admin/PlacementDrives.tsx',
  'src/pages/admin/Quizzes.tsx',
  'src/pages/admin/LearningContent.tsx',
  'src/pages/admin/VideoTutorials.tsx',
  'src/pages/admin/CodeChallenges.tsx',
  'src/pages/admin/Colleges.tsx',
  'src/components/modules/AddLessonModal.tsx',
  'src/components/modules/ModuleEditor.tsx',
  'src/components/modules/ModuleList.tsx',
  'src/components/auth/RequireAuth.tsx'
];

// Firebase to Amplify replacements
const replacements = [
  // Imports
  {
    from: "import { firestore, storage } from '@/lib/firebase';",
    to: "import { tutorialService, driveService, quizService, collegeService, storageService } from '@/lib/amplifyServices';"
  },
  {
    from: "import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';",
    to: ""
  },
  {
    from: "import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';",
    to: ""
  },
  {
    from: "import { db } from '@/lib/firebase';",
    to: "import { tutorialService, driveService, quizService, collegeService } from '@/lib/amplifyServices';"
  },
  {
    from: "import { useAuthState } from 'react-firebase-hooks/auth';",
    to: "import { useAuth } from '@/components/auth/AuthProvider';"
  },
  {
    from: "import { auth } from '@/lib/firebase';",
    to: "import { authService } from '@/lib/amplifyServices';"
  },
  
  // Firestore operations
  {
    from: "getDocs(collection(firestore, 'tutorials'))",
    to: "tutorialService.list()"
  },
  {
    from: "getDocs(collection(firestore, 'drives'))",
    to: "driveService.list()"
  },
  {
    from: "getDocs(collection(firestore, 'quizzes'))",
    to: "quizService.list()"
  },
  {
    from: "getDocs(collection(firestore, 'colleges'))",
    to: "collegeService.list()"
  },
  {
    from: "addDoc(collection(firestore, 'tutorials'), tutorial)",
    to: "tutorialService.create(tutorial)"
  },
  {
    from: "addDoc(collection(firestore, 'drives'), drive)",
    to: "driveService.create(drive)"
  },
  {
    from: "addDoc(collection(firestore, 'quizzes'), quiz)",
    to: "quizService.create(quiz)"
  },
  {
    from: "addDoc(collection(firestore, 'colleges'), college)",
    to: "collegeService.create(college)"
  },
  {
    from: "setDoc(doc(firestore, 'tutorials', id), tutorial)",
    to: "tutorialService.update(tutorial)"
  },
  {
    from: "setDoc(doc(firestore, 'drives', id), drive)",
    to: "driveService.update(drive)"
  },
  {
    from: "setDoc(doc(firestore, 'quizzes', id), quiz)",
    to: "quizService.update(quiz)"
  },
  {
    from: "setDoc(doc(firestore, 'colleges', id), college)",
    to: "collegeService.update(college)"
  },
  {
    from: "deleteDoc(doc(firestore, 'tutorials', id))",
    to: "tutorialService.delete(id)"
  },
  {
    from: "deleteDoc(doc(firestore, 'drives', id))",
    to: "driveService.delete(id)"
  },
  {
    from: "deleteDoc(doc(firestore, 'quizzes', id))",
    to: "quizService.delete(id)"
  },
  {
    from: "deleteDoc(doc(firestore, 'colleges', id))",
    to: "collegeService.delete(id)"
  },
  
  // Storage operations
  {
    from: "const storageRef = ref(storage, `folder/${file.name}`);",
    to: ""
  },
  {
    from: "await uploadBytes(storageRef, file);",
    to: ""
  },
  {
    from: "const downloadURL = await getDownloadURL(storageRef);",
    to: "const downloadURL = await storageService.uploadFile(file, 'folder');"
  },
  
  // Auth operations
  {
    from: "const [user, loading, error] = useAuthState(auth);",
    to: "const { user, loading } = useAuth();"
  },
  {
    from: "signInWithEmailAndPassword(auth, email, password)",
    to: "authService.signIn(email, password)"
  },
  {
    from: "signOut(auth)",
    to: "authService.signOut()"
  },
  
  // Timestamps
  {
    from: "serverTimestamp()",
    to: "new Date().toISOString()"
  },
  {
    from: "Timestamp",
    to: "Date"
  }
];

function migrateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Apply replacements
  replacements.forEach(replacement => {
    content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
  });
  
  // Write back if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migrated: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

function main() {
  console.log('🚀 Starting Firebase to Amplify migration...\n');
  
  filesToMigrate.forEach(file => {
    migrateFile(file);
  });
  
  console.log('\n🎉 Migration completed!');
  console.log('\nNext steps:');
  console.log('1. Review the migrated files for any manual adjustments needed');
  console.log('2. Test the application to ensure everything works correctly');
  console.log('3. Update any remaining Firebase-specific code patterns');
  console.log('4. Remove Firebase dependencies: npm uninstall firebase firebase-admin react-firebase-hooks');
}

if (require.main === module) {
  main();
}

module.exports = { migrateFile, replacements }; 