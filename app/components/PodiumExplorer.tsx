'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import { CategorySelect } from './CategorySelect';

type Listing = {
  id: string;
  slug: string;
  name: string;
  url: string;
  category: string;
  headline: string;
  description: string;
  bid_amount: number;
  logo_key: string | null;
  logo_url: string | null;
  created_at: number;
  clicks: number;
};

type Period = 'all' | 'today';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat('en-US');

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

export function PodiumExplorer({
  listings,
  allListings,
  categories,
  period,
  initialView,
}: {
  listings: Listing[];
  allListings: Listing[];
  categories: string[];
  period: Period;
  initialView?: string;
}) {
  const viewOptions = useMemo(() => ['Overall', ...categories], [categories]);
  const [view, setView] = useState(initialView && viewOptions.includes(initialView) ? initialView : 'Overall');
  const visibleListings = useMemo(() => {
    const filtered = view === 'Overall' ? listings : listings.filter((listing) => listing.category === view);
    return filtered;
  }, [listings, view]);
  const periodLabel = period === 'today' ? 'today' : 'all-time';

  return (
    <section className="podium-explorer" aria-label="Browse podium rankings">
      <div className="podium-explorer-head">
        <div>
          <p>Viewing</p>
          <h2>{view}</h2>
        </div>
        <label className="view-select">
          <span>Category</span>
          <CategorySelect categories={viewOptions} name="podiumCategory" value={view} onChange={setView} />
        </label>
      </div>

      <div className="category-podium-grid">
        {visibleListings.length ? visibleListings.map((listing, index) => {
          const categoryRank = getCategoryRank(listing, listings);
          const periodOverallRank = listings.findIndex((entry) => entry.id === listing.id) + 1;
          const allTimeOverallRank = allListings.findIndex((entry) => entry.id === listing.id) + 1;
          const displayedRank = view === 'Overall' ? periodOverallRank : index + 1;
          return (
            <article
              className={`category-podium-card rank-${displayedRank}`}
              key={listing.id}
              style={{ '--row-index': index } as CSSProperties}
            >
              <a className="card-click-layer" href={`/visit/${listing.slug}`} target="_blank" rel="noreferrer" aria-label={`Visit ${listing.name}`} />
              <div className="mini-rank">
                <span>#{displayedRank}</span>
              </div>
              <div className="mini-brand">
                <span className="mini-logo">
                  {logoFor(listing) ? <img src={logoFor(listing) ?? ''} alt="" /> : listing.name.slice(0, 2)}
                </span>
              </div>
              <div className="mini-copy">
                <h3>{listing.name} · {listing.headline}</h3>
                <p>{listing.description}</p>
                <div className="mini-meta">
                  <span>#{categoryRank} in {listing.category}</span>
                  {view === 'Overall' ? null : <span>#{periodOverallRank} overall {periodLabel}</span>}
                  {period === 'today' && allTimeOverallRank > 0 ? <span>#{allTimeOverallRank} all-time</span> : null}
                  <strong>{number.format(listing.clicks)} clicks</strong>
                  <span>{formatRelativeAge(listing.created_at)}</span>
                  <a className="details-link" href={`/listing/${listing.slug}`} target="_blank" rel="noreferrer">
                    see details
                  </a>
                </div>
              </div>
              <div className="mini-bid">
                <strong>{money.format(listing.bid_amount)}</strong>
              </div>
            </article>
          );
        }) : (
          <article className="category-podium-card empty-category">
            <div className="mini-rank">
              <span>#1</span>
            </div>
            <div className="mini-empty">
              <strong>No seats in this category yet.</strong>
              <span>The first paid entrant here becomes the category leader.</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
