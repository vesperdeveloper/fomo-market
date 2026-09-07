/** The other half: pressing the stake button must be what asks for a wallet. */
import { chromium } from "playwright";
const [base, id] = [process.argv[2], process.argv[3]];
const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
  window.__ethCalls = [];
  window.ethereum = {
    isMetaMask: true,
    request: async ({ method }) => {
      window.__ethCalls.push(method);
      if (method === "eth_accounts") return [];
      if (method === "eth_chainId") return "0x1237";
      throw new Error("spy wallet: the user declined");
    },
    on() {}, removeListener() {},
  };
});
const page = await ctx.newPage();
await page.goto(`${base}/m/${id}`, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(2500);
console.log("on arrival        :", (await page.evaluate(() => window.__ethCalls)).join(", ") || "none");

const btn = page.locator("button", { hasText: /Connect wallet|Buy |Enter an amount/ }).last();
const label = (await btn.textContent().catch(() => "")) ?? "";
await btn.click({ timeout: 8000 }).catch((e) => console.log("click failed:", e.message.split("\n")[0]));
await page.waitForTimeout(2500);
console.log(`after pressing "${label.trim()}":`, (await page.evaluate(() => window.__ethCalls)).join(", ") || "none");
await browser.close();
