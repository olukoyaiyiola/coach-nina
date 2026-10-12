import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { processAdminChat } from '@/lib/gemini';
import { addChatMessage, getChatMessages } from '@/lib/db';

export async function POST(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Retrieve previous recent messages for conversation context
    const previousMessages = await getChatMessages();
    const formattedHistory = previousMessages.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Record user message
    const userMsgId = `msg_user_${Date.now()}`;
    await addChatMessage({
      id: userMsgId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString()
    });

    // Call Gemini Assistant
    const result = await processAdminChat(message, formattedHistory);

    // Record assistant message
    const assistantMsgId = `msg_asst_${Date.now()}`;
    await addChatMessage({
      id: assistantMsgId,
      role: 'assistant',
      content: result.reply,
      proposed_changes: result.proposal,
      status: result.proposal ? 'completed' : 'completed',
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      reply: result.reply,
      proposal: result.proposal,
      messageId: assistantMsgId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
