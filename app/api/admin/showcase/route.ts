import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyApiAuth } from '@/lib/auth';
import { getShowcaseItems, saveShowcaseItem, deleteShowcaseItem } from '@/lib/db';
import { ShowcaseItem } from '@/lib/types';

function extractTikTokVideoId(url: string): string | null {
  // If already just numeric digits
  if (/^\d{15,22}$/.test(url.trim())) return url.trim();

  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes('tiktok.com')) return null;

    // Pattern: /@user/video/(\d+) or /video/(\d+)
    const match = parsed.pathname.match(/\/video\/(\d+)/);
    if (match && match[1]) return match[1];

    // Fallback search in query or path
    const digitMatch = parsed.pathname.match(/(\d{15,22})/);
    if (digitMatch && digitMatch[1]) return digitMatch[1];
  } catch {}

  return null;
}

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await getShowcaseItems();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const item = (await req.json()) as ShowcaseItem;
    if (!item.title || !item.video_url) {
      return NextResponse.json({ error: 'Title and TikTok video URL are required' }, { status: 400 });
    }

    const videoId = extractTikTokVideoId(item.video_url) || item.video_id;
    if (!videoId) {
      return NextResponse.json({
        error: 'Invalid TikTok URL. Please provide a standard TikTok video URL (e.g., https://www.tiktok.com/@username/video/1234567890123456789) or numeric ID.'
      }, { status: 400 });
    }

    item.video_id = videoId;
    if (!item.id) {
      item.id = `showcase-${Date.now()}`;
    }

    await saveShowcaseItem(item, 'admin:direct');

    try {
      revalidatePath('/');
    } catch {}

    const all = await getShowcaseItems();
    return NextResponse.json({ success: true, items: all });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  await deleteShowcaseItem(id, 'admin:direct');

  try {
    revalidatePath('/');
  } catch {}

  const all = await getShowcaseItems();
  return NextResponse.json({ success: true, items: all });
}
