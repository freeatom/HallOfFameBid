import { env } from 'cloudflare:workers';
import DodoPayments from 'dodopayments';
import { categories } from '@/app/categories';
import {
  ensureDatabase,
  getTwitterHandle,
  getPlacementForBid,
  isAllowedListingUrl,
  logoUrlForInput,
  normalizeUrl,
  slugify,
} from '@/db/hall';

function runtimeString(key: string) {
  const cfValue = (env as unknown as Record<string, unknown>)[key];
  if (typeof cfValue === 'string' && cfValue) return cfValue;
  return process.env[key] || '';
}

function appUrl(request: Request) {
  return runtimeString('NEXT_PUBLIC_APP_URL') || new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });

  const apiKey = runtimeString('DODO_PAYMENTS_API_KEY');
  const productId = runtimeString('DODO_PRODUCT_ID_BID');
  if (!apiKey || !productId) {
    return Response.json(
      {
        error:
          'Dodo Payments is not configured. Set DODO_PAYMENTS_API_KEY and DODO_PRODUCT_ID_BID for a pay-what-you-want one-time product.',
      },
      { status: 503 },
    );
  }

  await ensureDatabase(env.DB);
  const formData = await request.formData();
  const rawUrl = String(formData.get('url') ?? '');
  const url = normalizeUrl(rawUrl);
  const submittedName = String(formData.get('name') ?? '').trim().slice(0, 80);
  const category = String(formData.get('category') ?? '').trim().slice(0, 80);
  let derivedName = submittedName;
  if (!derivedName && url) {
    const parsed = new URL(url);
    const twitterHandle = getTwitterHandle(url);
    derivedName = twitterHandle ? `@${twitterHandle}` : parsed.hostname.replace(/^www\./, '');
  }

  const name = derivedName.slice(0, 80);
  const headline =
    String(formData.get('headline') ?? '').trim().slice(0, 140) || `${name} is entering the Hall of Fame`;
  const description =
    String(formData.get('description') ?? '').trim().slice(0, 260) ||
    'A paid Hall of Fame placement with public rank, tracked clicks, and a shareable profile.';
  const bidAmount = Number(String(formData.get('amount') ?? '').replace(/[^0-9]/g, ''));

  if (!url || !isAllowedListingUrl(url) || !name || !category || !categories.includes(category) || !Number.isFinite(bidAmount) || bidAmount < 1) {
    return Response.json(
      { error: 'Enter a valid brand, choose a category, and place a bid of at least $1.' },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();
  const baseSlug = slugify(name || url) || id;
  const slug = `${baseSlug}-${id.slice(0, 6)}`;
  const now = Date.now();
  let logoKey: string | null = null;
  let logoUrl = String(formData.get('logoUrl') ?? '').trim().slice(0, 500) || logoUrlForInput(rawUrl);

  const logo = formData.get('logo');
  if (logo instanceof File && logo.size > 0 && env.LOGOS) {
    const extension = logo.type.includes('png') ? 'png' : logo.type.includes('jpeg') ? 'jpg' : 'webp';
    logoKey = `${slug}.${extension}`;
    logoUrl = null;
    await env.LOGOS.put(logoKey, await logo.arrayBuffer(), {
      httpMetadata: { contentType: logo.type || 'image/webp' },
    });
  }

  const projectedRank = await getPlacementForBid(env.DB, bidAmount);

  await env.DB.prepare(
    `INSERT INTO checkout_intents (
      id, slug, name, url, category, headline, description, bid_amount,
      logo_key, logo_url, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(id, slug, name, url, category, headline, description, bidAmount, logoKey, logoUrl, 'pending', now)
    .run();

  const baseUrl = appUrl(request);
  const client = new DodoPayments({
    bearerToken: apiKey,
    environment: runtimeString('DODO_PAYMENTS_ENVIRONMENT') === 'live_mode' ? 'live_mode' : 'test_mode',
  });

  const checkout = await client.checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1, amount: bidAmount * 100 }],
    metadata: {
      intent_id: id,
      bid_amount: bidAmount,
      projected_rank: projectedRank,
      slug,
      source: 'halloffamebid.lol',
    },
    return_url: `${baseUrl}/?checkout=intent-${id}`,
    cancel_url: `${baseUrl}/#bid`,
    customization: {
      theme: 'dark',
      show_order_details: true,
      theme_config: {
        font_size: 'lg',
        font_weight: 'bold',
        pay_button_text: `Claim rank #${projectedRank}`,
        dark: {
          bg_primary: '#080706',
          bg_secondary: '#15100c',
          border_primary: '#8c6a31',
          button_primary: '#d7a84e',
          button_primary_hover: '#f0c96c',
          text_primary: '#fff7e6',
          text_secondary: '#c9b58a',
        },
      },
    },
  });

  await env.DB.prepare('UPDATE checkout_intents SET checkout_session_id = ? WHERE id = ?')
    .bind(checkout.session_id, id)
    .run();

  return Response.json({ checkoutUrl: checkout.checkout_url, projectedRank, intentId: id });
}
