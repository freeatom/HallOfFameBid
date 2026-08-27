export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL,
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    bid_amount INTEGER NOT NULL,
    logo_key TEXT,
    logo_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS clicks (
    id TEXT PRIMARY KEY,
    listing_id TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    clicked_at INTEGER NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id)
  )`,
  `CREATE TABLE IF NOT EXISTS visitors (
    visitor_id TEXT PRIMARY KEY,
    seen_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_listings_bid_amount ON listings(bid_amount DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_clicks_listing_id ON clicks(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_visitors_seen_at ON visitors(seen_at)`,
];

export const seedListings = [
  {
    id: 'aurelian-labs',
    slug: 'aurelian-labs',
    name: 'Aurelian Labs',
    url: 'https://aurelian.ai',
    category: 'AI Agents & Infrastructure',
    headline: 'Private AI operators for teams that move capital',
    description:
      'Executive-grade AI workflows with audited actions, private context, and board-level revenue attribution.',
    bid_amount: 28000,
    logo_url: null,
  },
  {
    id: 'vaultsignal',
    slug: 'vaultsignal',
    name: 'VaultSignal',
    url: 'https://vaultsignal.com',
    category: 'Business, Finance & Legal',
    headline: 'The investor relations room for elite operators',
    description:
      'Controlled investor updates, cap table intelligence, warm intros, and momentum reporting in one private room.',
    bid_amount: 18400,
    logo_url: null,
  },
  {
    id: 'maison-atlas',
    slug: 'maison-atlas',
    name: 'Maison Atlas',
    url: 'https://maisonatlas.co',
    category: 'Luxury & Private Access',
    headline: 'Concierge travel for founders and family offices',
    description:
      'Bespoke itineraries, private access, and real-time travel recovery handled by operators who know your preferences.',
    bid_amount: 15250,
    logo_url: null,
  },
  {
    id: 'northstar-gtm',
    slug: 'northstar-gtm',
    name: 'Northstar GTM',
    url: 'https://northstargtm.com',
    category: 'Agencies, Studios & Services',
    headline: 'Pipeline systems for category leaders',
    description:
      'Founder-led growth systems with offer design, outbound infrastructure, partner loops, and buyer-intent reporting.',
    bid_amount: 12800,
    logo_url: null,
  },
  {
    id: 'prismkit',
    slug: 'prismkit',
    name: 'PrismKit',
    url: 'https://prismkit.dev',
    category: 'Developer Tools',
    headline: 'Design-system infrastructure for AI-native teams',
    description:
      'Governed components, tokens, previews, accessibility checks, and release notes for product teams that ship fast.',
    bid_amount: 9700,
    logo_url: null,
  },
  {
    id: 'crownindex',
    slug: 'crownindex',
    name: 'CrownIndex',
    url: 'https://crownindex.co',
    category: 'Directories, Launch & Discovery',
    headline: 'A private market map for serious launch teams',
    description:
      'Track competitors, channels, and buyer intent before a launch window opens.',
    bid_amount: 8300,
    logo_url: null,
  },
];
