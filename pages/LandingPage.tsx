
import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/shared/PageWrapper';
import Card, { CardContent, CardHeader } from '../components/shared/Card';
import Button from '../components/shared/Button';
import Stat from '../components/shared/Stat';
import { useDeFiData } from '../hooks/useDeFiData';
import { TOKENS } from '../constants';

const LandingPage: React.FC = () => {
    const { lendingPools, stabilityPool, loading } = useDeFiData();

    const totalValueLocked = lendingPools.reduce((acc, pool) => acc + pool.totalSupplied * pool.token.price, 0) + (stabilityPool?.totalDeposited || 0);
    const topLendingPool = [...lendingPools].sort((a,b) => b.supplyApy - a.supplyApy)[0];

    const StatCard: React.FC<{ title: string; children: React.ReactNode; linkTo: string, linkText: string }> = ({title, children, linkTo, linkText}) => (
        <Card className="flex flex-col">
            <CardHeader>
                <h3 className="text-lg font-semibold">{title}</h3>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {children}
            </CardContent>
            <div className="p-4 mt-auto border-t border-border">
                <Link to={linkTo}>
                    <Button variant="secondary" className="w-full">
                       {linkText}
                    </Button>
                </Link>
            </div>
        </Card>
    );

    return (
        <PageWrapper title="Welcome to DeFi Nexus">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-3 bg-secondary/50">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground">Total Value Locked</p>
                            <p className="text-3xl font-bold">
                                {loading ? 'Loading...' : `$${(totalValueLocked / 1_000_000).toFixed(2)}M`}
                            </p>
                        </div>
                        <Link to="/dashboard">
                            <Button>Launch App</Button>
                        </Link>
                    </CardContent>
                </Card>

                <StatCard title="CDP Market" linkTo="/cdp" linkText="Manage CDPs">
                    <p className="text-sm text-muted-foreground">Mint feUSD by locking your crypto assets as collateral. Enjoy capital efficiency with competitive borrowing rates.</p>
                    <Stat label="Supported Collaterals" value="ETH, HYPE, WBTC" />
                    <Stat label="Minted Token" value="feUSD" />
                </StatCard>

                <StatCard title="Lending Market" linkTo="/vanilla" linkText="Explore Pools">
                    <p className="text-sm text-muted-foreground">Earn yield by supplying assets to our decentralized lending pools, or borrow against your supplied collateral.</p>
                     {loading ? <p>Loading...</p> : topLendingPool && (
                        <Stat label={`Top Supply APY (${topLendingPool.token.symbol})`} value={`${topLendingPool.supplyApy.toFixed(2)}%`} valueClassName="text-green-500" />
                     )}
                     <Stat label="Available Assets" value={Object.values(TOKENS).filter(t => t.symbol !== 'ETH' && t.symbol !== 'HYPE').map(t => t.symbol).join(', ')} />
                </StatCard>

                <StatCard title="Stability Pool" linkTo="/stability-pool" linkText="Stake feUSD">
                    <p className="text-sm text-muted-foreground">Secure the protocol and earn liquidation fees by depositing feUSD into the Stability Pool.</p>
                     {loading ? <p>Loading...</p> : stabilityPool && (
                        <Stat label="Current APR" value={`${stabilityPool.apr.toFixed(2)}%`} valueClassName="text-green-500" />
                     )}
                     <Stat label="Total Deposits" value={loading ? '...' : `$${(stabilityPool?.totalDeposited || 0).toLocaleString()}`}/>
                </StatCard>

            </div>
        </PageWrapper>
    );
};

export default LandingPage;