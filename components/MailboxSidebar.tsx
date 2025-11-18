import React, { useState, useContext } from 'react';
import { AppContext, Domain } from './context/AppContext';
import { Button } from './ui/Button';

interface MailboxSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Use Domain type for onNavigate prop
  onNavigate: (view: string, domain?: Domain) => void;
  activeView: string;
}

const NavItem: React.FC<{ label: string; icon: string; onClick: () => void; isActive: boolean; count?: number; }> = ({ label, icon, onClick, isActive, count }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between text-left px-4 py-3 text-lg rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'}`}>
    <div className="flex items-center">
      <i className={`${icon} w-6 text-center mr-4 text-muted-foreground`}></i>
      <span>{label}</span>
    </div>
    {count !== undefined && count > 0 && <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{count}</span>}
  </button>
);

const MailboxSidebar: React.FC<MailboxSidebarProps> = ({ isOpen, onClose, onNavigate, activeView }) => {
    const { accounts, activeDomain, setActiveModule } = useContext(AppContext);
    const [isAccountsOpen, setIsAccountsOpen] = useState(false);

    const handleNavigate = (view: string, domain?: Domain) => {
        onNavigate(view, domain);
        onClose();
    };

    const currentAccount = accounts.find(acc => 
        (activeDomain === 'microhard' && acc.email.includes('microhard')) || 
        (activeDomain === 'liverpool' && acc.email.includes('liverpool')) ||
        (activeDomain === 'innovate' && acc.email.includes('innovate'))
    ) || accounts[0];

    // FIX: Correctly calculate domainName, handling the 'all' case to avoid bugs.
    const domainName = activeDomain === 'innovate' 
    ? 'Innovate Inc.' 
    : activeDomain === 'microhard' 
        ? 'Microhard' 
        : activeDomain === 'liverpool'
            ? 'Liverpool FC'
            : '';


    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <aside 
                className={`fixed top-0 left-0 h-dvh w-80 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <header className="p-4 flex-shrink-0 border-b border-border">
                    <button onClick={() => setIsAccountsOpen(!isAccountsOpen)} className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent">
                        <div className="flex items-center space-x-3">
                            <img src={currentAccount?.avatarUrl} alt={currentAccount?.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-foreground text-left">{currentAccount?.name}</p>
                                <p className="text-sm text-muted-foreground text-left">{currentAccount?.email}</p>
                            </div>
                        </div>
                        <i className={`fa-solid fa-chevron-down w-4 h-4 text-muted-foreground transition-transform ${isAccountsOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                    {isAccountsOpen && (
                         <div className="mt-2 space-y-1 animate-fadeInDown" style={{animationDuration: '0.2s'}}>
                            {accounts.map(acc => (
                                <button key={acc.email} className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-accent">
                                    <img src={acc.avatarUrl} alt={acc.name} className="w-8 h-8 rounded-full" />
                                    <span className="text-foreground">{acc.name}</span>
                                </button>
                            ))}
                         </div>
                    )}
                </header>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <NavItem label="All Inboxes" icon="fa-solid fa-inbox" onClick={() => handleNavigate('inbox')} isActive={activeView === 'inbox'} />
                    
                    <h2 className="px-4 pt-4 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Smart Folders</h2>
                    <NavItem label="Todos" icon="fa-regular fa-circle-check" onClick={() => handleNavigate('todos')} isActive={activeView === 'todos'} />
                    <NavItem label="Starred" icon="fa-regular fa-star" onClick={() => handleNavigate('starred')} isActive={activeView === 'starred'} />
                    <NavItem label="Snoozed" icon="fa-regular fa-clock" onClick={() => handleNavigate('snoozed')} isActive={activeView === 'snoozed'} />
                    
                    {/* FIX: Conditionally render domain-specific folders only when a specific domain is active. */}
                    {activeDomain !== 'all' && (
                        <>
                            <h2 className="px-4 pt-4 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">{domainName}</h2>
                             <NavItem label="Sent" icon="fa-regular fa-paper-plane" onClick={() => handleNavigate('sent', activeDomain)} isActive={activeView === 'sent'} />
                             <NavItem label="Drafts" icon="fa-regular fa-file-lines" onClick={() => handleNavigate('drafts', activeDomain)} isActive={activeView === 'drafts'} />
                             <NavItem label="Archive" icon="fa-solid fa-archive" onClick={() => handleNavigate('archive', activeDomain)} isActive={activeView === 'archive'} />
                        </>
                    )}
                     
                     <h2 className="px-4 pt-4 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Bundles</h2>
                    <NavItem label="Finance" icon="fa-solid fa-piggy-bank" onClick={() => handleNavigate('finance')} isActive={activeView === 'finance'} />
                    <NavItem label="Feedback" icon="fa-solid fa-thumbs-up" onClick={() => handleNavigate('feedback')} isActive={activeView === 'feedback'} />
                    <NavItem label="Travel" icon="fa-solid fa-plane" onClick={() => handleNavigate('travel')} isActive={activeView === 'travel'} />

                </div>
            </aside>
        </>
    );
};

export default MailboxSidebar;
