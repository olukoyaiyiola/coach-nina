import { getSettings, getAllContent, getFaqs, getShowcaseItems } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhoItsFor from '@/components/WhoItsFor';
import ShowcaseGallery from '@/components/ShowcaseGallery';
import Curriculum from '@/components/Curriculum';
import PricingOffer from '@/components/PricingOffer';
import CoachBio from '@/components/CoachBio';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';
import StickyMobileCta from '@/components/StickyMobileCta';

export const revalidate = 0; // Always serve fresh database content on reload

export default async function HomePage() {
  const [settings, content, faqs, showcaseItems] = await Promise.all([
    getSettings(),
    getAllContent(),
    getFaqs(),
    getShowcaseItems(),
  ]);

  return (
    <main
      className="min-h-screen flex flex-col selection:bg-brand-gold selection:text-white pb-14 sm:pb-0 transition-colors duration-300"
      data-theme={settings.site_theme || 'editorial'}
      style={{
        backgroundColor:
          settings.site_theme === 'pink' ? '#FFF5F7' :
          settings.site_theme === 'purple' ? '#FAF8FF' :
          settings.site_theme === 'emerald' ? '#F6FEF9' :
          settings.site_theme === 'ocean' ? '#F0F9FF' : '#FFF8F1'
      }}
    >
      <Navbar settings={settings} />
      <Hero settings={settings} content={content.hero} />
      <WhoItsFor />
      <ShowcaseGallery items={showcaseItems} settings={settings} />
      <Curriculum whatsIncluded={content.whats_included} />
      <PricingOffer settings={settings} />
      <CoachBio content={content.about_coach} settings={settings} />
      <FaqSection faqs={faqs} />
      <Footer settings={settings} />
      <StickyMobileCta settings={settings} />
    </main>
  );
}
