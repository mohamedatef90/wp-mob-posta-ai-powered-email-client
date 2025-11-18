import React, { useContext } from 'react';
import { AppContext, Domain } from './context/AppContext';
import { Button } from './ui/Button';

interface SidebarProps {
  isSidebarOpen: boolean;
  activeView: string;
  activeDomain: Domain | 'all';
  onNavigate: (view: string, domain?: Domain) => void;
  snoozedCount: number;
  unreadCounts: { microhard: number; liverpool: number; innovate: number; };
  totalUnread: number;
  onComposeClick: () => void;
  width: number;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  view: string;
  activeView: string;
  onNavigate: (view: string, domain?: Domain) => void;
  count?: number;
  domain?: Domain;
  activeDomain?: Domain | 'all';
}> = ({ icon, label, view, activeView, onNavigate, count, domain, activeDomain }) => {
  const isDomainSpecific = !!domain;
  const isActive = isDomainSpecific
    ? activeView === view && activeDomain === domain
    // For non-domain-specific items, they are active if the view matches.
    // However, the main 'Inbox' should only be active if we are in 'all' domains.
    : activeView === view && (view !== 'inbox' || activeDomain === 'all');

  return (
    <button onClick={() => onNavigate(view, domain)} className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-left ${isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
        <div className="flex items-center space-x-3">
            {icon}
            <span>{label}</span>
        </div>
        {count !== undefined && count > 0 && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">{count}</span>}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ width, onComposeClick, activeView, activeDomain, onNavigate, snoozedCount, unreadCounts, totalUnread }) => {
    const { uiTheme } = useContext(AppContext);
    
    const isClassic = uiTheme === 'classic';
    const showMicrohard = !isClassic;
    const showLiverpool = !isClassic;
    const showInnovate = isClassic;

    return (
        <aside style={{width: `${width}px`}} className="bg-card h-full flex flex-col p-3 border-r border-border flex-shrink-0">
            <div className="px-2 mb-4">
                <Button onClick={onComposeClick} className="w-full shadow-md">
                    <i className="fa-solid fa-pen-to-square mr-2"></i>
                    Compose
                </Button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                <NavItem icon={<i className="fa-solid fa-inbox w-5 text-center"></i>} label="Inbox" view="inbox" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} count={totalUnread} />
                <NavItem icon={<i className="fa-regular fa-star w-5 text-center"></i>} label="Starred" view="starred" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />
                <NavItem icon={<i className="fa-regular fa-clock w-5 text-center"></i>} label="Snoozed" view="snoozed" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} count={snoozedCount} />
                <NavItem icon={<i className="fa-regular fa-paper-plane w-5 text-center"></i>} label="Sent" view="sent" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />
                <NavItem icon={<i className="fa-regular fa-file-lines w-5 text-center"></i>} label="Drafts" view="drafts" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />
                <NavItem icon={<i className="fa-solid fa-archive w-5 text-center"></i>} label="Archive" view="archive" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />

                <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Accounts</h3>
                    {showMicrohard && <NavItem icon={<img src="https://api.dicebear.com/8.x/initials/svg?seed=M" alt="Microhard" className="w-5 h-5 rounded" />} label="Microhard" view="inbox" domain="microhard" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} count={unreadCounts.microhard} />}
                    {showLiverpool && <NavItem icon={<img src="https://api.dicebear.com/8.x/initials/svg?seed=LFC" alt="Liverpool" className="w-5 h-5 rounded-full" />} label="Liverpool FC" view="inbox" domain="liverpool" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} count={unreadCounts.liverpool} />}
                    {showInnovate && <NavItem icon={<img src="https://api.dicebear.com/8.x/initials/svg?seed=I" alt="Innovate" className="w-5 h-5 rounded" />} label="Innovate Inc." view="inbox" domain="innovate" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} count={unreadCounts.innovate} />}
                </div>

                <div className="pt-4">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Bundles</h3>
                    <NavItem icon={<i className="fa-solid fa-piggy-bank w-5 text-center"></i>} label="Finance" view="finance" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />
                    <NavItem icon={<i className="fa-solid fa-thumbs-up w-5 text-center"></i>} label="Feedback" view="feedback" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />
                    <NavItem icon={<i className="fa-solid fa-plane-departure w-5 text-center"></i>} label="Travel" view="travel" activeView={activeView} activeDomain={activeDomain} onNavigate={onNavigate} />
                </div>
            </nav>
        </aside>
    );
}

export default Sidebar;
