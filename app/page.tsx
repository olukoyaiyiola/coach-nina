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
    <main className="min-h-screen flex flex-col selection:bg-brand-gold selection:text-white pb-14 sm:pb-0">
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
