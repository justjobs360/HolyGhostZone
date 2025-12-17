import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET() {
    try {
        const db = await getAdminDb();

        const events = [
            {
                id: 1,
                title: 'Sunday Service',
                date: 'Every Sunday',
                time: '10:00 AM',
                location: 'Holy Ghost Zone',
                category: 'Worship',
                attendees: '',
                image: '/images/events.jpeg',
                description: 'Join us for a powerful time of worship and the word.',
                buttonText: 'Join Us',
                buttonLink: '#'
            },
            {
                id: 2,
                title: 'Tuesday Service',
                date: 'Every Tuesday',
                time: '6:00 PM',
                location: 'Zoom',
                category: 'Service',
                attendees: '',
                image: '/images/services.jpg', // Placeholder for Zoom creative
                description: 'Meeting ID: 858 914 272\nPasscode: 141507',
                buttonText: 'Join on Zoom',
                buttonLink: 'https://zoom.us/j/858914272#success'
            },
            {
                id: 3,
                title: 'Thursday Service',
                date: 'Every Thursday',
                time: '6:00 PM',
                location: 'Zoom',
                category: 'Service',
                attendees: '',
                image: '/images/services.jpg', // Placeholder for Zoom creative
                description: 'Meeting ID: 858 914 272\nPasscode: 141507',
                buttonText: 'Join on Zoom',
                buttonLink: 'https://zoom.us/j/858914272#success'
            },
            {
                id: 4,
                title: 'Community Outreach',
                date: 'Monthly',
                time: '11:00 AM - 12:00 PM',
                location: 'Local Community',
                category: 'Outreach',
                attendees: '',
                image: '/images/services.jpg',
                description: 'Monthly and Local Community',
                buttonText: 'Learn More',
                buttonLink: '#'
            }
        ];

        // Read existing to avoid partial overwrite if needed, but merge: true handles fields.
        // However, specialEvents array is fully replaced here, which is desired.
        await db.collection('pages').doc('events').set({
            specialEvents: events
        }, { merge: true });

        return NextResponse.json({ success: true, events });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
