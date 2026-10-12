import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyApiAuth } from '@/lib/auth';
import { getFaqs, saveFaq, deleteFaq } from '@/lib/db';
import { FaqItem } from '@/lib/types';

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const faqs = await getFaqs();
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const faq = (await req.json()) as FaqItem;
    if (!faq || !faq.question || !faq.answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    if (!faq.id) {
      faq.id = `faq-${Date.now()}`;
    }

    await saveFaq(faq, 'admin:direct');

    try {
      revalidatePath('/');
    } catch {}

    const all = await getFaqs();
    return NextResponse.json({ success: true, faqs: all });
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

  await deleteFaq(id, 'admin:direct');

  try {
    revalidatePath('/');
  } catch {}

  const all = await getFaqs();
  return NextResponse.json({ success: true, faqs: all });
}
