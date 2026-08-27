import { getTwitterHandle, logoUrlForInput, normalizeUrl } from '@/db/hall';

function extract(content: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim();
    }
  }
  return '';
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = typeof body.input === 'string' ? body.input.trim().slice(0, 240) : '';
  if (!input) return Response.json({ error: 'Missing URL or handle' }, { status: 400 });

  const url = normalizeUrl(input);
  const logoUrl = logoUrlForInput(input);

  const twitterHandle = getTwitterHandle(input);
  if (twitterHandle) {
    return Response.json({
      name: `@${twitterHandle}`,
      headline: `@${twitterHandle} enters the Hall of Fame`,
      description: '',
      logoUrl,
      url,
    });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'HallOfFameBidBot/1.0 (+https://halloffamebid.lol)' },
      signal: AbortSignal.timeout(4500),
    });
    const html = await response.text();
    const title = extract(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    ]);
    const description = extract(html, [
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    ]);
    const image = extract(html, [/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i]);
    const absoluteImage = image ? new URL(image, url).toString() : logoUrl;
    const hostname = new URL(url).hostname.replace(/^www\./, '');

    return Response.json({
      name: title ? title.split(/[|-]/)[0].trim().slice(0, 80) : hostname,
      headline: title ? title.slice(0, 140) : `${hostname} enters the Hall of Fame`,
      description: description.slice(0, 260),
      logoUrl: absoluteImage,
      url,
    });
  } catch {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return Response.json({
      name: hostname,
      headline: `${hostname} enters the Hall of Fame`,
      description: '',
      logoUrl,
      url,
    });
  }
}
