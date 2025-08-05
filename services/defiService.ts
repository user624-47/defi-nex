
import { TOKENS } from '../constants';
import { CdpPosition, LendingPool, StabilityPoolData, UserBalance, UserLendingPosition, UserStabilityDeposit } from '../types';

// --- MOCK DATABASE ---
let mockUserBalances: UserBalance[] = [
    { symbol: 'ETH', amount: 5 },
    { symbol: 'WBTC', amount: 0.2 },
    { symbol: 'HYPE', amount: 15000 },
    { symbol: 'USDC', amount: 25000 },
    { symbol: 'feUSD', amount: 1200 },
    { symbol: 'HUSD', amount: 0 },
];

let mockCdpPositions: CdpPosition[] = [
    {
        id: 'cdp-0x123456',
        collateralToken: 'ETH',
        collateralAmount: 2.5,
        debtAmount: 2500,
        ltv: 28.57,
        liquidationPrice: 1428.57,
        healthFactor: 2.45
    },
    {
        id: 'cdp-0xabcdef',
        collateralToken: 'HYPE',
        collateralAmount: 10000,
        debtAmount: 15000,
        ltv: 33.33,
        liquidationPrice: 2.00,
        healthFactor: 1.85
    }
];

let mockLendingPools: LendingPool[] = [
    { token: TOKENS.HUSD, totalSupplied: 5000000, totalBorrowed: 3500000, supplyApy: 4.5, borrowApy: 6.2, utilization: 70 },
    { token: TOKENS.USDC, totalSupplied: 12000000, totalBorrowed: 9000000, supplyApy: 5.1, borrowApy: 7.0, utilization: 75 },
    { token: TOKENS.feUSD, totalSupplied: 8000000, totalBorrowed: 4000000, supplyApy: 3.8, borrowApy: 5.5, utilization: 50 },
    { token: TOKENS.WBTC, totalSupplied: 100, totalBorrowed: 40, supplyApy: 1.5, borrowApy: 2.8, utilization: 40 },
];

let mockStabilityPool: StabilityPoolData = {
    totalDeposited: 10000000,
    apr: 12.5,
};

let mockUserLendingPositions: UserLendingPosition[] = [
    { tokenSymbol: 'USDC', suppliedAmount: 20000, borrowedAmount: 5000 },
    { tokenSymbol: 'feUSD', suppliedAmount: 0, borrowedAmount: 1000 },
    { tokenSymbol: 'WBTC', suppliedAmount: 0.1, borrowedAmount: 0 },
    { tokenSymbol: 'HUSD', suppliedAmount: 0, borrowedAmount: 0 },
];


let mockUserStabilityDeposit: UserStabilityDeposit = {
    depositedAmount: 5000,
    claimableYield: 125.34,
};
// --- END MOCK DATABASE ---

const simulateNetworkDelay = <T,>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 500 + Math.random() * 500));
};

// --- API FUNCTIONS ---

export const getWalletBalances = async (): Promise<UserBalance[]> => {
    return simulateNetworkDelay(JSON.parse(JSON.stringify(mockUserBalances)));
};

export const getCdpPositions = async (): Promise<CdpPosition[]> => {
    return simulateNetworkDelay(JSON.parse(JSON.stringify(mockCdpPositions)));
};

export const getLendingPools = async (): Promise<LendingPool[]> => {
    // Simulate market fluctuations
    const newPools = mockLendingPools.map(pool => ({
        ...pool,
        supplyApy: Math.max(0.5, pool.supplyApy + (Math.random() - 0.5) * 0.2),
        borrowApy: Math.max(1, pool.borrowApy + (Math.random() - 0.5) * 0.2),
    }));
    return simulateNetworkDelay(newPools);
};

export const getStabilityPool = async (): Promise<StabilityPoolData> => {
    return simulateNetworkDelay(JSON.parse(JSON.stringify(mockStabilityPool)));
};

export const getUserLendingPositions = async (): Promise<UserLendingPosition[]> => {
    return simulateNetworkDelay(JSON.parse(JSON.stringify(mockUserLendingPositions)));
};

export const getUserStabilityDeposit = async (): Promise<UserStabilityDeposit> => {
    return simulateNetworkDelay(JSON.parse(JSON.stringify(mockUserStabilityDeposit)));
};

// --- MOCK TRANSACTIONS ---

export const createCdp = async (collateralToken: string, collateralAmount: number, mintAmount: number): Promise<CdpPosition> => {
    const collateralBalance = mockUserBalances.find(b => b.symbol === collateralToken);
    if (!collateralBalance || collateralBalance.amount < collateralAmount) {
        throw new Error(`Insufficient ${collateralToken} balance.`);
    }

    collateralBalance.amount -= collateralAmount;
    const feUSDBalance = mockUserBalances.find(b => b.symbol === 'feUSD');
    if (feUSDBalance) {
        feUSDBalance.amount += mintAmount;
    }

    const newPosition: CdpPosition = {
        id: `cdp-0x${Math.random().toString(16).slice(2, 8)}`,
        collateralToken,
        collateralAmount,
        debtAmount: mintAmount,
        ltv: (mintAmount * TOKENS.feUSD.price) / (collateralAmount * TOKENS[collateralToken].price) * 100,
        liquidationPrice: (mintAmount / collateralAmount) * 1.25, // Simplified
        healthFactor: ((collateralAmount * TOKENS[collateralToken].price) * 0.75) / mintAmount
    };
    mockCdpPositions.push(newPosition);
    return simulateNetworkDelay(newPosition);
};

export const supplyToLendingPool = async (tokenSymbol: string, amount: number): Promise<boolean> => {
    const userBalance = mockUserBalances.find(b => b.symbol === tokenSymbol);
    if (!userBalance || userBalance.amount < amount) {
        throw new Error(`Insufficient ${tokenSymbol} balance.`);
    }
    userBalance.amount -= amount;

    let lendingPosition = mockUserLendingPositions.find(p => p.tokenSymbol === tokenSymbol);
    if (lendingPosition) {
        lendingPosition.suppliedAmount += amount;
    } else {
        lendingPosition = { tokenSymbol, suppliedAmount: amount, borrowedAmount: 0 };
        mockUserLendingPositions.push(lendingPosition);
    }

    const pool = mockLendingPools.find(p => p.token.symbol === tokenSymbol);
    if (pool) {
        pool.totalSupplied += amount;
    }
    return simulateNetworkDelay(true);
};

export const withdrawFromLendingPool = async (tokenSymbol: string, amount: number): Promise<boolean> => {
    const lendingPosition = mockUserLendingPositions.find(p => p.tokenSymbol === tokenSymbol);
    if (!lendingPosition || lendingPosition.suppliedAmount < amount) {
        throw new Error('Withdraw amount exceeds supplied balance.');
    }
     // Simplified check: cannot withdraw collateral if it compromises borrow position
    const collateralValue = (lendingPosition.suppliedAmount - amount) * TOKENS[tokenSymbol].price;
    const borrowedValue = lendingPosition.borrowedAmount * TOKENS[tokenSymbol].price;
    if (borrowedValue > collateralValue * 0.8) {
        throw new Error('Withdrawal would exceed borrow limit.');
    }

    const userBalance = mockUserBalances.find(b => b.symbol === tokenSymbol);
    if (!userBalance) throw new Error("Balance not found");

    lendingPosition.suppliedAmount -= amount;
    userBalance.amount += amount;

    const pool = mockLendingPools.find(p => p.token.symbol === tokenSymbol);
    if (pool) {
        pool.totalSupplied -= amount;
    }
    return simulateNetworkDelay(true);
};


export const borrowFromLendingPool = async (tokenSymbol: string, amount: number): Promise<boolean> => {
    const userBalance = mockUserBalances.find(b => b.symbol === tokenSymbol);
    if (!userBalance) throw new Error("Balance not found");
    
    const lendingPosition = mockUserLendingPositions.find(p => p.tokenSymbol === tokenSymbol);
     if (!lendingPosition) {
         throw new Error('Must supply assets before borrowing.');
    }

    const collateralValue = lendingPosition.suppliedAmount * TOKENS[tokenSymbol].price;
    const newBorrowedValue = (lendingPosition.borrowedAmount + amount) * TOKENS[tokenSymbol].price;
    if (newBorrowedValue > collateralValue * 0.8) {
         throw new Error('Borrow limit exceeded');
    }

    userBalance.amount += amount;
    lendingPosition.borrowedAmount += amount;
    
    const pool = mockLendingPools.find(p => p.token.symbol === tokenSymbol);
    if (pool) {
        pool.totalBorrowed += amount;
    }

    return simulateNetworkDelay(true);
};


export const repayBorrow = async (tokenSymbol: string, amount: number): Promise<boolean> => {
    const userBalance = mockUserBalances.find(b => b.symbol === tokenSymbol);
    if (!userBalance || userBalance.amount < amount) {
        throw new Error(`Insufficient ${tokenSymbol} balance to repay.`);
    }

    const lendingPosition = mockUserLendingPositions.find(p => p.tokenSymbol === tokenSymbol);
    if (!lendingPosition || lendingPosition.borrowedAmount <= 0) {
        throw new Error('No outstanding borrow to repay.');
    }
    
    const repayAmount = Math.min(amount, lendingPosition.borrowedAmount);

    userBalance.amount -= repayAmount;
    lendingPosition.borrowedAmount -= repayAmount;

    const pool = mockLendingPools.find(p => p.token.symbol === tokenSymbol);
    if (pool) {
        pool.totalBorrowed -= repayAmount;
    }

    return simulateNetworkDelay(true);
};


export const depositToStabilityPool = async (amount: number): Promise<boolean> => {
    const feUSDBalance = mockUserBalances.find(b => b.symbol === 'feUSD');
    if (!feUSDBalance || feUSDBalance.amount < amount) {
        throw new Error('Insufficient feUSD balance.');
    }

    feUSDBalance.amount -= amount;
    mockUserStabilityDeposit.depositedAmount += amount;
    mockStabilityPool.totalDeposited += amount;
    return simulateNetworkDelay(true);
};

export const withdrawFromStabilityPool = async (amount: number): Promise<boolean> => {
    if (mockUserStabilityDeposit.depositedAmount < amount) {
        throw new Error('Withdraw amount exceeds deposit.');
    }
    const feUSDBalance = mockUserBalances.find(b => b.symbol === 'feUSD');
    if(feUSDBalance) {
        feUSDBalance.amount += amount;
    }
    mockUserStabilityDeposit.depositedAmount -= amount;
    mockStabilityPool.totalDeposited -= amount;
    return simulateNetworkDelay(true);
};