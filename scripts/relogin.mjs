#!/usr/bin/env node
/**
 * Sign the reader in, and say so out loud.
 *
 * The old flow asked you to sign in and then press Enter, which fails
 * silently in two ways nobody can see: signing in in a different window, or
 * closing the browser before the session is flushed to disk. Both happened.
 *
 * This one watches the profile's own storage instead of trusting a keypress.
 * It prints what it sees every few seconds, saves the moment a session
 * appears, and checks the token against fomo's API before claiming success —
 * so "signed in" means the reader can actually read.
 *
 *   node scripts/relogin.mjs
 */
import { chromium } from "playwright";
import { homedir } from "node:os";
import { join } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const PROFILE = process.env.KEEPER_PROFILE ?? join(homedir(), ".fomomarket-keeper-profile");
const APP_ID = "cm6h485o300n3zj9yl6vpedq7";
const WAIT_MS = 6 * 60 * 1000;

const ctx = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  viewport: { width: 1360, height: 940 },
});
const page = ctx.pages()[0] ?? (await ctx.newPage());

console.log("\nОткрываю fomo.family в отдельном профиле.");
console.log("Войди ИМЕННО В ЭТОМ окне — вход в обычном Chrome сюда не переносится.");
console.log("Закрывать окно не надо: я сам поймаю сессию и всё закрою.\n");

await page.goto("https://fomo.family/", { waitUntil: "domcontentloaded", timeout: 90_000 }).catch(() => {});

const read = () =>
  page
    .evaluate(() => ({
      refresh: JSON.parse(localStorage.getItem("privy:refresh_token") || "null"),
      caid: JSON.parse(localStorage.getItem("privy:caid") || "null"),
    }))
    .catch(() => ({ refresh: null, caid: null }));

let session = null;
const started = Date.now();
let said = 0;

while (Date.now() - started < WAIT_MS) {
  const got = await read();
  if (got.refresh) { session = got; break; }
  if (Date.now() - started > said * 15_000) {
    said++;
    process.stdout.write(`  жду входа… ${Math.round((Date.now() - started) / 1000)}с\n`);
  }
  await page.waitForTimeout(3000);
}

if (!session) {
  console.log("\nСессия так и не появилась. Проверь, что входил в окне, которое открыл этот скрипт.");
  await ctx.close();
  process.exit(2);
}

console.log(`\nСессия поймана (refresh ${session.refresh.length} симв).`);

/* --------------------------------------------------- does it actually read? */

const headers = {
  "privy-app-id": APP_ID,
  "content-type": "application/json",
  origin: "https://fomo.family",
  referer: "https://fomo.family/",
  "privy-client": "react-auth:2.13.4",
  ...(session.caid ? { "privy-ca-id": session.caid } : {}),
};

const privy = await fetch("https://auth.privy.io/api/v1/sessions", {
  method: "POST",
  headers,
  body: JSON.stringify({ refresh_token: session.refresh }),
}).then((r) => r.json()).catch(() => null);

if (!privy?.token) {
  console.log("Privy не отдал токен — сессия есть, но неполная.");
  await ctx.close();
  process.exit(3);
}

// The API check runs inside the browser: fomo fingerprints the TLS
// handshake, and node's fetch does not look like a browser to it.
const check = await page.evaluate(async (token) => {
  const r = await fetch("https://prod-api.fomo.family/v2/leaderboard", {
    headers: {
      authorization: `Bearer ${token}`,
      "app-language": "en",
      "x-supported-chains": "1,56,143,4663,8453,1399811149",
      "content-type": "application/json",
    },
  });
  let rows = 0;
  try { rows = (await r.clone().json())?.responseObject?.leaderboard?.length ?? 0; } catch {}
  return { status: r.status, rows };
}, privy.token);

console.log(`Проверка API: ${check.status}${check.rows ? `, строк лидерборда: ${check.rows}` : ""}`);

/* ------------------------------------------------------------- write it down */

const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  let env = readFileSync(envPath, "utf8");
  const set = (k, v) =>
    (env = env.match(new RegExp(`^${k}=.*$`, "m"))
      ? env.replace(new RegExp(`^${k}=.*$`, "m"), `${k}=${v}`)
      : env.replace(/\s*$/, `\n${k}=${v}\n`));
  set("PRIVY_REFRESH_TOKEN", session.refresh);
  if (session.caid) set("PRIVY_CA_ID", session.caid);
  writeFileSync(envPath, env);
  console.log("Записал в .env.local");
}

console.log(
  check.status === 200
    ? "\nГотово — доступ есть. Осталось обновить секрет в GitHub и перезапустить реле."
    : `\nСессия свежая, но API отвечает ${check.status}. Значит блокировка на аккаунте, а не на сессии.`,
);

await ctx.close();
