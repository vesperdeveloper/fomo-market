/**
 * The wallet menu, with an account already in play.
 *
 * A spy wallet reports an authorised account so the site resumes it quietly,
 * then the menu is opened and its two actions are pressed — the point is to
 * see what each one asks the wallet for.
 */
import { chromium } from "playwright";
const base = process.argv[2] ?? "http://localhost:3081";
const ACCOUNT = "0x219ED378c7910AF7245Ce31Dc4e101650dc29caf";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript((acct) => {
  localStorage.setItem("fomomarket.wallet.seen", "1");
  window.__eth = [];
  window.ethereum = {
    isMetaMask: true,
    request: async (a) => {
      window.__eth.push(a.method);
      if (a.method === "eth_accounts" || a.method === "eth_requestAccounts") return [acct];
      if (a.method === "eth_chainId") return "0x1237";
      if (a.method === "wallet_requestPermissions") return [{ parentCapability: "eth_accounts" }];
      if (a.method === "wallet_revokePermissions") return null;
      return null;
    },
    on() {}, removeListener() {},
  };
}, ACCOUNT);

const page = await ctx.newPage();
await page.goto(base + "/discover", { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(3000);
console.log("resumed quietly with:", (await page.evaluate(() => window.__eth)).join(", ") || "nothing");

await page.locator("header button[aria-haspopup=\"menu\"]").click({ timeout: 8000 });
await page.waitForTimeout(700);
await page.screenshot({ path: process.argv[3] ?? "out-menu.png", clip: { x: 900, y: 0, width: 540, height: 330 } });

await page.evaluate(() => (window.__eth = []));
await page.locator('button[role="menuitem"]', { hasText: "Switch wallet" }).click();
await page.waitForTimeout(1200);
console.log('"Switch wallet" asked for:', (await page.evaluate(() => window.__eth)).join(", ") || "nothing");

await page.locator("header button[aria-haspopup=\"menu\"]").click();
await page.waitForTimeout(500);
await page.evaluate(() => (window.__eth = []));
await page.locator('button[role="menuitem"]', { hasText: "Disconnect" }).click();
await page.waitForTimeout(1200);
console.log('"Disconnect" asked for:', (await page.evaluate(() => window.__eth)).join(", ") || "nothing");
console.log("menu still on screen after disconnect:",
  await page.locator("header button[aria-haspopup=\"menu\"]").count() > 0);
await browser.close();
