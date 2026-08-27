import { env } from 'cloudflare:workers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '@/app/components/Footer';
import { ListingDetailActions } from '@/app/components/ListingDetailActions';
import { formatMoney, formatNumber, getListings, type Listing } from '@/db/hall';

export const dynamic = 'force-dynamic';

function logoFor(listing: Listing) {
  if (listing.logo_key) return `/logo/${listing.logo_key}`;
  return listing.logo_url;
}

function Logo({ listing }: { listing: Listing }) {
  const logo = logoFor(listing);
  const initials = listing.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return (
    <div className="detail-logo">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={`${listing.name} logo`} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

function getCategoryRank(listing: Listing, listings: Listing[]) {
  return listings.filter((entry) => entry.category === listing.category && entry.bid_amount >= listing.bid_amount).length;
}

function getHost(value: string) {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = env.DB;

  if (!db) notFound();

  const listings = await getListings(db);
  const listing = listings.find((entry) => entry.slug === slug);

  if (!listing) notFound();

  const overallRank = listings.findIndex((entry) => entry.id === listing.id) + 1;
  const categoryRank = getCategoryRank(listing, listings);
  const claimAmount = formatMoney(Math.max(1, listing.bid_amount + 1));

  return (
    <main className="detail-shell">
      <section className="detail-panel">
        <header className="detail-topbar">
          <Link href="/" className="signature" aria-label="Hall of Fame Bid home">
            <span className="sigil">H</span>
            <span>
              <strong>Hall of Fame Bid</strong>
            </span>
          </Link>
          <Link className="nav-claim" href="/#bid">
            Claim #1
          </Link>
        </header>

        <div className="detail-hero">
          <p>Leaderboard · {listing.category}</p>
          <div className="detail-title-row">
            <Logo listing={listing} />
            <div>
              <h1>{listing.name} · {listing.headline}</h1>
              <p>{listing.description}</p>
              <div className="detail-meta">
                <span>#{categoryRank} in {listing.category}</span>
                <span>{formatNumber(listing.clicks)} clicks</span>
                <span>{getHost(listing.url)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-stat-grid">
          <article>
            <span>Spent</span>
            <strong>{formatMoney(listing.bid_amount)}</strong>
            <p>Paid to hold this rank</p>
          </article>
          <article>
            <span>Category Rank</span>
            <strong>#{categoryRank}</strong>
            <p>of {listings.filter((entry) => entry.category === listing.category).length} in {listing.category}</p>
            <Link href={`/?category=${encodeURIComponent(listing.category)}`}>See category ranking</Link>
          </article>
          <article>
            <span>Overall</span>
            <strong>#{overallRank}</strong>
            <p>of {formatNumber(listings.length)} on the board</p>
            <Link href="/">See overall ranking</Link>
          </article>
        </div>

        <ListingDetailActions slug={listing.slug} name={listing.name} claimAmount={claimAmount} />
      </section>

      <Footer />
    </main>
  );
}
