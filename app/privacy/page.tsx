import { LegalPage } from '../components/LegalPage';

export const metadata = {
  title: 'Privacy | Hall of Fame Bid',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" eyebrow="Effective August 27, 2026">
      <p>
        This policy explains how Hall of Fame Bid handles information when you visit the site, click a
        listing, submit a destination, or pay for a ranking.
      </p>

      <h2>Information we process</h2>
      <ul>
        <li>A random visitor identifier used for live visitor counts and duplicate-click reduction.</li>
        <li>Listing data you submit, including URL or X handle, category, bid amount, headline, description, and logo upload.</li>
        <li>Public metadata fetched from a submitted website or X profile, such as title, description, favicon, Open Graph image, or profile image.</li>
        <li>Payment confirmation data from Dodo Payments, including payment identifiers, bid metadata, and paid amount.</li>
        <li>Click records for listing redirects, including listing id, visitor id, and timestamp.</li>
        <li>Technical request data processed by hosting, security, and analytics infrastructure.</li>
      </ul>

      <h2>Analytics</h2>
      <p>
        Hall of Fame Bid uses DataFast analytics for site traffic and live visitor measurement. The site
        also keeps its own operational counters for visitors and tracked listing clicks.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are handled by Dodo Payments. Full card details are entered with the payment provider,
        not stored by Hall of Fame Bid. We receive payment status information needed to publish or reject
        a paid listing.
      </p>

      <h2>Public listings</h2>
      <p>
        Rank, paid amount, listing name, category, destination, logo or profile image, headline, description,
        and tracked click counts are public. Do not submit a destination if you do not want it displayed.
      </p>

      <h2>Why we use data</h2>
      <ul>
        <li>To operate the leaderboard and place paid listings.</li>
        <li>To process checkout confirmation and prevent unpaid placement.</li>
        <li>To count visitors and listing clicks.</li>
        <li>To reduce abuse, duplicate counting, misleading submissions, and payment disputes.</li>
        <li>To respond to notices, support requests, or legal obligations.</li>
      </ul>

      <h2>Retention</h2>
      <p>
        Public listing records may remain while the board operates. Payment identifiers are kept as needed
        for accounting, dispute, and fraud handling. Click and visitor records are kept as long as useful
        for operational stats and abuse protection.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions or removal requests, contact{' '}
        <a href="https://x.com/Abhinay_Vio" target="_blank" rel="noreferrer">
          @Abhinay_Vio
        </a>
        .
      </p>
    </LegalPage>
  );
}
