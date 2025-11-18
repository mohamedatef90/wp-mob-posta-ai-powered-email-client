import React from 'react';
import type { Thread } from '../types';

interface AttachEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  threads: Thread[];
  onSelect: (thread: Thread) => void;
}

const AttachEmailModal: React.FC<AttachEmailModalProps> = ({ isOpen, onClose, threads, onSelect }) => {
    if (!isOpen) return null;

    const handleSelect = (thread: Thread) => {
        onSelect(thread);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-200 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-card rounded-xl shadow-xl p-4 relative w-full max-w-lg transition-all duration-200 flex flex-col h-[70dvh] animate-scaleIn backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between pb-3 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Attach an Email</h2>
                    <button 
                        onClick={onClose} 
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark w-5 h-5"></i>
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto mt-2 no-scrollbar">
                    {threads.map(thread => (
                        <div 
                            key={thread.id} 
                            onClick={() => handleSelect(thread)}
                            className="p-2 rounded-lg hover:bg-accent cursor-pointer"
                        >
                            <p className="font-semibold text-sm text-foreground truncate">{thread.subject}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                From: {thread.participants[0].name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttachEmailModal;