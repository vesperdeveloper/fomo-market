#!/usr/bin/env bash
# Put the contract on chain and point both front ends at it.
#
#   CHAIN=testnet ./scripts/go-live.sh     # play money, needs faucet ETH
#   CHAIN=mainnet ./scripts/go-live.sh     # real USDG, needs real ETH
#
# The one thing this cannot do for you is fund the oracle. Deploying costs
# well under 0.01 ETH and every market opened or settled after that costs a
# little more, so the address below has to hold some before this will run.
set -euo pipefail
cd "$(dirname "$0")/.."

CHAIN="${CHAIN:-mainnet}"
SCOPE=qumm
PROJECTS=(fomo-market fomo-market-terminal)
export VERCEL_TOKEN="${VERCEL_TOKEN:-$(grep -o '"[^"]*"' ~/.config/vercel.env | tr -d '"')}"

echo "==> compiling"
node scripts/compile.mjs

echo "==> deploying to $CHAIN"
CHAIN="$CHAIN" node scripts/deploy-contract.mjs

CHAIN_ID=$(grep '^NEXT_PUBLIC_CHAIN_ID=' .env.local | cut -d= -f2-)
USDG=$(grep '^NEXT_PUBLIC_USDG=' .env.local | cut -d= -f2-)
MARKET=$(grep '^NEXT_PUBLIC_MARKET_ADDRESS=' .env.local | cut -d= -f2-)

for p in "${PROJECTS[@]}"; do
  echo "==> $p"
  for kv in "NEXT_PUBLIC_CHAIN_ID=$CHAIN_ID" "NEXT_PUBLIC_USDG=$USDG" "NEXT_PUBLIC_MARKET_ADDRESS=$MARKET"; do
    printf '%s' "${kv#*=}" | npx --yes vercel@latest env add "${kv%%=*}" production \
      --force --scope "$SCOPE" --token "$VERCEL_TOKEN" >/dev/null
    echo "    set ${kv%%=*}"
  done
done

echo "==> redeploying"
for p in "${PROJECTS[@]}"; do
  dir=$([ "$p" = fomo-market ] && echo . || echo ../fomo-market-terminal)
  (cd "$dir" && npx --yes vercel@latest deploy --prod --yes --scope "$SCOPE" --token "$VERCEL_TOKEN" >/dev/null)
  echo "    $p redeployed"
done

echo "==> opening the first markets"
curl -s -H "authorization: Bearer $(cat .keeper-secret)" https://fomo-market.vercel.app/api/oracle
echo
