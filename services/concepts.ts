// services/concepts.ts
// Knowledge base for DeFi concept explanations

export const CONCEPTS: Record<string, { short: string; link?: string }> = {
  'ltv': {
    short: 'LTV (Loan-to-Value) is the ratio of your loan amount to the value of your collateral. Lower LTV means lower liquidation risk.',
    link: 'https://www.investopedia.com/terms/l/loan-to-value-ratio.asp'
  },
  'health factor': {
    short: 'Health Factor is a risk metric showing how close your position is to liquidation. Above 1 means safe, below 1 means at risk.',
    link: 'https://docs.aave.com/faq/what-is-health-factor'
  },
  'liquidation': {
    short: 'Liquidation is when your collateral is sold off to repay your debt if your position becomes too risky.',
    link: 'https://www.investopedia.com/terms/l/liquidation.asp'
  },
  'apy': {
    short: 'APY (Annual Percentage Yield) is the real rate of return earned on your deposit, taking into account the effect of compounding interest.',
    link: 'https://www.investopedia.com/terms/a/apy.asp'
  },
  'cdp': {
    short: 'A CDP (Collateralized Debt Position) lets you lock up collateral and mint stablecoins against it, as in MakerDAO.',
    link: 'https://makerdao.com/en/whitepaper/'
  },
  'stability pool': {
    short: 'A Stability Pool is a pool of stablecoins used to absorb liquidations and keep the protocol solvent.',
    link: 'https://docs.liquity.org/faq/stability-pool'
  },
  'utilization': {
    short: 'Utilization is the percentage of supplied funds that are currently borrowed in a lending pool. High utilization can mean higher rates and less liquidity.',
    link: 'https://docs.aave.com/risk/asset-risk/asset-utilization'
  },
  'collateral': {
    short: 'Collateral is an asset you pledge to secure a loan. If you fail to repay, your collateral may be liquidated.'
  },
  'borrow limit': {
    short: 'Borrow limit is the maximum amount you can borrow based on your collateral and the protocol’s LTV parameters.'
  },
};
