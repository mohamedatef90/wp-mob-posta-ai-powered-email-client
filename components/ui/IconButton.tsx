import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ label, children, className, ...props }, ref) => (
    <button
        ref={ref}
        aria-label={label}
        className={`flex items-center justify-center h-10 w-10 rounded-full hover:bg-accent transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
));
