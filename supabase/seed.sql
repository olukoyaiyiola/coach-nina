-- ==============================================================================
-- COACH NINA DATABASE SEED DATA
-- ==============================================================================

-- 1. Site Settings
INSERT INTO site_settings (key, value, description) VALUES
('course_title', 'AI Video Creation Starter Class', 'Main title of the course'),
('original_price', '25000', 'Original course tuition in NGN'),
('launch_price', '15000', 'Launch discount tuition in NGN'),
('currency_symbol', '₦', 'Currency symbol'),
('campaign_headline', 'October Launch Offer', 'Campaign announcement tag'),
('campaign_deadline', '2026-10-31T23:59:59+01:00', 'Offer end deadline in ISO format (Africa/Lagos)'),
('campaign_active', 'true', 'Whether launch offer is active'),
('whatsapp_number', '2349133942845', 'Contact WhatsApp number in international format without plus'),
('whatsapp_prefilled_text', 'My name is [Your Name] and I am interested in learning about AI video creation.', 'Prefilled WhatsApp enquiry message'),
('whatsapp_cta_label', 'Chat with Coach Nina on WhatsApp →', 'Primary CTA button label'),
('instagram_handle', '_justninna_', 'Coach Nina Instagram handle'),
('instagram_url', 'https://instagram.com/_justninna_', 'Coach Nina Instagram profile URL'),
('email_address', 'nnannannenna2@gmail.com', 'Coach Nina contact email'),
('creator_profile_enabled', 'true', 'Enable official TikTok creator embed in Creator Hub'),
('creator_profile_url', 'https://www.tiktok.com/@noinoi.stories', 'TikTok Creator Hub profile link'),
('creator_unique_id', 'noinoi.stories', 'TikTok username identifier'),
('hero_image_url', '/images/coach-nina-laptop.png', 'Prominent hero / workspace portrait image'),
('bio_image_url', '/images/coach-nina-laptop.png', 'Coach Nina bio portrait image')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Site Content
INSERT INTO site_content (section_key, content, is_published) VALUES
('hero', '{
  "badge": "✨ A practical skill you can start using immediately",
  "headline": "Learn To Create Better Videos With AI.",
  "subheadline": "Learn how to create AI-powered videos for businesses, brands, and content projects, even if you are just getting started.",
  "practical_benefit": "Understand the tools, practise creating high-quality videos, and learn how to offer AI video creation as a high-demand service.",
  "primary_cta": "Chat on WhatsApp",
  "secondary_cta": "Explore the Starter Class",
  "value_badges": [
    "No Experience Required",
    "Hands-On Real-Project Builds",
    "Monetization & Client Playbook"
  ],
  "guarantee_note": "🔒 Launch price ends October 31, 2026 • While available"
}'::jsonb, true),

('overview', '{
  "tagline": "Real Skills. Plain Language.",
  "headline": "What is AI Video Creation?",
  "description": "AI video creation is the craft of turning ideas, scripts, and product concepts into high-engagement videos using cutting-edge generative tools. You do not need cameras, lighting rigs, or years of editing experience.",
  "use_cases_summary": "Produce product commercials, promotional brand videos, lifelike AI avatars, cinematic storytelling scenes, voiceovers, auto-captions, and organic social media content."
}'::jsonb, true),

('about_coach', '{
  "tagline": "Meet Your Instructor",
  "name": "Coach Nina",
  "role": "AI Video Educator & Creative Director",
  "bio": "Coach Nina helps beginners, entrepreneurs, freelancers, and creative minds master AI-driven storytelling and video production. With hands-on mentorship, she breaks down complex generative workflows into practical, step-by-step techniques anyone can use to build persuasive content and monetizable skills."
}'::jsonb, true),

('whats_included', '{
  "title": "What Is Included In The Class",
  "items": [
    {"title": "Prerecorded Video Lessons", "desc": "Learn through clear, step-by-step lessons you can watch at your own pace."},
    {"title": "Practical Video Walkthroughs", "desc": "Follow demonstrations of creating AI-generated videos, avatars, and scenes."},
    {"title": "Practice Exercises", "desc": "Apply what you learn as you work through the lessons."},
    {"title": "Personal Assistance", "desc": "Get help from Coach Nina when you need clarification or encounter difficulties."},
    {"title": "AI Prompts & Resources", "desc": "Access useful prompt formulas, tool links, and learning resources included with the class."},
    {"title": "Learn At Your Own Pace", "desc": "Work through the lessons at a pace that suits your schedule."}
  ]
}'::jsonb, true)
ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content;

-- 3. Showcase Items (TikTok videos)
INSERT INTO showcase_items (id, title, description, video_url, video_id, category, badge_text, study_focus, sort_order, is_active, embed_type) VALUES
('showcase-1', 'Swim Sexy Launch Spot', 'A product-focused AI commercial built around a clear customer problem, a strong offer, and a direct path to purchase. Learn how AI video can turn simple product ideas into persuasive marketing content.', 'https://www.tiktok.com/@noinoi.stories/video/7681170901257227542', '7681170901257227542', 'E-Commerce', 'High-Converting Commercial', 'Product storytelling', 1, true, 'player'),
('showcase-2', 'The Price of Envy (Part 1)', 'A story-driven AI video built around emotion, character, and cultural context. See how AI can be used to develop memorable scenes while keeping characters and visual direction consistent.', 'https://www.tiktok.com/@noinoi.stories/video/7670253315820735766', '7670253315820735766', 'Narrative', 'Viral Episodic Fiction', 'Character + storytelling', 2, true, 'player'),
('showcase-3', 'Children of the Tide (Part 1)', 'A cinematic example of AI-assisted world-building, character design, and environment creation. It shows how imaginative concepts can be developed into visual stories with a strong sense of atmosphere.', 'https://www.tiktok.com/@noinoi.stories/video/7670968106403073312', '7670968106403073312', 'Cinematic', 'Mythological Lore & CGI', 'World-building', 3, true, 'player')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  video_url = EXCLUDED.video_url,
  video_id = EXCLUDED.video_id;

-- 4. FAQs
INSERT INTO faqs (id, question, answer, sort_order, is_active) VALUES
('faq-1', 'Is this class suitable for complete beginners?', 'Yes, absolutely. The class is designed specifically from the ground up for people with zero video editing or AI background. We start with fundamental concepts and guide you click by click.', 1, true),
('faq-2', 'Do I need an expensive computer or editing software?', 'No. You can produce, voice, animate, and edit high-impact videos entirely using a modern smartphone or an everyday laptop. We demonstrate workflows tailored for both mobile and desktop.', 2, true),
('faq-3', 'Will I have to pay thousands of naira for AI subscriptions immediately?', 'No. The starter class emphasizes high-utility free tiers, starter credits, and budget-friendly engines so you can generate professional videos and start monetizing without massive upfront overhead.', 3, true),
('faq-4', 'How does the ₦15,000 October launch offer work?', 'The regular tuition is ₦25,000. The October launch offer lets you enroll for ₦15,000 until October 31, 2026. The real-time countdown on this page shows the remaining time before the offer ends.', 4, true),
('faq-5', 'What will I be able to create after completing the class?', 'You will know how to create direct-to-consumer product ads, faceless storytelling videos, AI avatars and spokespersons, voiceovers with natural accents, and clean social media clips for yourself or paying clients.', 5, true),
('faq-6', 'How do I complete my registration?', 'Click the WhatsApp button on this page to chat directly with Coach Nina. You will receive payment details and immediate access to the prerecorded video lessons, practice exercises, and learning resources.', 6, true),
('faq-7', 'How is the course delivered?', 'The AI Video Creation Starter Class consists of prerecorded instructional video lessons and practical demonstrations that you can watch at your own pace anytime. Practice exercises and learning resources are included, and you receive personal assistance from Coach Nina whenever you need help or clarification.', 7, true)
ON CONFLICT (id) DO UPDATE SET 
  question = EXCLUDED.question,
  answer = EXCLUDED.answer;

-- 5. Default Media Asset for Coach Nina Laptop Portrait
INSERT INTO media_assets (id, filename, original_name, url, file_type, file_size, in_use_sections) VALUES
('media-coach-nina-laptop', 'coach-nina-laptop.png', 'coach-nina-laptop.png', '/images/coach-nina-laptop.png', 'image/png', 2389564, '["hero", "about_coach"]'::jsonb)
ON CONFLICT (id) DO NOTHING;
