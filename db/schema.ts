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
  `CREATE TABLE IF NOT EXISTS checkout_intents (
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
    status TEXT NOT NULL,
    checkout_session_id TEXT,
    payment_id TEXT,
    created_at INTEGER NOT NULL,
    paid_at INTEGER
  )`,
  `CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    received_at INTEGER NOT NULL
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
  `CREATE INDEX IF NOT EXISTS idx_checkout_intents_status ON checkout_intents(status)`,
  `CREATE INDEX IF NOT EXISTS idx_clicks_listing_id ON clicks(listing_id)`,
  `CREATE INDEX IF NOT EXISTS idx_clicks_visitor_listing ON clicks(listing_id, visitor_id, clicked_at)`,
  `CREATE INDEX IF NOT EXISTS idx_visitors_seen_at ON visitors(seen_at)`,
];
