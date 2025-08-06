// services/intentParser.ts
// Simple rule-based intent parser for DeFi actions

export interface Intent {
  type: string;
  params: Record<string, any>;
}

// Example: "Open a CDP with 2 ETH"
export function parseIntent(input: string): Intent | null {
  const lower = input.toLowerCase();

  // Open CDP
  let match = lower.match(/open (a )?cdp (with|using)? ([\d.]+) ([a-zA-Z]+)/);
  if (match) {
    return {
      type: 'open_cdp',
      params: { amount: parseFloat(match[3]), token: match[4].toUpperCase() }
    };
  }

  // Supply to lending pool (with or without 'to the lending pool')
  match = lower.match(/supply ([\d.]+) ([a-zA-Z]+)( to (the )?lending pool)?/);
  if (match) {
    return {
      type: 'supply_lending',
      params: { amount: parseFloat(match[1]), token: match[2].toUpperCase() }
    };
  }

  // Borrow from lending pool
  match = lower.match(/borrow ([\d.]+) ([a-zA-Z]+) from (the )?lending pool/);
  if (match) {
    return {
      type: 'borrow_lending',
      params: { amount: parseFloat(match[1]), token: match[2].toUpperCase() }
    };
  }

  // Deposit to stability pool
  match = lower.match(/deposit ([\d.]+) ([a-zA-Z]+) to (the )?stability pool/);
  if (match) {
    return {
      type: 'deposit_stability',
      params: { amount: parseFloat(match[1]), token: match[2].toUpperCase() }
    };
  }

  // Portfolio summary
  if (/summarize (my )?(portfolio|positions)/.test(lower) || /portfolio health/.test(lower)) {
    return { type: 'portfolio_summary', params: {} };
  }

  // Optimization suggestion
  if (/suggest (an )?optimization/.test(lower) || /how can i (optimize|improve)/.test(lower)) {
    return { type: 'optimization_suggestion', params: {} };
  }

  // Concept explanation
  match = lower.match(/explain (what is |the concept of )?([a-zA-Z ]+)/);
  if (match) {
    return { type: 'explain_concept', params: { concept: match[2].trim() } };
  }

  return null;
}
