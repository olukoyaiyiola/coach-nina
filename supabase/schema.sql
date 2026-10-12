-- ==============================================================================
-- COACH NINA DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Site Settings (General global configurations: pricing, campaign, contact)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Site Content Sections (Rich editorial copy, hero, syllabus, guarantees)
CREATE TABLE IF NOT EXISTS site_content (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  draft_content JSONB,
  is_published BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Showcase Items (TikTok videos and embeds)
CREATE TABLE IF NOT EXISTS showcase_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_id TEXT NOT NULL,
  category TEXT DEFAULT 'Commercial',
  badge_text TEXT DEFAULT 'High-Converting',
  study_focus TEXT DEFAULT 'Product storytelling',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  embed_type TEXT DEFAULT 'player',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Media Assets Library
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  in_use_sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Change History (Audit log & rollback support)
CREATE TABLE IF NOT EXISTS change_history (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  change_description TEXT NOT NULL,
  previous_data JSONB,
  new_data JSONB,
  author TEXT DEFAULT 'admin',
  rolled_back BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Admin Assistant Chat Messages
CREATE TABLE IF NOT EXISTS admin_chat_messages (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  proposed_changes JSONB,
  status TEXT DEFAULT 'completed', -- 'completed' | 'applied' | 'cancelled' | 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Security: Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read access policies for published website content
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (is_published = true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read showcase_items" ON showcase_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read media_assets" ON media_assets FOR SELECT USING (true);

-- Authenticated / Service Role full access
CREATE POLICY "Admin manage site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin manage site_content" ON site_content FOR ALL USING (true);
CREATE POLICY "Admin manage faqs" ON faqs FOR ALL USING (true);
CREATE POLICY "Admin manage showcase_items" ON showcase_items FOR ALL USING (true);
CREATE POLICY "Admin manage media_assets" ON media_assets FOR ALL USING (true);
CREATE POLICY "Admin manage change_history" ON change_history FOR ALL USING (true);
CREATE POLICY "Admin manage admin_chat_messages" ON admin_chat_messages FOR ALL USING (true);
