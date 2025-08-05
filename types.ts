
export interface Token {
    symbol: string;
    name: string;
    icon: React.ReactNode;
    price: number;
    address: string;
}

export interface UserBalance {
    symbol: string;
    amount: number;
}

export interface CdpPosition {
    id: string;
    collateralToken: string;
    collateralAmount: number;
    debtAmount: number; // in feUSD
    ltv: number;
    liquidationPrice: number;
    healthFactor: number;
}

export enum PoolType {
    Lending = 'Lending',
    Stability = 'Stability',
    CDP = 'CDP'
}

export interface LendingPool {
    token: Token;
    totalSupplied: number;
    totalBorrowed: number;
    supplyApy: number;
    borrowApy: number;
    utilization: number;
}

export interface StabilityPoolData {
    totalDeposited: number;
    apr: number;
}

export interface UserLendingPosition {
    tokenSymbol: string;
    suppliedAmount: number;
    borrowedAmount: number;
}

export interface UserStabilityDeposit {
    depositedAmount: number;
    claimableYield: number;
}

export enum TransactionState {
    IDLE,
    LOADING,
    SUCCESS,
    ERROR
}
