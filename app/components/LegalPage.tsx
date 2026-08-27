import Link from 'next/link';
import { Footer } from './Footer';

export function LegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <main className="site-shell legal-page">
      <header className="legal-topbar">
        <Link href="/" className="signature" aria-label="Hall of Fame Bid home">
          <span className="sigil">H</span>
          <span>
            <strong>Hall of Fame Bid</strong>
            <small>halloffamebid.lol</small>
          </span>
        </Link>
        <Link className="nav-claim" href="/#bid">
          Claim #1
        </Link>
      </header>
      <article className="legal-doc">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        {children}
      </article>
      <Footer />
    </main>
  );
}
