import React, { useContext } from 'react';
import type { Thread } from '../types';
import { Button } from './ui/Button';
import { ChevronLeftIcon } from './Icons';
import { AppContext } from './context/AppContext';

interface EmailDetailHeaderMobileProps {
    thread: Thread | null;
    onBack: () => void;
    onOpenKebabMenu: (threadId: string, anchorEl: HTMLElement) => void;
    onArchive: (threadId: string) => void;
    onDelete: (threadId: string) => void;
    onMarkAsRead: (threadId: string, isRead: boolean) => void;
    onToggleAIAssistant?: () => void;
    isDetailView?: boolean;
    onDiscoverClick?: () => void;
    onScheduleMeetingClick?: () => void;
    onSnoozeClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onUnsnooze?: (threadId: string) => void;
    onSummarize?: () => void;
    isSummarizing?: boolean;
    onComposeInteraction?: (type: 'reply' | 'reply-all' | 'forward') => void;
    onToggleStar?: () => void;
    searchQuery?: string;
    onSearchQueryChange?: (query: string) => void;
    onOpenSearchFilters?: (anchorEl: HTMLElement) => void;
    areFiltersActive?: boolean;
    activeEmailView?: string;
    onNavigateThread?: (direction: 'next' | 'prev') => void;
    canNavigatePrev?: boolean;
    canNavigateNext?: boolean;
}


const EmailDetailHeaderMobile: React.FC<EmailDetailHeaderMobileProps> = ({ 
    thread, onBack, onOpenKebabMenu, onArchive, onDelete, onMarkAsRead, onNavigateThread, canNavigatePrev, canNavigateNext, ...props
}) => {
    const { uiTheme } = useContext(AppContext);
    
    const formatViewTitle = (view?: string) => {
        if (!view) return 'Inbox';
        return view
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    const headerClasses = uiTheme === 'modern'
        ? "absolute top-0 left-0 right-0 z-10 p-2 flex items-center justify-between flex-shrink-0 space-x-2"
        : "bg-background p-2 flex items-center justify-between flex-shrink-0 border-b border-border space-x-2";
    
    const BackButton = () => (
        <div className="flex items-center space-x-1 flex-shrink-0">
            <Button variant="ghost" onClick={onBack} className="flex items-center text-primary -ml-2 pr-2">
                <ChevronLeftIcon className="h-6 w-6" />
                <span className="text-lg">{formatViewTitle(props.activeEmailView)}</span>
            </Button>
        </div>
    );

    if (uiTheme === 'modern') {
        const BackButtonModern = () => (
            <div className="flex-shrink-0">
                <button 
                    onClick={onBack}
                    className="h-10 w-10 flex items-center justify-center bg-white/60 dark:bg-zinc-800/20 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-full shadow-md text-foreground"
                    aria-label="Back"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>
            </div>
        );

        return (
             <header 
                className={headerClasses}
                style={{paddingTop: 'calc(0.5rem + env(safe-area-inset-top))'}}
            >
                <BackButtonModern />
                <div className="flex items-center bg-white/60 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white/20 dark:border-white/60 rounded-full shadow-md h-10 px-1">
                  <button 
                    onClick={() => onNavigateThread?.('prev')} 
                    disabled={!canNavigatePrev}
                    className="h-8 w-8 flex items-center justify-center text-foreground disabled:text-muted-foreground"
                    aria-label="Previous email"
                  >
                    <i className="fa-solid fa-chevron-up"></i>
                  </button>
                  <div className="w-px h-4 bg-border/50"></div>
                  <button 
                    onClick={() => onNavigateThread?.('next')} 
                    disabled={!canNavigateNext}
                    className="h-8 w-8 flex items-center justify-center text-foreground disabled:text-muted-foreground"
                    aria-label="Next email"
                  >
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </div>
            </header>
        );
    }

    return (
        <header className={headerClasses}>
            <BackButton />
            <div className="flex items-center space-x-2 flex-1 justify-end">
                <div className="relative flex-1 max-w-xs">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></i>
                    <input
                        type="text"
                        placeholder="Search"
                        value={props.searchQuery}
                        onChange={(e) => props.onSearchQueryChange?.(e.target.value)}
                        className="w-full bg-secondary border-none rounded-full pl-9 pr-4 h-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
                 <Button variant="secondary" size="icon" className="rounded-full" onClick={props.onToggleAIAssistant} title="AI Assistant">
                    <i className="fa-solid fa-sparkles w-5 h-5"></i>
                </Button>
                 <Button variant="secondary" size="icon" className="rounded-full" onClick={props.onScheduleMeetingClick} title="Insert Meeting">
                    <i className="fa-regular fa-calendar w-5 h-5"></i>
                </Button>
            </div>
        </header>
    );
};

export default EmailDetailHeaderMobile;