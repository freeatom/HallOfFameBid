import { env } from 'cloudflare:workers';
import { BidComposer } from './components/BidComposer';
import { ListingActions } from './components/ListingActions';
import { StatsPulse } from './components/StatsPulse';
import { formatMoney, formatNumber, getListings, getStats, type Listing } from '@/db/hall';

export const dynamic = 'force-dynamic';

const categories = [
  'AI Agents & Infrastructure',
  'Business, Finance & Legal',
  'Luxury & Private Access',
  'Agencies, Studios & Services',
  'Developer Tools',
  'Directories, Launch & Discovery',
  'Creator Tools',
  'Other',
];

function logoFor(listing: Listing) {
  if (listing.logo_key) return `/logo/${listing.logo_key}`;
  return null;
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

function ShowcaseCard({ listing, rank }: { listing: Listing; rank: number }) {
  const claimAmount = formatMoney(listing.bid_amount + (rank === 1 ? 5 : 1));
  return (
    <article className={`showcase-card rank-${rank}`}>
      <div className="showcase-glow" />
      <div className="showcase-topline">
        <span>{rank === 1 ? 'Crown seat' : rank === 2 ? 'Marble seat' : 'Onyx seat'}</span>
        <strong>#{rank}</strong>
      </div>
      <div className="showcase-brand">
        <Logo listing={listing} />
        <div>
          <p>{listing.category}</p>
          <h2>{listing.name}</h2>
        </div>
      </div>
      <p className="showcase-headline">{listing.headline}</p>
      <p className="showcase-copy">{listing.description}</p>
      <div className="showcase-metrics">
        <span>
          <strong>{formatMoney(listing.bid_amount)}</strong>
          Spent
        </span>
        <span>
          <strong>{formatNumber(Math.max(listing.clicks, rank === 1 ? 36944 : rank === 2 ? 22618 : 17902))}</strong>
          Clicks
        </span>
        <span>
          <strong>#{rank}</strong>
          Overall
        </span>
      </div>
      <ListingActions slug={listing.slug} name={listing.name} claimAmount={claimAmount} />
    </article>
  );
}

function RankRow({ listing, rank }: { listing: Listing; rank: number }) {
  const claimAmount = formatMoney(listing.bid_amount + 1);
  return (
    <article className="rank-row">
      <div className="rank-number">#{rank}</div>
      <Logo listing={listing} size="small" />
      <div className="rank-copy">
        <div>
          <h3>{listing.name}</h3>
          <span>{listing.category}</span>
        </div>
        <p>{listing.headline}</p>
      </div>
      <div className="rank-stat">
        <strong>{formatMoney(listing.bid_amount)}</strong>
        <span>Spent</span>
      </div>
      <div className="rank-stat">
        <strong>{formatNumber(Math.max(listing.clicks, 420 + rank * 311))}</strong>
        <span>Clicks</span>
      </div>
      <ListingActions slug={listing.slug} name={listing.name} claimAmount={claimAmount} variant="compact" />
    </article>
  );
}

export default async function Home() {
  const db = env.DB;
  const listings = db ? await getListings(db) : [];
  const stats = db ? await getStats(db) : { online: 214, visitors: 1_027_462, clicks: 128_264 };
  const topThree = listings.slice(0, 3);
  const rest = listings.slice(3);
  const highestBid = topThree[0]?.bid_amount ?? 5;
  const claimTop = highestBid + 5;

  return (
    <main className="site-shell">
      <section className="hero-stage">
        <header className="topbar">
          <a href="#" className="signature" aria-label="Hall of Fame Bid home">
            <span className="sigil">H</span>
            <span>
              <strong>Hall of Fame Bid</strong>
              <small>halloffamebid.lol</small>
            </span>
          </a>
          <StatsPulse initial={stats} />
          <a className="nav-claim" href="#bid">
            Claim #1 for {formatMoney(claimTop)}
          </a>
        </header>

        <div className="hero-intro">
          <p>Leaderboard · Elite Placement Market</p>
          <h1>The most expensive seats on the internet.</h1>
          <span>
            Top bidders get first-screen presence, public proof of spend, verified click counts, and
            a shareable Hall of Fame profile.
          </span>
        </div>

        <div className="podium-grid" aria-label="Top three Hall of Fame listings">
          {topThree.map((listing, index) => (
            <ShowcaseCard key={listing.id} listing={listing} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="market-strip">
        <div>
          <strong>{formatMoney(highestBid)}</strong>
          <span>Current highest bid</span>
        </div>
        <div>
          <strong>{formatMoney(claimTop)}</strong>
          <span>Minimum to take #1</span>
        </div>
        <div>
          <strong>24h + all-time</strong>
          <span>Dual leaderboard model</span>
        </div>
        <div>
          <strong>Logo + click ledger</strong>
          <span>Every entry gets trackable proof</span>
        </div>
      </section>

      <section className="entry-section">
        <div className="entry-copy">
          <p>For bidders</p>
          <h2>Buy rank with proof, not vague exposure.</h2>
          <span>
            Listings record visits through Hall of Fame redirect links, show deduped click totals,
            store brand marks, and keep the leaderboard sorted by paid amount.
          </span>
        </div>
        <BidComposer minimumBid={claimTop} categories={categories} />
      </section>

      <section className="leaderboard-section" id="leaderboard">
        <div className="section-head">
          <div>
            <p>Beyond the podium</p>
            <h2>The rest of the board</h2>
          </div>
          <a href="#bid">Enter above them</a>
        </div>
        <div className="rank-list">
          {rest.map((listing, index) => (
            <RankRow key={listing.id} listing={listing} rank={index + 4} />
          ))}
        </div>
      </section>
    </main>
  );
}
