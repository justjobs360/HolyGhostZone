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
      console.warn('Missing Firebase Admin credentials, returning default service data');
      return NextResponse.json({
        title: 'Join Our Online Service',
        description:
          "We're redirecting you to our live Zoom service now. If nothing happens after a few seconds, please use the button below.",
        zoomUrl:
          'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1',
        autoRedirectSeconds: 2,
      });
    }

    const db = await getAdminDb();

    const docRef = db.collection('pages').doc('service');
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data() || {};
      return NextResponse.json({
        title: data.title || 'Join Our Online Service',
        description:
          data.description ||
          "We're redirecting you to our live Zoom service now. If nothing happens after a few seconds, please use the button below.",
        zoomUrl:
          data.zoomUrl ||
          'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1',
        autoRedirectSeconds:
          typeof data.autoRedirectSeconds === 'number' ? data.autoRedirectSeconds : 2,
      });
    } else {
      return NextResponse.json({
        title: 'Join Our Online Service',
        description:
          "We're redirecting you to our live Zoom service now. If nothing happens after a few seconds, please use the button below.",
        zoomUrl:
          'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1',
        autoRedirectSeconds: 2,
      });
    }
  } catch (error: any) {
    console.error('GET /api/pages/service error:', error);
    return NextResponse.json(
      {
        title: 'Join Our Online Service',
        description:
          "We're redirecting you to our live Zoom service now. If nothing happens after a few seconds, please use the button below.",
        zoomUrl:
          'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1',
        autoRedirectSeconds: 2,
        error: 'Failed to load',
        detail: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}

