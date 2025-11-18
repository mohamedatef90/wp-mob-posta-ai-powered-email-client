import React from 'react';
import AIAssistant from './AIAssistant';
import type { Thread } from '../types';

interface AIAssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedThread: Thread | null;
    mode: 'default' | 'scheduleMeeting';
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, selectedThread, mode }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-start md:items-center justify-center pt-16 md:pt-0 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-background rounded-t-2xl md:rounded-2xl shadow-xl w-full h-full md:w-full md:h-auto md:max-w-xl md:max-h-[90dvh] flex flex-col animate-fadeInUp md:animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
                style={{animationDuration: '0.3s'}}
            >
                <AIAssistant
                    selectedThread={selectedThread}
                    onClose={onClose}
                    mode={mode}
                />
            </div>
        </div>
    );
};

export default AIAssistantModal;