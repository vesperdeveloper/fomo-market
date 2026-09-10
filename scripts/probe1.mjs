import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
for (const path of ["/", "/m/1"]) {
  const p = await ctx.newPage();
  await p.goto("https://fomomarket.trade" + path, { waitUntil: "networkidle", timeout: 120000 });
  await p.waitForTimeout(1500);
  const chain = await p.evaluate(() => {
    const W = window.innerWidth;
    // the deepest element that is too wide but whose parent is not
    const all = [...document.querySelectorAll("*")];
    const bad = all.filter((el) => el.getBoundingClientRect().width > W + 2);
    const roots = bad.filter((el) => !el.parentElement || el.parentElement.getBoundingClientRect().width <= W + 2);
    return roots.slice(0, 5).map((el) => {
      const cs = getComputedStyle(el);
      const parent = el.parentElement;
      return {
        tag: el.tagName.toLowerCase() + (el.className ? "." + String(el.className).trim().split(/\s+/)[0] : ""),
        w: Math.round(el.getBoundingClientRect().width),
        minW: cs.minWidth, display: cs.display, cols: cs.gridTemplateColumns?.slice(0, 60),
        overflowX: cs.overflowX,
        parent: parent ? parent.tagName.toLowerCase() + (parent.className ? "." + String(parent.className).trim().split(/\s+/)[0] : "") : "-",
        parentCols: parent ? getComputedStyle(parent).gridTemplateColumns?.slice(0, 60) : "-",
        text: (el.textContent || "").trim().slice(0, 40),
      };
    });
  });
  console.log(`\n${path}`);
  for (const c of chain) console.log("  ", JSON.stringify(c));
  await p.close();
}
await b.close();
