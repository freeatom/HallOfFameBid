import { env } from 'cloudflare:workers';
import { BidComposer } from './components/BidComposer';
import { StatsPulse } from './components/StatsPulse';
import { Footer } from './components/Footer';
import { PodiumExplorer } from './components/PodiumExplorer';
import { categories } from './categories';
import { formatMoney, formatNumber, getClaimAmount, getListings, getStats, type Listing } from '@/db/hall';

export const dynamic = 'force-dynamic';

const emptySeats = [
  {
    rank: 1,
    title: 'Crown Seat',
    metal: 'GOLD',
    copy: 'The first paid entrant becomes the opening face of the Hall.',
  },
  {
    rank: 2,
    title: 'Platinum Seat',
    metal: 'PLATINUM',
    copy: 'Second position keeps first-screen prestige with distinct ceremony.',
  },
  {
    rank: 3,
    title: 'Bronze Seat',
    metal: 'BRONZE',
    copy: 'Third position completes the founding podium.',
  },
];

function logoFor(listing: Listing) {
  if (listing.logo_key) return `/logo/${listing.logo_key}`;
  return listing.logo_url;
}

function Logo({ listing, size = 'large' }: { listing: Listing; size?: 'large' | 'small' }) {
  const logo = logoFor(listing);
  const initials = listing.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return (
    <div className={size === 'large' ? 'brand-mark brand-mark-large' : 'brand-mark brand-mark-small'}>
      {logo ? <img src={logo} alt={`${listing.name} logo`} /> : <span>{initials}</span>}
    </div>
  );
}

function getCategoryRank(listing: Listing, listings: Listing[]) {
  return listings.filter((entry) => entry.category === listing.category && entry.bid_amount >= listing.bid_amount).length;
}

function ShowcaseCard({ listing, rank, categoryRank }: { listing: Listing; rank: number; categoryRank: number }) {
  return (
    <article className={`showcase-card rank-${rank}`}>
      <a className="card-click-layer" href={`/visit/${listing.slug}`} target="_blank" rel="noreferrer" aria-label={`Visit ${listing.name}`} />
      <div className="podium-rank-badge">#{rank}</div>
      <div className="showcase-topline">
        <span>{rank === 1 ? 'GOLD' : rank === 2 ? 'PLATINUM' : 'BRONZE'}</span>
      </div>
      <div className="bid-corner">{formatMoney(listing.bid_amount)}</div>
      <div className="showcase-brand">
        <Logo listing={listing} />
        <div>
          <h2>{listing.name}</h2>
        </div>
      </div>
      <p className="showcase-headline">{listing.headline}</p>
      <p className="showcase-copy">{listing.description}</p>
      <div className="showcase-meta">
        <span>
          #{categoryRank} in {listing.category}
        </span>
        <strong>{formatNumber(listing.clicks)} clicks</strong>
        <a className="details-link" href={`/listing/${listing.slug}`} target="_blank" rel="noreferrer">
          see details
        </a>
      </div>
    </article>
  );
}

function OpenSeat({ rank, title, metal, copy, claimAmount }: (typeof emptySeats)[number] & { claimAmount: string }) {
  return (
    <article className={`showcase-card rank-${rank} empty-seat`}>
      <div className="podium-rank-badge">#{rank}</div>
      <div className="showcase-topline">
        <span>{metal}</span>
      </div>
      <div className="bid-corner">{claimAmount}</div>
      <div className="empty-medallion">{rank}</div>
      <h2>{title}</h2>
      <p>{copy}</p>
      <a className="outbid-action empty-claim" href="#bid">
        Claim for {claimAmount}
      </a>
    </article>
  );
}

export default async function Home() {
  const db = env.DB;
  const listings = db ? await getListings(db) : [];
  const stats = db ? await getStats(db) : { online: 0, visitors: 0, clicks: 0 };
  const topThree = listings.slice(0, 3);
  const claimTop = getClaimAmount(listings);
  const topSeats = emptySeats.map((seat, index) => ({ seat, listing: topThree[index] }));

  return (
    <main className="site-shell">
      <section className="hero-stage">
        <header className="topbar">
          <a href="#" className="signature" aria-label="Hall of Fame Bid home">
            <span className="sigil">H</span>
            <span>
              <strong>Hall of Fame Bid</strong>
            </span>
          </a>
          <StatsPulse initial={stats} />
          <a className="nav-claim" href="#bid">
            Claim #1
          </a>
        </header>

        <div className="claim-stage">
          <p>Welcome to the Hall of Fame</p>
          <BidComposer minimumBid={claimTop} categories={categories} listings={listings} mode="compact" />
        </div>

        <div className="podium-grid" aria-label="Top three Hall of Fame listings">
          {topSeats.map(({ seat, listing }) =>
            listing ? (
              <ShowcaseCard
                key={listing.id}
                listing={listing}
                rank={seat.rank}
                categoryRank={getCategoryRank(listing, listings)}
              />
            ) : (
              <OpenSeat key={seat.rank} {...seat} claimAmount={formatMoney(seat.rank === 1 ? claimTop : 1)} />
            ),
          )}
        </div>

        <PodiumExplorer listings={listings} categories={categories} />
      </section>

      <Footer />
    </main>
  );
}
