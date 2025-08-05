
import React from 'react';
import { TOKENS } from '../../constants';
import { UserBalance } from '../../types';

interface WalletAllocationChartProps {
    balances: UserBalance[];
}

const COLORS = ['#3498db', '#e74c3c', '#9b59b6', '#2ecc71', '#f1c40f', '#1abc9c', '#34495e', '#e67e22'];

const WalletAllocationChart: React.FC<WalletAllocationChartProps> = ({ balances }) => {
    const assets = balances
        .map(b => ({ ...b, value: b.amount * (TOKENS[b.symbol]?.price || 0) }))
        .filter(b => b.value > 0.01) // Filter out dust
        .sort((a, b) => b.value - a.value);

    const totalValue = assets.reduce((acc, b) => acc + b.value, 0);

    if (totalValue === 0) {
        return <div className="text-center text-muted-foreground py-4">No assets to display.</div>;
    }

    return (
        <div className="space-y-3">
            <div className="w-full flex rounded-full h-3 overflow-hidden bg-secondary">
                {assets.map((asset, index) => (
                    <div
                        key={asset.symbol}
                        className="h-full transition-all duration-300"
                        style={{
                            width: `${(asset.value / totalValue) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                        }}
                        title={`${asset.symbol}: ${((asset.value / totalValue) * 100).toFixed(1)}%`}
                    />
                ))}
            </div>
            <ul className="text-xs space-y-1.5">
                {assets.map((asset, index) => (
                    <li key={asset.symbol} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span
                                className="w-2.5 h-2.5 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></span>
                            <span className="text-muted-foreground">{asset.symbol}</span>
                        </div>
                        <span className="font-mono text-foreground">{((asset.value / totalValue) * 100).toFixed(1)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WalletAllocationChart;
