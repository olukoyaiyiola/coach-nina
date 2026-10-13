import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth';
import { processAdminChat } from '@/lib/gemini';
import { addChatMessage, getChatMessages, deleteChatMessage, clearChatMessages } from '@/lib/db';
import { AdminChatMessage } from '@/lib/types';

export async function GET(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getChatMessages();
    return NextResponse.json({ messages: messages || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch conversation history' }, { status: 500 });
  }
}

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
    const formattedHistory = previousMessages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Record user message
    const userMsgId = `msg_user_${Date.now()}`;
    const userMessage: AdminChatMessage = {
      id: userMsgId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    await addChatMessage(userMessage);

    // Call Gemini Assistant with conversation context
    const result = await processAdminChat(message, formattedHistory);

    // Record assistant message
    const assistantMsgId = `msg_asst_${Date.now()}`;
    const assistantMessage: AdminChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: result.reply,
      proposed_changes: result.proposal,
      status: 'completed',
      created_at: new Date().toISOString(),
    };
    await addChatMessage(assistantMessage);

    return NextResponse.json({
      reply: result.reply,
      proposal: result.proposal,
      userMessage,
      assistantMessage,
      messageId: assistantMsgId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await verifyApiAuth(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('all') === 'true';

    if (clearAll || !id) {
      await clearChatMessages();
      return NextResponse.json({
        success: true,
        message: 'Conversation history cleared successfully',
      });
    }

    const removed = await deleteChatMessage(id);
    return NextResponse.json({
      success: removed,
      message: removed ? 'Message deleted successfully' : 'Message not found',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
