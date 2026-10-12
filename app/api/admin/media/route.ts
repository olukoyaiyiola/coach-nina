import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyApiAuth } from '@/lib/auth';
import { getMediaAssets, saveMediaAsset, deleteMediaAsset } from '@/lib/db';
import { MediaAsset } from '@/lib/types';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

// SSRF Protection: verify hostname is not a private/loopback/cloud-metadata address
function isSafePublicUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '169.254.169.254' || // AWS/GCP/Azure instance metadata
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const media = await getMediaAssets();
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  ensureUploadsDir();

  const contentType = req.headers.get('content-type') || '';

  // 1. JSON payload for Public URL Import
  if (contentType.includes('application/json')) {
    try {
      const { import_url } = await req.json();
      if (!import_url || typeof import_url !== 'string') {
        return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
      }

      if (!isSafePublicUrl(import_url)) {
        return NextResponse.json({
          error: 'URL rejected. Only public HTTP/HTTPS URLs are allowed. Local and private network addresses are blocked for security.'
        }, { status: 400 });
      }

      // Fetch with timeout and abort controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(import_url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'CoachNinaStudio/1.0' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json({ error: `Remote server returned status ${response.status}` }, { status: 400 });
      }

      const mimeType = response.headers.get('content-type') || '';
      if (!mimeType.startsWith('image/') && !mimeType.startsWith('video/')) {
        return NextResponse.json({ error: 'Only image or video files can be imported' }, { status: 400 });
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds maximum allowed 10MB limit' }, { status: 400 });
      }

      const ext = mimeType.split('/')[1]?.split(';')[0] || 'jpg';
      const filename = `import_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      const asset: MediaAsset = {
        id: `media_${Date.now()}`,
        filename,
        original_name: path.basename(new URL(import_url).pathname) || filename,
        url: `/uploads/${filename}`,
        file_type: mimeType,
        file_size: buffer.length,
        in_use_sections: [],
        created_at: new Date().toISOString()
      };

      await saveMediaAsset(asset);
      return NextResponse.json({ success: true, asset });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || 'Failed to import media from URL' }, { status: 500 });
    }
  }

  // 2. FormData for Device / Android upload
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 15MB limit' }, { status: 400 });
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `upload_${Date.now()}_${cleanName}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);

    const asset: MediaAsset = {
      id: `media_${Date.now()}`,
      filename,
      original_name: file.name,
      url: `/uploads/${filename}`,
      file_type: file.type || 'image/jpeg',
      file_size: buffer.length,
      in_use_sections: [],
      created_at: new Date().toISOString()
    };

    await saveMediaAsset(asset);
    return NextResponse.json({ success: true, asset });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });

  const result = await deleteMediaAsset(id);
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  const all = await getMediaAssets();
  return NextResponse.json({ success: true, media: all });
}
