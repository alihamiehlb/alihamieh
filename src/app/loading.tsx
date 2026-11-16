export default function Loading() {
  return (
    <main className="portfolio-shell loading-shell" aria-busy="true" aria-label="Loading portfolio">
      <div className="loading-glow loading-glow-one" />
      <div className="loading-glow loading-glow-two" />
      <nav className="loading-nav" aria-hidden="true">
        <span className="skeleton loading-brand" />
        <div>{Array.from({ length: 5 }, (_, i) => <span className="skeleton loading-nav-link" key={i} />)}</div>
      </nav>
      <section className="loading-hero" aria-hidden="true">
        <div className="loading-copy">
          <span className="skeleton loading-eyebrow" />
          <span className="skeleton loading-title" />
          <span className="skeleton loading-role" />
          <span className="skeleton loading-line loading-line-wide" />
          <span className="skeleton loading-line loading-line-short" />
          <div className="loading-actions"><span className="skeleton loading-button" /><span className="skeleton loading-button loading-button-muted" /></div>
        </div>
        <div className="loading-portrait"><div className="loading-portrait-inner"><span className="loading-orbit" /><span className="loading-monogram">AH</span></div></div>
      </section>
      <div className="loading-footer" aria-hidden="true"><span /> Preparing the portfolio <i /></div>
    </main>
  );
}
