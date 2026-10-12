import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyApiAuth } from '@/lib/auth';
import { getChangeHistory, rollbackChange } from '@/lib/db';

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const history = await getChangeHistory(30);
  return NextResponse.json(history);
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { historyId } = await req.json();
    if (!historyId) {
      return NextResponse.json({ error: 'historyId is required' }, { status: 400 });
    }

    const result = await rollbackChange(historyId);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    try {
      revalidatePath('/');
    } catch {}

    const updatedHistory = await getChangeHistory(30);
    return NextResponse.json({ success: true, message: result.message, history: updatedHistory });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
