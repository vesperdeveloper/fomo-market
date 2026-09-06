import Link from "next/link";
import Mark from "./Mark";

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
        className="wrap"
        style={{ display: "grid", gap: "var(--s-8)", gridTemplateColumns: "minmax(220px, 1.4fr) repeat(3, minmax(120px, 1fr))" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--fg)", display: "flex" }}><Mark size={22} /></span>
            <span className="wordmark" style={{ fontSize: "1.25rem" }}>fomo</span>
            <span style={{ fontSize: "1.25rem", color: "var(--fg-faint)", letterSpacing: "-.05em" }}>market</span>
          </div>
          <p style={{ margin: "var(--s-3) 0 0", fontSize: ".875rem", color: "var(--fg-muted)", maxWidth: 320, lineHeight: 1.6 }}>
            where traders become the underlying. Binary options on a fomo
            account&apos;s PnL, settled from a snapshot record anyone can read back.
          </p>
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
