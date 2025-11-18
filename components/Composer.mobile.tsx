import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './ui/Button';
import { AICopilotIcon } from './Icons';

interface ComposerMobileProps {
    onClose: () => void;
    initialState?: { to?: string; subject?: string; body?: string; } | null;
    onSend: (email: { to: string, cc: string, bcc: string, subject: string, body: string, attachments: File[] }) => void;
}

const AIPopover: React.FC<{
    anchorEl: HTMLElement | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (option: 'prompt' | 'proofread') => void;
}> = ({ anchorEl, isOpen, onClose, onSelect }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                popoverRef.current && 
                !popoverRef.current.contains(event.target as Node) && 
                anchorEl && 
                !anchorEl.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose, anchorEl]);

    if (!isOpen || !anchorEl) return null;

    const rect = anchorEl.getBoundingClientRect();
    const style = {
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
    };

    return ReactDOM.createPortal(
        <div 
            ref={popoverRef}
            className="fixed z-[60] bg-popover/80 backdrop-blur-xl rounded-xl shadow-lg w-48 animate-scaleIn"
            style={style}
        >
            <div className="p-2">
                <button onClick={() => onSelect('prompt')} className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent rounded-md transition-colors">
                    Enter prompt
                </button>
                <button onClick={() => onSelect('proofread')} className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent rounded-md transition-colors">
                    Proofread
                </button>
            </div>
        </div>,
        document.body
    );
};


const ComposerMobile: React.FC<ComposerMobileProps> = ({ onClose, initialState, onSend }) => {
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isCcBccExpanded, setIsCcBccExpanded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
    const aiButtonRef = useRef<HTMLButtonElement>(null);
    const [isFormattingOpen, setIsFormattingOpen] = useState(false);

    const hasContent = to || cc || bcc || subject || body || attachments.length > 0;
    
    useEffect(() => {
        if (initialState) {
            setTo(initialState.to || '');
            setSubject(initialState.subject || '');
            setBody(initialState.body || '');
        }
    }, [initialState]);

    const handleSend = () => {
        if (!to.trim()) {
            alert("Please fill in the recipient field.");
            return;
        }
        onSend({ to, cc, bcc, subject, body, attachments });
    };
    
    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };
    
    const handleAiClick = () => {
        setIsAiMenuOpen(prev => !prev);
    };

    const handleAiMenuSelect = (option: 'prompt' | 'proofread') => {
        setIsAiMenuOpen(false);
        if (option === 'proofread') {
            alert('Proofreading email body...'); // Placeholder
        } else {
            const prompt = window.prompt("Enter your prompt for the AI:");
            if (prompt) {
                alert(`AI will work on: ${prompt}`); // Placeholder
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-fadeInUp">
            <header className="p-2 flex items-center justify-between flex-shrink-0">
                <Button variant="ghost" size="default" onClick={onClose} className="text-primary font-semibold">
                    Cancel
                </Button>
                <h2 className="text-lg font-bold">New Message</h2>
                <div className="flex items-center space-x-2">
                     <Button ref={aiButtonRef} variant="ghost" size="icon" className="h-10 w-10 text-primary" onClick={handleAiClick}>
                        <AICopilotIcon className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => alert('Send Later clicked!')} className="h-10 w-10 text-primary">
                        <i className="fa-regular fa-clock w-5 h-5"></i>
                    </Button>
                    <Button onClick={handleSend} disabled={!to.trim()} size="icon" className="h-10 w-10 bg-primary text-primary-foreground rounded-full shadow-sm hover:bg-primary/90">
                        <i className="fa-solid fa-paper-plane w-4 h-4 text-white"></i>
                    </Button>
                </div>
            </header>
            <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-24">
                <div>
                    <div className="border-b border-border flex items-center">
                        <span className="py-3 pr-2 text-base text-muted-foreground">To:</span>
                        <input 
                            type="text" 
                            value={to} 
                            onChange={(e) => setTo(e.target.value)} 
                            placeholder="" 
                            className="w-full py-3 bg-transparent focus:outline-none text-base text-foreground flex-1"
                        />
                        <Button variant="ghost" size="icon" onClick={() => setIsCcBccExpanded(prev => !prev)} className="h-10 w-10 text-muted-foreground">
                            <i className={`fa-solid fa-chevron-down w-4 h-4 transition-transform duration-200 ${isCcBccExpanded ? 'rotate-180' : ''}`}></i>
                        </Button>
                    </div>
                    
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCcBccExpanded ? 'max-h-40' : 'max-h-0'}`}>
                        <div className="border-b border-border flex items-center">
                            <span className="py-3 pr-2 text-base text-muted-foreground">Cc:</span>
                            <input 
                                type="text" 
                                value={cc} 
                                onChange={(e) => setCc(e.target.value)} 
                                className="w-full py-3 bg-transparent focus:outline-none text-base text-foreground"
                            />
                        </div>
                        <div className="border-b border-border flex items-center">
                            <span className="py-3 pr-2 text-base text-muted-foreground">Bcc:</span>
                            <input 
                                type="text" 
                                value={bcc} 
                                onChange={(e) => setBcc(e.target.value)} 
                                className="w-full py-3 bg-transparent focus:outline-none text-base text-foreground"
                            />
                        </div>
                    </div>
                     <div className="border-b border-border flex items-center">
                        <span className="py-3 pr-2 text-base text-muted-foreground">From:</span>
                        <span className="py-3 text-base text-foreground">{`m.atefm20@gmail.com`}</span>
                     </div>
                </div>
                <div className="border-b border-border">
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full py-3 bg-transparent focus:outline-none text-base text-foreground placeholder:text-muted-foreground"/>
                </div>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full flex-1 pt-3 bg-transparent focus:outline-none text-base resize-none text-foreground placeholder:text-muted-foreground"
                    placeholder="Message..."
                />
                {attachments.length > 0 && (
                    <div className="py-2 mt-2 flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                            <div key={index} className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm text-secondary-foreground">
                                <span className="mr-2 truncate max-w-[150px]">{file.name}</span>
                                <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))} className="text-muted-foreground hover:text-foreground">
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
             
             {/* Bottom Toolbar */}
            <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
                 {isFormattingOpen && (
                    <div className="bg-card/90 backdrop-blur-xl border border-border shadow-xl rounded-xl p-2 mb-2 animate-scaleIn flex flex-col gap-1 min-w-[150px]">
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-sm text-foreground transition-colors text-left w-full">
                            <i className="fa-solid fa-bold w-5 text-center text-muted-foreground"></i> Bold
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-sm text-foreground transition-colors text-left w-full">
                            <i className="fa-solid fa-italic w-5 text-center text-muted-foreground"></i> Italic
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-sm text-foreground transition-colors text-left w-full">
                            <i className="fa-solid fa-underline w-5 text-center text-muted-foreground"></i> Underline
                        </button>
                         <button className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-sm text-foreground transition-colors text-left w-full">
                            <i className="fa-solid fa-list-ul w-5 text-center text-muted-foreground"></i> Bullet List
                        </button>
                         <button className="flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-sm text-foreground transition-colors text-left w-full">
                            <i className="fa-solid fa-list-ol w-5 text-center text-muted-foreground"></i> Ordered List
                        </button>
                    </div>
                 )}
                 
                 <div className="bg-white-500/30 backdrop-blur-3xl border border-white/40 dark:border-white/20 shadow-lg rounded-[2rem] px-2 py-1.5 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-primary hover:bg-blue-500/20 rounded-full transition-colors" onClick={handleAttachClick}>
                        <i className="fa-solid fa-paperclip text-lg"></i>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-primary hover:bg-blue-500/20 rounded-full transition-colors" onClick={() => alert('Scan document')}>
                        <i className="fa-solid fa-camera text-lg"></i>
                    </Button>
                    <div className="w-px h-5 bg-primary/30 mx-1"></div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-10 w-10 text-primary rounded-full hover:bg-blue-500/20 transition-colors ${isFormattingOpen ? 'bg-blue-500/20' : ''}`}
                        onClick={() => setIsFormattingOpen(!isFormattingOpen)}
                    >
                        <span className="font-serif text-xl font-bold">Aa</span>
                    </Button>
                </div>
            </div>

            <AIPopover
                anchorEl={aiButtonRef.current}
                isOpen={isAiMenuOpen}
                onClose={() => setIsAiMenuOpen(false)}
                onSelect={handleAiMenuSelect}
            />
        </div>
    );
};

export default ComposerMobile;