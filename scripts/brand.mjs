/**
 * Renders the brand marks and the link-preview card from the same markup the
 * site uses, so a change to the wordmark never leaves a stale bitmap behind.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const font = readFileSync("public/fonts/switzer-500.woff2").toString("base64");

const MARK = `<svg viewBox="0 0 120 72" width="__W__" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" fill="#F1F1FB" d="
    M 36 3 A 33 33 0 1 1 35.99 69 A 33 33 0 0 1 36 3 Z
    M 84 3 A 33 33 0 1 1 83.99 69 A 33 33 0 0 1 84 3 Z
    M 30.5 22 L 45.5 22 L 39 50 L 24 50 Z
    M 78.5 22 L 93.5 22 L 87 50 L 72 50 Z" />
</svg>`;

const page = (body, w, h) => `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:Switzer;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:500}
  *{margin:0;box-sizing:border-box}
  body{width:${w}px;height:${h}px;background:#06050f;color:#f7f7f7;
       font-family:Switzer,system-ui,sans-serif;display:flex;overflow:hidden}
</style>${body}`;

const b = await chromium.launch();

// square marks
for (const size of [512, 192, 96]) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.setContent(page(
    `<div style="flex:1;display:grid;place-items:center">${MARK.replace("__W__", Math.round(size * 0.62))}</div>`,
    size, size,
  ));
  await p.waitForTimeout(200);
  await p.screenshot({ path: size === 512 ? "app/icon.png" : `public/brand/mark-${size}.png` });
  await p.close();
}
const p512 = await b.newPage({ viewport: { width: 512, height: 512 } });
await p512.setContent(page(`<div style="flex:1;display:grid;place-items:center">${MARK.replace("__W__", 318)}</div>`, 512, 512));
await p512.waitForTimeout(200);
await p512.screenshot({ path: "public/brand/mark-512.png" });
await p512.close();

// link preview
const og = await b.newPage({ viewport: { width: 1200, height: 400 } });
await og.setContent(page(`
  <div style="flex:1;position:relative;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;
              background:radial-gradient(120% 130% at 78% 0%, rgba(96,106,247,.42) 0%, rgba(6,5,15,0) 62%)">
    <div style="display:flex;align-items:center;gap:14px">
      ${MARK.replace("__W__", 46)}
      <span style="font-size:42px;font-weight:500;letter-spacing:-.06em">fomo</span>
      <span style="font-size:15px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#9da4ff;
                   border:1px solid rgba(96,106,247,.4);background:rgba(96,106,247,.16);padding:5px 11px;border-radius:8px">market</span>
    </div>
    <div>
      <div style="font-size:64px;font-weight:500;letter-spacing:-.05em;line-height:1.02">where traders become<br>the underlying.</div>
      <div style="margin-top:18px;font-size:23px;color:#9997ab;letter-spacing:-.01em">
        Binary options on a fomo account&rsquo;s PnL &middot; settled in USDG
      </div>
    </div>
  </div>`, 1200, 400));
await og.waitForTimeout(250);
await og.screenshot({ path: "public/brand/og.jpg", type: "jpeg", quality: 92 });
await og.close();

await b.close();
console.log("brand assets written");
