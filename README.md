# fomo market

Binary options written on a fomo account's cumulative PnL. Same engine as
Trace.market — keeper, AMM, snapshot settlement, USDG on Robinhood Chain —
wearing the fomo app's own shell: the `#06050F` ground, the periwinkle
`#606AF7`, Switzer standing in for Aeonik, and the rail / board / ticket
layout the desktop app uses.

    npm run dev        # localhost:3081
    npm run keeper     # headed Playwright reader for prod-api.fomo.family
    node scripts/brand.mjs   # regenerate the marks and the link-preview card

Design system lives in `app/globals.css`; nothing outside it hard-codes a
colour. Dark only — fomo has no light mode, so neither does this.

Not affiliated with, or endorsed by, fomo.
