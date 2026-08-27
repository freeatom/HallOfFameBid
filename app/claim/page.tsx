import { env } from 'cloudflare:workers';
import Link from 'next/link';
import { BidComposer } from '../components/BidComposer';
import { Footer } from '../components/Footer';
import { StatsPulse } from '../components/StatsPulse';
import { categories } from '../categories';
import { getClaimAmount, getListings, getStats } from '@/db/hall';

export const dynamic = 'force-dynamic';

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; category?: string; url?: string }>;
}) {
  const params = await searchParams;
  const db = env.DB;
  const listings = db ? await getListings(db) : [];
  const stats = db ? await getStats(db) : { online: 0, visitors: 0, clicks: 0 };
  const claimTop = Math.max(Number(params.amount ?? 0) || getClaimAmount(listings), 1);

  return (
    <main className="site-shell claim-page">
      <header className="topbar claim-topbar">
        <Link href="/" className="signature" aria-label="Hall of Fame Bid home">
          <span className="sigil">H</span>
          <span>
            <strong>Hall of Fame Bid</strong>
            <small>Complete your claim</small>
          </span>
        </Link>
        <StatsPulse initial={stats} />
        <Link className="nav-claim" href="/">
          Back to Hall
        </Link>
      </header>

      <section className="claim-config">
        <div className="claim-config-copy">
          <p>Verified seat configuration</p>
          <h1>Shape the card before payment.</h1>
          <span>
            Add the brand mark, headline, and description that will replace the open seat after Dodo confirms payment.
          </span>
        </div>
        <BidComposer
          minimumBid={claimTop}
          categories={categories}
          listings={listings}
          initialUrl={params.url ?? ''}
          initialCategory={params.category}
        />
      </section>
      <Footer />
    </main>
  );
}
