
import React from 'react';
import { useTheme } from '../../App';
import Button from './Button';

const SunIcon = (props: React.ComponentProps<'svg'>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 011.06-1.06l1.591 1.59a.75.75 0 01-1.06 1.061l-1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.061-1.06l1.59-1.591zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.894 17.894a.75.75 0 01-1.06 1.06l-1.591-1.59a.75.75 0 011.06-1.061l1.591 1.59zM4.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H5a.75.75 0 01-.75-.75zM6.106 6.106a.75.75 0 011.06 1.06l-1.59 1.591a.75.75 0 01-1.06-1.06l1.59-1.591z" /></svg>;
const MoonIcon = (props: React.ComponentProps<'svg'>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 004.472-.69a.75.75 0 01.82.162l.805.806a.75.75 0 01-.162.82a10.488 10.488 0 01-5.12 3.635 10.488 10.488 0 01-6.522-1.206 10.488 10.488 0 01-3.636-5.119A10.488 10.488 0 011.717 9.528a.75.75 0 01.82-.162l.806.805a.75.75 0 01.162.82A8.97 8.97 0 006 9a9 9 0 009-9 8.97 8.97 0 00-.69-4.472a.75.75 0 01.162-.82l.806.805z" clipRule="evenodd" /></svg>;

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <Button 
            variant="ghost" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="w-10 h-10 p-0"
            aria-label="Toggle theme"
        >
            <SunIcon className={`h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
            <MoonIcon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeToggle;
