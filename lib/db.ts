import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SiteSettings,
  FaqItem,
  ShowcaseItem,
  MediaAsset,
  ChangeHistoryEntry,
  AdminChatMessage,
} from './types';

// Default Seed Constants
const DEFAULT_SETTINGS: SiteSettings = {
  course_title: 'AI Video Creation Starter Class',
  original_price: '25000',
  launch_price: '15000',
  currency_symbol: '₦',
  campaign_headline: 'October Launch Offer',
  campaign_deadline: '2026-10-31T23:59:59+01:00',
  campaign_active: 'true',
  whatsapp_number: '2349133942845',
  whatsapp_prefilled_text: 'My name is [Your Name] and I am interested in learning about AI video creation.',
  whatsapp_cta_label: 'Chat with Coach Nina on WhatsApp →',
  instagram_handle: '_justninna_',
  instagram_url: 'https://instagram.com/_justninna_',
  email_address: 'nnannannenna2@gmail.com',
  creator_profile_enabled: 'true',
  creator_profile_url: 'https://www.tiktok.com/@noinoi.stories',
  creator_unique_id: 'noinoi.stories',
  hero_image_url: '/images/coach-nina-laptop.png',
  bio_image_url: '/images/coach-nina-laptop.png',
};

const DEFAULT_CONTENT: Record<string, any> = {
  hero: {
    badge: '✨ A practical skill you can start using immediately',
    headline: 'Learn To Create Better Videos With AI.',
    subheadline: 'Learn how to create AI-powered videos for businesses, brands, and content projects, even if you are just getting started.',
    practical_benefit: 'Understand the tools, practise creating high-quality videos, and learn how to offer AI video creation as a high-demand service.',
    primary_cta: 'Chat on WhatsApp',
    secondary_cta: 'Explore the Starter Class',
    value_badges: [
      'No Experience Required',
      'Hands-On Real-Project Builds',
      'Monetization & Client Playbook'
    ],
    guarantee_note: '🔒 Launch price ends October 31, 2026 • While available'
  },
  overview: {
    tagline: 'Real Skills. Plain Language.',
    headline: 'What is AI Video Creation?',
    description: 'AI video creation is the craft of turning ideas, scripts, and product concepts into high-engagement videos using cutting-edge generative tools. You do not need cameras, lighting rigs, or years of editing experience.',
    use_cases_summary: 'Produce product commercials, promotional brand videos, lifelike AI avatars, cinematic storytelling scenes, voiceovers, auto-captions, and organic social media content.'
  },
  about_coach: {
    tagline: 'Meet Your Instructor',
    name: 'Coach Nina',
    role: 'AI Video Educator & Creative Director',
    bio: 'Coach Nina helps beginners, entrepreneurs, freelancers, and creative minds master AI-driven storytelling and video production. With hands-on mentorship, she breaks down complex generative workflows into practical, step-by-step techniques anyone can use to build persuasive content and monetizable skills.'
  },
  whats_included: {
    title: 'What Is Included In The Class',
    items: [
      { title: 'Live Online Training', desc: 'Interactive, step-by-step guided lessons with Coach Nina' },
      { title: 'Hands-On Practical Session', desc: 'Live building of real ads, avatars, and video scenes' },
      { title: 'Practice Assignment', desc: 'Guided assignment with direct feedback to lock in your skills' },
      { title: 'Live Q&A Session', desc: 'Dedicated troubleshooting and live workflow problem-solving' },
      { title: 'Resource & Prompt Pack', desc: 'Plug-and-play prompt formulas, tool links, and client scripts' },
      { title: 'Private Community Access', desc: 'Network with fellow creators and get ongoing support' }
    ]
  }
};

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is this class suitable for complete beginners?',
    answer: 'Yes, absolutely. The class is designed specifically from the ground up for people with zero video editing or AI background. We start with fundamental concepts and guide you click by click.',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'faq-2',
    question: 'Do I need an expensive computer or editing software?',
    answer: 'No. You can produce, voice, animate, and edit high-impact videos entirely using a modern smartphone or an everyday laptop. We demonstrate workflows tailored for both mobile and desktop.',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'faq-3',
    question: 'Will I have to pay thousands of naira for AI subscriptions immediately?',
    answer: 'No. The starter class emphasizes high-utility free tiers, starter credits, and budget-friendly engines so you can generate professional videos and start monetizing without massive upfront overhead.',
    sort_order: 3,
    is_active: true
  },
  {
    id: 'faq-4',
    question: 'How does the ₦15,000 October launch offer work?',
    answer: 'The regular tuition is ₦25,000. The October launch offer lets you enroll for ₦15,000 until October 31, 2026. The real-time countdown on this page shows the remaining time before the offer ends.',
    sort_order: 4,
    is_active: true
  },
  {
    id: 'faq-5',
    question: 'What will I be able to create after completing the class?',
    answer: 'You will know how to create direct-to-consumer product ads, faceless storytelling videos, AI avatars and spokespersons, voiceovers with natural accents, and clean social media clips for yourself or paying clients.',
    sort_order: 5,
    is_active: true
  },
  {
    id: 'faq-6',
    question: 'How do I complete my registration?',
    answer: 'Click the WhatsApp button on this page to chat directly with Coach Nina. You will receive immediate guidance on joining the upcoming starter class session.',
    sort_order: 6,
    is_active: true
  }
];

const DEFAULT_SHOWCASE: ShowcaseItem[] = [
  {
    id: 'showcase-1',
    title: 'Swim Sexy Launch Spot',
    description: 'A product-focused AI commercial built around a clear customer problem, a strong offer, and a direct path to purchase. Learn how AI video can turn simple product ideas into persuasive marketing content.',
    video_url: 'https://www.tiktok.com/@noinoi.stories/video/7681170901257227542',
    video_id: '7681170901257227542',
    category: 'E-Commerce',
    badge_text: 'High-Converting Commercial',
    study_focus: 'Product storytelling',
    sort_order: 1,
    is_active: true,
    embed_type: 'player'
  },
  {
    id: 'showcase-2',
    title: 'The Price of Envy (Part 1)',
    description: 'A story-driven AI video built around emotion, character, and cultural context. See how AI can be used to develop memorable scenes while keeping characters and visual direction consistent.',
    video_url: 'https://www.tiktok.com/@noinoi.stories/video/7670253315820735766',
    video_id: '7670253315820735766',
    category: 'Narrative',
    badge_text: 'Viral Episodic Fiction',
    study_focus: 'Character + storytelling',
    sort_order: 2,
    is_active: true,
    embed_type: 'player'
  },
  {
    id: 'showcase-3',
    title: 'Children of the Tide (Part 1)',
    description: 'A cinematic example of AI-assisted world-building, character design, and environment creation. It shows how imaginative concepts can be developed into visual stories with a strong sense of atmosphere.',
    video_url: 'https://www.tiktok.com/@noinoi.stories/video/7670968106403073312',
    video_id: '7670968106403073312',
    category: 'Cinematic',
    badge_text: 'Mythological Lore & CGI',
    study_focus: 'World-building',
    sort_order: 3,
    is_active: true,
    embed_type: 'player'
  }
];

const DEFAULT_MEDIA: MediaAsset[] = [
  {
    id: 'media-coach-nina-laptop',
    filename: 'coach-nina-laptop.png',
    original_name: 'coach-nina-laptop.png',
    url: '/images/coach-nina-laptop.png',
    file_type: 'image/png',
    file_size: 2389564,
    in_use_sections: ['hero', 'about_coach'],
    created_at: new Date().toISOString()
  }
];

// Supabase Client Initialization
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

// Local File Store Helper (Atomic writes & auto-seeding with Serverless /tmp support)
let memoryStore: LocalStoreSchema | null = null;

function getStorePaths() {
  const isServerless = !!process.env.VERCEL || (typeof process.cwd === 'function' && process.cwd().startsWith('/var/task')) || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const localDir = path.join(process.cwd(), 'data');
  const localFile = path.join(localDir, 'coach_nina_store.json');

  if (isServerless) {
    const tmpDir = '/tmp';
    const tmpFile = path.join(tmpDir, 'coach_nina_store.json');
    return {
      readOnlySeedFile: localFile,
      writableDir: tmpDir,
      writableFile: tmpFile,
      isServerless: true,
    };
  }

  return {
    readOnlySeedFile: localFile,
    writableDir: localDir,
    writableFile: localFile,
    isServerless: false,
  };
}

interface LocalStoreSchema {
  settings: SiteSettings;
  content: Record<string, any>;
  faqs: FaqItem[];
  showcase: ShowcaseItem[];
  media: MediaAsset[];
  history: ChangeHistoryEntry[];
  chatMessages: AdminChatMessage[];
}

function initLocalStore(): LocalStoreSchema {
  if (memoryStore) {
    return memoryStore;
  }

  const { readOnlySeedFile, writableDir, writableFile, isServerless } = getStorePaths();

  // 1. Try reading existing writable store in /tmp or local data/
  if (fs.existsSync(/*turbopackIgnore: true*/ writableFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ writableFile, 'utf-8'));
      memoryStore = {
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
        content: {
          hero: { ...DEFAULT_CONTENT.hero, ...(data.content?.hero || {}) },
          overview: { ...DEFAULT_CONTENT.overview, ...(data.content?.overview || {}) },
          about_coach: { ...DEFAULT_CONTENT.about_coach, ...(data.content?.about_coach || {}) },
          whats_included: { ...DEFAULT_CONTENT.whats_included, ...(data.content?.whats_included || {}) },
          ...(data.content || {})
        },
        faqs: data.faqs || DEFAULT_FAQS,
        showcase: data.showcase || DEFAULT_SHOWCASE,
        media: data.media || DEFAULT_MEDIA,
        history: data.history || [],
        chatMessages: data.chatMessages || []
      };
      return memoryStore;
    } catch {}
  }

  // 2. If running on Vercel serverless and /tmp is not yet initialized, read bundled seed file
  if (isServerless && fs.existsSync(/*turbopackIgnore: true*/ readOnlySeedFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ readOnlySeedFile, 'utf-8'));
      memoryStore = {
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
        content: {
          hero: { ...DEFAULT_CONTENT.hero, ...(data.content?.hero || {}) },
          overview: { ...DEFAULT_CONTENT.overview, ...(data.content?.overview || {}) },
          about_coach: { ...DEFAULT_CONTENT.about_coach, ...(data.content?.about_coach || {}) },
          whats_included: { ...DEFAULT_CONTENT.whats_included, ...(data.content?.whats_included || {}) },
          ...(data.content || {})
        },
        faqs: data.faqs || DEFAULT_FAQS,
        showcase: data.showcase || DEFAULT_SHOWCASE,
        media: data.media || DEFAULT_MEDIA,
        history: data.history || [],
        chatMessages: data.chatMessages || []
      };
      try {
        fs.writeFileSync(/*turbopackIgnore: true*/ writableFile, JSON.stringify(memoryStore, null, 2), 'utf-8');
      } catch {}
      return memoryStore;
    } catch {}
  }

  // 3. Fallback to default in-memory seed
  const initial: LocalStoreSchema = {
    settings: DEFAULT_SETTINGS,
    content: DEFAULT_CONTENT,
    faqs: DEFAULT_FAQS,
    showcase: DEFAULT_SHOWCASE,
    media: DEFAULT_MEDIA,
    history: [],
    chatMessages: []
  };

  memoryStore = initial;

  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ writableDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ writableDir, { recursive: true });
    }
    fs.writeFileSync(/*turbopackIgnore: true*/ writableFile, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write store to disk, running in memory-safe mode:', err);
  }

  return memoryStore;
}

function saveLocalStore(store: LocalStoreSchema): void {
  memoryStore = store;
  const { writableDir, writableFile } = getStorePaths();

  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ writableDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ writableDir, { recursive: true });
    }
    const tempPath = `${writableFile}.tmp.${Date.now()}`;
    fs.writeFileSync(/*turbopackIgnore: true*/ tempPath, JSON.stringify(store, null, 2), 'utf-8');
    fs.renameSync(/*turbopackIgnore: true*/ tempPath, writableFile);
  } catch (err) {
    console.warn('Could not persist store to disk, state maintained in memory:', err);
  }
}

// ==============================================================================
// PUBLIC & ADMIN DATA ACCESSORS
// ==============================================================================

export async function getSettings(): Promise<SiteSettings> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (!error && data && data.length > 0) {
        const settings: Partial<SiteSettings> = { ...DEFAULT_SETTINGS };
        for (const item of data) {
          settings[item.key] = item.value;
        }
        return settings as SiteSettings;
      }
    } catch (err) {
      console.warn('Supabase getSettings failed, using fallback:', err);
    }
  }

  const store = initLocalStore();
  return store.settings;
}

export async function updateSetting(key: string, value: string, author: string = 'admin'): Promise<void> {
  const oldSettings = await getSettings();
  const oldValue = oldSettings[key];

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });
    } catch (err) {
      console.warn('Supabase updateSetting failed:', err);
    }
  }

  const store = initLocalStore();
  store.settings[key] = value;
  saveLocalStore(store);

  await recordChange({
    section: `setting:${key}`,
    change_description: `Updated setting ${key}`,
    previous_data: { [key]: oldValue },
    new_data: { [key]: value },
    author
  });
}

export async function getContent(sectionKey: string): Promise<any> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', sectionKey)
        .single();
      if (!error && data) return data.content;
    } catch (err) {
      console.warn('Supabase getContent failed, using fallback:', err);
    }
  }

  const store = initLocalStore();
  return store.content[sectionKey] || DEFAULT_CONTENT[sectionKey];
}

export async function getAllContent(): Promise<Record<string, any>> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_content').select('section_key, content');
      if (!error && data && data.length > 0) {
        const result: Record<string, any> = { ...DEFAULT_CONTENT };
        for (const item of data) {
          result[item.section_key] = item.content;
        }
        return result;
      }
    } catch (err) {
      console.warn('Supabase getAllContent failed:', err);
    }
  }

  const store = initLocalStore();
  return store.content;
}

export async function updateContent(sectionKey: string, newContent: any, author: string = 'admin'): Promise<void> {
  const oldContent = await getContent(sectionKey);
  const finalContent = (typeof oldContent === 'object' && oldContent !== null && typeof newContent === 'object' && newContent !== null && !Array.isArray(newContent))
    ? { ...oldContent, ...newContent }
    : newContent;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('site_content')
        .upsert({
          section_key: sectionKey,
          content: finalContent,
          is_published: true,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('Supabase updateContent failed:', err);
    }
  }

  const store = initLocalStore();
  store.content[sectionKey] = finalContent;
  saveLocalStore(store);

  await recordChange({
    section: `content:${sectionKey}`,
    change_description: `Updated section ${sectionKey}`,
    previous_data: oldContent,
    new_data: finalContent,
    author
  });
}

export async function getFaqs(): Promise<FaqItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as FaqItem[];
    } catch (err) {
      console.warn('Supabase getFaqs failed:', err);
    }
  }

  const store = initLocalStore();
  return (store.faqs || []).sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveFaq(faq: FaqItem, author: string = 'admin'): Promise<void> {
  const oldFaqs = await getFaqs();
  const existing = oldFaqs.find(f => f.id === faq.id);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('faqs').upsert({
        ...faq,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveFaq failed:', err);
    }
  }

  const store = initLocalStore();
  const idx = store.faqs.findIndex(f => f.id === faq.id);
  if (idx >= 0) {
    store.faqs[idx] = faq;
  } else {
    store.faqs.push(faq);
  }
  saveLocalStore(store);

  await recordChange({
    section: 'faqs',
    change_description: existing ? `Updated FAQ: ${faq.question.slice(0, 30)}...` : `Added FAQ: ${faq.question.slice(0, 30)}...`,
    previous_data: existing || null,
    new_data: faq,
    author
  });
}

export async function deleteFaq(faqId: string, author: string = 'admin'): Promise<void> {
  const oldFaqs = await getFaqs();
  const existing = oldFaqs.find(f => f.id === faqId);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('faqs').delete().eq('id', faqId);
    } catch (err) {
      console.warn('Supabase deleteFaq failed:', err);
    }
  }

  const store = initLocalStore();
  store.faqs = store.faqs.filter(f => f.id !== faqId);
  saveLocalStore(store);

  if (existing) {
    await recordChange({
      section: 'faqs',
      change_description: `Deleted FAQ: ${existing.question.slice(0, 30)}...`,
      previous_data: existing,
      new_data: null,
      author
    });
  }
}

export async function getShowcaseItems(): Promise<ShowcaseItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('showcase_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as ShowcaseItem[];
    } catch (err) {
      console.warn('Supabase getShowcaseItems failed:', err);
    }
  }

  const store = initLocalStore();
  return (store.showcase || []).sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveShowcaseItem(item: ShowcaseItem, author: string = 'admin'): Promise<void> {
  const oldItems = await getShowcaseItems();
  const existing = oldItems.find(s => s.id === item.id);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('showcase_items').upsert({
        ...item,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveShowcaseItem failed:', err);
    }
  }

  const store = initLocalStore();
  const idx = store.showcase.findIndex(s => s.id === item.id);
  if (idx >= 0) {
    store.showcase[idx] = item;
  } else {
    store.showcase.push(item);
  }
  saveLocalStore(store);

  await recordChange({
    section: 'showcase',
    change_description: existing ? `Updated video showcase: ${item.title}` : `Added video showcase: ${item.title}`,
    previous_data: existing || null,
    new_data: item,
    author
  });
}

export async function deleteShowcaseItem(itemId: string, author: string = 'admin'): Promise<void> {
  const oldItems = await getShowcaseItems();
  const existing = oldItems.find(s => s.id === itemId);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('showcase_items').delete().eq('id', itemId);
    } catch (err) {
      console.warn('Supabase deleteShowcaseItem failed:', err);
    }
  }

  const store = initLocalStore();
  store.showcase = store.showcase.filter(s => s.id !== itemId);
  saveLocalStore(store);

  if (existing) {
    await recordChange({
      section: 'showcase',
      change_description: `Deleted showcase video: ${existing.title}`,
      previous_data: existing,
      new_data: null,
      author
    });
  }
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as MediaAsset[];
    } catch (err) {
      console.warn('Supabase getMediaAssets failed:', err);
    }
  }

  const store = initLocalStore();
  return store.media || [];
}

export async function saveMediaAsset(asset: MediaAsset): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('media_assets').upsert(asset);
    } catch (err) {
      console.warn('Supabase saveMediaAsset failed:', err);
    }
  }

  const store = initLocalStore();
  const idx = store.media.findIndex(m => m.id === asset.id);
  if (idx >= 0) {
    store.media[idx] = asset;
  } else {
    store.media.unshift(asset);
  }
  saveLocalStore(store);
}

export async function deleteMediaAsset(assetId: string): Promise<{ success: boolean; message?: string }> {
  const store = initLocalStore();
  const asset = store.media.find(m => m.id === assetId);

  // Check if asset is currently in use
  if (asset && asset.in_use_sections && asset.in_use_sections.length > 0) {
    return {
      success: false,
      message: `Asset is currently in use by section(s): ${asset.in_use_sections.join(', ')}. Reassign first before deleting.`
    };
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('media_assets').delete().eq('id', assetId);
    } catch (err) {}
  }

  store.media = store.media.filter(m => m.id !== assetId);
  saveLocalStore(store);
  return { success: true };
}

export async function getChangeHistory(limit: number = 20): Promise<ChangeHistoryEntry[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('change_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (!error && data) return data as ChangeHistoryEntry[];
    } catch (err) {}
  }

  const store = initLocalStore();
  return (store.history || []).slice(0, limit);
}

export async function recordChange(entry: Omit<ChangeHistoryEntry, 'id' | 'created_at'>): Promise<ChangeHistoryEntry> {
  const item: ChangeHistoryEntry = {
    ...entry,
    id: `chg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
    rolled_back: false
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('change_history').insert(item);
    } catch (err) {}
  }

  const store = initLocalStore();
  store.history.unshift(item);
  if (store.history.length > 100) store.history = store.history.slice(0, 100);
  saveLocalStore(store);

  return item;
}

export async function rollbackChange(historyId: string): Promise<{ success: boolean; message: string }> {
  const store = initLocalStore();
  const entry = store.history.find(h => h.id === historyId);
  if (!entry) return { success: false, message: 'Change history item not found' };
  if (entry.rolled_back) return { success: false, message: 'This change has already been rolled back' };
  if (!entry.previous_data) return { success: false, message: 'No previous state stored for rollback' };

  if (entry.section.startsWith('setting:')) {
    const key = entry.section.replace('setting:', '');
    const prevVal = entry.previous_data[key];
    if (prevVal !== undefined) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from('site_settings').upsert({ key, value: prevVal, updated_at: new Date().toISOString() });
        } catch (err) {}
      }
      const s = initLocalStore();
      s.settings[key] = prevVal;
      saveLocalStore(s);
    }
  } else if (entry.section.startsWith('content:')) {
    const sectionKey = entry.section.replace('content:', '');
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('site_content').upsert({
          section_key: sectionKey,
          content: entry.previous_data,
          is_published: true,
          updated_at: new Date().toISOString()
        });
      } catch (err) {}
    }
    const s = initLocalStore();
    s.content[sectionKey] = entry.previous_data;
    saveLocalStore(s);
  } else if (entry.section === 'faqs') {
    if (entry.previous_data) {
      await saveFaq(entry.previous_data, 'admin:rollback');
    }
  } else if (entry.section === 'showcase') {
    if (entry.previous_data) {
      await saveShowcaseItem(entry.previous_data, 'admin:rollback');
    }
  }

  entry.rolled_back = true;
  saveLocalStore(store);

  return { success: true, message: `Successfully rolled back "${entry.change_description}"` };
}

export async function getChatMessages(): Promise<AdminChatMessage[]> {
  const store = initLocalStore();
  return store.chatMessages || [];
}

export async function addChatMessage(msg: AdminChatMessage): Promise<void> {
  const store = initLocalStore();
  store.chatMessages.push(msg);
  if (store.chatMessages.length > 50) store.chatMessages = store.chatMessages.slice(-50);
  saveLocalStore(store);
}

export async function updateChatMessageStatus(msgId: string, status: AdminChatMessage['status']): Promise<void> {
  const store = initLocalStore();
  const msg = store.chatMessages.find(m => m.id === msgId);
  if (msg) {
    msg.status = status;
    saveLocalStore(store);
  }
}

export async function getDiagnostics(): Promise<{
  mode: 'supabase' | 'local_persistent';
  supabase_configured: boolean;
  gemini_configured: boolean;
  item_counts: {
    settings: number;
    content_sections: number;
    faqs: number;
    showcase: number;
    media: number;
    history: number;
  };
}> {
  const supabase = getSupabaseClient();
  const store = initLocalStore();

  return {
    mode: supabase ? 'supabase' : 'local_persistent',
    supabase_configured: !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)),
    gemini_configured: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    item_counts: {
      settings: Object.keys(store.settings).length,
      content_sections: Object.keys(store.content).length,
      faqs: store.faqs.length,
      showcase: store.showcase.length,
      media: store.media.length,
      history: store.history.length
    }
  };
}
