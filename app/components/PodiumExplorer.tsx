'use client';

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
  clicks: number;
};

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

function compactHost(value: string) {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export function PodiumExplorer({ listings, categories }: { listings: Listing[]; categories: string[] }) {
  const [view, setView] = useState('Overall');
  const viewOptions = useMemo(() => ['Overall', ...categories], [categories]);
  const visibleListings = useMemo(() => {
    const filtered = view === 'Overall' ? listings : listings.filter((listing) => listing.category === view);
    return filtered;
  }, [listings, view]);

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
          const rank = index + 1;
          const overallRank = listings.findIndex((entry) => entry.id === listing.id) + 1;
          const displayedRank = view === 'Overall' ? overallRank : rank;
          return (
            <a
              className={`category-podium-card rank-${displayedRank}`}
              href={`/visit/${listing.slug}`}
              key={listing.id}
              target="_blank"
              rel="noreferrer"
            >
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
                  <span>#{rank} in {listing.category}</span>
                  {view === 'Overall' ? null : <span>#{overallRank} overall</span>}
                  <span>{compactHost(listing.url)}</span>
                  <strong>{number.format(listing.clicks)} clicks</strong>
                  <span>see details</span>
                </div>
              </div>
              <div className="mini-bid">
                <strong>{money.format(listing.bid_amount)}</strong>
              </div>
            </a>
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
