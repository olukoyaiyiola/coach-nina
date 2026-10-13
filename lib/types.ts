export interface SiteSettings {
  course_title: string;
  original_price: string;
  launch_price: string;
  currency_symbol: string;
  campaign_headline: string;
  campaign_deadline: string; // ISO date string: 2026-10-31T23:59:59+01:00
  campaign_active: string; // 'true' | 'false'
  whatsapp_number: string;
  whatsapp_prefilled_text: string;
  whatsapp_cta_label: string;
  instagram_handle: string;
  instagram_url: string;
  email_address: string;
  creator_profile_enabled: string;
  creator_profile_url: string;
  creator_unique_id: string;
  hero_image_url: string;
  bio_image_url: string;
  site_theme: string;
  accent_color: string;
  [key: string]: string;
}

export interface HeroContent {
  badge: string;
  headline: string;
  subheadline: string;
  practical_benefit: string;
  primary_cta: string;
  secondary_cta: string;
  value_badges: string[];
  guarantee_note: string;
}

export interface OverviewContent {
  tagline: string;
  headline: string;
  description: string;
  use_cases_summary: string;
}

export interface AboutCoachContent {
  tagline: string;
  name: string;
  role: string;
  bio: string;
}

export interface IncludedItem {
  title: string;
  desc: string;
}

export interface WhatsIncludedContent {
  title: string;
  items: IncludedItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  updated_at?: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  video_id: string;
  category: string;
  badge_text: string;
  study_focus: string;
  sort_order: number;
  is_active: boolean;
  embed_type: 'player' | 'official' | 'custom';
  updated_at?: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  file_type: string;
  file_size: number;
  in_use_sections: string[];
  created_at: string;
}

export interface ChangeHistoryEntry {
  id: string;
  section: string;
  change_description: string;
  previous_data: any;
  new_data: any;
  author: string;
  rolled_back?: boolean;
  created_at: string;
}

export interface AdminChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposed_changes?: ProposedChangeSet | null;
  status?: 'completed' | 'applied' | 'cancelled' | 'error';
  created_at: string;
}

export interface ProposedChangeSet {
  summary: string;
  affected_sections: string[];
  changes: {
    type: 'setting' | 'content' | 'faq' | 'showcase' | 'media';
    key: string;
    label: string;
    old_value: any;
    new_value: any;
  }[];
}
