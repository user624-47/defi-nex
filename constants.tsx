
import React from 'react';
import { Token } from './types';

export const EthIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22.75L11.85 22.65L3.3 17.45L12 22.75Z" fill="#8C8C8C"></path><path d="M12 22.75L20.7 17.45L12.15 22.65L12 22.75Z" fill="#E8E8E8"></path><path d="M12 1.25L3.25 16.2L12 21.25V1.25Z" fill="#8C8C8C"></path><path d="M12 1.25L20.75 16.2L12 21.25V1.25Z" fill="#E8E8E8"></path><path d="M12 16.85L11.9 16.9L3.3 11.7L12 16.85Z" fill="#8C8C8C"></path><path d="M12 16.85L20.7 11.7L12.1 16.9L12 16.85Z" fill="#E8E8E8"></path><path d="M12 15.6L20.7 10.4L12 1.25V15.6Z" fill="#8C8C8C"></path><path d="M12 15.6L3.25 10.4L12 1.25V15.6Z" fill="#E8E8E8"></path></svg>
);

export const WbtcIcon = ({ className = "w-6 h-6" }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
        <title>Wrapped Bitcoin</title>
        <circle cx="12" cy="12" r="11" fill="#F7931A"/>
        <path fill="white" d="M8.07 16.71h1.47v-2.22h.85l.39 2.22h1.45l-1.57-6.52h-2.1zm.9-3.27l.37-2.12.37 2.12h-.74zm7.02 2.65c.6-.5.95-1.23.95-2.05 0-1.8-1.32-2.7-3-2.7h-2.13v6.52h2.24c1.83 0 3.03-.88 3.03-2.52 0-.9-.4-1.63-1.06-2.1zm-2.13-.57v-1.3h1.22c.83 0 1.28.4 1.28 1.1s-.4 1.1-1.22 1.1h-1.28zm0 1.1h1.4c.9 0 1.4.45 1.4 1.2s-.5 1.2-1.42 1.2h-1.38v-2.4z"/>
    </svg>
);


export const UsdcIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#2775CA"></circle><path d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM14.155 15.225C13.885 15.525 13.525 15.765 13.105 15.915C12.555 16.115 11.925 16.115 11.375 15.915C10.155 15.485 9.30501 14.345 9.17501 13.065L9.12501 12.525H11.235L11.285 13.065C11.455 14.005 12.305 14.635 13.235 14.445C13.785 14.335 14.225 13.895 14.335 13.345C14.485 12.635 14.015 11.925 13.315 11.785L10.825 11.225C9.50501 10.935 8.51501 9.80501 8.65501 8.47501C8.79501 7.21501 9.78501 6.22501 11.045 6.08501L11.375 6.05501C11.935 5.86501 12.565 5.86501 13.115 6.05501C14.325 6.47501 15.175 7.60501 15.065 8.87501L15.015 9.46501H12.905L12.855 8.92501C12.685 7.98501 11.835 7.35501 10.905 7.54501C10.355 7.65501 9.91501 8.09501 9.80501 8.64501C9.65501 9.35501 10.125 10.065 10.825 10.205L13.315 10.765C14.625 11.045 15.625 12.165 15.485 13.485C15.345 14.305 14.825 14.935 14.155 15.225Z" fill="white"></path></svg>
);

const FelixIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM8.25 8.25C8.25 7.83579 7.91421 7.5 7.5 7.5C7.08579 7.5 6.75 7.83579 6.75 8.25V15.75C6.75 16.1642 7.08579 16.5 7.5 16.5C7.91421 16.5 8.25 16.1642 8.25 15.75V8.25ZM12.75 8.25C12.75 7.83579 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.83579 11.25 8.25V15.75C11.25 16.1642 11.5858 16.5 12 16.5C12.4142 16.5 12.75 16.1642 12.75 15.75V8.25ZM17.25 7.5C16.8358 7.5 16.5 7.83579 16.5 8.25V15.75C16.5 16.1642 16.8358 16.5 17.25 16.5C17.6642 16.5 18 16.1642 18 15.75V8.25C18 7.83579 17.6642 7.5 17.25 7.5Z" fill="hsl(10, 80%, 60%)"></path></svg>
);

const HyperliquidIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="var(--foreground)"/>
        <path d="M6 12L12 6L18 12L12 18L6 12Z" fill="var(--background)"/>
    </svg>
);


export const TOKENS: { [key: string]: Token } = {
    ETH: { symbol: 'ETH', name: 'Ethereum', icon: <EthIcon />, price: 3500.00, address: '0xETH' },
    WBTC: { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: <WbtcIcon />, price: 65000.00, address: '0xWBTC' },
    HYPE: { symbol: 'HYPE', name: 'Hyperliquid Token', icon: <HyperliquidIcon />, price: 4.50, address: '0xHYPE' },
    USDC: { symbol: 'USDC', name: 'USD Coin', icon: <UsdcIcon />, price: 1.00, address: '0xUSDC' },
    feUSD: { symbol: 'feUSD', name: 'Felix USD', icon: <FelixIcon />, price: 0.99, address: '0xfeUSD' },
    HUSD: { symbol: 'HUSD', name: 'Hyperliquid USD', icon: <HyperliquidIcon />, price: 1.00, address: '0xHUSD' },
};