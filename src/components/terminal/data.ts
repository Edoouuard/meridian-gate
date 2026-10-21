/*
 * Demo data for the landing-page replica of the Meridian terminal.
 * Everything here is illustrative: the replica never touches a wallet or an API.
 */

export const icon = {
  protocol: (slug: string) => `https://icons.llamao.fi/icons/protocols/${slug}`,
  chain: (slug: string) => `https://icons.llamao.fi/icons/chains/rsz_${slug}`,
}

export type Ticker = { sym: string; price: number }

export const TICKERS: Ticker[] = [
  { sym: "BTC", price: 118420 },
  { sym: "ETH", price: 4812.4 },
  { sym: "SOL", price: 214.62 },
  { sym: "HYPE", price: 48.31 },
  { sym: "AAVE", price: 342.1 },
  { sym: "PENDLE", price: 6.84 },
  { sym: "LDO", price: 1.92 },
  { sym: "UNI", price: 11.48 },
  { sym: "MORPHO", price: 2.67 },
  { sym: "ARB", price: 0.81 },
  { sym: "OP", price: 1.74 },
]

export type Holding = { asset: string; venue: string; value: number; change: number }

export const START_HOLDINGS: Holding[] = [
  { asset: "stETH", venue: "Lido · Ethereum", value: 48210, change: 2.4 },
  { asset: "USDC", venue: "Aave v3 · Arbitrum", value: 34500, change: 0.6 },
  { asset: "PT-weETH", venue: "Pendle · Ethereum", value: 26880, change: 1.1 },
  { asset: "ETH", venue: "Wallet · Base", value: 17940, change: 1.9 },
]

export type Level = "Conservative" | "Balanced" | "Aggressive"

export type Option = {
  level: Level
  title: string
  protocol: string
  protocolIcon: string
  chain: string
  metric: { label: string; value: string }
  lines: string[]
  risk: string
  /** label of the execute button, "Execute on …" */
  venue: string
  exec: string[]
}

export type Effect = "deposit" | "stake" | "fixed" | "hedge" | "repay"

export type Scenario = {
  id: string
  title: string
  sub: string
  keywords: string[]
  thinking: string[]
  answer: string
  options: Option[]
  defaultOption: number
  effect: Effect
  amount: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: "yield",
    title: "Best yield on my stablecoins",
    sub: "Aave, Morpho, Pendle — across 8 chains, bridging only when it pays",
    keywords: ["yield", "stable", "usdc", "usdt", "dai", "idle", "earn", "apy", "interest", "deposit", "lend"],
    thinking: [
      "Reading your balances on 8 chains",
      "Fetching live rates from Aave, Morpho, Compound and Pendle",
      "Netting out bridge and gas costs for 5,000 USDC",
      "Simulating the deposit on a fork",
    ],
    answer: "Three ways to put 5,000 USDC to work, from safest to highest yield.",
    defaultOption: 1,
    effect: "deposit",
    amount: "5,000 USDC",
    options: [
      {
        level: "Conservative",
        title: "Supply on Aave v3",
        protocol: "Aave",
        protocolIcon: icon.protocol("aave"),
        chain: "Arbitrum",
        metric: { label: "APY", value: "6.7%" },
        lines: ["Stays on Arbitrum, no bridge", "Withdraw any time"],
        risk: "Lowest risk",
        venue: "Aave",
        exec: ["Approve USDC", "Supply to Aave v3"],
      },
      {
        level: "Balanced",
        title: "Morpho Steakhouse vault",
        protocol: "Morpho",
        protocolIcon: icon.protocol("morpho"),
        chain: "Base",
        metric: { label: "Net APY", value: "9.1%" },
        lines: ["Bridge via Across, $0.04 gas", "Curated vault, auto-rebalances"],
        risk: "Medium risk",
        venue: "Morpho",
        exec: ["Approve USDC", "Bridge to Base via Across", "Deposit into the vault"],
      },
      {
        level: "Aggressive",
        title: "Pendle PT-USDe",
        protocol: "Pendle",
        protocolIcon: icon.protocol("pendle"),
        chain: "Ethereum",
        metric: { label: "Fixed APY", value: "11.2%" },
        lines: ["Fixed to maturity, Mar 2027", "Exposure to the Ethena peg"],
        risk: "Higher risk",
        venue: "Pendle",
        exec: ["Swap USDC to USDe", "Buy PT-USDe"],
      },
    ],
  },
  {
    id: "stake",
    title: "Stake my ETH",
    sub: "Lido staking, optional EigenLayer restaking",
    keywords: ["stake", "staking", "lido", "restake", "eigen", "steth", "lst"],
    thinking: [
      "Found 2.0 ETH idle in your wallet on Base",
      "Comparing Lido, EigenLayer and Pendle routes",
      "Checking withdrawal queues and slashing exposure",
    ],
    answer: "Three ways to stake 2 ETH, depending on how much extra risk you want.",
    defaultOption: 0,
    effect: "stake",
    amount: "2.0 ETH",
    options: [
      {
        level: "Conservative",
        title: "Stake with Lido",
        protocol: "Lido",
        protocolIcon: icon.protocol("lido"),
        chain: "Ethereum",
        metric: { label: "APR", value: "3.2%" },
        lines: ["Receive liquid stETH", "Exit in ~2 days via the queue"],
        risk: "Lowest risk",
        venue: "Lido",
        exec: ["Bridge ETH to mainnet", "Stake with Lido"],
      },
      {
        level: "Balanced",
        title: "Lido + EigenLayer",
        protocol: "Lido",
        protocolIcon: icon.protocol("lido"),
        chain: "Ethereum",
        metric: { label: "APR", value: "3.2% + pts" },
        lines: ["Restake stETH on EigenLayer", "Adds AVS slashing risk"],
        risk: "Medium risk",
        venue: "Lido",
        exec: ["Stake with Lido", "Restake on EigenLayer"],
      },
      {
        level: "Aggressive",
        title: "Pendle YT-weETH",
        protocol: "Pendle",
        protocolIcon: icon.protocol("pendle"),
        chain: "Arbitrum",
        metric: { label: "Implied APY", value: "18.6%" },
        lines: ["Leveraged exposure to points", "Can expire worthless"],
        risk: "High risk",
        venue: "Pendle",
        exec: ["Swap ETH to weETH", "Buy YT-weETH"],
      },
    ],
  },
  {
    id: "fixed",
    title: "Lock a fixed rate",
    sub: "Pendle PT on major stablecoins, held to maturity",
    keywords: ["fixed", "lock", "pendle", "pt", "maturity", "guaranteed", "rate"],
    thinking: [
      "Scanning 14 fixed-rate pools on Pendle",
      "Comparing against Aave variable rates",
      "Checking liquidity for a 5,000 USDC entry",
    ],
    answer: "Fixed returns you can lock today, held to maturity.",
    defaultOption: 1,
    effect: "fixed",
    amount: "5,000 USDC",
    options: [
      {
        level: "Conservative",
        title: "PT-aUSDC · Jun 2027",
        protocol: "Pendle",
        protocolIcon: icon.protocol("pendle"),
        chain: "Ethereum",
        metric: { label: "Fixed APY", value: "7.6%" },
        lines: ["Underlying is Aave USDC", "+0.9% vs Aave variable"],
        risk: "Lowest risk",
        venue: "Pendle",
        exec: ["Approve USDC", "Buy PT-aUSDC"],
      },
      {
        level: "Balanced",
        title: "PT-sUSDS · Mar 2027",
        protocol: "Pendle",
        protocolIcon: icon.protocol("pendle"),
        chain: "Ethereum",
        metric: { label: "Fixed APY", value: "8.4%" },
        lines: ["Sky savings rate, locked", "+3.6% vs Aave variable"],
        risk: "Medium risk",
        venue: "Pendle",
        exec: ["Approve USDC", "Swap to USDS", "Buy PT-sUSDS"],
      },
      {
        level: "Aggressive",
        title: "PT-USDe · Mar 2027",
        protocol: "Pendle",
        protocolIcon: icon.protocol("pendle"),
        chain: "Ethereum",
        metric: { label: "Fixed APY", value: "11.2%" },
        lines: ["Highest fixed rate available", "Exposure to the Ethena peg"],
        risk: "Higher risk",
        venue: "Pendle",
        exec: ["Swap USDC to USDe", "Buy PT-USDe"],
      },
    ],
  },
  {
    id: "hedge",
    title: "Hedge my ETH downside",
    sub: "Short perps sized to your spot exposure",
    keywords: ["hedge", "short", "protect", "downside", "perp", "delta", "neutral", "crash", "bear"],
    thinking: [
      "Your net ETH exposure is +0.62 (≈ $3,000)",
      "Pricing ETH perps on Hyperliquid and Extended",
      "Sizing margin for a safe liquidation buffer",
    ],
    answer: "Ways to cut your ETH downside, sized to what you actually hold.",
    defaultOption: 1,
    effect: "hedge",
    amount: "950 USDC margin",
    options: [
      {
        level: "Conservative",
        title: "Half hedge",
        protocol: "Hyperliquid",
        protocolIcon: icon.protocol("hyperliquid"),
        chain: "HyperCore",
        metric: { label: "Net delta", value: "+0.31" },
        lines: ["Short 1.2 ETH-PERP at 3x", "Keeps some upside"],
        risk: "Lowest risk",
        venue: "Hyperliquid",
        exec: ["Deposit USDC margin", "Open short 1.2 ETH-PERP"],
      },
      {
        level: "Balanced",
        title: "Delta-neutral",
        protocol: "Hyperliquid",
        protocolIcon: icon.protocol("hyperliquid"),
        chain: "HyperCore",
        metric: { label: "Net delta", value: "−0.03" },
        lines: ["Short 2.5 ETH-PERP at 5x", "Funding 0.018% / 8h"],
        risk: "Medium risk",
        venue: "Hyperliquid",
        exec: ["Deposit USDC margin", "Open short 2.5 ETH-PERP", "Set stop-loss at $5,150"],
      },
      {
        level: "Aggressive",
        title: "Net short",
        protocol: "Hyperliquid",
        protocolIcon: icon.protocol("hyperliquid"),
        chain: "HyperCore",
        metric: { label: "Net delta", value: "−0.40" },
        lines: ["Short 4.0 ETH-PERP at 8x", "Profits if ETH falls"],
        risk: "High risk",
        venue: "Hyperliquid",
        exec: ["Deposit USDC margin", "Open short 4.0 ETH-PERP"],
      },
    ],
  },
  {
    id: "repay",
    title: "Repay to lift my health factor",
    sub: "Repay $4,200 USDC on Aave",
    keywords: ["repay", "health", "liquidation", "debt", "borrow", "deleverage"],
    thinking: [
      "Lowest health factor is 1.32 on Aave (Arbitrum)",
      "Found 4,200 USDC you can repay with",
      "Simulating the repayment",
    ],
    answer: "Repaying 4,200 USDC takes your health factor from 1.32 to 1.81.",
    defaultOption: 0,
    effect: "repay",
    amount: "4,200 USDC",
    options: [
      {
        level: "Conservative",
        title: "Repay 4,200 USDC",
        protocol: "Aave",
        protocolIcon: icon.protocol("aave"),
        chain: "Arbitrum",
        metric: { label: "Health factor", value: "1.32 → 1.81" },
        lines: ["Uses idle USDC, no swap", "Gas ≈ $0.06"],
        risk: "Reduces risk",
        venue: "Aave",
        exec: ["Approve USDC", "Repay on Aave v3"],
      },
    ],
  },
]

export type Pool = {
  protocol: string
  slug: string
  chain: string
  asset: string
  apy: number
  tvl: string
  executable: boolean
}

export const POOLS: Record<"Stablecoins" | "ETH" | "HYPE", Pool[]> = {
  Stablecoins: [
    { protocol: "Morpho", slug: "morpho", chain: "Base", asset: "USDC", apy: 9.1, tvl: "$412M", executable: true },
    { protocol: "Pendle", slug: "pendle", chain: "Ethereum", asset: "PT-sUSDS", apy: 8.4, tvl: "$188M", executable: true },
    { protocol: "Aave v3", slug: "aave", chain: "Arbitrum", asset: "USDC", apy: 6.7, tvl: "$1.2B", executable: true },
    { protocol: "Compound", slug: "compound-finance", chain: "Optimism", asset: "USDC", apy: 5.9, tvl: "$96M", executable: false },
    { protocol: "Aave v3", slug: "aave", chain: "Polygon", asset: "USDT", apy: 5.2, tvl: "$310M", executable: true },
  ],
  ETH: [
    { protocol: "Pendle", slug: "pendle", chain: "Arbitrum", asset: "PT-weETH", apy: 4.8, tvl: "$240M", executable: true },
    { protocol: "Lido", slug: "lido", chain: "Ethereum", asset: "stETH", apy: 3.2, tvl: "$24B", executable: true },
    { protocol: "Morpho", slug: "morpho", chain: "Base", asset: "WETH", apy: 2.9, tvl: "$180M", executable: true },
    { protocol: "Aave v3", slug: "aave", chain: "Ethereum", asset: "WETH", apy: 2.1, tvl: "$3.4B", executable: false },
  ],
  HYPE: [
    { protocol: "Hyperliquid", slug: "hyperliquid", chain: "HyperEVM", asset: "HYPE", apy: 2.4, tvl: "$5.1B", executable: true },
    { protocol: "Morpho", slug: "morpho", chain: "HyperEVM", asset: "kHYPE", apy: 6.3, tvl: "$72M", executable: false },
  ],
}

export const NEWS = [
  { tag: "Pendle", title: "New PT-USDe pool opens at 11.2% fixed", delta: "+$42M TVL", time: "12m" },
  { tag: "Aave", title: "Supply cap raised on the Base USDC market", delta: "+1.3% APY", time: "38m" },
  { tag: "Lido", title: "Withdrawal queue drops under 2 days", delta: "−3 days", time: "1h" },
  { tag: "Hyperliquid", title: "ETH funding flips negative for the first time this week", delta: "−0.004%", time: "2h" },
  { tag: "Morpho", title: "Steakhouse vault adds cbBTC collateral", delta: "+$18M", time: "4h" },
]

export const CHAINS = [
  { name: "Ethereum", slug: "ethereum", value: 75090 },
  { name: "Arbitrum", slug: "arbitrum", value: 34500 },
  { name: "Base", slug: "base", value: 17940 },
  { name: "Optimism", slug: "optimism", value: 0 },
  { name: "Polygon", slug: "polygon", value: 0 },
  { name: "Avalanche", slug: "avalanche", value: 0 },
  { name: "BNB Chain", slug: "binance", value: 0 },
  { name: "HyperEVM", slug: "hyperliquid", value: 0 },
]

export const ALPHA = [
  {
    title: "Fixed beats variable by 3.6%",
    body: "Pendle PT-sUSDS pays 8.4% fixed while Aave USDC sits at 4.8% variable.",
    scenario: "fixed",
  },
  {
    title: "Your ETH is unhedged",
    body: "Net delta +0.62. A 2.5 ETH short on Hyperliquid would bring it to flat.",
    scenario: "hedge",
  },
  {
    title: "2 ETH sitting idle on Base",
    body: "Staking it with Lido would earn about 0.064 ETH a year.",
    scenario: "stake",
  },
]

export function matchScenario(text: string): Scenario {
  const t = text.toLowerCase()
  let best = SCENARIOS[0]
  let bestScore = 0
  for (const s of SCENARIOS) {
    const score = s.keywords.reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0)
    if (score > bestScore) {
      best = s
      bestScore = score
    }
  }
  return best
}

export const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
