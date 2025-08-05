
import { useContext } from 'react';
import { DeFiDataContext } from '../context/DeFiDataContext';

export const useDeFiData = () => {
    const context = useContext(DeFiDataContext);
    if (context === undefined) {
        throw new Error('useDeFiData must be used within a DeFiDataProvider');
    }
    return context;
};
