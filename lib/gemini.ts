import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProposedChangeSet } from './types';
import {
  getSettings,
  getAllContent,
  getFaqs,
  getShowcaseItems,
  getMediaAssets,
  getChangeHistory,
} from './db';

const SYSTEM_PROMPT = `You are the Coach Nina AI Website Assistant. You help Coach Nina manage her website content, pricing, campaign settings, media placement, FAQs, and TikTok showcase.

Brand Identity:
- Coach Nina is an AI video creation educator targeting beginners, business owners, content creators, freelancers, and students.
- Tone: Warm, editorial, elegant, encouraging, professional, creator-focused.
- Main Offer: AI Video Creation Starter Class.

Your Capabilities & Guidelines:
1. When the user asks for information (e.g. "What is the current launch price?", "Show me every section mentioning pricing", "What is the campaign deadline?"), answer clearly and concisely based on the current website data provided.
2. When the user requests a change (e.g. "Change the launch price to ₦18,000", "Rewrite hero headline", "Add FAQ about refunds", "Add TikTok video", "Use new image in hero", "Undo last change"), formulate a structured change proposal.
3. Every proposal MUST have:
   - "summary": A clear 1-line summary of the change.
   - "affected_sections": An array of affected section identifiers (e.g. ["pricing", "hero", "faqs"]).
   - "changes": Array of granular modifications with:
     - "type": "setting" | "content" | "faq" | "showcase" | "media"
     - "key": The exact setting key or section key or ID
     - "label": Human-readable label (e.g., "Launch Price", "Hero Headline")
     - "old_value": The previous value from the current data
     - "new_value": The proposed new value
4. NEVER propose changes to security secrets, environment variables, or administrative credentials.
5. All proposed changes require explicit user approval via the interface before they are applied to the database.

RESPONSE FORMAT:
You MUST respond with valid JSON adhering to this exact TypeScript structure:
{
  "reply": "Your conversational explanation to Coach Nina describing what you inspected or what changes you formulated.",
  "proposal": {
    "summary": "Short description of proposed change",
    "affected_sections": ["pricing", "hero"],
    "changes": [
      {
        "type": "setting",
        "key": "launch_price",
        "label": "Launch Price",
        "old_value": "15000",
        "new_value": "18000"
      }
    ]
  } // Set to null if the user was just asking a question and no changes are proposed.
}
`;

export async function processAdminChat(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ reply: string; proposal: ProposedChangeSet | null }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: 'The Gemini API key is not yet configured in server environment variables (GEMINI_API_KEY). Please add your key in the server configuration to enable automated conversational editing. You can still edit any section directly using the dashboard tabs above.',
      proposal: null
    };
  }

  // Gather current live site context
  const [settings, content, faqs, showcase, media, changeHistory] = await Promise.all([
    getSettings(),
    getAllContent(),
    getFaqs(),
    getShowcaseItems(),
    getMediaAssets(),
    getChangeHistory(5),
  ]);

  const siteContext = {
    settings,
    content,
    faqs: faqs.map(f => ({ id: f.id, question: f.question, answer: f.answer })),
    showcase: showcase.map(s => ({ id: s.id, title: s.title, video_url: s.video_url, video_id: s.video_id })),
    media_assets: media.map(m => ({ id: m.id, filename: m.filename, url: m.url, in_use: m.in_use_sections })),
    recent_changes: changeHistory.map(h => ({ id: h.id, section: h.section, desc: h.change_description, rolled_back: h.rolled_back })),
  };

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = `CURRENT WEBSITE STATE:
${JSON.stringify(siteContext, null, 2)}

USER REQUEST:
"${message}"

Formulate your response strictly following the JSON format.`;

    const chat = model.startChat({
      history: history.slice(-6).map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage(userPrompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    return {
      reply: parsed.reply || 'I analyzed your request.',
      proposal: parsed.proposal || null,
    };
  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    return {
      reply: `Could not process request with Gemini: ${error?.message || 'Unknown error'}. You can still make direct updates using the Content and Settings tabs.`,
      proposal: null,
    };
  }
}
