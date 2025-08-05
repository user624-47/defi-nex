
import React, { createContext, useState, useCallback } from 'react';
import { UserBalance } from '../types';
import * as defiService from '../services/defiService';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balances: UserBalance[];
    connectWallet: () => void;
    disconnectWallet: () => void;
    refreshBalances: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [balances, setBalances] = useState<UserBalance[]>([]);

    const refreshBalances = useCallback(async () => {
        if (isConnected) {
            const fetchedBalances = await defiService.getWalletBalances();
            setBalances(fetchedBalances);
        }
    }, [isConnected]);

    const connectWallet = useCallback(() => {
        const mockAddress = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        setAddress(mockAddress);
        setIsConnected(true);
        refreshBalances();
    }, [refreshBalances]);
    

    const disconnectWallet = () => {
        setIsConnected(false);
        setAddress(null);
        setBalances([]);
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, balances, connectWallet, disconnectWallet, refreshBalances }}>
            {children}
        </WalletContext.Provider>
    );
};
