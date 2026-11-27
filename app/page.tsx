import Image from "next/image";

// A fictional month for the public reading example. The app uses the user's local dates.
const sampleCheckins = new Set([1, 2, 4, 6, 7, 8, 9, 12, 13, 14, 17, 18, 20, 21, 24]);
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

const steps = [
  {
    title: "Pick one tiny habit",
    body: "Read one page. Water the basil. Pick something small enough to repeat on an ordinary Tuesday.",
  },
  {
    title: "Tap once each morning",
    body: "When you finish, tap the flame. Your check-in stays on this device, even when you’re offline.",
  },
  {
    title: "Watch your year fill in",
    body: "Each day has its own square. A missed day leaves a space beside the days you kept.",
  },
];

const faqs = [
  {
    q: "What counts as a ritual?",
    a: "Anything you can do in a couple of minutes and repeat most days: stretching while the kettle boils, writing one sentence, stepping outside. Ember works best when you keep it to one.",
  },
  {
    q: "What happens if I miss a day?",
    a: "The square stays blank. Your past check-ins stay in the year view, and you can tap again tomorrow.",
  },
  {
    q: "Is my data private?",
    a: "Your check-ins live on your device. We don't sell data and we don't run ads. Sync is planned for Ember Unlimited.",
  },
  {
    q: "What is included for free?",
    a: "You can keep one ritual on your device for free. A paid plan for multiple rituals, sync and reminders is planned for the App Store release.",
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

        <section className="journal" id="how" aria-labelledby="how-title">
          <div className="wrap journal-spread">
            <div>
              <h2 id="how-title">How to keep a ritual</h2>
              <p className="margin-note">A morning’s worth of practice.</p>
            </div>
            <ol className="steps">
              {steps.map((step) => (
                <li key={step.title}><h3>{step.title}</h3><p>{step.body}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="almanac" id="year" aria-labelledby="year-title">
          <div className="wrap journal-spread">
            <div>
              <h2 id="year-title">A year in pixels</h2>
              <p>Look back on the days you read a page, took the walk or wrote a sentence. Each square holds one day.</p>
            </div>
            <figure className="month">
              <figcaption><span>June 2026</span><small>Illustrated month</small></figcaption>
              <div className="calendar" aria-hidden="true">
                {weekdays.map((label, index) => <b key={index}>{label}</b>)}
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <span key={day} className={sampleCheckins.has(day) ? "kept" : ""}>{day}</span>
                ))}
              </div>
              <p>One page of reading <strong>{sampleCheckins.size} days kept</strong></p>
            </figure>
          </div>
        </section>

        <section className="journal" id="pricing" aria-labelledby="pricing-title">
          <div className="wrap journal-spread">
            <h2 id="pricing-title">Rituals &amp; pricing</h2>
            <dl className="plans">
              <div><dt>One ritual <strong>Free</strong></dt>
              <dd>Keep one daily ritual and see your year in pixels. Check-ins are stored on this device.</dd></div>
              <div><dt>Unlimited <strong>$2.99 / month</strong></dt>
              <dd>Planned for the App Store release, with a seven-day trial. Multiple rituals, device sync and reminders are in development.</dd></div>
            </dl>
          </div>
        </section>

        <section className="journal faq-section" id="faq" aria-labelledby="faq-title">
          <div className="wrap journal-spread">
            <h2 id="faq-title">Questions</h2>
            <div className="faq">
              {faqs.map((f) => (
                <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
              ))}
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
