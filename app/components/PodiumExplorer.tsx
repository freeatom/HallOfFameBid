'use client';

import { useMemo, useState } from 'react';
import { Crown, Medal } from 'lucide-react';
import { ListingActions } from './ListingActions';

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

function podiumLabel(rank: number) {
  if (rank === 1) return 'Gold';
  if (rank === 2) return 'Platinum';
  return 'Bronze';
}

export function PodiumExplorer({ listings, categories }: { listings: Listing[]; categories: string[] }) {
  const [view, setView] = useState('Overall');
  const visibleListings = useMemo(() => {
    const filtered = view === 'Overall' ? listings : listings.filter((listing) => listing.category === view);
    return filtered.slice(0, 3);
  }, [listings, view]);

  return (
    <section className="podium-explorer" aria-label="Browse podium rankings">
      <div className="podium-explorer-head">
        <div>
          <p>Viewing</p>
          <h2>{view}</h2>
        </div>
        <label className="view-select">
          <span>Podium view</span>
          <select value={view} onChange={(event) => setView(event.target.value)}>
            <option value="Overall">Overall</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="category-podium-grid">
        {[0, 1, 2].map((index) => {
          const rank = index + 1;
          const listing = visibleListings[index];
          return (
            <article className={`category-podium-card rank-${rank}`} key={listing?.id ?? `${view}-${rank}`}>
              <div className="mini-rank">
                {rank === 1 ? <Crown aria-hidden="true" /> : <Medal aria-hidden="true" />}
                <span>#{rank}</span>
                <strong>{podiumLabel(rank)}</strong>
              </div>
              {listing ? (
                <>
                  <div className="mini-brand">
                    <span className="mini-logo">
                      {logoFor(listing) ? <img src={logoFor(listing) ?? ''} alt="" /> : listing.name.slice(0, 2)}
                    </span>
                    <div>
                      <h3>{listing.name}</h3>
                      <p>{listing.category}</p>
                    </div>
                  </div>
                  <strong className="mini-bid">{money.format(listing.bid_amount)}</strong>
                  <p className="mini-headline">{listing.headline}</p>
                  <div className="mini-stats">
                    <span>{number.format(listing.clicks)} clicks</span>
                    <ListingActions
                      slug={listing.slug}
                      name={listing.name}
                      claimAmount={money.format(listing.bid_amount + 1)}
                      variant="compact"
                    />
                  </div>
                </>
              ) : (
                <div className="mini-empty">
                  <strong>Open seat</strong>
                  <span>Claim this category podium with the next paid bid.</span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
