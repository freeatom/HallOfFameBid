import { env } from 'cloudflare:workers';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { categories } from '../categories';
import { Footer } from '../components/Footer';
import { HallControls } from '../components/HallControls';
import { formatMoney, formatNumber, getListings, getStats, type Listing } from '@/db/hall';

export const dynamic = 'force-dynamic';

type Period = 'all' | 'today';

function getTodayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function logoFor(listing: Listing) {
  if (listing.logo_key) return `/logo/${listing.logo_key}`;
  return listing.logo_url;
}

function getCategoryRank(listing: Listing, listings: Listing[]) {
  return listings.filter((entry) => entry.category === listing.category && entry.bid_amount >= listing.bid_amount).length;
}

function formatRelativeAge(timestamp: number) {
  const elapsed = Math.max(0, Date.now() - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (elapsed < hour) return `${Math.max(1, Math.floor(elapsed / minute))} min ago`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)} hrs ago`;
  return `${Math.floor(elapsed / day)} days ago`;
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

function HallFrame({
  listing,
  displayedRank,
  categoryRank,
  overallRank,
  index,
  period,
  category,
}: {
  listing: Listing;
  displayedRank: number;
  categoryRank: number;
  overallRank: number;
  index: number;
  period: Period;
  category: string;
}) {
  const logo = logoFor(listing);
  const categoryLine =
    category === 'Overall'
      ? `#${categoryRank} in ${listing.category}`
      : `#${displayedRank} in ${listing.category}`;

  return (
    <article className={`hall-wall-frame rank-${displayedRank}`} style={{ '--frame-index': index } as CSSProperties}>
      <span className="frame-wire" aria-hidden="true" />
      <a className="hall-frame-click" href={`/visit/${listing.slug}`} target="_blank" rel="noreferrer" aria-label={`Visit ${listing.name}`} />
      <div className="frame-crown">
        <span>#{displayedRank}</span>
      </div>
      <div className="frame-portrait">
        {logo ? <img src={logo} alt={`${listing.name} logo`} /> : <span>{initialsFor(listing.name)}</span>}
      </div>
      <div className="frame-engraving">
        <p>{categoryLine}</p>
        <h2>{listing.name}</h2>
        <strong>{listing.headline}</strong>
        <blockquote>{listing.description}</blockquote>
      </div>
      <div className="frame-ledger">
        <span>{formatMoney(listing.bid_amount)}</span>
        <small>{formatNumber(listing.clicks)} clicks</small>
        <small>{formatRelativeAge(listing.created_at)}</small>
        {category === 'Overall' ? null : <small>#{overallRank} overall {period === 'today' ? 'today' : 'all-time'}</small>}
        <Link className="details-link" href={`/listing/${listing.slug}`} target="_blank" rel="noreferrer">
          see details <ExternalLink aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default async function HallPage({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string; category?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const period: Period = params.period === 'today' ? 'today' : 'all';
  const category = params.category && categories.includes(params.category) ? params.category : 'Overall';
  const db = env.DB;
  const allListings = db ? await getListings(db) : [];
  const periodListings = db && period === 'today' ? await getListings(db, { createdSince: getTodayStart() }) : allListings;
  const visibleListings =
    category === 'Overall' ? periodListings : periodListings.filter((listing) => listing.category === category);
  const stats = db ? await getStats(db) : { online: 0, visitors: 0, clicks: 0 };

  return (
    <main className="site-shell hall-page">
      <section className="grand-hall">
        <header className="hall-topbar">
          <Link className="hall-back" href="/">
            <ArrowLeft aria-hidden="true" />
            Board
          </Link>
          <div className="hall-brand">
            <span className="sigil">H</span>
            <span>Hall of Fame</span>
          </div>
          <Link className="nav-claim" href="/#bid">
            Claim #1
          </Link>
        </header>

        <div className="hall-title-block">
          <p>The Gallery Wall</p>
          <h1>{category === 'Overall' ? 'All-Time Hall of Fame' : `${category} Hall`}</h1>
          <span>
            {formatNumber(stats.clicks)} tracked clicks, {formatNumber(stats.visitors)} visitors, ranked by paid position.
          </span>
        </div>

        <HallControls categories={categories} category={category} period={period} />

        <div className="hall-wall" aria-label={`${category} Hall of Fame wall`}>
          <div className="gallery-rail" aria-hidden="true" />
          {visibleListings.length ? (
            visibleListings.map((listing, index) => {
              const overallRank = periodListings.findIndex((entry) => entry.id === listing.id) + 1;
              const displayedRank = category === 'Overall' ? overallRank : index + 1;
              return (
                <HallFrame
                  key={listing.id}
                  listing={listing}
                  displayedRank={displayedRank}
                  categoryRank={getCategoryRank(listing, periodListings)}
                  overallRank={overallRank}
                  index={index}
                  period={period}
                  category={category}
                />
              );
            })
          ) : (
            <article className="hall-wall-empty">
              <span>Unclaimed Wall</span>
              <h2>No frames in this hall yet.</h2>
              <p>The first paid entrant becomes the opening inscription for this view.</p>
              <Link className="visit-action" href="/#bid">
                Claim the first frame
              </Link>
            </article>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
