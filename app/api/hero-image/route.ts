import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const DEFAULT_MAX_WIDTH = 1920;
const DEFAULT_QUALITY = 80;
const CACHE_MAX_AGE = 31536000; // 1 year

/**
 * Serves an optimized (resized + WebP) hero image for local /images/* paths.
 * Optional ?w= and ?q= for responsive/mobile (smaller payload), desktop unchanged.
 */
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    if (!url || typeof url !== 'string') {
      return new NextResponse('Missing url', { status: 400 });
    }
    const w = req.nextUrl.searchParams.get('w');
    const q = req.nextUrl.searchParams.get('q');
    const maxWidth = w ? Math.min(2048, Math.max(1, parseInt(w, 10) || DEFAULT_MAX_WIDTH)) : DEFAULT_MAX_WIDTH;
    const quality = q ? Math.min(100, Math.max(1, parseInt(q, 10) || DEFAULT_QUALITY)) : DEFAULT_QUALITY;

    // Only allow paths under /images/ (local public assets)
    const normalized = path.normalize(url).replace(/^(\.\.(\/|\\))+/, '');
    if (!normalized.startsWith('/images/')) {
      return new NextResponse('Invalid path', { status: 400 });
    }
    const filePath = path.join(process.cwd(), 'public', normalized);
    const buffer = await readFile(filePath);
    const optimized = await sharp(buffer)
      .resize(maxWidth, null, { withoutEnlargement: true })
      .webp({ quality })
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
