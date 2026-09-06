"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Mark from "./Mark";
import { useWallet } from "./WalletButton";
import { short } from "@/lib/wallet";

const LINKS = [
  ["/discover", "Markets"],
  ["/leaderboard", "Leaderboard"],
  ["/portfolio", "Portfolio"],
  ["/docs", "Docs"],
];

export default function Nav() {
  const path = usePathname();
  const [solid, setSolid] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50, height: "var(--nav-h)",
        background: solid ? "rgba(6,5,15,.78)" : "transparent",
        backdropFilter: solid ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: solid ? "blur(16px) saturate(140%)" : "none",
        borderBottom: `1px solid ${solid ? "var(--border-subtle)" : "transparent"}`,
        transition: "background var(--dur-state) var(--ease-ui), border-color var(--dur-state) var(--ease-ui)",
      }}
    >
      <div className="wrap-wide" style={{ height: "100%", display: "flex", alignItems: "center", gap: "var(--s-6)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <span style={{ color: "var(--fg)", display: "flex" }}><Mark size={26} /></span>
          <span className="wordmark" style={{ fontSize: "1.375rem" }}>fomo</span>
          <span
            style={{
              padding: "2px 7px", borderRadius: 6, fontSize: ".625rem", fontWeight: 600,
              letterSpacing: ".1em", textTransform: "uppercase",
              background: "var(--accent-quiet)", color: "var(--accent-hover)",
              border: "1px solid rgba(96,106,247,.25)", marginTop: 1,
            }}
          >
            market
          </span>
        </Link>

        {/* the app's own tab row — active tab is white with a periwinkle
            underline, exactly where fomo puts Tokens / Feed / Leaderboard */}
        <nav className="nav-links" style={{ display: "flex", gap: "var(--s-5)", alignItems: "center", height: "100%" }}>
          {LINKS.map(([href, label]) => {
            const active = path === href || path.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                style={{
                  position: "relative", height: "100%", display: "flex", alignItems: "center",
                  fontSize: ".9375rem", fontWeight: 500,
                  color: active ? "var(--fg)" : "var(--fg-muted)",
                  transition: "color var(--dur-micro) var(--ease-ui)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = active ? "var(--fg)" : "var(--fg-muted)")}
              >
                {label}
                {active && (
                  <i
                    style={{
                      position: "absolute", left: 0, right: 0, bottom: -1, height: 2,
                      background: "var(--accent)", borderRadius: 2,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
          {/* fomo's cash-balance pill: label over value, hairline box */}
          {wallet.address ? (
            <span
              title={wallet.address}
              style={{
                display: "flex", flexDirection: "column", lineHeight: 1.2,
                padding: "5px 12px", borderRadius: "var(--r-md)",
                background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
              }}
            >
              <span className="num" style={{ fontSize: ".875rem", fontWeight: 600 }}>
                {wallet.balance == null ? "—" : `$${wallet.balance.toFixed(2)}`}
              </span>
              <span style={{ fontSize: ".625rem", color: "var(--fg-faint)" }}>{short(wallet.address)}</span>
            </span>
          ) : (
            <button
              onClick={() => { void wallet.connectWallet(); }}
              disabled={wallet.connecting}
              className="nav-connect"
              style={{
                padding: "8px 14px", borderRadius: "var(--r-md)", cursor: "pointer",
                background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
                color: "var(--fg)", fontSize: ".875rem", fontWeight: 500,
              }}
            >
              {wallet.connecting ? "Connecting…" : "Connect"}
            </button>
          )}

          <Link
            href="/discover"
            style={{
              padding: "9px 18px", borderRadius: "var(--r-md)", background: "var(--accent)",
              color: "var(--accent-contrast)", fontWeight: 500, fontSize: ".9375rem",
              boxShadow: "var(--shadow-accent)",
              transition: "background var(--dur-micro) var(--ease-ui)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            Start trading
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 1040px){ .nav-links{display:none !important} }
        @media (max-width: 560px){ .nav-connect{display:none !important} }
      `}</style>
    </header>
  );
}
