"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Mark from "./Mark";
import { useWallet } from "./WalletButton";
import WalletMenu from "./WalletMenu";
import ContractAddress from "./ContractAddress";

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
          <Mark size={24} />
          {/* same lockup as the hero, only smaller: the accent carries "market" */}
          <span className="wordmark" style={{ fontSize: "1.375rem", display: "flex", gap: ".22em" }}>
            <span>fomo</span>
            <span style={{ color: "var(--accent)" }}>market</span>
          </span>
        </Link>

        {/* the account this is run from — empty until there is one to point at */}
        <a
          href="https://x.com/usefomo_market"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="fomo market on X"
          style={{
            display: "grid", placeItems: "center", width: 32, height: 32,
            borderRadius: "var(--r-md)", color: "var(--fg-muted)", flexShrink: 0,
            marginLeft: -2,
            transition: "background var(--dur-micro) var(--ease-ui), color var(--dur-micro) var(--ease-ui)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "var(--fg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-muted)"; }}
        >
          <XIcon />
        </a>

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
          <span className="nav-ca"><ContractAddress /></span>

          {/* The balance only appears once there is a wallet in play, and it
              is a menu rather than a label: switching accounts and dropping
              one are the only two things anybody wants from it. */}
          <WalletMenu wallet={wallet} />

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
        @media (max-width: 760px){ .nav-ca{display:none !important} }
      `}</style>
    </header>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.11z" />
    </svg>
  );
}
