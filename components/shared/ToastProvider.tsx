
import React, { createContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

const Toast: React.FC<{ message: string; type: ToastType; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
    const baseClasses = 'mt-2 p-4 w-full max-w-sm rounded-lg shadow-lg flex items-center justify-between pointer-events-auto';
    const typeClasses = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-blue-600 text-white',
    };

    React.useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <span>{message}</span>
            <button onClick={onDismiss}>&times;</button>
        </div>
    );
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        setToasts((prevToasts) => [...prevToasts, { id: Date.now(), message, type }]);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onDismiss={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
