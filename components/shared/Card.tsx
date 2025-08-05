import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-card text-card-foreground border border-border rounded-lg shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className }) => (
    <div className={`p-4 sm:p-6 border-b border-border ${className}`}>
        {children}
    </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
    <div className={`p-4 sm:p-6 ${className}`}>
        {children}
    </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className }) => (
    <div className={`p-4 sm:p-6 bg-muted/50 border-t border-border ${className}`}>
        {children}
    </div>
);


export default Card;