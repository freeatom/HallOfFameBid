import { env } from 'cloudflare:workers';

export async function GET(_request: Request, context: { params: Promise<{ key: string }> }) {
  const { key } = await context.params;
  if (!env.LOGOS) return new Response('Logo storage is not configured', { status: 500 });

  const logo = await env.LOGOS.get(key);
  if (!logo) return new Response('Not found', { status: 404 });

  return new Response(logo.body, {
    headers: {
      'Content-Type': logo.httpMetadata?.contentType ?? 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
