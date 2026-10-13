export default function WhoItsFor() {
  const audiences = [
    {
      emoji: '🌱',
      title: 'Beginners',
      desc: 'Zero experience needed. Learn click-by-click from step zero to your first finished video.',
    },
    {
      emoji: '💼',
      title: 'Business Owners',
      desc: 'Cut expensive agency fees. Produce viral product ads that explain and sell your offerings 24/7.',
    },
    {
      emoji: '🎥',
      title: 'Content Creators',
      desc: 'Scale your views across TikTok, Reels, and YouTube Shorts without showing your face on camera.',
    },
    {
      emoji: '💻',
      title: 'Freelancers',
      desc: 'Add a high-demand service that businesses and brands pay ₦100,000 to ₦300,000+ per campaign for.',
    },
    {
      emoji: '🎓',
      title: 'Students & Creatives',
      desc: 'Master an internationally valuable, creative digital tech skill from your smartphone or laptop.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-y border-brand-border/60 bg-brand-surface/60">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-2">
          Designed Specifically For You
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal tracking-tight font-serif">
          Who Is This Mentorship Built For?
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {audiences.map((item, index) => (
          <div
            key={index}
            className={`${
              index === 4 ? 'col-span-2 md:col-span-1' : ''
            } bg-brand-card p-5 sm:p-6 rounded-2xl border border-brand-border text-center hover:border-brand-gold/60 transition-all hover:-translate-y-1 shadow-sm`}
          >
            <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand-border mx-auto flex items-center justify-center text-xl sm:text-2xl mb-3 shadow-inner">
              {item.emoji}
            </div>
            <h3 className="font-bold text-brand-charcoal text-sm sm:text-base mb-1 font-serif">
              {item.title}
            </h3>
            <p className="text-stone-500 text-xs leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
