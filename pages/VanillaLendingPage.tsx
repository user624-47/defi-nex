
import React, { useState } from 'react';
import PageWrapper from '../components/shared/PageWrapper';
import Card, { CardContent, CardHeader } from '../components/shared/Card';
import Button from '../components/shared/Button';
import Stat from '../components/shared/Stat';
import Modal from '../components/shared/Modal';
import TokenInput from '../components/shared/TokenInput';
import { useWallet } from '../hooks/useWallet';
import { useDeFiData } from '../hooks/useDeFiData';
import { LendingPool, TransactionState, UserLendingPosition } from '../types';
import * as defiService from '../services/defiService';
import { useToast } from '../hooks/useToast';
import Tabs from '../components/shared/Tabs';

type ActionType = 'Supply' | 'Borrow' | 'Withdraw' | 'Repay';

const LendingActionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    pool: LendingPool;
    userPosition: UserLendingPosition | undefined;
}> = ({ isOpen, onClose, pool, userPosition }) => {
    const { balances, refreshBalances } = useWallet();
    const { refreshData } = useDeFiData();
    const { addToast } = useToast();
    
    const [amount, setAmount] = useState('');
    const [txState, setTxState] = useState<TransactionState>(TransactionState.IDLE);
    const [activeAction, setActiveAction] = useState<ActionType>('Supply');

    const userBalance = balances.find(b => b.symbol === pool.token.symbol)?.amount || 0;
    const suppliedAmount = userPosition?.suppliedAmount || 0;
    const borrowedAmount = userPosition?.borrowedAmount || 0;

    const handleAction = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            addToast('Please enter a valid amount.', 'error');
            return;
        }

        setTxState(TransactionState.LOADING);
        try {
            let success = false;
            switch(activeAction) {
                case 'Supply':
                    success = await defiService.supplyToLendingPool(pool.token.symbol, numAmount);
                    break;
                case 'Withdraw':
                    success = await defiService.withdrawFromLendingPool(pool.token.symbol, numAmount);
                    break;
                case 'Borrow':
                     success = await defiService.borrowFromLendingPool(pool.token.symbol, numAmount);
                    break;
                case 'Repay':
                     success = await defiService.repayBorrow(pool.token.symbol, numAmount);
                    break;
            }

            if (success) {
                addToast(`${activeAction} successful!`, 'success');
                setAmount('');
                onClose();
                await refreshBalances();
                await refreshData();
            }
        } catch (error) {
            addToast((error as Error).message, 'error');
        } finally {
            setTxState(TransactionState.IDLE);
        }
    };
    
    const tabs = [
      { id: 'supply', label: 'Supply' },
      { id: 'borrow', label: 'Borrow' },
    ];

    const renderSupplyTab = () => {
        const maxWithdraw = suppliedAmount;
        return (
             <div className="space-y-6">
                <ActionSection 
                    title="Supply" 
                    token={pool.token}
                    balance={userBalance}
                    currentAmount={suppliedAmount}
                    amount={amount}
                    setAmount={setAmount}
                    setActiveAction={setActiveAction}
                    actionType="Supply"
                    buttonLabel="Supply"
                    activeAction={activeAction}
                />
                 <ActionSection 
                    title="Withdraw" 
                    token={pool.token}
                    balance={maxWithdraw}
                    currentAmount={suppliedAmount}
                    amount={amount}
                    setAmount={setAmount}
                    setActiveAction={setActiveAction}
                    actionType="Withdraw"
                    buttonLabel="Withdraw"
                    activeAction={activeAction}
                />
            </div>
        );
    };

    const renderBorrowTab = () => {
        const maxRepay = Math.min(borrowedAmount, userBalance);
        return (
             <div className="space-y-6">
                 <ActionSection 
                    title="Borrow" 
                    token={pool.token}
                    balance={suppliedAmount * 0.8 - borrowedAmount} // Simplified max borrow
                    currentAmount={borrowedAmount}
                    amount={amount}
                    setAmount={setAmount}
                    setActiveAction={setActiveAction}
                    actionType="Borrow"
                    buttonLabel="Borrow"
                    activeAction={activeAction}
                />
                 <ActionSection 
                    title="Repay" 
                    token={pool.token}
                    balance={maxRepay}
                    currentAmount={borrowedAmount}
                    amount={amount}
                    setAmount={setAmount}
                    setActiveAction={setActiveAction}
                    actionType="Repay"
                    buttonLabel="Repay"
                    activeAction={activeAction}
                />
            </div>
        );
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${pool.token.symbol} Market`}>
            <Tabs tabs={tabs}>
                {(activeTab) => (
                    <div>
                        {activeTab === 'supply' && renderSupplyTab()}
                        {activeTab === 'borrow' && renderBorrowTab()}
                        <div className="mt-6">
                            <Button 
                                className="w-full"
                                onClick={handleAction}
                                isLoading={txState === TransactionState.LOADING}
                                disabled={txState !== TransactionState.IDLE || parseFloat(amount) <= 0}
                            >
                                {activeAction}
                            </Button>
                        </div>
                    </div>
                )}
            </Tabs>
        </Modal>
    );
};

const ActionSection: React.FC<{
    title: string;
    token: any;
    balance: number;
    currentAmount: number;
    amount: string;
    setAmount: (val: string) => void;
    setActiveAction: (action: ActionType) => void;
    actionType: ActionType;
    buttonLabel: string;
    activeAction: ActionType;
}> = ({ title, token, balance, amount, setAmount, setActiveAction, actionType, activeAction }) => (
    <div>
        <h4 className="font-semibold text-card-foreground mb-2">{title}</h4>
        <TokenInput
            token={token}
            amount={activeAction === actionType ? amount : ''}
            onAmountChange={(val) => {
                setActiveAction(actionType);
                setAmount(val);
            }}
            balance={balance}
            onMaxClick={() => {
                setActiveAction(actionType);
                setAmount(balance.toString());
            }}
        />
    </div>
);


const LendingPoolCard: React.FC<{ pool: LendingPool }> = ({ pool }) => {
    const { isConnected } = useWallet();
    const { userLendingPositions } = useDeFiData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const userPosition = userLendingPositions.find(p => p.tokenSymbol === pool.token.symbol);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-center">
                    {pool.token.icon}
                    <h3 className="text-lg font-semibold ml-3">{pool.token.name} ({pool.token.symbol})</h3>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <Stat label="Supply APY" value={`${pool.supplyApy.toFixed(2)}%`} valueClassName="text-green-500" />
                <Stat label="Borrow APY" value={`${pool.borrowApy.toFixed(2)}%`} valueClassName="text-red-500" />
                <Stat label="Total Supplied" value={`$${(pool.totalSupplied * pool.token.price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`} />
                <Stat label="Total Borrowed" value={`$${(pool.totalBorrowed * pool.token.price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`} />
                <Stat label="Utilization" value={`${pool.utilization.toFixed(2)}%`} />
                 {isConnected && userPosition && (userPosition.suppliedAmount > 0 || userPosition.borrowedAmount > 0) && (
                    <div className="pt-3 border-t border-border space-y-1">
                        {userPosition.suppliedAmount > 0 && <Stat label="My Supply" value={`${userPosition.suppliedAmount.toFixed(4)} ${pool.token.symbol}`} />}
                        {userPosition.borrowedAmount > 0 && <Stat label="My Borrow" value={`${userPosition.borrowedAmount.toFixed(4)} ${pool.token.symbol}`} />}
                    </div>
                )}
            </CardContent>
            {isConnected && (
                <div className="p-4 border-t border-border mt-auto">
                    <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="w-full">Manage</Button>
                </div>
            )}
            {isModalOpen && (
                <LendingActionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    pool={pool}
                    userPosition={userPosition}
                />
            )}
        </Card>
    );
};

const VanillaLendingPage: React.FC = () => {
    const { lendingPools, loading } = useDeFiData();

    return (
        <PageWrapper title="Lending Market">
            {loading ? (
                <p>Loading lending pools...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lendingPools.map(pool => (
                        <LendingPoolCard key={pool.token.symbol} pool={pool} />
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};

export default VanillaLendingPage;
