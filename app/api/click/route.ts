import { env } from 'cloudflare:workers';
import { ensureDatabase } from '@/db/hall';

export async function POST(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });

  await ensureDatabase(env.DB);
  const body = await request.json().catch(() => ({}));
  const listingId = typeof body.listingId === 'string' ? body.listingId : '';
  const visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 80) : crypto.randomUUID();

  if (!listingId) {
    return Response.json({ error: 'Missing listing id' }, { status: 400 });
  }

  await env.DB.prepare('INSERT INTO clicks (id, listing_id, visitor_id, clicked_at) VALUES (?, ?, ?, ?)')
    .bind(crypto.randomUUID(), listingId, visitorId, Date.now())
    .run();

  return Response.json({ ok: true });
}
