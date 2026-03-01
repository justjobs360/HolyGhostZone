import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import clientPromise from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

const CHUNK_MAX_BYTES = 4 * 1024 * 1024; // 4MB per chunk (under Vercel 4.5MB limit)
const ASSEMBLY_MAX_DOC_BYTES = 16 * 1024 * 1024 - 1024 * 1024; // ~15MB (under MongoDB 16MB doc limit)
const CHUNKS_COLLECTION = 'upload_chunks';
const BUCKET_NAME = 'media';

function bufferToStream(buf: Buffer): Readable {
    return Readable.from(buf);
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const chunk = formData.get('chunk') as File | null;
        const uploadId = formData.get('uploadId') as string | null;
        const chunkIndex = parseInt((formData.get('chunkIndex') as string) ?? '', 10);
        const totalChunks = parseInt((formData.get('totalChunks') as string) ?? '', 10);
        const filename = formData.get('filename') as string | null;
        const contentType = formData.get('contentType') as string | null;

        if (!chunk || !uploadId || Number.isNaN(chunkIndex) || Number.isNaN(totalChunks) || !filename || !contentType) {
            return NextResponse.json(
                { error: 'Missing chunk, uploadId, chunkIndex, totalChunks, filename, or contentType' },
                { status: 400 }
            );
        }

        const isImage = contentType.startsWith('image/');
        const isVideo = contentType.startsWith('video/');
        const isAudio = contentType.startsWith('audio/');
        if (!isImage && !isVideo && !isAudio) {
            return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
        }

        if (chunk.size > CHUNK_MAX_BYTES) {
            return NextResponse.json({ error: `Chunk too large (max ${CHUNK_MAX_BYTES / 1024 / 1024}MB)` }, { status: 400 });
        }

        const buffer = Buffer.from(await chunk.arrayBuffer());
        const client = await clientPromise();
        const db = client.db('holyghostzone_storage');

        await db.collection(CHUNKS_COLLECTION).insertOne({
            uploadId,
            chunkIndex,
            totalChunks,
            filename,
            contentType,
            data: buffer,
            createdAt: new Date(),
        });

        const count = await db.collection(CHUNKS_COLLECTION).countDocuments({ uploadId });
        if (count < totalChunks) {
            return NextResponse.json({ done: false, received: count, totalChunks });
        }

        // Assemble all chunks
        const chunks = await db
            .collection(CHUNKS_COLLECTION)
            .find({ uploadId })
            .sort({ chunkIndex: 1 })
            .toArray();

        const fullBuffer = Buffer.concat(
            chunks.map((c) => (c.data instanceof Buffer ? c.data : Buffer.from((c.data as any).buffer ?? c.data)))
        );
        let publicUrl: string;

        if (fullBuffer.length > ASSEMBLY_MAX_DOC_BYTES) {
            const bucket = new GridFSBucket(db, { bucketName: BUCKET_NAME });
            const fileId = new ObjectId();
            const uploadStream = bucket.openUploadStreamWithId(fileId, filename, {
                metadata: { contentType },
            });
            await new Promise<void>((resolve, reject) => {
                bufferToStream(fullBuffer)
                    .pipe(uploadStream)
                    .on('finish', resolve)
                    .on('error', reject);
            });
            publicUrl = `/api/images/${fileId.toString()}`;
        } else {
            const imageDoc = {
                filename,
                contentType,
                data: fullBuffer,
                uploadDate: new Date(),
            };
            const result = await db.collection('images').insertOne(imageDoc);
            publicUrl = `/api/images/${result.insertedId.toString()}`;
        }

        await db.collection(CHUNKS_COLLECTION).deleteMany({ uploadId });

        return NextResponse.json({ done: true, url: publicUrl });
    } catch (error: any) {
        console.error('Upload chunk error:', error);
        return NextResponse.json(
            { error: 'Chunk upload failed', detail: error.message },
            { status: 500 }
        );
    }
}
