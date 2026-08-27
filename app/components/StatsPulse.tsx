'use client';

import { useEffect, useMemo, useState } from 'react';

type Stats = {
  online: number;
  visitors: number;
  clicks: number;
};

function getVisitorId() {
  const key = 'hof_visitor_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

export function StatsPulse({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState(initial);
  const formatter = useMemo(() => new Intl.NumberFormat('en-US'), []);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      try {
        const response = await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId: getVisitorId() }),
        });
        if (!response.ok) return;
        const next = (await response.json()) as Stats;
        if (!cancelled) setStats(next);
      } catch {
        // Stats are decorative for the visitor; keep the last known server value.
      }
    }

    sync();
    const timer = window.setInterval(sync, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="stats-pill" aria-live="polite">
      <span>
        <strong>{formatter.format(stats.online)}</strong> online
      </span>
      <span>
        <strong>{formatter.format(stats.visitors)}</strong> visitors since launch
      </span>
      <span>
        <strong>{formatter.format(stats.clicks)}</strong> tracked clicks
      </span>
      <a className="stats-link" href="/stats">
        see stats -&gt;
      </a>
    </div>
  );
}
