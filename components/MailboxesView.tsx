import React, { useContext, useState, useRef } from 'react';
// FIX: Import Domain type
import { AppContext, type Domain } from './context/AppContext';
import { ChevronRightIcon } from './Icons';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface MailboxesViewProps {
  onNavigate: (view: string, domain?: Domain) => void;
  unreadCounts: { microhard: number; liverpool: number; innovate: number; };
  snoozedCount: number;
  activeView: string;
}

interface MailboxItemConfig {
  id: string;
  label: string;
  icon: string;
  view: string;
  domain?: Domain;
  // FIX: Correctly typed the unreadCounts parameter to include 'microhard'.
  count?: (unreadCounts: { microhard: number, liverpool: number, innovate: number }, snoozedCount: MailboxesViewProps['snoozedCount']) => number;
}

const initialMainItems: MailboxItemConfig[] = [
  { id: 'all-inboxes', label: 'All Inboxes', icon: 'fa-solid fa-inbox', view: 'inbox', count: (u) => Object.values(u).reduce((a, b) => a + b, 0) },
];

const initialSmartFolders: MailboxItemConfig[] = [
  { id: 'todos', label: 'Todos', icon: 'fa-regular fa-circle-check', view: 'todos' },
  { id: 'starred', label: 'Starred', icon: 'fa-regular fa-star', view: 'starred' },
  { id: 'snoozed', label: 'Snoozed', icon: 'fa-regular fa-clock', view: 'snoozed', count: (_, s) => s },
];

const createDomainFolders = (domain: 'microhard' | 'liverpool' | 'innovate'): MailboxItemConfig[] => [
    { id: `${domain}-inbox`, label: 'Inbox', icon: 'fa-solid fa-inbox', view: 'inbox', domain, count: (u) => u[domain] },
    { id: `${domain}-drafts`, label: 'Drafts', icon: 'fa-regular fa-file-lines', view: 'drafts', domain },
    { id: `${domain}-sent`, label: 'Sent', icon: 'fa-regular fa-paper-plane', view: 'sent', domain },
    { id: `${domain}-junk`, label: 'Junk', icon: 'fa-solid fa-ban', view: 'junk', domain },
    { id: `${domain}-trash`, label: 'Trash', icon: 'fa-solid fa-trash-can', view: 'trash', domain },
    { id: `${domain}-archive`, label: 'Archive', icon: 'fa-solid fa-archive', view: 'archive', domain },
];

const EditableNavItem: React.FC<{
  item: MailboxItemConfig;
  onClick: () => void;
  isEditMode: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
  count?: number;
  dragProps: any;
}> = ({ item, onClick, isEditMode, isVisible, onToggleVisibility, count, dragProps }) => (
    <div 
        className="flex items-center"
        draggable={isEditMode}
        {...dragProps}
    >
        {isEditMode && (
            <div className="flex items-center pl-4 pr-2">
                <button onClick={onToggleVisibility} className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", isVisible ? 'bg-primary border-primary' : 'border-muted-foreground')}>
                    {isVisible && <i className="fa-solid fa-check text-white text-xs"></i>}
                </button>
            </div>
        )}
        <button disabled={isEditMode} onClick={onClick} className="w-full flex items-center justify-between text-left px-4 py-3 text-base text-foreground disabled:text-foreground">
            <div className="flex items-center">
                <i className={cn(item.icon, 'w-6 text-center mr-4 text-muted-foreground')}></i>
                <span className="font-medium">{item.label}</span>
            </div>
            <div className="flex items-center space-x-3">
                {count !== undefined && count > 0 && <span className="text-sm font-semibold text-muted-foreground">{count}</span>}
                {!isEditMode ? <ChevronRightIcon className="h-4 w-4 text-muted-foreground" /> : <i className="fa-solid fa-bars text-muted-foreground cursor-grab"></i>}
            </div>
        </button>
    </div>
);

const CollapsibleSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
    <div>
        <button onClick={onToggle} className="w-full flex justify-between items-center px-4 pt-4 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider text-left hover:text-foreground">
            <span>{title}</span>
            <ChevronRightIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        {isOpen && (
            <div className="bg-card rounded-xl border border-border mt-2 animate-fadeInDown" style={{animationDuration: '0.2s'}}>
                {children}
            </div>
        )}
    </div>
);


export const MailboxesView: React.FC<MailboxesViewProps> = ({ onNavigate, unreadCounts, snoozedCount, activeView }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [mainItems, setMainItems] = useState(initialMainItems);
    const [smartFolders, setSmartFolders] = useState(initialSmartFolders);
    const [microhardFolders, setMicrohardFolders] = useState(createDomainFolders('microhard'));
    const [liverpoolFolders, setLiverpoolFolders] = useState(createDomainFolders('liverpool'));

    const [visibleItemIds, setVisibleItemIds] = useState<Set<string>>(new Set([
        ...initialMainItems.map(i => i.id),
        ...initialSmartFolders.map(i => i.id),
        ...createDomainFolders('microhard').map(i => i.id),
        ...createDomainFolders('liverpool').map(i => i.id),
    ]));

    const [isMicrohardOpen, setIsMicrohardOpen] = useState(true);
    const [isLiverpoolOpen, setIsLiverpoolOpen] = useState(true);
    
    const dragItem = useRef<any>(null);
    const dragOverItem = useRef<any>(null);

    const handleSort = (listKey: 'main' | 'smart' | 'microhard' | 'liverpool') => {
        const lists = { main: mainItems, smart: smartFolders, microhard: microhardFolders, liverpool: liverpoolFolders };
        const setLists = { main: setMainItems, smart: setSmartFolders, microhard: setMicrohardFolders, liverpool: setLiverpoolFolders };

        if (!dragItem.current || !dragOverItem.current || dragItem.current.listKey !== dragOverItem.current.listKey) return;

        let _list = [...lists[listKey]];
        const draggedItemContent = _list.splice(dragItem.current.index, 1)[0];
        _list.splice(dragOverItem.current.index, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setLists[listKey](_list);
    };
    
    const handleToggleVisibility = (itemId: string) => {
        setVisibleItemIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const renderList = (
        items: MailboxItemConfig[],
        listKey: 'main' | 'smart' | 'microhard' | 'liverpool'
    ) => {
        const displayItems = isEditMode ? items : items.filter(i => visibleItemIds.has(i.id));
        return displayItems.map((item, index) => (
             <React.Fragment key={item.id}>
                <EditableNavItem
                    item={item}
                    onClick={() => onNavigate(item.view, item.domain)}
                    isEditMode={isEditMode}
                    isVisible={visibleItemIds.has(item.id)}
                    onToggleVisibility={() => handleToggleVisibility(item.id)}
                    count={item.count ? item.count(unreadCounts, snoozedCount) : undefined}
                    dragProps={{
                        onDragStart: () => (dragItem.current = { index, listKey }),
                        onDragEnter: () => (dragOverItem.current = { index, listKey }),
                        onDragEnd: () => handleSort(listKey),
                        onDragOver: (e: React.DragEvent) => e.preventDefault(),
                    }}
                />
                {index < displayItems.length - 1 && <div className="border-t border-border mx-4" />}
            </React.Fragment>
        ));
    };

  return (
    <div className="h-full w-full bg-background text-foreground flex flex-col mailboxes-mobile-light">
      <header className="sticky top-0 z-10 p-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border flex-shrink-0">
        <h1 className="text-3xl font-bold">Mailboxes</h1>
        <button 
            onClick={() => setIsEditMode(p => !p)} 
            className="px-4 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border shadow-sm text-base font-semibold text-primary hover:bg-accent transition-colors"
        >
          {isEditMode ? 'Done' : 'Edit'}
        </button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-card rounded-xl border border-border">
          {renderList(mainItems, 'main')}
        </div>

        <h3 className="px-4 pt-0 pb-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">Smart Folders</h3>
        <div className="bg-card rounded-xl border border-border">
          {renderList(smartFolders, 'smart')}
        </div>

        <CollapsibleSection title="Microhard" isOpen={isMicrohardOpen} onToggle={() => setIsMicrohardOpen(p => !p)}>
            {renderList(microhardFolders, 'microhard')}
        </CollapsibleSection>

        <CollapsibleSection title="Liverpool FC" isOpen={isLiverpoolOpen} onToggle={() => setIsLiverpoolOpen(p => !p)}>
            {renderList(liverpoolFolders, 'liverpool')}
        </CollapsibleSection>
      </main>
    </div>
  );
};