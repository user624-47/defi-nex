
import { GoogleGenAI } from "@google/genai";
import { CdpPosition, UserLendingPosition, UserStabilityDeposit } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. DeFi Helper will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = (
    cdpPositions?: CdpPosition[], 
    lendingPositions?: UserLendingPosition[], 
    stabilityDeposit?: UserStabilityDeposit,
    tokenPrices?: { [key: string]: number }
    ) => {
    let context = "You are an expert DeFi assistant integrated into the DeFi Nexus Dashboard. Your goal is to provide concise, helpful, and accurate information to users about their positions and general DeFi concepts. Be friendly and encouraging. The user is currently looking at their dashboard. Here is a summary of their current positions:\n\n";

    if (cdpPositions && cdpPositions.length > 0) {
        context += "Collateralized Debt Positions (CDPs):\n";
        cdpPositions.forEach(p => {
            context += `- CDP #${p.id.slice(0, 6)}: Collateral: ${p.collateralAmount.toFixed(2)} ${p.collateralToken}, Debt: ${p.debtAmount.toFixed(2)} feUSD, Health Factor: ${p.healthFactor.toFixed(2)}\n`;
        });
    } else {
        context += "- No active CDPs.\n";
    }

    if (lendingPositions && lendingPositions.length > 0) {
        context += "\nLending & Borrowing Positions:\n";
        lendingPositions.forEach(p => {
            if (p.suppliedAmount > 0) {
                context += `- Supplying: ${p.suppliedAmount.toFixed(2)} ${p.tokenSymbol}\n`;
            }
            if (p.borrowedAmount > 0) {
                context += `- Borrowing: ${p.borrowedAmount.toFixed(2)} ${p.tokenSymbol}\n`;
            }
        });
    } else {
        context += "- No active lending or borrowing positions.\n";
    }
    
    if (stabilityDeposit && stabilityDeposit.depositedAmount > 0) {
        context += `\nStability Pool Deposit: ${stabilityDeposit.depositedAmount.toFixed(2)} feUSD\n`;
    } else {
        context += "- No deposit in the stability pool.\n";
    }
    
    if (tokenPrices) {
        context += "\nCurrent Market Prices:\n";
        Object.entries(tokenPrices).forEach(([symbol, price]) => {
            context += `- ${symbol}: $${price.toFixed(2)}\n`;
        });
    }

    context += "\nBased on this context, answer the user's questions. If you don't know the answer, say so. Do not give financial advice. You can explain concepts like 'Health Factor', 'LTV', 'Liquidation', 'APY', etc. Keep answers short and to the point.";
    return context;
};


export const getDeFiHelperResponse = async (
    prompt: string,
    cdpPositions?: CdpPosition[],
    lendingPositions?: UserLendingPosition[],
    stabilityDeposit?: UserStabilityDeposit,
    tokenPrices?: { [key: string]: number }
): Promise<string> => {
    if (!API_KEY) {
        return "The DeFi Helper is currently unavailable. The API key is not configured.";
    }

    try {
        const systemInstruction = getSystemInstruction(cdpPositions, lendingPositions, stabilityDeposit, tokenPrices);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5,
                topP: 0.95,
                topK: 64,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching response from Gemini API:", error);
        return "Sorry, I encountered an error while trying to respond. Please try again later.";
    }
};
