
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { CdpPosition, LendingPool, StabilityPoolData, UserLendingPosition, UserStabilityDeposit } from '../types';
import * as defiService from '../services/defiService';
import { useWallet } from '../hooks/useWallet';

interface DeFiDataContextType {
    cdpPositions: CdpPosition[];
    lendingPools: LendingPool[];
    stabilityPool: StabilityPoolData | null;
    userLendingPositions: UserLendingPosition[];
    userStabilityDeposit: UserStabilityDeposit | null;
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
}

export const DeFiDataContext = createContext<DeFiDataContextType | undefined>(undefined);

export const DeFiDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isConnected } = useWallet();
    const [cdpPositions, setCdpPositions] = useState<CdpPosition[]>([]);
    const [lendingPools, setLendingPools] = useState<LendingPool[]>([]);
    const [stabilityPool, setStabilityPool] = useState<StabilityPoolData | null>(null);
    const [userLendingPositions, setUserLendingPositions] = useState<UserLendingPosition[]>([]);
    const [userStabilityDeposit, setUserStabilityDeposit] = useState<UserStabilityDeposit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refreshData = useCallback(async (isInitialLoad = false) => {
        if (isInitialLoad) setLoading(true);
        setError(null);
        try {
            const [
                lendingPoolsData,
                stabilityPoolData,
                cdpPositionsData,
                userLendingPositionsData,
                userStabilityDepositData
            ] = await Promise.all([
                defiService.getLendingPools(),
                defiService.getStabilityPool(),
                isConnected ? defiService.getCdpPositions() : Promise.resolve([]),
                isConnected ? defiService.getUserLendingPositions() : Promise.resolve([]),
                isConnected ? defiService.getUserStabilityDeposit() : Promise.resolve(null),
            ]);

            setLendingPools(lendingPoolsData);
            setStabilityPool(stabilityPoolData);

            if (isConnected) {
                setCdpPositions(cdpPositionsData);
                setUserLendingPositions(userLendingPositionsData);
                setUserStabilityDeposit(userStabilityDepositData);
            } else {
                setCdpPositions([]);
                setUserLendingPositions([]);
                setUserStabilityDeposit(null);
            }

        } catch (e) {
            setError(e as Error);
            console.error("Failed to fetch DeFi data:", e);
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected]);

    useEffect(() => {
        refreshData(true);
        const interval = setInterval(() => {
            refreshData(false);
        }, 15000); // Refresh every 15 seconds

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, refreshData]);

    const value = {
        cdpPositions,
        lendingPools,
        stabilityPool,
        userLendingPositions,
        userStabilityDeposit,
        loading,
        error,
        refreshData,
    };

    return (
        <DeFiDataContext.Provider value={value}>
            {children}
        </DeFiDataContext.Provider>
    );
};
