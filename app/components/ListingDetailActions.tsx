'use client';

import { useState } from 'react';

export function ListingDetailActions({
  slug,
  name,
  claimAmount,
}: {
  slug: string;
  name: string;
  claimAmount: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyDetailsLink() {
    const url = typeof window === 'undefined' ? `/listing/${slug}` : `${window.location.origin}/listing/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="detail-actions">
      <a className="visit-action" href={`/visit/${slug}`} target="_blank" rel="noreferrer">
        Visit {name}
      </a>
      <a className="outbid-action" href={`/#bid`}>
        Outbid for {claimAmount}
      </a>
      <button className="copy-action" type="button" onClick={copyDetailsLink}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}
