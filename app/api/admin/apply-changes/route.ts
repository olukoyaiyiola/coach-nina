import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyApiAuth } from '@/lib/auth';
import {
  updateSetting,
  updateContent,
  saveFaq,
  saveShowcaseItem,
  updateChatMessageStatus,
  getContent,
} from '@/lib/db';
import { ProposedChangeSet } from '@/lib/types';

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { proposal, messageId } = (await req.json()) as {
      proposal: ProposedChangeSet;
      messageId?: string;
    };

    if (!proposal || !Array.isArray(proposal.changes) || proposal.changes.length === 0) {
      return NextResponse.json({ error: 'Valid proposal with changes is required' }, { status: 400 });
    }

    const appliedResults = [];

    for (const change of proposal.changes) {
      switch (change.type) {
        case 'setting': {
          await updateSetting(change.key, String(change.new_value), 'assistant:approved');
          appliedResults.push(`Updated setting ${change.key}`);
          break;
        }
        case 'content': {
          let updatedObj = change.new_value;
          // If partial update to a section
          if (change.key.includes('.')) {
            const [sectionKey, field] = change.key.split('.');
            const current = await getContent(sectionKey);
            updatedObj = { ...current, [field]: change.new_value };
            await updateContent(sectionKey, updatedObj, 'assistant:approved');
          } else {
            await updateContent(change.key, change.new_value, 'assistant:approved');
          }
          appliedResults.push(`Updated content section ${change.key}`);
          break;
        }
        case 'faq': {
          await saveFaq(change.new_value, 'assistant:approved');
          appliedResults.push(`Updated FAQ ${change.key}`);
          break;
        }
        case 'showcase': {
          await saveShowcaseItem(change.new_value, 'assistant:approved');
          appliedResults.push(`Updated showcase item ${change.key}`);
          break;
        }
        case 'media': {
          if (change.key === 'hero_image_url') {
            await updateSetting('hero_image_url', String(change.new_value), 'assistant:approved');
          } else if (change.key === 'bio_image_url') {
            await updateSetting('bio_image_url', String(change.new_value), 'assistant:approved');
          }
          appliedResults.push(`Updated media placement ${change.key}`);
          break;
        }
        default:
          break;
      }
    }

    if (messageId) {
      await updateChatMessageStatus(messageId, 'applied');
    }

    // Refresh live website cache immediately
    try {
      revalidatePath('/');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Successfully applied ${appliedResults.length} change(s).`,
      applied: appliedResults,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to apply changes' }, { status: 500 });
  }
}
