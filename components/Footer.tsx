import Link from "next/link";
import Mark from "./Mark";
import ContractAddress from "./ContractAddress";

const COLS: [string, [string, string][]][] = [
  ["Market", [["/discover", "Markets"], ["/leaderboard", "Leaderboard"], ["/portfolio", "Portfolio"]]],
  ["Protocol", [["/docs#underlying", "The underlying"], ["/docs#resolution", "Snapshots"], ["/docs#void", "Voids"], ["/docs#params", "Parameters"]]],
  ["Traders", [["/docs#traders", "Claim a handle"], ["/docs#traders", "Opt out"]]],
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface-sunken)",
        marginTop: "var(--section-y)",
        padding: "var(--s-16) 0 var(--s-10)",
      }}
    >
      <div
        className="wrap footer-grid"
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mark size={22} />
            <span className="wordmark" style={{ fontSize: "1.25rem", display: "flex", gap: ".22em" }}>
              <span>fomo</span>
              <span style={{ color: "var(--accent)" }}>market</span>
            </span>
          </div>
          <p style={{ margin: "var(--s-3) 0 0", fontSize: ".875rem", color: "var(--fg-muted)", maxWidth: 320, lineHeight: 1.6 }}>
            where traders become the underlying. Up or down on a fomo account&apos;s
            PnL, staked and settled in one contract anyone can read back.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
            <a
              href="https://x.com/usefomo_market"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="fomo market on X"
              style={{
                display: "grid", placeItems: "center", width: 34, height: 34,
                borderRadius: "var(--r-md)", border: "1px solid var(--border-subtle)",
                background: "var(--surface-raised)", color: "var(--fg-muted)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z" />
              </svg>
            </a>
            <ContractAddress />
          </div>
        </div>
        {COLS.map(([title, links]) => (
          <div key={title}>
            <div className="eyebrow" style={{ marginBottom: "var(--s-3)" }}>{title}</div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--s-2)" }}>
              {links.map(([href, label]) => (
                <li key={label}>
                  <Link href={href} style={{ fontSize: ".875rem", color: "var(--fg-muted)" }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="wrap"
        style={{
          marginTop: "var(--s-12)", paddingTop: "var(--s-6)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex", flexWrap: "wrap", gap: "var(--s-4)",
          justifyContent: "space-between", fontSize: ".8125rem", color: "var(--fg-faint)",
        }}
      >
        <span>Positions carry risk of total loss. Nothing here is investment advice.</span>
        <span>An independent market. Not affiliated with, or endorsed by, fomo.</span>
      </div>
    </footer>
  );
}
