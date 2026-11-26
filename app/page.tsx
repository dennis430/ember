import Image from "next/image";

const YEAR_CELLS = 336; // 14 cols x 24 rows demo grid

function buildDemoCells(): ("lit" | "ember" | "")[] {
  // Deterministic demo: a streak building over the year, ember = today's check-in.
  const cells: ("lit" | "ember" | "")[] = [];
  for (let i = 0; i < YEAR_CELLS; i++) {
    const momentum = i / YEAR_CELLS;
    const rhythm = Math.sin(i * 1.7) * 0.5 + 0.5;
    cells.push(momentum * 0.85 + rhythm * 0.25 > 0.55 ? "lit" : "");
  }
  cells[cells.length - 1] = "ember";
  return cells;
}

const demoCells = buildDemoCells();

const steps = [
  {
    title: "Pick one tiny habit",
    body: "Not a routine — one ritual. Two minutes of reading. One glass of water before coffee. Small enough that you can't talk yourself out of it.",
  },
  {
    title: "Tap once each morning",
    body: "Open Ember, tap the flame, done. No forms, no timers, no guilt-driven analytics. Sixty seconds is the whole ask.",
  },
  {
    title: "Watch your year fill in",
    body: "Every check-in lights a pixel. Miss a day and nothing breaks — the grid waits, and tomorrow is another square.",
  },
];

const faqs = [
  {
    q: "What counts as a ritual?",
    a: "Anything you can do in a couple of minutes and repeat most days: stretching while the kettle boils, writing one sentence, stepping outside. Ember works best when you keep it to one.",
  },
  {
    q: "What happens if I miss a day?",
    a: "Nothing dramatic. Your streak pauses and the grid simply leaves that square blank. Ember is built around gentleness, not broken-chain shame.",
  },
  {
    q: "Is my data private?",
    a: "Your check-ins live on your device. We don't sell data and we don't run ads. Sync across your devices comes with the subscription.",
  },
  {
    q: "Why isn't it free forever?",
    a: "The free tier covers your first ritual, forever. $2.99/month funds development, keeps Ember ad-free, and unlocks unlimited rituals, sync and gentle streak reminders.",
  },
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="wordmark" href="/">
            <span className="dot" aria-hidden="true" />
            Ember
          </a>
          <nav className="nav-links" aria-label="Main">
            <a className="link" href="#how">How it works</a>
            <a className="link" href="#year">Year in pixels</a>
            <a className="link" href="#pricing">Pricing</a>
            <a className="btn btn-primary" href="#pricing">Start your first ritual</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="eyebrow">A minute a day, kept</p>
              <h1>Small habits, quietly kept for life</h1>
              <p className="lede">
                Ember is a one-tap daily ritual app. Pick one tiny habit, check in each
                morning, and watch a year fill in — one quiet square at a time.
              </p>
              <div className="hero-ctas">
                <a className="btn btn-primary" href="#pricing">Start your first ritual</a>
                <a className="btn btn-ghost" href="#how">See how it works</a>
              </div>
              <p className="hero-note">Free to start · $2.99/month for unlimited rituals · 7-day free trial</p>
            </div>
            <div className="hero-media">
              <Image
                src="/stock/ember-morning.jpg"
                alt="A warm cup of tea beside flowers in soft morning light"
                width={1200}
                height={1500}
                priority
                sizes="(max-width: 860px) 100vw, 45vw"
              />
              <div className="chip" aria-hidden="true">
                <span>Good morning — did you read one page?</span>
                <strong>Tap to keep</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section tinted" id="how">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">How it works</p>
              <h2>Three steps. No dashboard required.</h2>
              <p>
                Habit apps fail when they ask for too much. Ember asks for one habit,
                one tap, sixty seconds a day.
              </p>
            </div>
            <div className="steps">
              {steps.map((s) => (
                <article className="step" key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="year">
          <div className="wrap split">
            <div>
              <p className="eyebrow">Year in pixels</p>
              <h2>A view you&rsquo;ll want to keep filling</h2>
              <p className="body">
                Ember turns your year into a grid of small squares. Each morning you keep
                your ritual, another square lights up — the quiet proof of who you&rsquo;re
                becoming, collected in one glance.
              </p>
              <p className="body">
                It isn&rsquo;t a streak counter that shames you when it breaks. It&rsquo;s a
                record, and a record is forgiving.
              </p>
              <a className="btn btn-primary" href="#pricing">Start your first ritual</a>
            </div>
            <div className="year-demo" role="img" aria-label="Example year-in-pixels grid, mostly filled with green squares and today lit in ember">
              <p className="month-label">One page of reading · Day 218</p>
              <div className="year-grid" aria-hidden="true">
                {demoCells.map((state, i) => (
                  <span key={i} className={`cell ${state}`} />
                ))}
              </div>
              <div className="legend">
                <span>218 of 336 days kept</span>
                <span className="swatches">
                  kept <i style={{ background: "var(--accent)" }} />
                  today <i style={{ background: "var(--ember)" }} />
                  missed <i style={{ background: "var(--accent-soft)" }} />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section tinted quote-band">
          <div className="wrap">
            <blockquote>
              &ldquo;After twenty years of abandoned habit trackers, I&rsquo;ve kept a
              two-minute walk every morning for five months. Ember never made me feel
              bad about the days I missed.&rdquo;
            </blockquote>
            <cite>Mara T., kept 148 days and counting</cite>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Pricing</p>
              <h2>Free to start. Quietly priced.</h2>
              <p>Keep your first ritual free, forever. Go unlimited when Ember has earned it.</p>
            </div>
            <div className="pricing-grid">
              <article className="plan">
                <h3>Single ember</h3>
                <p className="price">Free</p>
                <ul>
                  <li>One daily ritual, forever</li>
                  <li>Year-in-pixels view</li>
                  <li>Offline first — your data stays on your device</li>
                </ul>
                <a className="btn btn-ghost" href="#pricing">Start your first ritual</a>
              </article>
              <article className="plan featured">
                <span className="flag">Most kept</span>
                <h3>Unlimited</h3>
                <p className="price">$2.99 <span>/ month</span></p>
                <ul>
                  <li>Unlimited rituals</li>
                  <li>Sync across your iPhone and iPad</li>
                  <li>Gentle streak reminders, tuned by you</li>
                  <li>Every future ember feature</li>
                </ul>
                <a className="btn btn-primary" href="#pricing">Start 7-day free trial</a>
                <p className="trial">7 days free, then $2.99/month. Cancel anytime in the App Store.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">Questions</p>
              <h2>Asked and answered</h2>
            </div>
            <div className="faq">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="final">
              <p className="eyebrow" style={{ color: "#DCE2D2" }}>A minute a day, kept</p>
              <h2>Tomorrow morning, tap once</h2>
              <p>
                Choose one small thing you&rsquo;d like to keep. Ember will hold the rest
                of it quietly for you.
              </p>
              <a className="btn btn-primary" href="#pricing">Start your first ritual</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site">
        <div className="wrap cols">
          <span>© {new Date().getFullYear()} Ember. A minute a day, kept.</span>
          <nav aria-label="Footer">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
