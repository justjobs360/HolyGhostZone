// Simple Firebase Admin SDK initialization - using static imports (Next.js 15 compatible)
import * as admin from 'firebase-admin';

let initialized = false;

function initializeFirebaseAdmin() {
    // Return if already initialized
    if (initialized) {
        return admin;
    }

    // Check if Firebase Admin is already initialized
    if (admin.apps.length > 0) {
        initialized = true;
        return admin;
    }

    // Validate environment variables
    if (!process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Missing Firebase Admin credentials in environment variables');
    }

    // Initialize Firebase Admin
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

    initialized = true;
    return admin;
}

// Export helper functions
export function getAdminDb() {
    const adminSDK = initializeFirebaseAdmin();
    return adminSDK.firestore();
}

export function getAdminAuth() {
    const adminSDK = initializeFirebaseAdmin();
    return adminSDK.auth();
}

export function getAdminStorage() {
    const adminSDK = initializeFirebaseAdmin();
    return adminSDK.storage();
}

export default initializeFirebaseAdmin;
