/**
 * What the wallet is actually asked to do when somebody buys.
 *
 * A spy wallet records every request. A real purchase must show the chain
 * check, the account request and then a transaction to sign — a simulated
 * one would show nothing but a fetch.
 */
import { chromium } from "playwright";
const [base, id] = [process.argv[2], process.argv[3]];
const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  window.__eth = [];
  window.ethereum = {
    isMetaMask: true,
    request: async (a) => {
      window.__eth.push(a.method);
      if (a.method === "eth_accounts") return [];
      if (a.method === "eth_requestAccounts") return ["0x219ED378c7910AF7245Ce31Dc4e101650dc29caf"];
      if (a.method === "eth_chainId") return "0x1237";           // 4663
      if (a.method === "wallet_switchEthereumChain") return null;
      // this is the confirmation dialog; declining it proves it was raised
      throw new Error("spy wallet: user rejected the request");
    },
    on() {}, removeListener() {},
  };
});
const page = await ctx.newPage();
const msgs = [];
page.on("console", (m) => msgs.push(m.text()));
await page.goto(`${base}/m/${id}`, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(3000);
console.log("on arrival :", (await page.evaluate(() => window.__eth)).join(", ") || "none");

const btn = page.locator("button").filter({ hasText: /Buy |Connect wallet/ }).last();
console.log("button says:", (await btn.textContent().catch(() => "?"))?.trim());
await btn.click({ timeout: 10000 }).catch((e) => console.log("click:", e.message.split("\n")[0]));
await page.waitForTimeout(6000);
console.log("after press:", (await page.evaluate(() => window.__eth)).join(", ") || "none");
const note = await page.locator("p").filter({ hasText: /wallet|cancel|reject|USDG/i }).last().textContent().catch(() => null);
if (note) console.log("page says  :", note.trim().slice(0, 140));
await browser.close();
