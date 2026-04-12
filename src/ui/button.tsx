
import type { ReactNode } from "react";

type ButtonProps = {
    className?: string;
    active?: boolean;
    children: ReactNode;
    onClick: () => void;
};


export const Button = ({ active = false, children, onClick }: ButtonProps) => (
    <button
        onClick={onClick}
        className={`cursor-pointer px-3 py-2 text-sm rounded-md md:px-6 md:py-4 md:text-xl md:rounded-xl border font-semibold transition-all duration-200
        ${active
                ? "bg-amber-400 text-black border-amber-300 scale-105"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:scale-105"
            }`}
    >
        {children}
    </button>
);

export const ButtonOrange = ({ children, onClick }: ButtonProps) => (
    <button
        onClick={onClick}
        className="cursor-pointer px-3 py-2 text-sm rounded-md md:px-5 md:py-3 md:text-xl md:rounded-xl border font-semibold transition-all duration-200        
                bg-amber-400 text-black/90 border-amber-300 hover:scale-105 hover:bg-amber-300"
    >
        {children}
    </button>
);