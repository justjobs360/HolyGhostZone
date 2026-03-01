import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;
const CACHE_MAX_AGE = 31536000; // 1 year

/**
 * Serves an optimized (resized + WebP) hero image for local /images/* paths.
 * Keeps the hero as a single <img> while reducing payload and improving LCP.
 */
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    if (!url || typeof url !== 'string') {
      return new NextResponse('Missing url', { status: 400 });
    }
    // Only allow paths under /images/ (local public assets)
    const normalized = path.normalize(url).replace(/^(\.\.(\/|\\))+/, '');
    if (!normalized.startsWith('/images/')) {
      return new NextResponse('Invalid path', { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'public', normalized);
    const buffer = await readFile(filePath);
    const optimized = await sharp(buffer)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    return new NextResponse(optimized, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, immutable`,
      },
    });
  } catch (err) {
    console.error('Hero image optimization error:', err);
    return new NextResponse('Not Found', { status: 404 });
  }
}
