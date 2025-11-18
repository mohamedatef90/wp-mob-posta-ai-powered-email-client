import React, { useContext } from 'react';
import type { Thread } from '../types';
import { Button } from './ui/Button';
import { AppContext } from './context/AppContext';

interface EmailDetailActionBarProps {
    thread: Thread;
    onComposeInteraction: (thread: Thread, type: 'reply' | 'reply-all' | 'forward') => void;
    onArchive: (threadId: string) => void;
    onDelete: (threadId: string) => void; 
}

const EmailDetailActionBar: React.FC<EmailDetailActionBarProps> = ({ thread, onComposeInteraction, onArchive, onDelete }) => {
    const { uiTheme } = useContext(AppContext);

    const handleArchive = () => {
        onArchive(thread.id);
    };

    const handleDelete = () => {
        onDelete(thread.id);
    };
    
    if (uiTheme === 'classic') {
      return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-2 bg-background/80 border-t border-border backdrop-blur-xl animate-fadeInUp" style={{animationDuration: '0.2s', paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))'}}>
            <div className="flex justify-around items-center">
                <Button variant="ghost" className="flex-col h-auto px-2 py-1 space-y-1 text-muted-foreground" onClick={() => onComposeInteraction(thread, 'reply')}>
                    <i className="fa-solid fa-reply w-5 h-5"></i>
                    <span className="text-xs">Reply</span>
                </Button>
                 <Button variant="ghost" className="flex-col h-auto px-2 py-1 space-y-1 text-muted-foreground" onClick={() => onComposeInteraction(thread, 'reply-all')}>
                    <i className="fa-solid fa-reply-all w-5 h-5"></i>
                    <span className="text-xs">Reply All</span>
                </Button>
                <Button variant="ghost" className="flex-col h-auto px-2 py-1 space-y-1 text-muted-foreground" onClick={() => onComposeInteraction(thread, 'forward')}>
                    <i className="fa-solid fa-reply w-5 h-5 transform -scale-x-100"></i>
                    <span className="text-xs">Forward</span>
                </Button>
                <Button variant="ghost" className="flex-col h-auto px-2 py-1 space-y-1 text-muted-foreground" onClick={handleDelete}>
                    <i className="fa-solid fa-trash w-5 h-5"></i>
                    <span className="text-xs">Delete</span>
                </Button>
                 <Button variant="ghost" className="flex-col h-auto px-2 py-1 space-y-1 text-muted-foreground" onClick={handleArchive}>
                    <i className="fa-solid fa-archive w-5 h-5"></i>
                    <span className="text-xs">Archive</span>
                </Button>
            </div>
        </div>
      );
    }
    
    // Modern Theme
    return (
        <div 
            className="md:hidden fixed bottom-5 left-0 right-0 z-30 px-2 flex justify-between items-center gap-2 animate-fadeInUp backdrop-blur-sm" 
            style={{animationDuration: '0.2s', paddingBottom: 'calc(env(safe-area-inset-bottom))'}}
        >

            {/* left Side Actions */}
            <div className="bg-white/60 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white/20 dark:border-white/60 rounded-[2rem] shadow-lg px-2 flex justify-around items-center h-12 flex-1">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-white/20" onClick={handleDelete} aria-label="Delete">
                    <i className="fa-solid fa-trash w-5 h-5"></i>
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-white/20" onClick={handleArchive} aria-label="Archive">
                    <i className="fa-solid fa-archive w-5 h-5"></i>
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-white/20" onClick={() => onComposeInteraction(thread, 'reply-all')} aria-label="Reply All">
                    <i className="fa-solid fa-reply-all w-5 h-5"></i>
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground hover:bg-white/20" onClick={() => onComposeInteraction(thread, 'forward')} aria-label="Forward">
                    <i className="fa-solid fa-share w-5 h-5"></i>
                </Button>
            </div>

            {/* right Side Reply Button */}
            <div className="bg-white/60 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white/20 dark:border-white/60 rounded-[2rem] shadow-lg px-2 flex justify-center items-center h-12">
                <Button variant="ghost" className="h-10 px-6 text-foreground hover:bg-white/20 font-semibold flex items-center space-x-2" onClick={() => onComposeInteraction(thread, 'reply')}>
                    <i className="fa-solid fa-reply w-5 h-5"></i>
                    <span>Reply</span>
                </Button>
            </div>
        </div>
    );
};

export default EmailDetailActionBar;