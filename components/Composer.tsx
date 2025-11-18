import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { allUsers, you } from '../constants';
import type { User } from '../types';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface ComposerProps {
    isOpen: boolean;
    onClose: () => void;
    initialState?: { to?: string; subject?: string; body?: string; } | null;
    isMinimized: boolean;
    isMaximized: boolean;
    onToggleMinimize: () => void;
    onToggleMaximize: () => void;
    onSend: (email: { to: string, subject: string, body: string, attachments: File[] }) => void;
}

const Composer: React.FC<ComposerProps> = ({ 
    isOpen, onClose, initialState, isMinimized, isMaximized, onToggleMinimize, onToggleMaximize, onSend 
}) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<User[]>([]);
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
    
    const saveTimeoutRef = useRef<number | null>(null);
    const dragCounter = useRef(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toInputRef = useRef<HTMLInputElement>(null);
    const composerRef = useRef<HTMLDivElement>(null);

    const hasContent = to || subject || body || attachments.length > 0;

    useEffect(() => {
        if (isOpen && initialState) {
            setTo(initialState.to || '');
            setSubject(initialState.subject || '');
            setBody(initialState.body || '');
        }
    }, [isOpen, initialState]);
    
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => toInputRef.current?.focus(), 100); // Small delay to ensure element is visible
        }
    }, [isOpen, isMinimized, isMaximized]);

    // Auto-save draft
    useEffect(() => {
        if (hasContent) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = window.setTimeout(() => {
                console.log('📝 Saving draft...', { to, subject, body: body.substring(0, 20), attachments: attachments.map(f => f.name) });
            }, 3000); // Save after 3 seconds of inactivity
        }
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [to, subject, body, attachments, hasContent]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
                setIsAutocompleteOpen(false);
            }
        };
        if (isAutocompleteOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAutocompleteOpen]);
    
    const handleClose = () => {
        if(hasContent && !window.confirm("You have an unsaved draft. Are you sure you want to close?")) {
            return;
        }
        setTo(''); setSubject(''); setBody(''); setAttachments([]);
        onClose();
    }
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange({ target: e.dataTransfer } as any);
            e.dataTransfer.clearData();
        }
    };
    
    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTo(value);

        const lastEntry = value.split(/[,;]/).pop()?.trim().toLowerCase();

        if (lastEntry && lastEntry.length > 1) {
            const suggestions = allUsers.filter(user =>
                user.email !== you.email &&
                (user.name.toLowerCase().includes(lastEntry) || user.email.toLowerCase().includes(lastEntry))
            );
            setAutocompleteSuggestions(suggestions.slice(0, 5));
        } else {
            setAutocompleteSuggestions([]);
        }
    };

    const handleSelectSuggestion = (user: User) => {
        const parts = to.split(/[,;]/);
        parts.pop();
        parts.push(user.email);
        setTo(parts.join(', ') + ', ');
        setAutocompleteSuggestions([]);
        toInputRef.current?.focus();
    };

    const handlePlusClick = () => {
        setAutocompleteSuggestions(allUsers.filter(u => u.email !== you.email));
        setIsAutocompleteOpen(true);
        toInputRef.current?.focus();
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={composerRef}
            className={cn(
                "fixed z-50 transition-all duration-300 ease-in-out",
                 isMaximized 
                    ? "inset-auto w-[90vw] max-w-4xl h-[90dvh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    : isMinimized 
                        ? "bottom-0 right-4 w-full max-w-sm" 
                        : "bottom-0 right-4 w-full max-w-lg h-[500px]",
                !isMinimized && "animate-fadeInUp"
            )}
            style={{ animationDuration: '0.3s' }}
        >
            <div 
                className={cn(
                    "shadow-2xl flex flex-col relative w-full h-full backdrop-blur-2xl bg-white dark:bg-[hsl(224,20%,18%)] border border-border",
                    isMaximized
                        ? "rounded-2xl"
                        : isMinimized
                            ? "rounded-lg border-b"
                            : "rounded-t-lg border-b-0"
                )}
                onDragEnter={handleDragEnter} 
                onDragLeave={handleDragLeave} 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <header 
                    className={cn(
                        "px-4 py-2 flex justify-between items-center",
                         isMaximized ? "bg-transparent" : isMinimized ? "bg-secondary rounded-lg" : "bg-secondary rounded-t-lg",
                         isMinimized ? "cursor-pointer" : "cursor-move"
                    )}
                    onClick={isMinimized ? onToggleMinimize : undefined}
                >
                    <h3 className={cn("font-semibold truncate pr-2", isMaximized ? "text-foreground" : "text-secondary-foreground")}>{subject || 'New Message'}</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); onToggleMinimize(); }} className="text-muted-foreground hover:text-foreground"><i className="fa-solid fa-minus w-4 h-4"></i></button>
                        <button onClick={(e) => { e.stopPropagation(); onToggleMaximize(); }} className="text-muted-foreground hover:text-foreground">
                             <i className={cn("w-4 h-4", isMaximized ? "fa-solid fa-compress" : "fa-regular fa-window-maximize")}></i>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleClose(); }} className="text-muted-foreground hover:text-foreground"><i className="fa-solid fa-xmark w-4 h-4"></i></button>
                    </div>
                </header>

                {!isMinimized && (
                    <>
                        <div className="px-4 flex flex-col flex-1 overflow-hidden">
                            <div className="relative">
                                <div className={cn("border-b flex items-center", isMaximized ? "border-border" : "border-border")}>
                                    <span className="py-2 pr-2 text-sm text-muted-foreground">To</span>
                                    <input 
                                        ref={toInputRef}
                                        type="text" 
                                        value={to} 
                                        onChange={handleToChange}
                                        onFocus={() => setIsAutocompleteOpen(true)}
                                        placeholder="" 
                                        className="w-full py-2 bg-transparent focus:outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1" 
                                    />
                                    <Button onClick={handlePlusClick} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                        <i className="fa-solid fa-plus w-4 h-4 text-muted-foreground"></i>
                                    </Button>
                                </div>
                                {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-popover border border-border shadow-lg rounded-b-lg z-20 max-h-60 overflow-y-auto no-scrollbar animate-fadeInDown backdrop-blur-2xl" style={{animationDuration: '0.2s'}}>
                                        {autocompleteSuggestions.map(user => (
                                            <div key={user.email} onMouseDown={() => handleSelectSuggestion(user)} className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center space-x-3">
                                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={cn("border-b", isMaximized ? "border-border" : "border-border")}>
                                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full py-2 bg-transparent focus:outline-none text-sm text-foreground placeholder:text-muted-foreground" />
                            </div>
                            {attachments.length > 0 && (
                                <div className={cn("py-2 border-b max-h-24 overflow-y-auto no-scrollbar", isMaximized ? "border-border" : "border-border")}>
                                    {attachments.map((file, index) => (
                                        <div key={index} className={cn("flex items-center justify-between p-1.5 rounded-md my-1 animate-fadeIn", isMaximized ? "bg-secondary" : "bg-secondary")}>
                                            <div className="flex items-center space-x-2 text-sm min-w-0">
                                                <i className="fa-solid fa-paperclip text-muted-foreground flex-shrink-0"></i>
                                                <span className={cn("truncate", isMaximized ? "text-foreground" : "text-secondary-foreground")}>{file.name}</span>
                                                <span className="text-muted-foreground text-xs flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                                            </div>
                                            <button onClick={() => removeAttachment(index)} className="text-muted-foreground hover:text-foreground flex-shrink-0 ml-2">
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex-1 relative">
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    spellCheck="true"
                                    className="w-full h-full pt-2 bg-transparent focus:outline-none text-sm resize-none text-foreground placeholder:text-muted-foreground no-scrollbar"
                                    placeholder="Compose your email..."
                                />
                            </div>
                        </div>
                        <footer className={cn("p-3 border-t flex justify-between items-center", isMaximized ? "border-border" : "border-border")}>
                            <Button onClick={() => onSend({ to, subject, body, attachments })}>Send</Button>
                            <div className="flex items-center space-x-1 text-muted-foreground">
                                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                <Button variant="ghost" size="icon" title="Formatting options" onClick={() => console.log('Formatting clicked')}><i className="fa-solid fa-underline"></i></Button>
                                <Button variant="ghost" size="icon" title="Attach files" onClick={handleAttachClick}><i className="fa-solid fa-paperclip"></i></Button>
                                <Button variant="ghost" size="icon" title="Insert link" onClick={() => console.log('Link clicked')}><i className="fa-solid fa-link"></i></Button>
                                <Button variant="ghost" size="icon" title="Insert emoji" onClick={() => console.log('Emoji clicked')}><i className="fa-regular fa-face-smile"></i></Button>
                            </div>
                        </footer>
                    </>
                )}

                {isDragging && !isMinimized && (
                    <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center text-primary">
                            <i className="fa-solid fa-upload text-3xl"></i>
                            <p className="font-semibold mt-2">Drop files to attach</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Composer;