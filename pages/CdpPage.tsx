
import React, { useState, useMemo } from 'react';
import PageWrapper from '../components/shared/PageWrapper';
import Card, { CardContent, CardHeader, CardFooter } from '../components/shared/Card';
import Button from '../components/shared/Button';
import TokenInput from '../components/shared/TokenInput';
import { TOKENS } from '../constants';
import { useWallet } from '../hooks/useWallet';
import { useDeFiData } from '../hooks/useDeFiData';
import Stat from '../components/shared/Stat';
import * as defiService from '../services/defiService';
import { useToast } from '../hooks/useToast';
import { TransactionState } from '../types';
import HealthFactorBar from '../components/shared/HealthFactorBar';

const CdpPage: React.FC = () => {
    const { isConnected, balances, refreshBalances } = useWallet();
    const { refreshData } = useDeFiData();
    const { addToast } = useToast();

    const collateralTabs = ['ETH', 'WBTC', 'HYPE'];
    const [collateralTokenSymbol, setCollateralTokenSymbol] = useState('ETH');
    const [collateralAmount, setCollateralAmount] = useState('');
    const [mintAmount, setMintAmount] = useState('');
    const [txState, setTxState] = useState<TransactionState>(TransactionState.IDLE);

    const collateralToken = TOKENS[collateralTokenSymbol];
    const feUSDToken = TOKENS.feUSD;
    const userBalance = balances.find(b => b.symbol === collateralTokenSymbol)?.amount || 0;

    const collateralValue = parseFloat(collateralAmount) * collateralToken.price;
    const debtValue = parseFloat(mintAmount) * feUSDToken.price;
    const ltv = collateralValue > 0 ? (debtValue / collateralValue) * 100 : 0;
    const healthFactor = debtValue > 0 ? (collateralValue * 0.75) / debtValue : Infinity; // Max LTV is 75%
    const liquidationPrice = parseFloat(collateralAmount) > 0 ? (debtValue / parseFloat(collateralAmount)) / 0.75 : 0;

    const handleCreateCdp = async () => {
        if (!collateralAmount || !mintAmount || parseFloat(collateralAmount) <= 0 || parseFloat(mintAmount) <= 0) {
            addToast('Please enter valid amounts.', 'error');
            return;
        }
        
        if (healthFactor < 1.1) { // Buffer
             addToast('Health factor is too low. Reduce mint amount or add more collateral.', 'error');
            return;
        }

        setTxState(TransactionState.LOADING);
        try {
            await defiService.createCdp(collateralTokenSymbol, parseFloat(collateralAmount), parseFloat(mintAmount));
            setTxState(TransactionState.SUCCESS);
            addToast('CDP created successfully!', 'success');
            // Reset form
            setCollateralAmount('');
            setMintAmount('');
            // Refresh data
            refreshBalances();
            refreshData();
        } catch (error) {
            setTxState(TransactionState.ERROR);
            addToast((error as Error).message, 'error');
        } finally {
            // Reset state after a delay
            setTimeout(() => setTxState(TransactionState.IDLE), 3000);
        }
    };

    return (
        <PageWrapper title="Create a new CDP">
            {!isConnected ? (
                <div className="flex flex-col items-center justify-center h-64 bg-card border border-border rounded-lg">
                    <p className="text-lg text-muted-foreground">Please connect your wallet to manage CDPs.</p>
                </div>
            ) : (
                <Card className="max-w-xl mx-auto">
                    <CardHeader>
                         <div className="border-b border-border -m-6 mb-0 px-6">
                            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                {collateralTabs.map(symbol => (
                                    <button
                                        key={symbol}
                                        onClick={() => setCollateralTokenSymbol(symbol)}
                                        className={`${
                                            collateralTokenSymbol === symbol
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                                    >
                                        Deposit {symbol}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <TokenInput
                            token={collateralToken}
                            amount={collateralAmount}
                            onAmountChange={setCollateralAmount}
                            balance={userBalance}
                            onMaxClick={() => setCollateralAmount(userBalance.toString())}
                        />
                        <div className="flex justify-center my-[-10px] z-10">
                            <div className="bg-card border border-border rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                         <div className="bg-input rounded-md p-3">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-muted-foreground">Mint feUSD</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <input
                                    type="number"
                                    value={mintAmount}
                                    onChange={(e) => setMintAmount(e.target.value)}
                                    placeholder="0.0"
                                    className="bg-transparent text-xl font-mono w-full focus:outline-none"
                                />
                                <div className="flex items-center bg-secondary p-2 rounded-md">
                                    <div className="w-5 h-5 mr-2">{feUSDToken.icon}</div>
                                    <span className="font-semibold">{feUSDToken.symbol}</span>
                                </div>
                            </div>
                        </div>

                        {parseFloat(collateralAmount) > 0 && parseFloat(mintAmount) > 0 && (
                             <Card className="bg-secondary/50">
                                 <CardContent className="space-y-3">
                                     <h4 className="font-semibold">Position Summary</h4>
                                     <Stat label="Collateral Value" value={`$${collateralValue.toFixed(2)}`} />
                                     <Stat label="LTV" value={`${ltv.toFixed(2)}%`} valueClassName={ltv > 75 ? 'text-red-500' : ltv > 60 ? 'text-yellow-500' : 'text-green-500'}/>
                                     <Stat label="Liquidation Price" value={`$${liquidationPrice.toFixed(2)}`} />
                                     <HealthFactorBar healthFactor={healthFactor} />
                                 </CardContent>
                             </Card>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={handleCreateCdp}
                            isLoading={txState === TransactionState.LOADING}
                            disabled={txState !== TransactionState.IDLE || parseFloat(collateralAmount) <= 0 || parseFloat(mintAmount) <= 0 || ltv > 75}
                        >
                            {ltv > 75 ? 'LTV is too high' : 'Create CDP'}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </PageWrapper>
    );
};

export default CdpPage;