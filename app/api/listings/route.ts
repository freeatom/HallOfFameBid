import { env } from 'cloudflare:workers';
import { getListings } from '@/db/hall';

function getTodayStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export async function GET(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });
  const period = new URL(request.url).searchParams.get('period');
  const listings = await getListings(env.DB, period === 'today' ? { createdSince: getTodayStart() } : {});
  return Response.json({ listings });
}

export async function POST() {
  return Response.json(
    { error: 'Listings go live only after Dodo Payments confirms the checkout webhook. Use /api/checkout.' },
    { status: 409 },
  );
}
