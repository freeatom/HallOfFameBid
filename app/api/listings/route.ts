import { env } from 'cloudflare:workers';
import { ensureDatabase, getListings, isAllowedListingUrl, normalizeUrl, slugify } from '@/db/hall';

export async function GET() {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });
  const listings = await getListings(env.DB);
  return Response.json({ listings });
}

export async function POST(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });

  await ensureDatabase(env.DB);
  const formData = await request.formData();
  const rawUrl = String(formData.get('url') ?? '');
  const name = String(formData.get('name') ?? '').trim().slice(0, 80);
  const category = String(formData.get('category') ?? 'Other').trim().slice(0, 80);
  const headline = String(formData.get('headline') ?? '').trim().slice(0, 140);
  const description = String(formData.get('description') ?? '').trim().slice(0, 260);
  const bidAmount = Number(String(formData.get('amount') ?? '').replace(/[^0-9]/g, ''));
  const url = normalizeUrl(rawUrl);

  if (!url || !isAllowedListingUrl(url) || !name || !headline || !description || !Number.isFinite(bidAmount) || bidAmount < 5) {
    return Response.json({ error: 'Enter a valid brand, domain or X handle, headline, description, and bid of at least $5.' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const baseSlug = slugify(name || url) || id;
  const slug = `${baseSlug}-${id.slice(0, 6)}`;
  const now = Date.now();
  let logoKey: string | null = null;

  const logo = formData.get('logo');
  if (logo instanceof File && logo.size > 0 && env.LOGOS) {
    const extension = logo.type.includes('png') ? 'png' : logo.type.includes('jpeg') ? 'jpg' : 'webp';
    logoKey = `${slug}.${extension}`;
    await env.LOGOS.put(logoKey, await logo.arrayBuffer(), {
      httpMetadata: { contentType: logo.type || 'image/webp' },
    });
  }

  await env.DB.prepare(
    `INSERT INTO listings (
      id, slug, name, url, category, headline, description, bid_amount,
      logo_key, logo_url, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, slug, name, url, category, headline, description, bidAmount, logoKey, null, now, now)
    .run();

  return Response.json({ ok: true, slug }, { status: 201 });
}
