import React, { useState, useRef, useEffect } from 'react';
import { getDeFiHelperResponse } from '../services/geminiService';
import { parseIntent } from '../services/intentParser';
import * as defiService from '../services/defiService';
import { getUserMemory, addToHistory } from '../services/userMemory';
import { useWallet } from '../hooks/useWallet';
import { useDeFiData } from '../hooks/useDeFiData';
import { TOKENS } from '../constants';
import Button from './shared/Button';

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 011.75 16.5A6.75 6.75 0 018.5 9.75h7.25a.75.75 0 01.75.75v3.75a3 3 0 01-3 3h-1.5a.75.75 0 010-1.5h1.5a1.5 1.5 0 001.5-1.5v-3a.75.75 0 00-.75-.75H8.5a5.25 5.25 0 00-5.25 5.25c0 1.522.647 2.934 1.704 3.93l-1.15 1.15a.75.75 0 01-1.06-1.06l1.15-1.15a6.723 6.723 0 01-2.244-4.22h-.004z" clipRule="evenodd" /><path d="M18.5 9.75a.75.75 0 01.75-.75h.008a6.75 6.75 0 016.75 6.75c0 2.822-1.734 5.252-4.22 6.302l1.15 1.15a.75.75 0 11-1.06 1.06l-1.15-1.15A6.707 6.707 0 0116.5 22.25a6.75 6.75 0 01-6.75-6.75V15a.75.75 0 011.5 0v.5a5.25 5.25 0 005.25 5.25 5.25 5.25 0 005.25-5.25c0-1.522-.647-2.934-1.704-3.93l-1.15 1.15a.75.75 0 01-1.06-1.06l1.15-1.15A6.723 6.723 0 0118.5 9.75z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const DeFiHelper: React.FC = () => {
    const { isConnected } = useWallet();
    const { cdpPositions, userLendingPositions, userStabilityDeposit, refreshData } = useDeFiData();

    const [isOpen, setIsOpen] = useState(false);
    // Load memory on open
    const [messages, setMessages] = useState<Message[]>([]);

    // Load memory when chat opens
    useEffect(() => {
        if (isOpen) {
            const mem = getUserMemory();
            if (mem.history.length > 0) {
                setMessages(mem.history.map(h => [
                    { sender: 'user', text: h.question },
                    { sender: 'ai', text: h.answer }
                ]).flat());
            }
        }
    }, [isOpen]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        const tokenPrices = Object.entries(TOKENS).reduce((acc, [symbol, token]) => {
            acc[symbol] = token.price;
            return acc;
        }, {} as {[key:string]: number});

        try {
            // Try to parse a natural language intent
            const intent = parseIntent(input);
            if (intent) {
                let resultMsg = '';
                try {
                    if (intent.type === 'open_cdp') {
                        // For simplicity, mint 1000 feUSD for every CDP
                        await defiService.createCdp(intent.params.token, intent.params.amount, 1000);
                        resultMsg = `Opened a CDP with ${intent.params.amount} ${intent.params.token} and minted 1000 feUSD.`;
                    } else if (intent.type === 'supply_lending') {
                        await defiService.supplyToLendingPool(intent.params.token, intent.params.amount);
                        resultMsg = `Supplied ${intent.params.amount} ${intent.params.token} to the lending pool.`;
                    } else if (intent.type === 'borrow_lending') {
                        await defiService.borrowFromLendingPool(intent.params.token, intent.params.amount);
                        resultMsg = `Borrowed ${intent.params.amount} ${intent.params.token} from the lending pool.`;
                    } else if (intent.type === 'deposit_stability') {
                        // Only feUSD is supported for stability pool in mock data
                        if (intent.params.token === 'FEUSD') {
                            await defiService.depositToStabilityPool(intent.params.amount);
                            resultMsg = `Deposited ${intent.params.amount} feUSD to the stability pool.`;
                        } else {
                            throw new Error('Only feUSD can be deposited to the stability pool.');
                        }
                    } else {
                        resultMsg = `Intent recognized but not implemented: ${intent.type}`;
                    }
                    await refreshData();
                } catch (err: any) {
                    resultMsg = `Action failed: ${err.message || err}`;
                }
                const aiMessage: Message = { sender: 'ai', text: resultMsg };
                setMessages(prev => [...prev, aiMessage]);
                addToHistory(input, resultMsg);
            } else {
                // Fallback to Gemini AI
                const responseText = await getDeFiHelperResponse(
                    input,
                    cdpPositions,
                    userLendingPositions,
                    userStabilityDeposit,
                    tokenPrices
                );
                const aiMessage: Message = { sender: 'ai', text: responseText };
                setMessages(prev => [...prev, aiMessage]);
                // Save to conversational memory
                addToHistory(input, responseText);
            }
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isConnected) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform transform hover:scale-110"
                aria-label="Toggle DeFi Helper"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm bg-card border border-border rounded-lg shadow-2xl flex flex-col h-[60vh]">
                    <header className="p-4 border-b border-border">
                        <h3 className="font-semibold text-card-foreground">DeFi Helper</h3>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="flex">
                                 <div className="bg-secondary text-secondary-foreground p-3 rounded-lg max-w-xs">
                                    <p className="text-sm">Hi! How can I help you with your DeFi positions today?</p>
                                </div>
                            </div>
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                    <div className={`${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} p-3 rounded-lg max-w-xs`}>
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                               <div className="flex">
                                    <div className="bg-secondary text-secondary-foreground p-3 rounded-lg max-w-xs">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </main>
                    <footer className="p-4 border-t border-border">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your positions..."
                                className="w-full bg-input text-foreground px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                disabled={isLoading}
                            />
                            <Button onClick={handleSend} isLoading={isLoading}>Send</Button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default DeFiHelper;