import { env } from 'cloudflare:workers';
import DodoPayments from 'dodopayments';
import { ensureDatabase, getPendingListing, publishPaidListing } from '@/db/hall';

function runtimeString(key: string) {
  const cfValue = (env as unknown as Record<string, unknown>)[key];
  if (typeof cfValue === 'string' && cfValue) return cfValue;
  return process.env[key] || '';
}

export async function POST(request: Request) {
  if (!env.DB) return Response.json({ error: 'Database is not configured' }, { status: 500 });

  const apiKey = runtimeString('DODO_PAYMENTS_API_KEY');
  const webhookKey = runtimeString('DODO_PAYMENTS_WEBHOOK_KEY');
  if (!apiKey || !webhookKey) return Response.json({ error: 'Dodo webhook is not configured' }, { status: 503 });

  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());
  const client = new DodoPayments({
    bearerToken: apiKey,
    environment: runtimeString('DODO_PAYMENTS_ENVIRONMENT') === 'live_mode' ? 'live_mode' : 'test_mode',
  });

  let event: DodoPayments.Webhooks.UnwrapWebhookEvent;
  try {
    event = client.webhooks.unwrap(body, { headers, key: webhookKey });
  } catch {
    return Response.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  await ensureDatabase(env.DB);
  const payment = 'data' in event ? event.data : null;
  const paymentId =
    payment && typeof payment === 'object' && 'payment_id' in payment ? String(payment.payment_id) : crypto.randomUUID();
  const eventId = `${event.type}:${paymentId}:${event.timestamp}`;

  try {
    await env.DB.prepare('INSERT INTO webhook_events (id, event_type, received_at) VALUES (?, ?, ?)')
      .bind(eventId, event.type, Date.now())
      .run();
  } catch {
    return Response.json({ ok: true, duplicate: true });
  }

  if (event.type === 'payment.succeeded') {
    const metadata = event.data.metadata ?? {};
    const intentId = typeof metadata.intent_id === 'string' ? metadata.intent_id : '';
    const amountFromMetadata = Number(metadata.bid_amount ?? 0);
    const paidCents = Number(event.data.total_amount ?? 0);
    const intent = intentId ? await getPendingListing(env.DB, intentId) : null;

    if (!intent || intent.status === 'paid') return Response.json({ ok: true });
    if (!Number.isFinite(amountFromMetadata) || amountFromMetadata !== intent.bid_amount) {
      return Response.json({ error: 'Bid metadata mismatch' }, { status: 422 });
    }
    if (paidCents < intent.bid_amount * 100) {
      return Response.json({ error: 'Paid amount is lower than bid' }, { status: 422 });
    }

    await publishPaidListing(env.DB, intent, event.data.payment_id);
  }

  if (event.type === 'payment.failed' || event.type === 'payment.cancelled') {
    const metadata = event.data.metadata ?? {};
    const intentId = typeof metadata.intent_id === 'string' ? metadata.intent_id : '';
    if (intentId) {
      await env.DB.prepare("UPDATE checkout_intents SET status = 'failed' WHERE id = ? AND status = 'pending'")
        .bind(intentId)
        .run();
    }
  }

  return Response.json({ ok: true });
}
