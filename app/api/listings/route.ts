import { env } from 'cloudflare:workers';
import { getListings } from '@/db/hall';

export async function GET() {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });
  const listings = await getListings(env.DB);
  return Response.json({ listings });
}

export async function POST() {
  return Response.json(
    { error: 'Listings go live only after Dodo Payments confirms the checkout webhook. Use /api/checkout.' },
    { status: 409 },
  );
}
