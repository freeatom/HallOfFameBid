'use client';

import { useMemo, useState } from 'react';

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function BidComposer({ minimumBid, categories }: { minimumBid: number; categories: string[] }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState(minimumBid);
  const [status, setStatus] = useState('');

  const formatted = useMemo(() => money.format(amount), [amount]);

  async function submit(formData: FormData) {
    setStatus('Preparing your entry...');
    formData.set('amount', String(amount));

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus(result.error ?? 'Could not create the listing.');
        return;
      }
      setStatus('Entry recorded. Payment checkout will be connected next.');
    } catch {
      setStatus('Network error. Try again.');
    }
  }

  return (
    <form action={submit} className="bid-composer" id="bid">
      <div className="composer-head">
        <span>New patron entry</span>
        <strong>Claim #1 for {formatted}</strong>
      </div>

      <div className="amount-stepper">
        <button type="button" onClick={() => setAmount((value) => Math.max(5, value - 1))} aria-label="Decrease bid">
          -
        </button>
        <span>{formatted}</span>
        <button type="button" onClick={() => setAmount((value) => value + 1)} aria-label="Increase bid">
          +
        </button>
      </div>

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
        <span className="logo-preview">{logoPreview ? <img src={logoPreview} alt="" /> : 'Logo'}</span>
        <span>
          <strong>Upload brand mark</strong>
          <small>Shown beside your Hall of Fame entry</small>
        </span>
      </label>

      <div className="composer-grid">
        <input name="name" placeholder="Brand name" required />
        <input name="url" placeholder="website.com or @handle" required />
        <select name="category" defaultValue={categories[0]}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input name="headline" placeholder="One premium headline" required />
      </div>
      <textarea name="description" placeholder="Short listing description" required />
      <button className="primary-action" type="submit">
        Enter the Hall
      </button>
      {status ? <p className="composer-status">{status}</p> : null}
    </form>
  );
}
