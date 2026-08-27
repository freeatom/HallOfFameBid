import { LegalPage } from '../components/LegalPage';

export const metadata = {
  title: 'Terms | Hall of Fame Bid',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" eyebrow="Effective August 27, 2026">
      <p>
        These Terms govern access to Hall of Fame Bid, including the public leaderboard, claim flow,
        checkout, stats pages, redirects, and related features. By using the site or completing payment,
        you agree to these Terms and the Rules.
      </p>

      <h2>What the service is</h2>
      <p>
        Hall of Fame Bid is a paid public ranking. A payment buys placement at the rank supported by
        the confirmed bid amount. It is not an endorsement, review, certification, investment advice,
        traffic guarantee, revenue guarantee, or permanent exclusive placement.
      </p>

      <h2>Payments</h2>
      <ul>
        <li>Checkout is processed by Dodo Payments. We do not collect or store full card numbers.</li>
        <li>Amounts are shown in US dollars. Taxes or payment fees may be handled by the checkout provider.</li>
        <li>Rank is assigned only after payment confirmation reaches the Hall of Fame Bid webhook.</li>
        <li>Payments are final unless applicable law requires otherwise.</li>
      </ul>

      <h2>Your listing</h2>
      <ul>
        <li>You must have the right to submit the website or X profile you list.</li>
        <li>Your destination must be lawful, safe, non-deceptive, and not impersonate another person or brand.</li>
        <li>You grant us permission to display the submitted destination, category, bid amount, fetched logo or profile image, headline, and description for operating the board.</li>
        <li>You are responsible for claims made on your destination and in your listing copy.</li>
      </ul>

      <h2>Moderation</h2>
      <p>
        We may refuse, hide, edit, recategorize, or remove listings if they appear to violate these
        Terms, the Rules, third-party rights, platform policies, law, or the integrity of the board.
        Removal does not automatically create a refund.
      </p>

      <h2>Availability and changes</h2>
      <p>
        The service is provided as available. Ranking rules, categories, minimums, checkout behavior,
        stats, and page design may change over time. Continued use after a change means you accept the
        updated version.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent allowed by law, Hall of Fame Bid is provided without warranties. We are
        not liable for lost profits, lost traffic, lost data, lost goodwill, indirect damages, or the
        actions of listed destinations, analytics providers, payment providers, hosting providers, or
        other third parties.
      </p>

      <h2>Contact</h2>
      <p>
        For listing notices, rights complaints, and service questions, contact{' '}
        <a href="https://x.com/Abhinay_Vio" target="_blank" rel="noreferrer">
          @Abhinay_Vio
        </a>
        .
      </p>
    </LegalPage>
  );
}
