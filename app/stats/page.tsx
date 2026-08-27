import { env } from 'cloudflare:workers';
import Link from 'next/link';
import { Footer } from '../components/Footer';
import { StatsPulse } from '../components/StatsPulse';
import { formatMoney, formatNumber, getClaimAmount, getListings, getStats } from '@/db/hall';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const db = env.DB;
  const listings = db ? await getListings(db) : [];
  const stats = db ? await getStats(db) : { online: 0, visitors: 0, clicks: 0 };
  const paidVolume = listings.reduce((sum, listing) => sum + listing.bid_amount, 0);
  const claimTop = getClaimAmount(listings);

  return (
    <main className="site-shell stats-page">
      <header className="topbar claim-topbar">
        <Link href="/" className="signature" aria-label="Hall of Fame Bid home">
          <span className="sigil">H</span>
          <span>
            <strong>Hall of Fame Bid</strong>
            <small>Stats room</small>
          </span>
        </Link>
        <StatsPulse initial={stats} />
        <Link className="nav-claim" href="/#bid">
          Claim #1 for {formatMoney(claimTop)}
        </Link>
      </header>

      <section className="stats-room">
        <div className="claim-config-copy">
          <p>Live board intelligence</p>
          <h1>Stats behind the seats.</h1>
          <span>Clicks are recorded through Hall of Fame redirect links and deduped per visitor for a short window.</span>
        </div>

        <div className="stats-grid">
          <div>
            <span>Online now</span>
            <strong>{formatNumber(stats.online)}</strong>
          </div>
          <div>
            <span>Visitors since launch</span>
            <strong>{formatNumber(stats.visitors)}</strong>
          </div>
          <div>
            <span>Tracked clicks</span>
            <strong>{formatNumber(stats.clicks)}</strong>
          </div>
          <div>
            <span>Paid seats</span>
            <strong>{formatNumber(listings.length)}</strong>
          </div>
          <div>
            <span>Total bid volume</span>
            <strong>{formatMoney(paidVolume)}</strong>
          </div>
          <div>
            <span>Current top bid</span>
            <strong>{formatMoney(listings[0]?.bid_amount ?? 0)}</strong>
          </div>
        </div>

        <div className="stats-table">
          <div className="stats-table-head">
            <span>Rank</span>
            <span>Listing</span>
            <span>Paid</span>
            <span>Tracked clicks</span>
          </div>
          {listings.length ? (
            listings.map((listing, index) => (
              <div className="stats-table-row" key={listing.id}>
                <strong>#{index + 1}</strong>
                <span>{listing.name}</span>
                <span>{formatMoney(listing.bid_amount)}</span>
                <span>{formatNumber(listing.clicks)}</span>
              </div>
            ))
          ) : (
            <div className="stats-empty">No paid listings yet.</div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
