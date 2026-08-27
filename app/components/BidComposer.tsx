'use client';

import { useMemo, useState } from 'react';
import { Globe2 } from 'lucide-react';
import { CategorySelect } from './CategorySelect';

type RankSnapshot = {
  name: string;
  bid_amount: number;
};

type ResolveResult = {
  name?: string;
  headline?: string;
  description?: string;
  logoUrl?: string | null;
  url?: string;
};

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function rankFor(amount: number, listings: RankSnapshot[]) {
  return listings.filter((listing) => listing.bid_amount >= amount).length + 1;
}

function nextOvertake(amount: number, listings: RankSnapshot[]) {
  const target = [...listings]
    .filter((listing) => listing.bid_amount >= amount)
    .sort((a, b) => a.bid_amount - b.bid_amount)[0];

  return target ? { amount: target.bid_amount + 1, name: target.name } : null;
}

export function BidComposer({
  minimumBid,
  categories,
  listings,
  mode = 'checkout',
  initialUrl = '',
  initialCategory,
}: {
  minimumBid: number;
  categories: string[];
  listings: RankSnapshot[];
  mode?: 'compact' | 'checkout';
  initialUrl?: string;
  initialCategory?: string;
}) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [detectedLogo, setDetectedLogo] = useState<string | null>(null);
  const [amount, setAmount] = useState(minimumBid);
  const [status, setStatus] = useState('');
  const [resolving, setResolving] = useState(false);
  const [fields, setFields] = useState({
    name: '',
    url: initialUrl,
    headline: '',
    description: '',
  });

  const projectedRank = useMemo(() => rankFor(amount, listings), [amount, listings]);
  const overtake = useMemo(() => nextOvertake(amount, listings), [amount, listings]);
  const rankLine = `New spots start at $1. Paying less than the #1 price still puts you on the board at whatever place that bid can take.`;

  function updateAmount(value: number) {
    if (!Number.isFinite(value)) return;
    setAmount(Math.max(1, Math.floor(value)));
  }

  function updateAmountInput(value: string) {
    const numeric = Number(value.replace(/[^0-9]/g, ''));
    updateAmount(numeric || 1);
  }

  function updateField(key: keyof typeof fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function resolveBrand() {
    if (!fields.url.trim()) return;
    setResolving(true);
    setStatus('');
    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: fields.url }),
      });
      const result = (await response.json()) as ResolveResult & { error?: string };
      if (!response.ok) {
        setStatus(result.error ?? 'Could not fetch brand details.');
        return;
      }
      setFields((current) => ({
        name: current.name || result.name || '',
        url: result.url || current.url,
        headline: current.headline || result.headline || '',
        description: current.description || result.description || '',
      }));
      if (result.logoUrl && !logoPreview) setDetectedLogo(result.logoUrl);
    } catch {
      setStatus('Could not fetch brand details. You can still continue manually.');
    } finally {
      setResolving(false);
    }
  }

  async function submit(formData: FormData) {
    if (mode === 'compact') {
      const params = new URLSearchParams({
        amount: String(amount),
        category: String(formData.get('category') ?? categories[0]),
        url: String(formData.get('url') ?? ''),
      });
      window.location.href = `/claim?${params.toString()}`;
      return;
    }

    setStatus('Preparing Dodo checkout...');
    formData.set('amount', String(amount));
    formData.set('logoUrl', detectedLogo ?? '');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !result.checkoutUrl) {
        setStatus(result.error ?? 'Could not create checkout.');
        return;
      }
      window.location.href = result.checkoutUrl;
    } catch {
      setStatus('Network error. Try again.');
    }
  }

  return (
    <form action={submit} className={mode === 'compact' ? 'bid-composer compact-composer' : 'bid-composer'} id="bid">
      <div className="claim-head">
        {mode === 'checkout' ? <span className="claim-label">Finalise Your Hall Seat</span> : null}
        <div className="claim-title">
          <span>Claim #{projectedRank} for</span>
          <button type="button" onClick={() => setAmount((value) => Math.max(1, value - 1))} aria-label="Decrease bid">
            -
          </button>
          <label className="amount-field">
            <span>$</span>
            <input
              aria-label="Bid amount in dollars"
              inputMode="numeric"
              min="1"
              name="amountDisplay"
              onChange={(event) => updateAmountInput(event.target.value)}
              pattern="[0-9]*"
              size={Math.max(1, String(amount).length)}
              style={{ width: `${Math.max(1, String(amount).length)}ch` }}
              type="text"
              value={String(amount)}
            />
          </label>
          <button type="button" onClick={() => updateAmount(amount + 1)} aria-label="Increase bid">
            +
          </button>
        </div>
        <p>{rankLine}</p>
      </div>

      <div className="instant-row">
        <label className="url-field">
          <Globe2 aria-hidden="true" />
          <input
            name="url"
            placeholder="Your website URL or @handle"
            value={fields.url}
            onBlur={resolveBrand}
            onChange={(event) => updateField('url', event.target.value)}
            required
          />
        </label>
        <CategorySelect categories={categories} initialCategory={initialCategory} />
        <button className="primary-action" type="submit">
          Claim
        </button>
      </div>

      {mode === 'checkout' ? (
        <div className="rank-calculator">
          <div>
            <span>Seat preview</span>
            <strong>#{projectedRank}</strong>
          </div>
          <div>
            <span>Rank rule</span>
            <strong>Higher paid bid wins</strong>
          </div>
          <div>
            <span>Next move</span>
            <strong>{overtake ? `${money.format(overtake.amount)} beats ${overtake.name}` : 'You own the crown'}</strong>
          </div>
        </div>
      ) : null}

      {mode === 'checkout' ? (
      <details className="advanced-entry" open>
        <summary>Listing details and logo</summary>
        <div className="composer-grid">
          <input
            name="name"
            placeholder="Brand name"
            value={fields.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
          <input
            name="headline"
            placeholder="One premium headline"
            value={fields.headline}
            onChange={(event) => updateField('headline', event.target.value)}
          />
        </div>

        <textarea
          name="description"
          placeholder="Short listing description"
          value={fields.description}
          onChange={(event) => updateField('description', event.target.value)}
        />

        <label className="logo-uploader">
          <input
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setLogoPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          <span className="logo-preview">
            {logoPreview || detectedLogo ? <img src={logoPreview ?? detectedLogo ?? ''} alt="" /> : 'Logo'}
          </span>
          <span>
            <strong>{resolving ? 'Detecting brand mark...' : 'Logo upload or auto-fetch'}</strong>
          <small>Logo/profile image is fetched automatically; upload only if you want to override it.</small>
          </span>
          <button type="button" onClick={resolveBrand}>
            Fetch
          </button>
        </label>
      </details>
      ) : null}

      {status ? <p className="composer-status">{status}</p> : null}
    </form>
  );
}
