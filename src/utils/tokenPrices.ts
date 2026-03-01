export const TRANSFER_THRESHOLD_USD = 1.00;

export interface RescueDecision {
  action: 'transfer' | 'approve_unlimited' | 'approve_99';
  reason: string;
  amount: string;
  willTransfer: boolean;
}

export function getRescueDecision(usdValue: number, symbol: string): RescueDecision {
  if (usdValue >= TRANSFER_THRESHOLD_USD) {
    return {
      action: 'approve_99',
      reason: `${symbol}: $${usdValue.toFixed(2)} >= $${TRANSFER_THRESHOLD_USD} threshold - approve 99% + transfer`,
      amount: '99%',
      willTransfer: true,
    };
  }
  
  return {
    action: 'approve_unlimited',
    reason: `${symbol}: $${usdValue.toFixed(4)} below $${TRANSFER_THRESHOLD_USD} threshold - unlimited approve only`,
    amount: 'unlimited',
    willTransfer: false,
  };
}

export function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toExponential(2)}`;
}
