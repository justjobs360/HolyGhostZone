import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return new NextResponse('Invalid Image ID', { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('holyghostzone_storage');

        const image = await db.collection('images').findOne({ _id: new ObjectId(id) });

        if (!image) {
            return new NextResponse('Image not found', { status: 404 });
        }

        // Return the image data with correct content type
        return new NextResponse(image.data.buffer, {
            headers: {
                'Content-Type': image.contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error('Image Serve Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
