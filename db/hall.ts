import { schemaStatements } from './schema';

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

export type PendingListing = Omit<Listing, 'clicks' | 'updated_at'> & {
  status: 'pending' | 'paid' | 'failed';
  checkout_session_id: string | null;
  payment_id: string | null;
  paid_at: number | null;
};

let initialized = false;

const temporaryDemoListings = [
  {
    id: 'demo-see-io',
    slug: 'demo-see-io',
    name: 'see.io',
    url: 'https://see.io/',
    category: 'AI Agents & Infrastructure',
    headline: 'Ship your idea into a live site in minutes.',
    description: 'AI turns a product idea into a polished website with domain-ready launch flow.',
    bid_amount: 17000,
    logo_url: 'https://www.google.com/s2/favicons?domain=see.io&sz=128',
    clicks: 48,
  },
  {
    id: 'demo-arcade-ai',
    slug: 'demo-arcade-ai',
    name: 'Arcade AI',
    url: 'https://arcade.dev/',
    category: 'Developer Tools',
    headline: 'Tool calling infrastructure for ambitious agent teams.',
    description: 'A premium developer platform occupying a visible founder-grade placement.',
    bid_amount: 9400,
    logo_url: 'https://www.google.com/s2/favicons?domain=arcade.dev&sz=128',
    clicks: 31,
  },
  {
    id: 'demo-abhinay-vio',
    slug: 'demo-abhinay-vio',
    name: '@Abhinay_Vio',
    url: 'https://x.com/Abhinay_Vio',
    category: 'People',
    headline: 'Builder profile reserved for the opening Hall showcase.',
    description: 'An X profile demo entry showing handle detection, avatar fetching, and click tracking.',
    bid_amount: 6200,
    logo_url: 'https://unavatar.io/x/Abhinay_Vio',
    clicks: 24,
  },
  {
    id: 'demo-luxe-launch',
    slug: 'demo-luxe-launch',
    name: 'LuxeLaunch',
    url: 'https://luxelaunch.co/',
    category: 'Marketing & Advertising',
    headline: 'Launch positioning for products that need instant credibility.',
    description: 'A lower Hall entry used to preview the remaining-ranks layout and action controls.',
    bid_amount: 1800,
    logo_url: 'https://www.google.com/s2/favicons?domain=luxelaunch.co&sz=128',
    clicks: 12,
  },
  {
    id: 'demo-vaultsignal',
    slug: 'demo-vaultsignal-new',
    name: 'VaultSignal',
    url: 'https://vaultsignal.com/',
    category: 'Security',
    headline: 'Private security intelligence with board-level visibility.',
    description: 'A compact row entry for testing long category names, bid order, and tracked clicks.',
    bid_amount: 1200,
    logo_url: 'https://www.google.com/s2/favicons?domain=vaultsignal.com&sz=128',
    clicks: 9,
  },
];

async function seedTemporaryDemoData(db: D1Database) {
  const realCount = await db
    .prepare("SELECT COUNT(*) AS total FROM listings WHERE id NOT LIKE 'demo-%'")
    .first<{ total: number }>();
  const demoCount = await db
    .prepare("SELECT COUNT(*) AS total FROM listings WHERE id LIKE 'demo-%'")
    .first<{ total: number }>();

  if ((realCount?.total ?? 0) > 0 || (demoCount?.total ?? 0) > 0) return;

  const now = Date.now();
  const statements = temporaryDemoListings.flatMap((listing, listingIndex) => {
    const createdAt = now - (temporaryDemoListings.length - listingIndex) * 60 * 60 * 1000;
    const inserts = [
      db
        .prepare(
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
          createdAt,
          createdAt,
        ),
    ];

    for (let clickIndex = 0; clickIndex < listing.clicks; clickIndex += 1) {
      inserts.push(
        db
          .prepare('INSERT INTO clicks (id, listing_id, visitor_id, referrer, created_at) VALUES (?, ?, ?, ?, ?)')
          .bind(
            `${listing.id}-click-${clickIndex}`,
            listing.id,
            `demo-visitor-${listingIndex}-${clickIndex}`,
            'demo',
            createdAt + clickIndex * 1000,
          ),
      );
    }

    return inserts;
  });

  await db.batch(statements);
}

export async function ensureDatabase(db: D1Database) {
  if (initialized) return;

  for (const statement of schemaStatements) {
    await db.prepare(statement).run();
  }

  const oldSeedIds = ['aurelian-labs', 'vaultsignal', 'maison-atlas', 'northstar-gtm', 'prismkit', 'crownindex'];
  await db.batch([
    db
      .prepare(`DELETE FROM clicks WHERE listing_id IN (${oldSeedIds.map(() => '?').join(',')})`)
      .bind(...oldSeedIds),
    db
      .prepare(`DELETE FROM listings WHERE id IN (${oldSeedIds.map(() => '?').join(',')})`)
      .bind(...oldSeedIds),
  ]);

  await seedTemporaryDemoData(db);

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

export async function getPlacementForBid(db: D1Database, amount: number) {
  await ensureDatabase(db);
  const result = await db
    .prepare('SELECT COUNT(*) AS total FROM listings WHERE bid_amount >= ?')
    .bind(amount)
    .first<{ total: number }>();

  return (result?.total ?? 0) + 1;
}

export function getClaimAmount(listings: Pick<Listing, 'bid_amount'>[]) {
  const highest = listings[0]?.bid_amount ?? 0;
  return Math.max(1, highest + 1);
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
    online: onlineCount?.total ?? 0,
    visitors: visitorCount?.total ?? 0,
    clicks: clickCount?.total ?? 0,
  };
}

export async function getPendingListing(db: D1Database, id: string) {
  await ensureDatabase(db);
  return db
    .prepare('SELECT * FROM checkout_intents WHERE id = ? LIMIT 1')
    .bind(id)
    .first<PendingListing>();
}

export async function publishPaidListing(db: D1Database, intent: PendingListing, paymentId: string) {
  await ensureDatabase(db);
  const now = Date.now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO listings (
          id, slug, name, url, category, headline, description, bid_amount,
          logo_key, logo_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          bid_amount = excluded.bid_amount,
          logo_key = excluded.logo_key,
          logo_url = excluded.logo_url,
          updated_at = excluded.updated_at`,
      )
      .bind(
        intent.id,
        intent.slug,
        intent.name,
        intent.url,
        intent.category,
        intent.headline,
        intent.description,
        intent.bid_amount,
        intent.logo_key,
        intent.logo_url,
        intent.created_at,
        now,
      ),
    db
      .prepare('UPDATE checkout_intents SET status = ?, payment_id = ?, paid_at = ? WHERE id = ?')
      .bind('paid', paymentId, now, intent.id),
  ]);
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
  if (trimmed.startsWith('@')) return `https://x.com/${trimmed.slice(1).replace(/^@+/, '')}`;
  const looksLikeUrl =
    /^https?:\/\//i.test(trimmed) ||
    /^www\./i.test(trimmed) ||
    trimmed.includes('.') ||
    trimmed.includes('/');
  const withProtocol = looksLikeUrl ? (/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`) : `https://x.com/${trimmed.replace(/^@+/, '')}`;
  try {
    const url = new URL(withProtocol);
    if (url.hostname === 'twitter.com' || url.hostname === 'www.twitter.com') {
      url.hostname = 'x.com';
      return url.toString();
    }
    if (url.hostname === 'www.x.com') {
      url.hostname = 'x.com';
      return url.toString();
    }
    return url.toString();
  } catch {
    return withProtocol;
  }
}

export function isAllowedListingUrl(value: string) {
  try {
    const url = new URL(value);
    return url.hostname === 'x.com' || url.hostname.includes('.');
  } catch {
    return false;
  }
}

export function logoUrlForInput(value: string) {
  if (!value) return null;
  try {
    const url = new URL(normalizeUrl(value));
    if (url.hostname === 'x.com') {
      const handle = url.pathname.split('/').filter(Boolean)[0];
      return handle ? `https://unavatar.io/x/${encodeURIComponent(handle)}` : null;
    }
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.hostname)}&sz=128`;
  } catch {
    return null;
  }
}

export function getTwitterHandle(value: string) {
  try {
    const url = new URL(normalizeUrl(value));
    if (url.hostname !== 'x.com') return '';
    return url.pathname.split('/').filter(Boolean)[0]?.replace(/^@+/, '') ?? '';
  } catch {
    return '';
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
