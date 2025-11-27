

import React, { useContext, useState } from 'react';
import type { Thread, Message, User } from '../types';
import { you } from '../constants';
import { Card } from './ui/Card';
import { AppContext } from './context/AppContext';
import { Button } from './ui/Button';

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
  onSummarize: () => void;
  onGenerateAiReply?: () => void;
  isGeneratingReply?: boolean;
  onAddToCalendar?: () => void;
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

    return (
        <Card className="p-4 mb-4 animate-fadeInUp">
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
                <div className="flex items-center space-x-3 text-muted-foreground text-sm flex-shrink-0 ml-2">
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

// --- CLASSIC THEME COMPONENTS ---
const MessageItemClassic: React.FC<{ message: Message; onOpenKebabMenu: (anchorEl: HTMLElement) => void; onReply: () => void; }> = ({ message, onOpenKebabMenu, onReply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const date = new Date(message.timestamp);
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="mt-8">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <img src={message.sender.avatarUrl} alt={message.sender.name} className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2">
              <p className="font-bold text-base text-foreground truncate">{message.sender.name}</p>
              <p className="text-xs text-muted-foreground flex-shrink-0">{time}</p>
            </div>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-muted-foreground flex items-center">
              to me <i className={`fa-solid fa-chevron-down ml-1 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-muted-foreground text-lg ml-2">
          <button><i className="fa-regular fa-face-smile"></i></button>
          <button onClick={onReply}><i className="fa-solid fa-reply"></i></button>
          <button onClick={(e) => onOpenKebabMenu(e.currentTarget)}><i className="fa-solid fa-ellipsis-v"></i></button>
        </div>
      </div>
      
      {isExpanded && (
          <div className="mt-4 ml-13 bg-secondary/50 border border-border rounded-lg p-3 text-xs text-muted-foreground">
              <p><strong>From:</strong> {`${message.sender.name} <${message.sender.email}>`}</p>
              <p><strong>To:</strong> you &lt;{you.email}&gt;</p>
              <p><strong>Date:</strong> {date.toLocaleString()}</p>
          </div>
      )}
      
      <div className="mt-6 text-base text-gray-800 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: message.body }} />
      
      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-2">
          {message.attachments.map(att => (
            att.type === 'image' && (
              <div key={att.id} className="border border-border rounded-lg overflow-hidden">
                <img src={att.url} alt={att.filename} className="w-full h-auto object-cover" />
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};


const EmailDetailMobile: React.FC<EmailDetailProps> = ({ thread, summaryState, onClearSummary, onComposeInteraction, onToggleStar, onOpenKebabMenu, onSummarize, onGenerateAiReply, isGeneratingReply, onAddToCalendar }) => {
  const { uiTheme } = useContext(AppContext);
  
  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-card text-muted-foreground rounded-xl border border-border">
        <i className="fa-regular fa-folder-open text-8xl text-muted-foreground/50"></i>
        <p className="mt-4 text-lg">Select an item to read</p>
      </div>
    );
  }

  const isMeeting = thread.subject.toLowerCase().includes('invitation') || thread.subject.toLowerCase().includes('meeting') || thread.subject.toLowerCase().includes('kickoff');

  // --- CLASSIC THEME ---
  if (uiTheme === 'classic') {
    return (
        <div className="flex flex-col h-full flex-1 overflow-auto bg-background text-foreground pb-20">
          <div className="flex-1 overflow-y-auto px-4 pt-4">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-normal text-foreground flex-1 pr-4">{thread.subject}</h1>
              <button onClick={onToggleStar} className="text-muted-foreground pt-1">
                <i className={`fa-star text-xl ${thread.isStarred ? 'fa-solid text-yellow-500' : 'fa-regular'}`}></i>
              </button>
            </div>
            {thread.category === 'primary' && <span className="bg-zinc-200 text-zinc-700 text-xs font-medium px-2 py-1 rounded">Inbox</span>}
            
            {isMeeting && onAddToCalendar && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <i className="fa-regular fa-calendar-check text-blue-600 dark:text-blue-400 text-lg"></i>
                        <div>
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Meeting Detected</p>
                        </div>
                    </div>
                    <Button size="sm" onClick={onAddToCalendar} className="bg-blue-600 text-white hover:bg-blue-700 border-none h-8 px-3 text-xs">Add to Calendar</Button>
                </div>
            )}

            {thread.messages.map((msg) => (
              <MessageItemClassic 
                key={msg.id} 
                message={msg} 
                onOpenKebabMenu={onOpenKebabMenu} 
                onReply={() => onComposeInteraction('reply', msg)}
              />
            ))}
  
            <div className="mt-12 text-center">
              <p className="text-sm font-medium text-primary mb-3">Start your reply with one tap</p>
              <div className="flex justify-center gap-2">
                <Button variant="secondary" className="rounded-full !bg-card border border-border !text-primary shadow-sm">Great pictures!</Button>
                <Button variant="secondary" className="rounded-full !bg-card border border-border !text-primary shadow-sm">Amazing photos!</Button>
              </div>
            </div>
          </div>
        </div>
      );
  }

  // --- MODERN THEME ---
  const showSummary = summaryState.threadId === thread.id && (summaryState.isLoading || summaryState.summary || summaryState.error);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4 pt-20 pb-28">
        <h2 className="text-2xl font-bold text-foreground truncate mb-4">{thread.subject}</h2>
        
        {isMeeting && onAddToCalendar && (
            <div className="mb-6 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-2.5 rounded-xl">
                        <i className="fa-regular fa-calendar-plus text-primary text-xl"></i>
                    </div>
                    <div>
                        <p className="font-bold text-foreground text-sm">Meeting Detected</p>
                        <p className="text-xs text-muted-foreground">Add to your calendar</p>
                    </div>
                </div>
                <Button size="sm" onClick={onAddToCalendar} className="rounded-lg font-semibold">Add</Button>
            </div>
        )}

        <div className="flex items-center gap-3 mb-4">
            <button 
                onClick={onSummarize}
                className="flex-1 bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-xl shadow-md px-4 py-3 flex items-center justify-center space-x-2 transition-all hover:bg-white/30 dark:hover:bg-zinc-800/40"
            >
                <i className="fa-solid fa-wand-magic-sparkles bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"></i>
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Summarise
                </span>
            </button>
            <button 
                onClick={onGenerateAiReply}
                disabled={isGeneratingReply}
                className="flex-1 bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-xl shadow-md px-4 py-3 flex items-center justify-center space-x-2 transition-all hover:bg-white/30 dark:hover:bg-zinc-800/40 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <i className={`fa-solid fa-pen-sparkles bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 ${isGeneratingReply ? 'animate-spin' : ''}`}></i>
                <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    {isGeneratingReply ? 'Drafting...' : 'Draft Reply'}
                </span>
            </button>
        </div>

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

export default EmailDetailMobile;