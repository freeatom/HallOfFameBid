import { env } from 'cloudflare:workers';
import { ensureDatabase } from '@/db/hall';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (!env.DB) return Response.redirect(new URL('/', request.url));

  await ensureDatabase(env.DB);
  const listing = await env.DB.prepare('SELECT id, url FROM listings WHERE slug = ?')
    .bind(slug)
    .first<{ id: string; url: string }>();

  if (!listing) return Response.redirect(new URL('/', request.url));

  const visitorCookie = request.headers.get('cookie')?.match(/hof_visitor=([^;]+)/)?.[1];
  const visitorId = visitorCookie ? decodeURIComponent(visitorCookie).slice(0, 80) : crypto.randomUUID();

  await env.DB.prepare('INSERT INTO clicks (id, listing_id, visitor_id, clicked_at) VALUES (?, ?, ?, ?)')
    .bind(crypto.randomUUID(), listing.id, visitorId, Date.now())
    .run();

  const response = new Response(null, {
    status: 302,
    headers: { Location: listing.url },
  });
  response.headers.append(
    'Set-Cookie',
    `hof_visitor=${encodeURIComponent(visitorId)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`,
  );
  return response;
}
