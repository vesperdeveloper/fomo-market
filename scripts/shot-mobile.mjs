import { chromium } from "playwright";
const [,, path, out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1" });
await p.goto("http://localhost:3081" + path, { waitUntil: "networkidle", timeout: 180000 });
await p.evaluate(async () => { for (let y = 0; y < 3000; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
await p.waitForTimeout(900);
await p.screenshot({ path: out });
await b.close();
