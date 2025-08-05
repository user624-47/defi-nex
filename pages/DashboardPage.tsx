
import React from 'react';
import PageWrapper from '../components/shared/PageWrapper';
import Card, { CardContent, CardHeader } from '../components/shared/Card';
import Stat from '../components/shared/Stat';
import { useWallet } from '../hooks/useWallet';
import { useDeFiData } from '../hooks/useDeFiData';
import { TOKENS } from '../constants';
import HealthFactorBar from '../components/shared/HealthFactorBar';
import WalletAllocationChart from '../components/shared/WalletAllocationChart';

const DashboardPage: React.FC = () => {
    const { isConnected, balances, address } = useWallet();
    const { cdpPositions, userLendingPositions, userStabilityDeposit, loading } = useDeFiData();

    if (!isConnected) {
        return (
            <PageWrapper title="My Dashboard">
                <div className="flex flex-col items-center justify-center h-64 bg-card border border-border rounded-lg">
                    <p className="text-lg text-muted-foreground">Please connect your wallet to view your dashboard.</p>
                </div>
            </PageWrapper>
        );
    }
    
    if (loading) {
        return <PageWrapper title="My Dashboard"><p>Loading dashboard data...</p></PageWrapper>
    }

    const totalWalletValue = balances.reduce((acc, bal) => acc + bal.amount * (TOKENS[bal.symbol]?.price || 0), 0);
    const totalSuppliedValue = userLendingPositions.reduce((acc, pos) => {
        if (!pos.tokenSymbol || !TOKENS[pos.tokenSymbol]) return acc;
        return acc + pos.suppliedAmount * TOKENS[pos.tokenSymbol].price;
    }, 0);
    const totalBorrowedValue = userLendingPositions.reduce((acc, pos) => {
        if (!pos.tokenSymbol || !TOKENS[pos.tokenSymbol]) return acc;
        return acc + pos.borrowedAmount * TOKENS[pos.tokenSymbol].price;
    }, 0);

    return (
        <PageWrapper title="My Dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* CDP Positions */}
                    <Card>
                        <CardHeader><h3 className="font-semibold text-lg">My CDPs</h3></CardHeader>
                        <CardContent>
                            {cdpPositions.length > 0 ? (
                                <div className="space-y-4">
                                    {cdpPositions.map(pos => (
                                        <Card key={pos.id} className="bg-secondary/50">
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        {TOKENS[pos.collateralToken].icon}
                                                        <span className="ml-2 font-bold text-lg">{pos.collateralToken}</span>
                                                    </div>
                                                    <span className="text-xs font-mono bg-background px-2 py-1 rounded border border-border">{pos.id}</span>
                                                </div>
                                                <Stat label="Collateral" value={`${pos.collateralAmount.toFixed(4)} ${pos.collateralToken}`} />
                                                <Stat label="Debt" value={`${pos.debtAmount.toFixed(2)} feUSD`} />
                                                <Stat label="Liquidation Price" value={`$${pos.liquidationPrice.toFixed(2)}`} />
                                                <HealthFactorBar healthFactor={pos.healthFactor} />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No active CDP positions.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Lending Positions */}
                     <Card>
                        <CardHeader><h3 className="font-semibold text-lg">My Lending Positions</h3></CardHeader>
                        <CardContent>
                            {userLendingPositions.some(p => p.suppliedAmount > 0 || p.borrowedAmount > 0) ? (
                                <div className="space-y-4">
                                {userLendingPositions.filter(p => p.suppliedAmount > 0 || p.borrowedAmount > 0).map(pos => (
                                    <Card key={pos.tokenSymbol} className="bg-secondary/50">
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center font-bold text-lg">
                                                {TOKENS[pos.tokenSymbol].icon}
                                                <span className="ml-2">{pos.tokenSymbol}</span>
                                            </div>
                                            {pos.suppliedAmount > 0 && <Stat label="Supplied" value={`${pos.suppliedAmount.toFixed(4)} ($${(pos.suppliedAmount * TOKENS[pos.tokenSymbol].price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})`} />}
                                            {pos.borrowedAmount > 0 && <Stat label="Borrowed" value={`${pos.borrowedAmount.toFixed(4)} ($${(pos.borrowedAmount * TOKENS[pos.tokenSymbol].price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})})`} />}
                                        </CardContent>
                                    </Card>
                                ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No active lending or borrowing positions.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                {/* Right Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><h3 className="font-semibold text-lg">My Summary</h3></CardHeader>
                        <CardContent className="space-y-3">
                            <Stat label="Net Worth" value={`$${(totalWalletValue + totalSuppliedValue - totalBorrowedValue).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} valueClassName="text-xl"/>
                            <Stat label="Wallet Balance" value={`$${totalWalletValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                            <Stat label="Total Supplied" value={`$${totalSuppliedValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                            <Stat label="Total Borrowed" value={`$${totalBorrowedValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><h3 className="font-semibold text-lg">Wallet Allocation</h3></CardHeader>
                        <CardContent>
                            <WalletAllocationChart balances={balances} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><h3 className="font-semibold text-lg">Stability Pool</h3></CardHeader>
                        <CardContent className="space-y-2">
                            <Stat label="My Deposit" value={`${userStabilityDeposit?.depositedAmount.toFixed(2) || '0.00'} feUSD`} />
                            <Stat label="Claimable Yield" value={`${userStabilityDeposit?.claimableYield.toFixed(2) || '0.00'} feUSD`} valueClassName="text-green-400" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageWrapper>
    );
};

export default DashboardPage;