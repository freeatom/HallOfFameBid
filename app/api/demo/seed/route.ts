import { env } from 'cloudflare:workers';
import { ensureDatabase, seedTemporaryDemoData } from '@/db/hall';

export async function POST(request: Request) {
  const host = new URL(request.url).hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') {
    return Response.json({ error: 'Demo seeding is local-only.' }, { status: 403 });
  }

  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });

  await ensureDatabase(env.DB);
  await seedTemporaryDemoData(env.DB, true);

  const listings = await env.DB.prepare('SELECT COUNT(*) AS total FROM listings').first<{ total: number }>();
  const clicks = await env.DB.prepare('SELECT COUNT(*) AS total FROM clicks').first<{ total: number }>();

  return Response.json({ ok: true, listings: listings?.total ?? 0, clicks: clicks?.total ?? 0 });
}
