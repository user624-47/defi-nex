
import React from 'react';
import { useLocation } from 'react-router-dom';
import ConnectWalletButton from '../ConnectWalletButton';
import ThemeToggle from '../shared/ThemeToggle';

const Header: React.FC = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Overview';
        const title = path.replace('/', '').replace(/-/g, ' ');
        return title.charAt(0).toUpperCase() + title.slice(1);
    };

    return (
        <header className="flex-shrink-0 bg-card border-b border-border px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeToggle />
                    <ConnectWalletButton />
                </div>
            </div>
        </header>
    );
};

export default Header;