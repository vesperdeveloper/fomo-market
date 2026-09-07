# fomo market

Binary options written on a fomo account's cumulative PnL. Same engine as
Trace.market — keeper, AMM, snapshot settlement, USDG on Robinhood Chain —
wearing the fomo app's own shell: the `#06050F` ground, the periwinkle
`#606AF7`, Switzer standing in for Aeonik, and the rail / board / ticket
layout the desktop app uses.

    npm run dev        # localhost:3081
    npm run keeper     # headed Playwright reader for prod-api.fomo.family
    node scripts/brand.mjs   # regenerate the marks and the link-preview card

## What is running where

- site — https://fomomarket.trade (`fomo-market` on Vercel)
- sibling front end — https://terminal.fomomarket.trade, same book and same
  database, a different design language
- reader — GitHub Actions, `.github/workflows/keeper.yml`, every 5 minutes.
  It runs `keeper/read.py` on GitHub's machines, not on anybody's laptop.
- book — `contracts/FomoMarket.sol`, one parimutuel contract holding every
  stake. `node scripts/test-contract.mjs` exercises it against a local EVM
  (`npx hardhat node` in another shell).

## Going live

Everything above runs today except the contract, which needs gas:

    # 1. fund the oracle — this is the only manual step
    #    testnet: https://faucet.testnet.chain.robinhood.com
    #    mainnet: send ~0.01 ETH on Robinhood Chain
    #    to 0xC494168783b65a48679d7cbFae8e6B4C3E0ec2Fb

    # 2. one command deploys it and points both sites at it
    CHAIN=testnet ./scripts/go-live.sh
    CHAIN=mainnet ./scripts/go-live.sh

Until then both sites read as pre-launch: the record is live and published,
the book is not open, and there is nothing on either site that could take
somebody's money.

Design system lives in `app/globals.css`; nothing outside it hard-codes a
colour. Dark only — fomo has no light mode, so neither does this.

Not affiliated with, or endorsed by, fomo.
