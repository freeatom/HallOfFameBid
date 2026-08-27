'use client';

import Link from 'next/link';
import { CategorySelect } from './CategorySelect';

type Period = 'all' | 'today';

export function HallControls({
  categories,
  category,
  period,
}: {
  categories: string[];
  category: string;
  period: Period;
}) {
  const categoryOptions = ['Overall', ...categories];

  function hrefFor(next: { category?: string; period?: Period }) {
    const params = new URLSearchParams();
    const nextPeriod = next.period ?? period;
    const nextCategory = next.category ?? category;

    if (nextPeriod === 'today') params.set('period', 'today');
    if (nextCategory !== 'Overall') params.set('category', nextCategory);

    const query = params.toString();
    return query ? `/hall?${query}` : '/hall';
  }

  function onCategoryChange(nextCategory: string) {
    window.location.href = hrefFor({ category: nextCategory });
  }

  return (
    <div className="hall-controls" aria-label="Hall filters">
      <div className="period-toggle" aria-label="Hall period">
        <Link className={period === 'all' ? 'period-choice active' : 'period-choice'} href={hrefFor({ period: 'all' })}>
          <span className="period-trophy" aria-hidden="true" />
          All-time
        </Link>
        <Link className={period === 'today' ? 'period-choice active today' : 'period-choice today'} href={hrefFor({ period: 'today' })}>
          <span className="period-dot" aria-hidden="true" />
          Today
        </Link>
      </div>
      <label className="view-select">
        <span>Category</span>
        <CategorySelect
          categories={categoryOptions}
          name="hallCategory"
          value={category}
          onChange={onCategoryChange}
        />
      </label>
    </div>
  );
}
