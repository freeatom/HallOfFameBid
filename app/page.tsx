const categories = [
  { label: 'All', topBid: '$28,000' },
  { label: 'AI', topBid: '$28,000' },
  { label: 'SaaS', topBid: '$18,400' },
  { label: 'Finance', topBid: '$15,250' },
  { label: 'Luxury', topBid: '$12,800' },
  { label: 'Creator', topBid: '$9,700' },
  { label: 'Devtools', topBid: '$8,300' },
  { label: 'Agencies', topBid: '$6,500' },
];

const leaders = [
  {
    rank: 1,
    name: 'Aurelian Labs',
    url: 'aurelian.ai',
    category: 'AI',
    bid: '$28,000',
    claim: '$28,005',
    clicks: '42,810',
    conversion: '8.4%',
    age: '2 hours ago',
    title: 'Private AI operators for teams that move capital',
    description:
      'Deploy executive-grade AI workflows with audited actions, private context, and measurable revenue attribution.',
  },
  {
    rank: 2,
    name: 'VaultSignal',
    url: 'vaultsignal.com',
    category: 'Finance',
    bid: '$18,400',
    claim: '$18,401',
    clicks: '31,094',
    conversion: '6.9%',
    age: 'yesterday',
    title: 'The investor relations room for elite operators',
    description:
      'One controlled room for investor updates, cap table intelligence, warm intros, and board-ready momentum reporting.',
  },
  {
    rank: 3,
    name: 'Maison Atlas',
    url: 'maisonatlas.co',
    category: 'Luxury',
    bid: '$15,250',
    claim: '$15,251',
    clicks: '22,671',
    conversion: '5.8%',
    age: '2 days ago',
    title: 'Concierge travel for founders and family offices',
    description:
      'Bespoke itineraries, private access, and real-time travel recovery handled by an operator who knows your preferences.',
  },
  {
    rank: 4,
    name: 'Northstar GTM',
    url: 'northstargtm.com',
    category: 'Agencies',
    bid: '$12,800',
    claim: '$12,801',
    clicks: '17,480',
    conversion: '7.1%',
    age: '3 days ago',
    title: 'Pipeline systems for category leaders',
    description:
      'Build a founder-led growth machine with offer design, outbound systems, partner loops, and buyer-intent dashboards.',
  },
  {
    rank: 5,
    name: 'PrismKit',
    url: 'prismkit.dev',
    category: 'Devtools',
    bid: '$9,700',
    claim: '$9,701',
    clicks: '14,209',
    conversion: '4.9%',
    age: '4 days ago',
    title: 'Design-system infrastructure for AI-native teams',
    description:
      'Ship branded interfaces from a governed component library with tokens, previews, accessibility checks, and release notes.',
  },
];

const activity = [
  'Aurelian Labs defended #1 with a $5,000 raise',
  'Maison Atlas entered Luxury at #1',
  'VaultSignal crossed 30,000 verified clicks',
  'PrismKit claimed #1 in Devtools',
  'Northstar GTM booked 19 intro requests from the board',
];

const insights = [
  { label: 'Verified clicks', value: '128,264', note: 'Deduped by visitor and fraud filters' },
  { label: 'Avg. click value', value: '$1.24', note: 'Estimated from current bid depth' },
  { label: 'Founder audience', value: '71%', note: 'Visitors from builder and operator channels' },
  { label: 'Median top-10 stay', value: '38h', note: 'Useful for planning campaign windows' },
];

const mechanics = [
  'All-time rank is the total paid bid. To take #1, pay at least $5 above the current leader.',
  'Today rank counts spend in the last 24 hours, then rolls off automatically.',
  'Raising your own listing only charges the difference, with ownership verification before checkout.',
  'Every listing gets a public detail page with clicks, rank history, category position, and source quality.',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090806] text-[#f7f0df]">
      <section className="relative isolate overflow-hidden border-b border-[#d8b15a]/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(216,177,90,.28),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(110,18,35,.34),transparent_30%),linear-gradient(135deg,#090806_0%,#15100b_46%,#2a0c14_100%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,.12),transparent)]" />

        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Hall of Fame Bid home">
            <span className="grid h-10 w-10 place-items-center border border-[#d8b15a]/60 bg-[#100d09] text-lg text-[#f3cd75] shadow-[0_0_30px_rgba(216,177,90,.18)]">
              H
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-[#f3cd75]">
                Hall of Fame Bid
              </span>
              <span className="block text-xs text-[#c7b99e]">halloffamebid.lol</span>
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[#d8ceb8] md:flex">
            <a href="#leaderboard">Leaderboard</a>
            <a href="#insights">Insights</a>
            <a href="#rules">Rules</a>
          </nav>
          <a
            href="#bid"
            className="border border-[#d8b15a]/60 bg-[#d8b15a] px-4 py-2 text-sm font-semibold text-[#15100b] shadow-[0_10px_30px_rgba(216,177,90,.22)]"
          >
            Claim a rank
          </a>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:pb-20 lg:pt-16">
          <div>
            <div className="mb-7 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[#f3cd75]">
              <span className="border border-[#d8b15a]/35 bg-black/20 px-3 py-2">214 online</span>
              <span className="border border-[#d8b15a]/35 bg-black/20 px-3 py-2">1.2M visitors tracked</span>
              <span className="border border-[#d8b15a]/35 bg-black/20 px-3 py-2">Verified click ledger</span>
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-[#fff8e8] sm:text-7xl lg:text-8xl">
              Buy your place in the internet hall of fame.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8ceb8]">
              A premium pay-to-rank leaderboard where founders, brands, and operators bid for public
              prestige, measurable attention, and category ownership.
            </p>
            <div className="mt-9 grid max-w-3xl grid-cols-3 border border-[#d8b15a]/25 bg-black/20">
              <div className="border-r border-[#d8b15a]/20 p-4">
                <p className="text-2xl font-semibold text-[#f3cd75]">$28,000</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#a99d86]">Highest bid</p>
              </div>
              <div className="border-r border-[#d8b15a]/20 p-4">
                <p className="text-2xl font-semibold text-[#f3cd75]">42,810</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#a99d86]">Top clicks</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-semibold text-[#f3cd75]">38h</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#a99d86]">Median stay</p>
              </div>
            </div>
          </div>

          <form id="bid" className="border border-[#d8b15a]/35 bg-[#120f0a]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,.36)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f3cd75]">
              Claim #1 for
            </p>
            <div className="mt-4 flex items-center justify-between border border-[#d8b15a]/25 bg-black/25">
              <button className="h-14 w-14 border-r border-[#d8b15a]/20 text-2xl text-[#f3cd75]" type="button" aria-label="Decrease bid">
                -
              </button>
              <label className="sr-only" htmlFor="amount">Amount in dollars</label>
              <input
                id="amount"
                defaultValue="$28,005"
                className="h-14 min-w-0 flex-1 bg-transparent px-4 text-center text-2xl font-semibold text-[#fff8e8] outline-none"
              />
              <button className="h-14 w-14 border-l border-[#d8b15a]/20 text-2xl text-[#f3cd75]" type="button" aria-label="Increase bid">
                +
              </button>
            </div>
            <label className="mt-5 block text-xs uppercase tracking-[0.12em] text-[#a99d86]" htmlFor="url">
              Product URL or @handle
            </label>
            <input
              id="url"
              placeholder="yourbrand.com"
              className="mt-2 h-12 w-full border border-[#d8b15a]/25 bg-black/20 px-4 text-[#fff8e8] outline-none placeholder:text-[#7f725d]"
            />
            <label className="mt-4 block text-xs uppercase tracking-[0.12em] text-[#a99d86]" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="mt-2 h-12 w-full border border-[#d8b15a]/25 bg-black/20 px-4 text-[#fff8e8] outline-none"
              defaultValue="AI"
            >
              {categories.slice(1).map((category) => (
                <option key={category.label}>{category.label}</option>
              ))}
            </select>
            <button className="mt-5 h-12 w-full bg-[#f3cd75] font-semibold text-[#15100b]" type="button">
              Enter the hall
            </button>
            <p className="mt-4 text-sm leading-6 text-[#b9ad94]">
              Checkout will show projected rank, expected exposure, and the exact difference owed if you are
              raising an existing listing.
            </p>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8" id="leaderboard">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {categories.map((category) => (
            <a
              href="#leaderboard"
              key={category.label}
              className="shrink-0 border border-[#d8b15a]/25 bg-[#120f0a] px-4 py-3 text-sm text-[#d8ceb8]"
            >
              <span className="text-[#f3cd75]">{category.label}</span>
              <span className="ml-3 text-[#857966]">{category.topBid}</span>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {leaders.map((leader) => (
              <article
                key={leader.rank}
                className="grid gap-4 border border-[#d8b15a]/22 bg-[#0f0c08] p-5 transition hover:border-[#d8b15a]/55 md:grid-cols-[86px_minmax(0,1fr)_170px]"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[#857966]">Rank</p>
                  <p className="mt-1 text-5xl font-semibold text-[#f3cd75]">#{leader.rank}</p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-[#fff8e8]">{leader.name}</h2>
                    <span className="border border-[#d8b15a]/25 px-2 py-1 text-xs uppercase tracking-[0.12em] text-[#f3cd75]">
                      #1 in {leader.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#a99d86]">{leader.url} · {leader.age}</p>
                  <p className="mt-4 text-lg font-medium text-[#e9dcc2]">{leader.title}</p>
                  <p className="mt-2 max-w-3xl leading-7 text-[#b9ad94]">{leader.description}</p>
                  <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#d8ceb8]">
                    <span>{leader.clicks} clicks</span>
                    <span>{leader.conversion} visit-to-action signal</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-4 md:items-end">
                  <p className="text-3xl font-semibold text-[#f3cd75]">{leader.bid}</p>
                  <button className="border border-[#d8b15a]/50 px-4 py-3 text-sm font-semibold text-[#f3cd75]" type="button">
                    Claim for {leader.claim}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-5">
            <section className="border border-[#d8b15a]/25 bg-[#120f0a] p-5" id="insights">
              <h2 className="text-xl font-semibold text-[#fff8e8]">Buyer intelligence</h2>
              <div className="mt-5 space-y-4">
                {insights.map((item) => (
                  <div key={item.label} className="border-b border-[#d8b15a]/15 pb-4 last:border-0 last:pb-0">
                    <p className="text-2xl font-semibold text-[#f3cd75]">{item.value}</p>
                    <p className="mt-1 text-sm font-medium text-[#fff8e8]">{item.label}</p>
                    <p className="mt-1 text-sm text-[#a99d86]">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="border border-[#d8b15a]/25 bg-[#120f0a] p-5">
              <h2 className="text-xl font-semibold text-[#fff8e8]">Latest movements</h2>
              <ol className="mt-5 space-y-3 text-sm leading-6 text-[#c7b99e]">
                {activity.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </section>

      <section className="border-y border-[#d8b15a]/20 bg-[#120f0a] px-5 py-12 sm:px-8" id="rules">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f3cd75]">Mechanics</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#fff8e8]">Prestige backed by transparent numbers.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mechanics.map((item) => (
              <p key={item} className="border border-[#d8b15a]/20 bg-black/20 p-5 leading-7 text-[#d8ceb8]">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
