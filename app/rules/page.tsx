import { LegalPage } from '../components/LegalPage';

export const metadata = {
  title: 'Rules | Hall of Fame Bid',
};

export default function RulesPage() {
  return (
    <LegalPage title="Rules" eyebrow="How the Hall works">
      <h2>Ranking</h2>
      <ul>
        <li>Every paid listing is ranked by confirmed bid amount in whole US dollars.</li>
        <li>New spots start at $1. Paying less than the #1 price still puts you on the board at whatever place that bid can take.</li>
        <li>To outrank an existing listing, your bid must be higher than that listing. Equal bids stay below older paid listings.</li>
        <li>Claiming #1 costs at least $1 more than the current highest paid bid.</li>
        <li>Rank goes live only after Dodo Payments confirms the payment through the server webhook.</li>
      </ul>

      <h2>What can be listed</h2>
      <ul>
        <li>A product website, company website, personal website, or X profile.</li>
        <li>Plain text such as “openai” is treated as an X handle. Full domains and URLs are treated as websites.</li>
        <li>Do not submit destinations you do not own or have permission to represent.</li>
        <li>No malware, phishing, scams, sexual content, illegal offers, impersonation, or deceptive redirects.</li>
        <li>Short links, group invite links, and destinations designed mainly to hide the real target may be removed.</li>
      </ul>

      <h2>Clicks and stats</h2>
      <ul>
        <li>Visits from Hall of Fame Bid go through tracked redirect links.</li>
        <li>Clicks are stored per listing and deduped for a short visitor window to reduce accidental repeat counts.</li>
        <li>Click and visitor counts are operational measurements, not promises of traffic, buyers, revenue, or ranking permanence.</li>
      </ul>

      <h2>After payment</h2>
      <ul>
        <li>Your listing becomes public with its rank, paid amount, destination, category, logo or profile image, and copy.</li>
        <li>Someone else can later bid more and push your listing down.</li>
        <li>Payments are final unless applicable law requires otherwise.</li>
      </ul>
    </LegalPage>
  );
}
