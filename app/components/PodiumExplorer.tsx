'use client';

import { useMemo, useState } from 'react';
import { ListingActions } from './ListingActions';
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
          return (
            <article className={`category-podium-card rank-${rank}`} key={listing?.id ?? `${view}-${rank}`}>
              <div className="mini-rank">
                <span>#{rank}</span>
              </div>
              <div className="mini-brand">
                <span className="mini-logo">
                  {logoFor(listing) ? <img src={logoFor(listing) ?? ''} alt="" /> : listing.name.slice(0, 2)}
                </span>
                <div>
                  <h3>{listing.name}</h3>
                  <p>{listing.category}</p>
                </div>
              </div>
              <p className="mini-headline">{listing.headline}</p>
              <div className="mini-bid">
                <strong>{money.format(listing.bid_amount)}</strong>
                <span>paid rank</span>
              </div>
              <div className="mini-stats">
                <span>{number.format(listing.clicks)} clicks</span>
                <ListingActions
                  slug={listing.slug}
                  name={listing.name}
                  claimAmount={money.format(listing.bid_amount + 1)}
                  variant="compact"
                />
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
