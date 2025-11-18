import React from 'react';
import type { Thread, Message, User } from '../types';
import { you } from '../constants';
import { Card } from './ui/Card';

interface EmailDetailProps {
  thread: Thread | null;
  summaryState: {
    threadId: string | null;
    summary: string | null;
    isLoading: boolean;
    error: string | null;
  };
  onClearSummary: () => void;
  onComposeInteraction: (type: 'reply', message: Message) => void;
  onToggleStar: () => void;
  onOpenKebabMenu: (anchorEl: HTMLElement) => void;
}

const ThreadSummary: React.FC<{
    summary: string | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}> = ({ summary, isLoading, error, onClose }) => {
    return (
        <div className="bg-secondary rounded-lg p-4 my-4 border border-border animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                    <i className="fa-solid fa-wand-magic-sparkles text-primary"></i>
                    <h3 className="font-semibold text-secondary-foreground">AI Summary</h3>
                </div>
                <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-background text-muted-foreground" title="Dismiss summary">
                    <i className="fa-solid fa-xmark w-4 h-4"></i>
                </button>
            </div>
            
            {isLoading && (
                <div className="text-sm text-muted-foreground animate-pulse">Generating summary...</div>
            )}
            
            {error && (
                <div className="text-sm text-destructive">{error}</div>
            )}

            {summary && (
                <div className="whitespace-pre-wrap text-sm text-secondary-foreground/90 font-sans prose prose-sm max-w-none [&_ul]:my-2 [&_li]:my-1">
                   {summary}
                </div>
            )}
        </div>
    );
}

const EmailMessage: React.FC<{ message: Message; allParticipants: User[]; subject: string; isStarred: boolean; onReply: () => void; onToggleStar: () => void; onOpenKebabMenu: (e: React.MouseEvent<HTMLButtonElement>) => void; }> = ({ message, allParticipants, subject, isStarred, onReply, onToggleStar, onOpenKebabMenu }) => {
    const toUsers = allParticipants.filter(p => p.email !== message.sender.email);
    const date = new Date(message.timestamp);
    const formattedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);

    return (
        <Card className="p-6 mb-4  animate-fadeInUp">
            <div className="flex justify-between items-start mb-4">
                 <div className="flex items-start space-x-4 min-w-0">
                    <img src={message.sender.avatarUrl} alt={message.sender.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{message.sender.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{subject}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                            To: {toUsers.map(p => p.email === you.email ? 'me' : p.name).join(', ')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground text-sm flex-shrink-0 ml-4">
                    <span className="text-xs inline-block">{formattedDate}</span>
                    <button onClick={onReply} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent" title="Reply"><i className="fa-solid fa-reply w-4 h-4"></i></button>
                    <button onClick={onToggleStar} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent" title="Star">
                        <i className={`w-4 h-4 ${isStarred ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star'}`}></i>
                    </button>
                    <button onClick={onOpenKebabMenu} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent" title="More options"><i className="fa-solid fa-ellipsis-h w-4 h-4"></i></button>
                </div>
            </div>
            <div 
                className="prose prose-sm max-w-none text-foreground/90 [&_a]:text-primary [&_p]:my-1" 
                dangerouslySetInnerHTML={{ __html: message.body }} 
            />
        </Card>
    );
};

const CommentingIndicator: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-2.5 my-4 animate-pulse">
        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
        <div>
            <p className="text-sm text-muted-foreground italic">{user.name} is commenting...</p>
        </div>
    </div>
);

const EmailDetail: React.FC<EmailDetailProps> = ({ thread, summaryState, onClearSummary, onComposeInteraction, onToggleStar, onOpenKebabMenu }) => {
  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-card text-muted-foreground rounded-xl border border-border">
        <i className="fa-regular fa-folder-open text-8xl text-muted-foreground/50"></i>
        <p className="mt-4 text-lg">Select an item to read</p>
      </div>
    );
  }
  
  const showSummary = summaryState.threadId === thread.id && (summaryState.isLoading || summaryState.summary || summaryState.error);

  return (
    <div className="flex flex-col h-full flex-1 overflow-auto">
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-3xl font-bold text-foreground truncate mb-6">{thread.subject}</h2>
        
        {showSummary && (
            <ThreadSummary 
                isLoading={summaryState.isLoading}
                summary={summaryState.summary}
                error={summaryState.error}
                onClose={onClearSummary}
            />
        )}
        {thread.messages.map(msg => <EmailMessage 
          key={msg.id} 
          message={msg} 
          allParticipants={thread.participants} 
          subject={thread.subject} 
          isStarred={!!thread.isStarred}
          onReply={() => onComposeInteraction('reply', msg)}
          onToggleStar={onToggleStar}
          onOpenKebabMenu={(e) => onOpenKebabMenu(e.currentTarget)}
        />)}
        {thread.commenter && <CommentingIndicator user={thread.commenter} />}
      </div>
    </div>
  );
};

export default EmailDetail;