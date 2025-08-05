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

  // Supply to lending pool
  match = lower.match(/supply ([\d.]+) ([a-zA-Z]+) to (the )?lending pool/);
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

  return null;
}
