import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyApiAuth } from '@/lib/auth';
import { getSettings, updateSetting } from '@/lib/db';

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const updates = await req.json();
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(updates)) {
      await updateSetting(key, String(value), 'admin:direct');
    }

    try {
      revalidatePath('/');
    } catch {}

    const updated = await getSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
