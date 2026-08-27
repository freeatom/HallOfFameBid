import { schemaStatements, seedListings } from './schema';

export type Listing = {
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
  updated_at: number;
  clicks: number;
};

export type RuntimeEnv = {
  DB?: D1Database;
  LOGOS?: R2Bucket;
};

let initialized = false;

export async function ensureDatabase(db: D1Database) {
  if (initialized) return;

  for (const statement of schemaStatements) {
    await db.prepare(statement).run();
  }

  const now = Date.now();
  const seedInserts: D1PreparedStatement[] = [];

  for (const [index, listing] of seedListings.entries()) {
    const existing = await db.prepare('SELECT id FROM listings WHERE id = ?').bind(listing.id).first<{ id: string }>();
    if (!existing) {
      seedInserts.push(
        db.prepare(
          `INSERT INTO listings (
              id, slug, name, url, category, headline, description, bid_amount,
              logo_key, logo_url, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
          .bind(
            listing.id,
            listing.slug,
            listing.name,
            listing.url,
            listing.category,
            listing.headline,
            listing.description,
            listing.bid_amount,
            null,
            listing.logo_url,
            now - index * 86_400_000,
            now - index * 86_400_000,
          ),
      );
    }
  }

  if (seedInserts.length) {
    await db.batch(seedInserts);
  }

  const seededClick = await db
    .prepare("SELECT id FROM clicks WHERE id LIKE 'aurelian-labs-seed-%' LIMIT 1")
    .first<{ id: string }>();

  if (!seededClick) {
    const clickRows = seedListings.flatMap((listing, listingIndex) => {
      const totals = [36944, 22618, 17902, 12440, 9875, 6301];
      const total = totals[listingIndex] ?? 1000;
      const samples = Math.min(total, 48);
      return Array.from({ length: samples }, (_, index) =>
        db
          .prepare('INSERT INTO clicks (id, listing_id, visitor_id, clicked_at) VALUES (?, ?, ?, ?)')
          .bind(
            `${listing.id}-seed-${index}`,
            listing.id,
            `seed-visitor-${listingIndex}-${index}`,
            now - index * 3_600_000,
          ),
      );
    });
    await db.batch(clickRows);
  }

  initialized = true;
}

export async function getListings(db: D1Database) {
  await ensureDatabase(db);
  const result = await db
    .prepare(
      `SELECT
        listings.*,
        COUNT(clicks.id) AS clicks
      FROM listings
      LEFT JOIN clicks ON clicks.listing_id = listings.id
      WHERE listings.url LIKE 'https://%.%' OR listings.url LIKE 'https://x.com/%'
      GROUP BY listings.id
      ORDER BY listings.bid_amount DESC, listings.created_at ASC`,
    )
    .all<Listing>();

  return result.results ?? [];
}

export async function getStats(db: D1Database) {
  await ensureDatabase(db);
  const now = Date.now();
  const onlineCutoff = now - 5 * 60 * 1000;
  const [visitorCount, onlineCount, clickCount] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS total FROM visitors').first<{ total: number }>(),
    db.prepare('SELECT COUNT(*) AS total FROM visitors WHERE seen_at > ?').bind(onlineCutoff).first<{ total: number }>(),
    db.prepare('SELECT COUNT(*) AS total FROM clicks').first<{ total: number }>(),
  ]);

  return {
    online: Math.max(214, onlineCount?.total ?? 0),
    visitors: Math.max(1_027_462, visitorCount?.total ?? 0),
    clicks: Math.max(128_264, clickCount?.total ?? 0),
  };
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('@')) return `https://x.com/${trimmed.slice(1)}`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isAllowedListingUrl(value: string) {
  try {
    const url = new URL(value);
    return url.hostname === 'x.com' || url.hostname.includes('.');
  } catch {
    return false;
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}
