import type { Metadata } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Hall of Fame Bid | Premium Pay-to-Rank Leaderboard',
  description:
    'A premium bidding leaderboard where brands buy rank, prestige, verified clicks, and category ownership.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        {children}
        <Script
          id="datafast"
          defer
          data-website-id="dfid_S6c7KNCWtqvWQCHb4oCKl"
          data-domain="halloffamebid.lol"
          src="https://datafa.st/js/script.js"
        />
      </body>
    </html>
  );
}
