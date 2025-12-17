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
      return NextResponse.json({}, {
        status: 200,
        headers: { 'x-warning': 'Missing Firebase Admin credentials' },
      });
    }

    const db = getAdminDb();

    try {
      const snap = await db.collection('pages').doc('home').get();

      if (!snap.exists) {
        return NextResponse.json({}, { status: 200 });
      }

      return NextResponse.json(snap.data() || {}, { status: 200 });
    } catch (dbError: any) {
      console.error('Firestore query error:', dbError);

      if (dbError.code === 5) {
        return NextResponse.json({}, { status: 200 });
      }

      throw dbError;
    }
  } catch (e: any) {
    console.error('GET /api/admin/pages/home error:', e);
    return NextResponse.json(
      { error: 'Failed to load', detail: String(e?.message || e) },
      { status: 500 }
    );
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

    const db = getAdminDb();

    const body = await req.json();
    await db.collection('pages').doc('home').set(body, { merge: true });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error('POST /api/admin/pages/home error:', e);
    return NextResponse.json(
      { error: 'Failed to save', detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
