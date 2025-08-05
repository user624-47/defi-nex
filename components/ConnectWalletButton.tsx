
import React from 'react';
import { useWallet } from '../hooks/useWallet';
import Button from './shared/Button';

const ConnectWalletButton: React.FC = () => {
    const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    if (isConnected && address) {
        return (
            <div className="flex items-center space-x-2">
                <span className="px-3 py-2 text-sm font-mono bg-secondary rounded-md">{formatAddress(address)}</span>
                <Button onClick={disconnectWallet} variant="secondary">
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={connectWallet}>
            Connect Wallet
        </Button>
    );
};

export default ConnectWalletButton;
