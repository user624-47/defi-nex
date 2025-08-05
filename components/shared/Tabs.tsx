
import React, { useState } from 'react';

interface TabsProps {
    tabs: { label: string; id: string }[];
    children: (activeTab: string) => React.ReactNode;
    defaultTab?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, children, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

    return (
        <div>
            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                            } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="pt-5">
                {children(activeTab)}
            </div>
        </div>
    );
};

export default Tabs;
