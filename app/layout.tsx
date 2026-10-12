import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display, Cinzel } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Video Creation Starter Class | Coach Nina',
  description: 'Learn practical AI video creation from scratch with Coach Nina. Beginner-friendly, hands-on training for creators, business owners, freelancers and students.',
  keywords: ['AI Video Creation', 'Coach Nina', 'TikTok AI Video', 'AI Video Starter Class', 'Generative Video', 'Nigeria AI Creator'],
  authors: [{ name: 'Coach Nina' }],
  openGraph: {
    title: 'AI Video Creation Starter Class | Coach Nina',
    description: 'Learn practical AI video creation from scratch with Coach Nina. Beginner-friendly, hands-on training.',
    url: 'https://coachnina.com',
    siteName: 'Coach Nina AI Video Academy',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakarta.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="bg-[#FFF8F1] text-[#2A1711] editorial-grid antialiased">
        {children}
      </body>
    </html>
  );
}
