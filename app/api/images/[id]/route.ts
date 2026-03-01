import { Readable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

const BUCKET_NAME = 'media';

function toBuffer(data: Buffer | { buffer?: ArrayBuffer } | Uint8Array): Buffer {
    if (Buffer.isBuffer(data)) return data;
    if (data instanceof Uint8Array) return Buffer.from(data);
    if (data && typeof (data as any).buffer !== 'undefined') return Buffer.from((data as any).buffer);
    return Buffer.from(data as any);
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return new NextResponse('Invalid Image ID', { status: 400 });
        }

        const client = await clientPromise();
        const db = client.db('holyghostzone_storage');
        const objectId = new ObjectId(id);

        // 1) Try regular images collection (small files stored as single doc)
        const image = await db.collection('images').findOne({ _id: objectId });

        if (image) {
            const body = toBuffer(image.data);
            return new NextResponse(body, {
                headers: {
                    'Content-Type': image.contentType || 'application/octet-stream',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        // 2) Try GridFS (large video/audio stored via chunked upload)
        const bucket = new GridFSBucket(db, { bucketName: BUCKET_NAME });
        const filesCol = db.collection(`${BUCKET_NAME}.files`);
        const fileDoc = await filesCol.findOne({ _id: objectId });
        if (!fileDoc) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const contentType = (fileDoc.metadata as any)?.contentType || (fileDoc as any).contentType || 'application/octet-stream';
        const downloadStream = bucket.openDownloadStream(objectId);
        const webStream = Readable.toWeb(downloadStream as any);

        return new NextResponse(webStream, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Image Serve Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
