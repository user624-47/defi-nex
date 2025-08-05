
import React from 'react';

interface StatProps {
    label: string;
    value: React.ReactNode;
    className?: string;
    valueClassName?: string;
}

const Stat: React.FC<StatProps> = ({ label, value, className, valueClassName }) => {
    return (
        <div className={`flex justify-between items-center ${className}`}>
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={`text-sm font-semibold text-foreground ${valueClassName}`}>{value}</span>
        </div>
    );
};

export default Stat;
