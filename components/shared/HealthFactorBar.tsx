
import React from 'react';

interface HealthFactorBarProps {
    healthFactor: number;
}

const HealthFactorBar: React.FC<HealthFactorBarProps> = ({ healthFactor }) => {
    // healthFactor > 2 is safe, 1.5-2 is warning, < 1.5 is danger
    const getHealthColor = () => {
        if (healthFactor >= 2) return 'bg-green-500';
        if (healthFactor >= 1.5) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Cap percentage at 100 for visual representation
    const percentage = Math.min((healthFactor / 3) * 100, 100);

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground">Health Factor</span>
                <span className={`text-sm font-medium ${getHealthColor().replace('bg-', 'text-')}`}>{healthFactor.toFixed(2)}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5">
                <div className={`${getHealthColor()} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export default HealthFactorBar;
