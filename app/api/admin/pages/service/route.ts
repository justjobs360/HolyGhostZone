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
      return NextResponse.json(
        {
          title: 'Join Our Online Service',
          description:
            'Use this Zoom link to join our live online services. You can update it here whenever the meeting details change.',
          zoomUrl:
            'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1',
          autoRedirectSeconds: 2,
        },
        {
          status: 200,
          headers: { 'x-warning': 'Missing Firebase Admin credentials' },
        }
      );
    }

    const db = await getAdminDb();

    try {
      const snap = await db.collection('pages').doc('service').get();

      if (!snap.exists) {
        return NextResponse.json(
          {
            title: 'Join Our Online Service',
            description:
              'Use this Zoom link to join our live online services. You can update it here whenever the meeting details change.',
            zoomUrl:
              'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1',
            autoRedirectSeconds: 2,
          },
          { status: 200 }
        );
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
    console.error('GET /api/admin/pages/service error:', e);
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

    const db = await getAdminDb();

    const body = await req.json();
    await db.collection('pages').doc('service').set(body, { merge: true });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error('POST /api/admin/pages/service error:', e);
    return NextResponse.json(
      { error: 'Failed to save', detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}

