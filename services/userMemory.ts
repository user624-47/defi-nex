// services/userMemory.ts
// Simple persistent memory for user preferences and past questions

export interface UserMemory {
  preferences: Record<string, any>;
  history: { question: string; answer: string }[];
}

const MEMORY_KEY = 'defi-nexus-user-memory';

export function getUserMemory(): UserMemory {
  if (typeof window === 'undefined') return { preferences: {}, history: [] };
  const raw = localStorage.getItem(MEMORY_KEY);
  if (!raw) return { preferences: {}, history: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { preferences: {}, history: [] };
  }
}

export function saveUserMemory(mem: UserMemory) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
}

export function addToHistory(question: string, answer: string) {
  const mem = getUserMemory();
  mem.history.push({ question, answer });
  if (mem.history.length > 50) mem.history.shift();
  saveUserMemory(mem);
}

export function setPreference(key: string, value: any) {
  const mem = getUserMemory();
  mem.preferences[key] = value;
  saveUserMemory(mem);
}

export function getPreference(key: string) {
  return getUserMemory().preferences[key];
}
