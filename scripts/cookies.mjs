import { chromium } from "playwright";
import { homedir } from "node:os";
import { join } from "node:path";
const ctx = await chromium.launchPersistentContext(
  process.env.KEEPER_PROFILE ?? join(homedir(), ".fomomarket-keeper-profile"),
  { headless: true });
const cookies = (await ctx.cookies()).filter(c => /fomo|cloudflare|cf_/.test(c.domain + c.name));
console.log(JSON.stringify(cookies.map(c => ({ n: c.name, d: c.domain, v: c.value }))));
await ctx.close();
