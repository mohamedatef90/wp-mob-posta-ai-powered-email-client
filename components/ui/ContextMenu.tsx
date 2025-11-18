import React, { useEffect, useRef, useState } from 'react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, children }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: y, left: x });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        const handleContextMenu = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [onClose]);

    useEffect(() => {
        if (menuRef.current) {
            const menuWidth = menuRef.current.offsetWidth;
            const menuHeight = menuRef.current.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            let newX = x;
            let newY = y;

            if (x + menuWidth > screenWidth - 16) {
                newX = screenWidth - menuWidth - 16;
            }
            if (y + menuHeight > screenHeight - 16) {
                newY = screenHeight - menuHeight - 16;
            }
            setPosition({ top: newY, left: newX });
        }
    }, [x, y]);

    return (
        <div
            ref={menuRef}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 w-64 bg-card rounded-xl shadow-2xl border border-border p-2 animate-scaleIn backdrop-blur-xl"
            role="menu"
            onContextMenu={(e) => e.preventDefault()}
        >
            {children}
        </div>
    );
};

export const ContextMenuItem: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string; shortcut?: string; destructive?: boolean }> = ({ icon, children, shortcut, destructive, className, ...props }) => (
    <button
        role="menuitem"
        className={cn(
            'w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors flex items-center justify-between disabled:opacity-50 disabled:pointer-events-none',
            destructive && 'text-destructive hover:bg-destructive/10',
            className
        )}
        {...props}
    >
        <div className="flex items-center space-x-3">
            {icon && <i className={cn('w-4 h-4 text-center', icon)}></i>}
            <span>{children}</span>
        </div>
        {shortcut && <span className="text-xs text-muted-foreground">{shortcut}</span>}
    </button>
);

export const ContextMenuSeparator: React.FC = () => (
    <div className="h-px bg-border my-1.5" role="separator"></div>
);