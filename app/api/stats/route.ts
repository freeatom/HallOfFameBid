import { env } from 'cloudflare:workers';
import { ensureDatabase, getStats } from '@/db/hall';

export async function POST(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });

  await ensureDatabase(env.DB);
  const body = await request.json().catch(() => ({}));
  const visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 80) : crypto.randomUUID();

  await env.DB.prepare(
    `INSERT INTO visitors (visitor_id, seen_at)
     VALUES (?, ?)
     ON CONFLICT(visitor_id) DO UPDATE SET seen_at = excluded.seen_at`,
  )
    .bind(visitorId, Date.now())
    .run();

  return Response.json(await getStats(env.DB));
}

export async function GET() {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });
  return Response.json(await getStats(env.DB));
}
