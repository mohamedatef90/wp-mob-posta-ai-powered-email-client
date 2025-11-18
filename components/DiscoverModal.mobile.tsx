import React, { useState, useEffect } from 'react';

const DiscoverCard: React.FC<{icon:React.ReactNode, title: string, description: string, cta1: string, cta2?: string}> = ({icon, title, description, cta1, cta2}) => (
    <div className="bg-primary p-4 rounded-xl text-primary-foreground w-full">
        <div className="flex items-center space-x-3 mb-2">
            {icon}
            <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-primary-foreground/80 mb-4 min-h-[5rem]">{description}</p>
        <div className="flex items-center justify-between text-sm font-semibold">
            <button className="hover:bg-white/10 px-2 py-1 rounded-md transition-colors">{cta1}</button>
            {cta2 && <button className="hover:bg-white/10 px-2 py-1 rounded-md transition-colors">{cta2}</button>}
        </div>
    </div>
);


interface DiscoverModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DiscoverModalMobile: React.FC<DiscoverModalProps> = ({ isOpen, onClose }) => {
    const [isRendering, setIsRendering] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsRendering(true);
        } else {
            const timer = setTimeout(() => setIsRendering(false), 200); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendering) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div 
                className={`bg-card rounded-xl shadow-xl p-6 relative w-full max-w-2xl transition-all duration-200 backdrop-blur-xl ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                    aria-label="Close"
                >
                    <i className="fa-solid fa-xmark w-6 h-6"></i>
                </button>
                <h2 className="text-2xl font-bold text-foreground mb-4">Discover</h2>
                <div className="flex flex-col gap-4">
                     <DiscoverCard 
                         icon={<i className="fa-solid fa-inbox w-5 h-5"></i>}
                         title="Unified Inbox"
                         description="Access multiple accounts easily in PostaGate's Unified Inbox."
                         cta1="Add Account"
                         cta2="Maybe Later"
                       />
                       <DiscoverCard 
                         icon={<i className="fa-solid fa-user-group w-5 h-5"></i>}
                         title="Add Shared Account"
                         description="Manage team emails and notes in one unified inbox."
                         cta1="Learn More"
                       />
                </div>
            </div>
        </div>
    );
};

export default DiscoverModalMobile;
