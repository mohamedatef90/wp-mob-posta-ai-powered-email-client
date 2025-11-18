import React, { useState, useEffect } from 'react';
import type { Thread } from '../types';
import CalendarCard from './CalendarCard';
import { you } from '../constants';


interface MeetingDetails {
    title: string;
    date?: string;
    time?: string;
}

interface AIAssistantProps {
    selectedThread: Thread | null;
    onClose: () => void;
    mode: 'default' | 'scheduleMeeting';
}

const AIAssistant: React.FC<AIAssistantProps> = ({ selectedThread, onClose, mode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
    
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        // If there's an active action (like showing a summary), don't fetch new suggestions.
        // Also, do nothing if no thread is selected.
        if (activeAction || !selectedThread) {
            if (!selectedThread) {
                setSuggestions([]);
            }
            return;
        }

        // Reset states and show loading indicator
        setIsLoading(true);
        setError(null);
        if (mode === 'default') setSuggestions([]);
        if (mode === 'scheduleMeeting') setMeetingDetails(null);

        // Simulate fetching data
        const timer = setTimeout(() => {
            if (mode === 'default') {
                const participants = selectedThread.participants.filter(p => p.email !== you.email);
                const mainParticipantName = participants[0]?.name.split(' ')[0] || 'them';
                setSuggestions([
                    'Summarize thread',
                    `Draft a reply to ${mainParticipantName}`,
                    `Create a task for ${mainParticipantName}`
                ]);
            } else if (mode === 'scheduleMeeting') {
                 const today = new Date();
                 today.setDate(today.getDate() + 1); // Tomorrow
                 const tomorrowDate = today.toISOString().split('T')[0];
                setMeetingDetails({
                    title: `RE: ${selectedThread.subject}`,
                    date: tomorrowDate,
                    time: '11:00'
                });
            }
            setIsLoading(false);
        }, 700);

        return () => clearTimeout(timer);

    }, [selectedThread, mode, activeAction]);
    
    const handleAction = async (action: string) => {
        if (action.toLowerCase().includes('summarize')) {
            setActiveAction('summarize');
            setIsLoading(true);
            setError(null);
            setSummary(null);

            setTimeout(() => {
                 const mockSummary = `This is a summary for the thread: **${selectedThread?.subject}**.\n\nHere are the key points:\n- An urgent meeting has been called.\n- The meeting is tonight at 8 PM.\n- Important intelligence may be shared beforehand.\n\n**Action Item:**\n- Harry needs to attend the meeting.`;
                setSummary(mockSummary);
                setIsLoading(false);
            }, 800);
        } else {
             alert(`Action "${action}" is not implemented in this demo.`);
        }
    };


    const renderContent = () => {
        const participants = selectedThread?.participants.filter(p => p.email !== you.email) || [];
        const calendarProps = {
            participants,
            onClose,
            suggestedDetails: meetingDetails,
            isLoading,
        };

        if (mode === 'scheduleMeeting') {
            return (
                <>
                    <div className="flex justify-end">
                        <div className="bg-secondary px-4 py-2 rounded-2xl">
                            <p className="text-secondary-foreground">Schedule a meeting</p>
                        </div>
                    </div>
                    <CalendarCard {...calendarProps} />
                </>
            );
        }
        
        if (activeAction === 'summarize') {
            return (
                <>
                    <div className="flex items-center space-x-2 mb-4">
                        <button 
                            onClick={() => setActiveAction(null)} 
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                            aria-label="Back to suggestions"
                        >
                            <i className="fa-solid fa-arrow-left w-5 h-5"></i>
                        </button>
                        <h3 className="font-semibold text-lg">Thread Summary</h3>
                    </div>

                    {isLoading && (
                        <div className="bg-card border border-border rounded-xl p-4 text-center">
                            <p className="text-sm text-muted-foreground animate-pulse">Generating summary...</p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4">
                            <p className="text-sm font-semibold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {!isLoading && summary && (
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div 
                                className="whitespace-pre-wrap text-sm text-card-foreground font-sans prose prose-sm max-w-none text-foreground/90 [&_ul]:my-2 [&_li]:my-1 [&_p]:my-1"
                                dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }}
                            />
                        </div>
                    )}
                </>
            );
        }


        // Default view
        return (
            <>
                 <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0"><i className="fa-solid fa-star"></i></div>
                    <h3 className="font-semibold text-lg">AI Assistant</h3>
                </div>
                
                {isLoading && (
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-center">
                        <p className="text-sm text-muted-foreground animate-pulse">Analyzing this thread...</p>
                    </div>
                )}
                
                {!isLoading && error && (
                     <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 space-y-3">
                         <p className="text-sm font-semibold">Error</p>
                         <p className="text-sm">{error}</p>
                     </div>
                )}
                
                {!isLoading && !error && suggestions.length > 0 && (
                     <div className="bg-card border border-border rounded-xl p-3 space-y-2">
                         <p className="text-sm font-medium text-card-foreground px-1 pb-1">Here are some suggestions:</p>
                         {suggestions.map((s, i) => (
                             <button 
                                key={i}
                                onClick={() => handleAction(s)}
                                className="w-full text-left bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                             >
                                {s}
                             </button>
                         ))}
                     </div>
                )}
                 
                {!isLoading && !error && !selectedThread && (
                    <div className="bg-card border border-border rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">Select an email to get suggestions.</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="w-full h-full bg-background flex flex-col overflow-hidden">
           <div className="flex items-center justify-end p-2 flex-shrink-0">
               <button 
                   onClick={onClose}
                   className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                   aria-label="Close Assistant"
               >
                   <i className="fa-solid fa-xmark w-5 h-5"></i>
               </button>
           </div>
           <div className="flex-1 p-4 space-y-4 overflow-y-auto border-t border-border">
                {renderContent()}
            </div>

            <div className="p-4 border-t border-border bg-background">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Ask anything..."
                        className="w-full bg-secondary border border-border rounded-lg pl-4 pr-10 py-2.5 text-sm text-secondary-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-muted hover:bg-muted/80 rounded-md">
                        <i className="fa-solid fa-paper-plane w-4 h-4 text-muted-foreground"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AIAssistant;