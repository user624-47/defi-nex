
import React, { createContext, useState, useContext, useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CdpPage from './pages/CdpPage';
import VanillaLendingPage from './pages/VanillaLendingPage';
import StabilityPoolPage from './pages/StabilityPoolPage';
import { WalletProvider } from './context/WalletContext';
import { DeFiDataProvider } from './context/DeFiDataContext';
import ToastProvider from './components/shared/ToastProvider';
import DeFiHelper from './components/DeFiHelper';

// --- Theme Context and Provider ---
interface ThemeContextType {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window !== 'undefined' && window.localStorage.getItem('theme')) {
            return window.localStorage.getItem('theme') as 'dark' | 'light';
        }
        // Default to dark theme
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
// --- End Theme ---


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <WalletProvider>
                <DeFiDataProvider>
                    <ToastProvider>
                        <HashRouter>
                            <div className="flex h-screen bg-background text-foreground">
                                <Sidebar />
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    <Header />
                                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
                                        <Routes>
                                            <Route path="/" element={<LandingPage />} />
                                            <Route path="/dashboard" element={<DashboardPage />} />
                                            <Route path="/cdp" element={<CdpPage />} />
                                            <Route path="/vanilla" element={<VanillaLendingPage />} />
                                            <Route path="/stability-pool" element={<StabilityPoolPage />} />
                                        </Routes>
                                        <DeFiHelper />
                                    </main>
                                </div>
                            </div>
                        </HashRouter>
                    </ToastProvider>
                </DeFiDataProvider>
            </WalletProvider>
        </ThemeProvider>
    );
};

export default App;