import { NextRequest, NextResponse } from 'next/server';
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

    const docRef = db.collection('pages').doc('header');
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return NextResponse.json(docSnap.data() || {});
    } else {
      return NextResponse.json({});
    }
  } catch (error: any) {
    console.error('GET /api/pages/header error:', error);
    return NextResponse.json({ error: 'Failed to load', detail: String(error?.message || error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const hasCreds = Boolean(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    if (!hasCreds) {
      return NextResponse.json(
        { error: 'Missing Firebase Admin credentials' },
        { status: 500 }
      );
    }

    const db = await getAdminDb();

    const body = await req.json();
    await db.collection('pages').doc('header').set(body, { merge: true });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error('POST /api/pages/header error:', e);
    return NextResponse.json(
      { error: 'Failed to save', detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
