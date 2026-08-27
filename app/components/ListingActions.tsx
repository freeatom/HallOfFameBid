'use client';

import { useState } from 'react';

export function ListingActions({
  slug,
  name,
  claimAmount,
  variant = 'full',
}: {
  slug: string;
  name: string;
  claimAmount: string;
  variant?: 'full' | 'compact';
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window === 'undefined' ? `/visit/${slug}` : `${window.location.origin}/visit/${slug}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={variant === 'compact' ? 'row-actions' : 'showcase-actions'}>
      <a className="visit-action" href={`/visit/${slug}`} target="_blank" rel="noreferrer">
        Visit {variant === 'compact' ? name : name}
      </a>
      <a className="outbid-action" href="#bid">
        Outbid for {claimAmount}
      </a>
      <button className="copy-action" type="button" onClick={copyLink}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
