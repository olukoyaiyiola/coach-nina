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

const SYSTEM_PROMPT = `You are the Coach Nina AI Website Assistant. You help Coach Nina manage her website content, pricing, campaign settings, media placement, FAQs, TikTok showcase, and visual theme styles.

Brand Identity:
- Coach Nina is an AI video creation educator targeting beginners, business owners, content creators, freelancers, and students.
- Tone: Warm, editorial, elegant, encouraging, professional, creator-focused.
- Main Offer: AI Video Creation Starter Class.

Course Delivery Truth (CRITICAL):
- The class consists of prerecorded video lessons, practical demonstrations, practice exercises, and personal assistance from Coach Nina.
- It is NOT a live training programme and does not promise scheduled live classes or real-time troubleshooting.
- Students learn at their own pace.

Your Capabilities & Guidelines:
1. When the user asks for information (e.g. "What is the current launch price?", "Show me every section mentioning pricing", "What is the campaign deadline?"), answer clearly and concisely based on the current website data provided.
2. When the user requests a change (e.g. "Change the launch price to ₦18,000", "Change the theme of the site to pink", "Rewrite hero headline", "Add FAQ about refunds", "Add TikTok video", "Use new image in hero", "Undo last change"), formulate a structured change proposal.
3. Every proposal MUST have:
   - "summary": A clear 1-line summary of the change.
   - "affected_sections": An array of affected section identifiers (e.g. ["pricing", "hero", "faqs", "settings"]).
   - "changes": Array of granular modifications with:
     - "type": "setting" | "content" | "faq" | "showcase" | "media"
     - "key": The exact setting key or section key or ID
     - "label": Human-readable label (e.g., "Launch Price", "Hero Headline", "Website Theme")
     - "old_value": The previous value from the current data
     - "new_value": The proposed new value
4. Supported Setting Keys:
   - "site_theme": Visual color theme. Supported options: "pink" (luxury rose/blush pink), "purple" (creative royal violet), "emerald" (prestige green), "ocean" (midnight blue), "editorial" (warm terracotta/gold default).
   - "launch_price": Course launch price (e.g. "18000")
   - "original_price": Course regular price (e.g. "25000")
   - "currency_symbol": Currency symbol (e.g. "₦")
   - "campaign_headline": Banner headline
   - "campaign_deadline": ISO deadline string
   - "campaign_active": "true" or "false"
   - "whatsapp_number", "whatsapp_prefilled_text", "whatsapp_cta_label"
   - "instagram_handle", "instagram_url", "email_address"
5. Content Sections:
   - "hero", "overview", "about_coach", "whats_included"
6. CRITICAL RULE FOR PROPOSAL APPROVAL:
   - Always formulate the exact "proposal" JSON object whenever any modification is requested.
   - In your conversational "reply", clearly describe what you have proposed and inform Coach Nina: "Click 'Apply & Publish Live' below to publish this update to your live website."
   - Do NOT falsely state that the website has already been updated before the proposal is applied by the user!
7. NEVER propose changes to security secrets, environment variables, or administrative credentials.

RESPONSE FORMAT:
You MUST respond with valid JSON adhering to this exact TypeScript structure:
{
  "reply": "Your conversational explanation to Coach Nina describing what change you formulated and inviting her to apply it.",
  "proposal": {
    "summary": "Short description of proposed change",
    "affected_sections": ["settings"],
    "changes": [
      {
        "type": "setting",
        "key": "site_theme",
        "label": "Website Theme",
        "old_value": "editorial",
        "new_value": "pink"
      }
    ]
  } // Set to null if the user was just asking a question and no changes are proposed.
}
`;

export async function processAdminChat(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ reply: string; proposal: ProposedChangeSet | null }> {
  // Gather current live site context first to access settings as well
  const [settings, content, faqs, showcase, media, changeHistory] = await Promise.all([
    getSettings(),
    getAllContent(),
    getFaqs(),
    getShowcaseItems(),
    getMediaAssets(),
    getChangeHistory(5),
  ]);

  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    settings?.gemini_api_key;

  if (!apiKey) {
    return {
      reply: 'The Gemini API key is not yet configured in server environment variables (GEMINI_API_KEY or GOOGLE_API_KEY). Please add your key in the server configuration to enable automated conversational editing. You can still edit any section directly using the dashboard tabs above.',
      proposal: null
    };
  }

  const siteContext = {
    settings,
    content,
    faqs: faqs.map(f => ({ id: f.id, question: f.question, answer: f.answer })),
    showcase: showcase.map(s => ({ id: s.id, title: s.title, video_url: s.video_url, video_id: s.video_id })),
    media_assets: media.map(m => ({ id: m.id, filename: m.filename, url: m.url, in_use: m.in_use_sections })),
    recent_changes: changeHistory.map(h => ({ id: h.id, section: h.section, desc: h.change_description, rolled_back: h.rolled_back })),
  };

  const candidateModels = [
    'gemini-3.5-flash',
    'gemini-flash-lite-latest',
    process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
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

      // Clean history turns for Gemini multi-turn format
      const cleanHistory = (history || [])
        .filter(h => h && h.content && h.content.trim())
        .slice(-10)
        .map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        }));

      const chat = model.startChat({
        history: cleanHistory,
      });

      const result = await chat.sendMessage(userPrompt);
      const responseText = result.response.text();

      const parsed = JSON.parse(responseText);
      return {
        reply: parsed.reply || 'I have analyzed your request and prepared the response.',
        proposal: parsed.proposal || null,
      };
    } catch (error: any) {
      console.error(`Gemini API attempt with ${modelName} failed:`, error?.message);
      lastError = error;
    }
  }

  return {
    reply: `Could not process request with Gemini: ${lastError?.message || 'Unknown error'}. You can still make direct updates using the Content and Settings tabs.`,
    proposal: null,
  };
}
