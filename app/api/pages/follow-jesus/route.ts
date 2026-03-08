import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const hasCreds = Boolean(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    if (!hasCreds) {
      console.warn('Missing Firebase Admin credentials, returning empty data');
      return NextResponse.json({});
    }

    const db = await getAdminDb();
    const docRef = db.collection('pages').doc('followJesus');
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data() || {});
    }
    return NextResponse.json({});
  } catch (error: unknown) {
    const err = error as Error;
    console.error('GET /api/pages/follow-jesus error:', err);
    return NextResponse.json(
      { error: 'Failed to load', detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
