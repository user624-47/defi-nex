
import React, { useState } from 'react';
import PageWrapper from '../components/shared/PageWrapper';
import Card, { CardContent, CardHeader, CardFooter } from '../components/shared/Card';
import Stat from '../components/shared/Stat';
import Button from '../components/shared/Button';
import TokenInput from '../components/shared/TokenInput';
import { useWallet } from '../hooks/useWallet';
import { useDeFiData } from '../hooks/useDeFiData';
import { TOKENS } from '../constants';
import * as defiService from '../services/defiService';
import { useToast } from '../hooks/useToast';
import { TransactionState } from '../types';
import Tabs from '../components/shared/Tabs';

type StabilityAction = 'Deposit' | 'Withdraw';

const StabilityPoolPage: React.FC = () => {
    const { isConnected, balances, refreshBalances } = useWallet();
    const { stabilityPool, userStabilityDeposit, loading, refreshData } = useDeFiData();
    const { addToast } = useToast();

    const [action, setAction] = useState<StabilityAction>('Deposit');
    const [amount, setAmount] = useState('');
    const [txState, setTxState] = useState<TransactionState>(TransactionState.IDLE);

    const feUSDBalance = balances.find(b => b.symbol === 'feUSD')?.amount || 0;
    const depositedAmount = userStabilityDeposit?.depositedAmount || 0;
    const maxAmount = action === 'Deposit' ? feUSDBalance : depositedAmount;
    
    const handleAction = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            addToast('Please enter a valid amount.', 'error');
            return;
        }
        
        setTxState(TransactionState.LOADING);
        try {
            let success = false;
            if (action === 'Deposit') {
                success = await defiService.depositToStabilityPool(numAmount);
            } else {
                success = await defiService.withdrawFromStabilityPool(numAmount);
            }

            if(success) {
                addToast(`${action} successful!`, 'success');
                setAmount('');
                refreshBalances();
                refreshData();
            }
        } catch (error) {
            addToast((error as Error).message, 'error');
        } finally {
            setTxState(TransactionState.IDLE);
        }
    };
    
    const TABS = [
        { id: 'deposit', label: 'Deposit' },
        { id: 'withdraw', label: 'Withdraw' },
    ];
    
    return (
        <PageWrapper title="Stability Pool">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><h3 className="text-lg font-semibold">Pool Stats</h3></CardHeader>
                        <CardContent className="space-y-4">
                            <Stat label="Total feUSD Deposited" value={loading ? '...' : `$${stabilityPool?.totalDeposited.toLocaleString()}`} />
                            <Stat label="Pool APR" value={loading ? '...' : `${stabilityPool?.apr.toFixed(2)}%`} valueClassName="text-green-500" />
                            <p className="text-sm text-muted-foreground pt-4">
                                Deposit your feUSD into the Stability Pool to help keep the system solvent. In return, you'll earn rewards from liquidated CDPs.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    {!isConnected ? (
                        <Card className="h-full">
                           <CardContent className="flex flex-col items-center justify-center h-full">
                                <p className="text-lg text-muted-foreground text-center">Please connect your wallet to interact with the Stability Pool.</p>
                           </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent>
                                <Tabs tabs={TABS}>
                                    {(activeTab) => {
                                        // Update action based on active tab
                                        const currentAction: StabilityAction = activeTab === 'deposit' ? 'Deposit' : 'Withdraw';
                                        if (action !== currentAction) {
                                            setAction(currentAction);
                                            setAmount(''); // Reset amount on tab change
                                        }

                                        return (
                                            <div className="space-y-4">
                                                <TokenInput 
                                                    token={TOKENS.feUSD}
                                                    amount={amount}
                                                    onAmountChange={setAmount}
                                                    balance={maxAmount}
                                                    onMaxClick={() => setAmount(maxAmount.toString())}
                                                />
                                                <div className="space-y-2 text-sm">
                                                    <Stat label="My Deposit" value={`${depositedAmount.toFixed(2)} feUSD`} />
                                                    <Stat label="Claimable Yield" value={`${userStabilityDeposit?.claimableYield.toFixed(2) || '0.00'} feUSD`} valueClassName="text-green-400" />
                                                </div>
                                            </div>
                                        );
                                    }}
                                </Tabs>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full"
                                    onClick={handleAction}
                                    isLoading={txState === TransactionState.LOADING}
                                    disabled={txState !== TransactionState.IDLE || parseFloat(amount) <= 0}
                                >
                                    {action} feUSD
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
             </div>
        </PageWrapper>
    );
};

export default StabilityPoolPage;