
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { you, MOCK_THREADS } from '../constants';
import type { Thread, User } from '../types';
import AttachEmailModal from './AttachEmailModal';
import { AICopilotIcon } from './Icons';

// --- Type Definitions ---
interface CopilotMessage {
  author: 'user' | 'model';
  text: string;
}

interface CopilotConversation {
  id: string;
  title: string;
  messages: CopilotMessage[];
  timestamp: string;
}

// --- Mock Data ---
const MOCK_COPILOT_CONVERSATIONS: CopilotConversation[] = [
  {
    id: 'copilot-1',
    title: 'Draft an email to a client',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    messages: [
      { author: 'user', text: 'Draft an email to a client about a project delay.' },
      { author: 'model', text: 'Of course. What is the client\'s name and the new projected timeline?' },
    ],
  },
  {
    id: 'copilot-2',
    title: 'Explain quantum computing',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    messages: [
      { author: 'user', text: 'Explain quantum computing in simple terms.' },
      { author: 'model', text: 'Imagine a regular computer bit is a light switch that\'s either on or off. A quantum bit, or qubit, is like a dimmer switch that can be on, off, or somewhere in between, all at the same time. This allows quantum computers to solve certain complex problems much faster than regular computers.' },
    ],
  },
  {
    id: 'copilot-3',
    title: 'React component for a button',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    messages: [
      { author: 'user', text: 'Give me a simple React component for a button.' },
      { author: 'model', text: '```jsx\nimport React from \'react\';\n\nconst Button = ({ onClick, children }) => {\n  return (\n    <button onClick={onClick} style={{ padding: \'10px 20px\', borderRadius: \'5px\' }}>\n      {children}\n    </button>\n  );\n};\n\nexport default Button;\n```' },
    ],
  }
];


// --- Helper Components ---

const CopilotHistoryItem: React.FC<{ conversation: CopilotConversation; isSelected: boolean; onSelect: (id: string) => void }> = ({ conversation, isSelected, onSelect }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div onClick={() => onSelect(conversation.id)} className={`flex flex-col p-3 cursor-pointer transition-colors duration-150 rounded-lg ${isSelected ? 'bg-accent' : 'hover:bg-accent/50'}`}>
            <p className="font-semibold text-sm text-foreground truncate">{conversation.title}</p>
            <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground truncate pr-2">{conversation.messages[conversation.messages.length - 1].text}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(conversation.timestamp)}</p>
            </div>
        </div>
    );
};

// --- Main Component ---

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const CopilotViewMobile: React.FC = () => {
  const [conversations, setConversations] = useState<CopilotConversation[]>(MOCK_COPILOT_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('new');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAttachEmailModalOpen, setIsAttachEmailModalOpen] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedConversation = useMemo(() => {
    if (selectedConversationId === 'new') return null;
    return conversations.find(c => c.id === selectedConversationId);
  }, [selectedConversationId, conversations]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [selectedConversation?.messages, isLoading, selectedConversationId]);

  const handleNewChat = () => {
    setSelectedConversationId('new');
    setInput('');
    setIsHistorySidebarOpen(false);
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setIsHistorySidebarOpen(false);
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const fileNames = Array.from(e.target.files).map((f: File) => f.name).join(', ');
          setInput(prev => `${prev} [Attached file(s): ${fileNames}]`);
      }
      if (e.target) e.target.value = '';
  };

  const handleSendMessage = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: CopilotMessage = { author: 'user', text: messageText };
    const currentInput = messageText;
    setInput('');
    setIsLoading(true);

    let conversationToUpdateId = selectedConversationId === 'new' ? null : selectedConversationId;

    if (!conversationToUpdateId) {
        const newConversation: CopilotConversation = {
            id: `copilot-${Date.now()}`,
            title: currentInput.substring(0, 40) + (currentInput.length > 40 ? '...' : ''),
            messages: [userMessage],
            timestamp: new Date().toISOString(),
        };
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
        conversationToUpdateId = newConversation.id;
    } else {
        setConversations(prev => prev.map(c => 
            c.id === conversationToUpdateId 
                ? { ...c, messages: [...c.messages, userMessage], timestamp: new Date().toISOString() } 
                : c
        ));
    }
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: currentInput,
      });
      
      let modelResponse = '';
      let addedModelMessage = false;

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        setConversations(prev => {
            return prev.map(c => {
                if (c.id === conversationToUpdateId) {
                    if (!addedModelMessage) {
                        addedModelMessage = true;
                        // Add the new model message
                        return { ...c, messages: [...c.messages, { author: 'model', text: modelResponse }] };
                    } else {
                        // Update the last model message
                        const updatedMessages = [...c.messages];
                        updatedMessages[updatedMessages.length - 1] = { author: 'model', text: modelResponse };
                        return { ...c, messages: updatedMessages, timestamp: new Date().toISOString() };
                    }
                }
                return c;
            });
        });
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setConversations(prev => prev.map(c => {
        if (c.id === conversationToUpdateId) {
            const lastMessage = c.messages[c.messages.length - 1];
            if(lastMessage.author === 'model'){
                 const updatedMessages = [...c.messages];
                 updatedMessages[updatedMessages.length-1].text = 'Sorry, something went wrong. Please try again.';
                 return {...c, messages: updatedMessages};
            }
            return { ...c, messages: [...c.messages, { author: 'model', text: 'Sorry, something went wrong. Please try again.' }]};
        }
        return c;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  const handleAttachEmail = (thread: Thread) => {
    const fromName = thread.participants[0]?.name ?? 'Unknown Sender';
    const firstMessageBody = (thread.messages[0]?.body ?? '').replace(/<[^>]*>/g, '').substring(0, 200);
    const emailContext = `\n\n--- Linked Email ---\nSubject: ${thread.subject}\nFrom: ${fromName}\n\n${firstMessageBody}...\n---`;
    setInput(prev => `${prev}${emailContext}`.trim());
    setIsAttachEmailModalOpen(false);
  };

  const lastMessage = selectedConversation?.messages[selectedConversation.messages.length - 1];

  return (
    <div className="flex h-full w-full bg-background relative overflow-hidden">
        {/* History Sidebar */}
        <aside className={cn(
            "absolute top-0 left-0 h-full w-[300px] bg-[#fcfcfc] dark:bg-background border-r border-border flex-shrink-0 flex flex-col z-50 transition-transform duration-300 ease-in-out",
            isHistorySidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
            <div className="p-4 border-b border-border flex-shrink-0 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                  <AICopilotIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">Copilot Chats</h2>
              </div>
              <Button onClick={handleNewChat} variant="ghost" size="icon" title="New Chat" className="inline-flex">
                  <AICopilotIcon className="w-6 h-6 text-primary" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-24">
              {conversations.map(conv => (
                  <CopilotHistoryItem key={conv.id} conversation={conv} isSelected={conv.id === selectedConversationId} onSelect={handleSelectConversation} />
              ))}
          </div>
        </aside>

        {isHistorySidebarOpen && (
            <div 
                onClick={() => setIsHistorySidebarOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                aria-hidden="true"
            ></div>
        )}

        {/* Main Chat Window */}
        <div className="flex flex-col flex-1 h-full bg-card">
            <header className="p-2 border-b border-border flex items-center flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setIsHistorySidebarOpen(true)} className="h-10 w-10">
                    <i className="fa-solid fa-bars w-5 h-5 text-foreground"></i>
                </Button>
                <h2 className="text-lg font-bold ml-2 truncate">{selectedConversation?.title || "New Chat"}</h2>
           </header>
          {/* Main chat area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 pb-4">
              <div className="max-w-3xl mx-auto h-full">
                  {(selectedConversationId || selectedConversationId === 'new') ? (
                      <div className="space-y-6 h-full">
                           {selectedConversationId === 'new' && !selectedConversation?.messages.length ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground animate-fadeIn p-4">
                                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-6">
                                        <AICopilotIcon className="w-12 h-12 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground mb-8">How can I help you today?</h1>
                                    
                                    <div className="flex flex-col gap-3 w-full max-w-md px-2">
                                         {/* Email AI Suggestions */}
                                         <button onClick={() => handleSuggestionClick("Summarize my unread emails from today")} className="w-full text-left bg-secondary/50 hover:bg-secondary border border-border/50 px-4 py-3 rounded-2xl text-sm font-medium text-foreground transition-all flex items-center gap-3">
                                            <i className="fa-solid fa-envelope text-primary"></i>
                                            <span>Summarize my unread emails from today</span>
                                         </button>
                                         
                                         <button onClick={() => handleSuggestionClick("Draft a follow-up email for the project meeting")} className="w-full text-left bg-secondary/50 hover:bg-secondary border border-border/50 px-4 py-3 rounded-2xl text-sm font-medium text-foreground transition-all flex items-center gap-3">
                                            <i className="fa-solid fa-pen-fancy text-primary"></i>
                                            <span>Draft a follow-up email for the project meeting</span>
                                         </button>

                                         {/* General Questions */}
                                         <button onClick={() => handleSuggestionClick("What are the key principles of effective leadership?")} className="w-full text-left bg-secondary/50 hover:bg-secondary border border-border/50 px-4 py-3 rounded-2xl text-sm font-medium text-foreground transition-all flex items-center gap-3">
                                            <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                                            <span>What are the key principles of effective leadership?</span>
                                         </button>
                                         
                                         <button onClick={() => handleSuggestionClick("Explain the concept of quantum entanglement")} className="w-full text-left bg-secondary/50 hover:bg-secondary border border-border/50 px-4 py-3 rounded-2xl text-sm font-medium text-foreground transition-all flex items-center gap-3">
                                            <i className="fa-solid fa-graduation-cap text-green-500"></i>
                                            <span>Explain the concept of quantum entanglement</span>
                                         </button>
                                    </div>
                                </div>
                            ) : (
                              <>
                                {selectedConversation?.messages.map((msg, index) => (
                                     <div key={index} className={`flex items-start space-x-4 animate-fadeInUp ${msg.author === 'user' ? 'justify-end' : ''}`}>
                                        {msg.author === 'model' && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0"><i className="fa-solid fa-star"></i></div>}
                                        <div className={`px-4 py-3 rounded-2xl max-w-xl ${msg.author === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-background text-foreground'}`}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        {msg.author === 'user' && <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=You" alt="User Avatar" className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                    </div>
                                ))}
                                 {isLoading && (lastMessage?.author === 'user' || selectedConversationId === 'new') && (
                                    <div className="flex items-start space-x-4 animate-fadeInUp">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0"><i className="fa-solid fa-star"></i></div>
                                        <div className="px-4 py-3 rounded-xl max-w-xl bg-background text-foreground">
                                            <div className="flex items-center space-x-2">
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '200ms'}}></span>
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{animationDelay: '400ms'}}></span>
                                            </div>
                                        </div>
                                    </div>
                                 )}
                              </>
                            )}
                      </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground animate-fadeIn">
                          <div className="inline-block bg-primary p-4 rounded-full shadow-lg">
                             <AICopilotIcon className="w-12 h-12 text-primary-foreground" />
                          </div>
                          <h1 className="text-3xl font-bold text-foreground mt-4">Hello, {you.name.split(' ')[0]}.</h1>
                          <p className="mt-2">Select a chat to continue or start a new one.</p>
                      </div>
                  )}
              </div>
          </div>
          {/* Input area */}
          <div className="px-4 pt-4 pb-4 border-t border-border bg-background flex-shrink-0" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
              <div className="max-w-3xl mx-auto">
                   <div className="flex items-end space-x-2 w-full">
                        <div className="flex-1 relative">
                            <textarea
                                placeholder="Message Copilot..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                rows={1}
                                className="w-full bg-secondary border border-border rounded-full py-3 px-4 text-base text-secondary-foreground placeholder-muted-foreground focus:outline-none resize-none max-h-[200px] no-scrollbar focus:ring-2 focus:ring-ring"
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                            />
                        </div>

                        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                        <Button variant="secondary" size="icon" className="flex-shrink-0 h-12 w-12 rounded-full" aria-label="Attach" onClick={handleAttachClick}>
                            <i className="fa-solid fa-paperclip w-5 h-5"></i>
                        </Button>
                        
                        <Button
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="rounded-full flex-shrink-0 h-12 w-12"
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <i className="fa-solid fa-spinner animate-spin w-5 h-5"></i>
                            ) : (
                                <i className="fa-solid fa-arrow-up w-5 h-5"></i>
                            )}
                        </Button>
                    </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">Copilot may display inaccurate info, so double-check its responses.</p>
              </div>
          </div>
        </div>
        <AttachEmailModal 
            isOpen={isAttachEmailModalOpen}
            onClose={() => setIsAttachEmailModalOpen(false)}
            threads={MOCK_THREADS}
            onSelect={handleAttachEmail}
        />
    </div>
  );
};

export default CopilotViewMobile;
