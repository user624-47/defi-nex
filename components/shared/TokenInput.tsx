
import React from 'react';
import { Token } from '../../types';

interface TokenInputProps {
    token: Token;
    amount: string;
    onAmountChange: (value: string) => void;
    balance: number;
    onMaxClick: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ token, amount, onAmountChange, balance, onMaxClick }) => {
    return (
        <div className="bg-input rounded-md p-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Amount</span>
                <span className="text-xs text-muted-foreground">
                    Balance: {balance.toFixed(4)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-xl font-mono w-full focus:outline-none"
                />
                <div className="flex items-center">
                    <button
                        onClick={onMaxClick}
                        className="text-xs font-semibold text-primary hover:text-primary/80 mr-3 px-2 py-1 rounded-md bg-secondary"
                    >
                        MAX
                    </button>
                    <div className="flex items-center bg-secondary p-2 rounded-md">
                        <div className="w-5 h-5 mr-2">{token.icon}</div>
                        <span className="font-semibold">{token.symbol}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenInput;
