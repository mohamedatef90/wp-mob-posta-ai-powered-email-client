import React from 'react';
import type { Thread } from '../types';
import { Button } from './ui/Button';

interface EmailDetailHeaderProps {
    thread: Thread | null;
    onToggleAIAssistant: () => void;
    onBack: () => void;
    isDetailView: boolean;
    onDiscoverClick: () => void;
    onScheduleMeetingClick: () => void;
    onSnoozeClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenKebabMenu: (threadId: string, anchorEl: HTMLElement) => void;
    onUnsnooze: (threadId: string) => void;
    onSummarize: () => void;
    isSummarizing: boolean;
    onComposeInteraction: (type: 'reply' | 'reply-all' | 'forward') => void;
    onToggleStar: () => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onOpenSearchFilters: (anchorEl: HTMLElement) => void;
    areFiltersActive: boolean;
    onGenerateAiReply?: () => void;
    isGeneratingReply?: boolean;
}

const EmailDetailHeader: React.FC<EmailDetailHeaderProps> = ({ 
    thread, onToggleAIAssistant, onBack, isDetailView, onDiscoverClick, 
    onScheduleMeetingClick, onSnoozeClick, onOpenKebabMenu, onUnsnooze, onSummarize, 
    isSummarizing, onComposeInteraction, onToggleStar, searchQuery, onSearchQueryChange,
    onOpenSearchFilters, areFiltersActive, onGenerateAiReply, isGeneratingReply
}) => {
    
    return (
        <header className="bg-background p-2 flex items-center justify-between flex-shrink-0 border-b border-border space-x-2">
            <div className="flex items-center space-x-1">
                {/* Desktop view has no back button here */}
            </div>
            <div className="flex items-center space-x-2 flex-1 justify-end">
                <div className="relative flex-1 max-w-sm">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></i>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => onSearchQueryChange(e.target.value)}
                        className="w-full bg-secondary border-none rounded-full pl-9 pr-4 h-10 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </div>
                {thread && (
                    <>
                        <Button 
                            onClick={onSummarize}
                            disabled={isSummarizing}
                            variant="secondary"
                            size="default"
                            className="rounded-full inline-flex"
                            title="Summarize thread"
                        >
                            <i className={`fa-solid fa-wand-magic-sparkles w-4 h-4 mr-2 ${isSummarizing ? 'animate-spin' : ''}`}></i>
                            <span>Summarize</span>
                        </Button>
                        <Button 
                            onClick={onGenerateAiReply}
                            disabled={isGeneratingReply}
                            variant="secondary"
                            size="default"
                            className="rounded-full inline-flex"
                            title="Draft a reply"
                        >
                            <i className={`fa-solid fa-pen-sparkles w-4 h-4 mr-2 ${isGeneratingReply ? 'animate-spin' : ''}`}></i>
                            <span>{isGeneratingReply ? 'Drafting...' : 'Draft Reply'}</span>
                        </Button>
                    </>
                )}
                 <Button variant="secondary" size="default" className="rounded-full" onClick={onToggleAIAssistant} title="AI Assistant">
                    <i className="fa-solid fa-wand-magic-sparkles w-4 h-4 mr-2"></i>
                    <span>Assistant</span>
                </Button>
                 <Button variant="secondary" size="default" className="rounded-full" onClick={onScheduleMeetingClick} title="Insert Meeting">
                    <i className="fa-regular fa-calendar w-4 h-4 mr-2"></i>
                    <span>Meeting</span>
                </Button>
            </div>
        </header>
    );
};

export default EmailDetailHeader;