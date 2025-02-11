import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  // Check if any Firebase apps have been initialized
  if (getApps().length === 0) {
    // Ensure all required environment variables are present
    const requiredEnvVars = [
      'PRIVATE_KEY',
      'CLIENT_EMAIL',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingEnvVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Initialize the Firebase Admin app
    return initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        // The private key comes as a string with "\n" characters
        // We need to replace them with actual newlines
        privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
  } else {
    return getApp();
  }
}

// Initialize app and get Firestore instance
const app = initializeFirebaseAdmin();
const adminDb = getFirestore(app);

export { app as adminApp, adminDb };