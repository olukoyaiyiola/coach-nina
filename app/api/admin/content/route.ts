import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyApiAuth } from '@/lib/auth';
import { getAllContent, getContent, updateContent } from '@/lib/db';

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const section = url.searchParams.get('section');

  if (section) {
    const data = await getContent(section);
    return NextResponse.json(data);
  }

  const all = await getAllContent();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { section, content } = await req.json();
    if (!section || !content) {
      return NextResponse.json({ error: 'Section and content are required' }, { status: 400 });
    }

    await updateContent(section, content, 'admin:direct');

    try {
      revalidatePath('/');
    } catch {}

    const updated = await getContent(section);
    return NextResponse.json({ success: true, section, content: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
