import { chromium } from "playwright";
import { homedir } from "node:os";
import { join } from "node:path";
const PROFILE = process.env.KEEPER_PROFILE ?? join(homedir(), ".fomomarket-keeper-profile");
const ctx = await chromium.launchPersistentContext(PROFILE, { headless: true });
const p = ctx.pages()[0] ?? await ctx.newPage();
await p.goto("https://fomo.family/", { waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
await p.waitForTimeout(3000);
const o = await p.evaluate(() => ({
  refresh: JSON.parse(localStorage.getItem("privy:refresh_token") || "null"),
  caid: JSON.parse(localStorage.getItem("privy:caid") || "null"),
}));
console.log(JSON.stringify(o));
await ctx.close();
