
import React from 'react';
import { NavLink } from 'react-router-dom';

const IconNexus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
        <path d="M12.378 1.602a.75.75 0 00-.756 0L3.366 6.162A.75.75 0 003 6.847v10.306a.75.75 0 00.366.685l8.256 4.56a.75.75 0 00.756 0l8.256-4.56a.75.75 0 00.366-.685V6.847a.75.75 0 00-.366-.685L12.378 1.602zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
        <path d="M12 21.288V15.75a3.75 3.75 0 010-7.5V2.712l6.978 3.84-3.565 1.962a.75.75 0 00-.348 1.012l1.33 2.222a.75.75 0 001.23-.735l-.75-1.251 3.111 1.713v3.435L12 21.288z" />
    </svg>
);
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>;
const IconCdp = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" /><path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const IconLending = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.82 3.43c0 .537.22 1.042.593 1.412.373.37.874.588 1.412.588h12.75a.75.75 0 000-1.5H6.201a.75.75 0 01-.75-.75c0-.414.336-.75.75-.75h11.218a.75.75 0 00.728-.547l2.55-9.3a.75.75 0 00-.728-.953H4.62L3.89 4.25H2.25z" /><path d="M8.25 12a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM12 12a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 12zm3.75 12a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" /></svg>;
const IconStability = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.769 4.5-3.067 4.5H5.114c-2.3 0-4.22-2.5-3.068-4.5L9.4 3.003zM12 6a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6A.75.75 0 0112 6zm0 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" /></svg>;


const Sidebar: React.FC = () => {
    const navItems = [
        { path: '/', label: 'Overview', icon: <IconDashboard /> },
        { path: '/dashboard', label: 'My Dashboard', icon: <IconDashboard /> },
        { path: '/cdp', label: 'CDP Market', icon: <IconCdp /> },
        { path: '/vanilla', label: 'Lending Market', icon: <IconLending /> },
        { path: '/stability-pool', label: 'Stability Pool', icon: <IconStability /> },
    ];
    
    const NavItem: React.FC<{ path: string, label: string, icon: React.ReactNode }> = ({ path, label, icon }) => (
        <NavLink
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                        ? 'bg-secondary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`
            }
        >
            <span className="mr-3">{icon}</span>
            {label}
        </NavLink>
    );

    return (
        <aside className="w-64 flex-shrink-0 bg-background border-r border-border p-4 flex flex-col">
            <div className="flex items-center mb-8 px-2">
                <IconNexus />
                <h1 className="text-xl font-bold ml-2">DeFi Nexus</h1>
            </div>
            <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavItem key={item.path} {...item} />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
