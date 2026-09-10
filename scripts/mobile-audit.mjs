/**
 * Page width at 390px, without mobile emulation's shrink-to-fit — which
 * hides the problem by zooming the whole page out until it fits, and is
 * exactly why everything looked tiny rather than broken.
 */
import { chromium } from "playwright";
const base = process.argv[2] ?? "https://fomomarket.trade";
const out = process.argv[3] ?? "/tmp";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
for (const path of ["/", "/discover", "/leaderboard", "/portfolio", "/docs", "/m/1"]) {
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "networkidle", timeout: 120000 }).catch(() => {});
  await p.evaluate(async () => { for (let y = 0; y < 4000; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(900);
  const m = await p.evaluate(() => {
    const W = window.innerWidth;
    const wide = [...document.querySelectorAll("*")]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ el, r }) => r.width > W + 2 && getComputedStyle(el).overflowX !== "auto" && getComputedStyle(el).overflowX !== "scroll")
      .filter(({ el }) => !el.closest("[style*='overflow-x: auto'],[style*='overflowX']"))
      .slice(0, 8)
      .map(({ el, r }) => `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).trim().split(/\s+/)[0] : ""} ${Math.round(r.width)}px "${(el.textContent || "").trim().slice(0, 28)}"`);
    return { scrollW: document.documentElement.scrollWidth, W, wide };
  });
  console.log(`${path.padEnd(12)} scrollWidth ${m.scrollW} при ${m.W}${m.scrollW > m.W + 2 ? "  ← вылезает" : "  ok"}`);
  for (const w of m.wide) console.log(`               ${w}`);
  await p.screenshot({ path: `${out}/m${path.replace(/\W/g, "_")}.png` });
  await p.close();
}
await b.close();
