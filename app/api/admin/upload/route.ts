import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');

        if (!isImage && !isVideo && !isAudio) {
            return NextResponse.json({ error: 'File must be an image, video, or audio file' }, { status: 400 });
        }

        // Increase size limit for video/audio files
        const maxSize = isImage ? 5 * 1024 * 1024 : 100 * 1024 * 1024; // 5MB for images, 100MB for video/audio
        if (file.size > maxSize) {
            return NextResponse.json({ error: `File size must be less than ${maxSize / (1024 * 1024)}MB` }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Connect to MongoDB
        const client = await clientPromise();
        const db = client.db('holyghostzone_storage');

        // Save image document
        const imageDoc = {
            filename: file.name,
            contentType: file.type,
            data: buffer,
            uploadDate: new Date(),
        };

        const result = await db.collection('images').insertOne(imageDoc);
        const imageId = result.insertedId.toString();

        // Return the URL that will serve this image
        // Note: In production, configure your domain. Locally localhost works.
        // We use a relative URL which works fine for the frontend.
        const publicUrl = `/api/images/${imageId}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error('Mongo Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', detail: error.message },
            { status: 500 }
        );
    }
}
