import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" href="/">
          Hall of Fame Bid
        </Link>
        <p>Paid public ranking for products, websites, and X profiles.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/hall">Hall</Link>
        <Link href="/rules">Rules</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/stats">Stats</Link>
        <a href="https://x.com/Abhinay_Vio" target="_blank" rel="noreferrer">
          Made by @Abhinay_Vio
        </a>
      </nav>
    </footer>
  );
}
