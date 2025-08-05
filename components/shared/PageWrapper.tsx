
import React from 'react';

interface PageWrapperProps {
    title: string;
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
            {children}
        </div>
    );
};

export default PageWrapper;
