import React from 'react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface ResizerProps {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
}

const Resizer: React.FC<ResizerProps> = ({ onMouseDown, className }) => {
    return (
        <div
            className={cn(
                "w-1.5 h-full cursor-col-resize group flex-shrink-0 bg-background z-10",
                className
            )}
            onMouseDown={onMouseDown}
            role="separator"
            aria-orientation="vertical"
        >
            <div className="w-0.5 h-full bg-border group-hover:bg-primary transition-colors mx-auto"></div>
        </div>
    );
};

export default Resizer;