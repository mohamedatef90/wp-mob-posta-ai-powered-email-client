


// ... (keep imports)
import React, { useState, useRef, useMemo, useContext, useEffect } from 'react';
import type { Thread, User } from '../types';
import EmailListItemMobile from './EmailListItem.mobile';
import EmailListHeaderMobile from './EmailListHeader.mobile';
import { AppContext, type Domain } from './context/AppContext';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// ... (keep BulkActionBarMobile and Pill components same as original)
const BulkActionBarMobile: React.FC<{ onFlag: () => void; onMove: () => void; onDelete: () => void; selectedCount: number; onMarkAsRead: () => void; areAllSelectedRead: boolean; }> = ({ onFlag, onMove, onDelete, selectedCount, onMarkAsRead, areAllSelectedRead }) => {
    const ActionButton: React.FC<{ icon: string; label: string; onClick: () => void; disabled: boolean }> = ({ icon, label, onClick, disabled }) => (
        <div className="flex flex-col items-center">
            <button
                onClick={onClick}
                disabled={disabled}
                className="w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors text-foreground hover:bg-black/10 dark:hover:bg-white/10"
                aria-label={label}
            >
                <i className={`${icon} text-2xl`}></i>
            </button>
            <span className="text-xs text-muted-foreground mt-1">{label}</span>
        </div>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 animate-fadeInUp" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
            <div className="max-w-md mx-auto h-20 flex justify-around items-center bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white dark:border-white/20 rounded-[2rem] shadow-lg">
                <ActionButton icon={areAllSelectedRead ? 'fa-regular fa-envelope' : 'fa-regular fa-envelope-open'} label={areAllSelectedRead ? 'Unread' : 'Read'} onClick={onMarkAsRead} disabled={selectedCount === 0} />
                <ActionButton icon="fa-regular fa-flag" label="Flag" onClick={onFlag} disabled={selectedCount === 0} />
                <ActionButton icon="fa-regular fa-folder" label="Move" onClick={onMove} disabled={selectedCount === 0} />
                <ActionButton icon="fa-regular fa-trash-can" label="Delete" onClick={onDelete} disabled={selectedCount === 0} />
            </div>
        </div>
    );
};

const Pill: React.FC<{label: string, icon: string, isActive: boolean, onClick: ()=>void}> = ({label, icon, isActive, onClick}) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center justify-center text-base font-semibold rounded-full transition-all duration-300 ease-in-out whitespace-nowrap transform active:scale-95 focus:outline-none",
            "h-10",
            isActive
              ? 'bg-primary text-primary-foreground px-5 shadow-md'
              : 'bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm border border-white/20 dark:border-white/20 text-muted-foreground px-4'
        )}
    >
        <i className={cn(icon, "text-xl transition-all duration-300", isActive ? 'mr-2' : 'mr-0')}></i>
        <span className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            isActive ? 'max-w-24 opacity-100' : 'max-w-0 opacity-0'
        )}>
            {label}
        </span>
    </button>
);


interface EmailListMobileProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (id: string) => void;
  activeView?: string;
  onSnoozeClick: (threadId: string, anchorEl: HTMLElement) => void;
  selectedThreadIds: string[];
  onToggleSelection: (id: string) => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkMarkAsRead: () => void;
  onContextMenu: (event: React.MouseEvent, threadId: string) => void;
  onArchive: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onMarkAsRead: (threadId: string, isRead: boolean) => void;
  onToggleStar: (threadId: string) => void;
  onOpenKebabMenu: (threadId: string, anchorEl: HTMLElement) => void;
  toggleEmailSidebar?: () => void;
  onBack?: () => void;
  onClearSelection: () => void;
  currentUser: User;
  onCompose: () => void;
  onNavigate: (view: string, domain?: Domain) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onBulkModeChange: (isActive: boolean) => void;
  isAiSearching: boolean;
  onOpenCalendar?: () => void;
  onOpenFilters?: () => void;
  areFiltersActive?: boolean;
}

const pills = [
    { label: 'Primary', icon: 'fa-solid fa-inbox', category: 'primary' },
    { label: 'Transactions', icon: 'fa-solid fa-receipt', category: 'finance' },
    { label: 'Updates', icon: 'fa-solid fa-bell', category: 'updates' },
    { label: 'Promotions', icon: 'fa-solid fa-tag', category: 'promotions' },
    { label: 'All Mail', icon: 'fa-solid fa-envelope', category: 'all' },
];

const EmailListMobile: React.FC<EmailListMobileProps> = (props) => {
  const { onSelectThread, activeView = 'inbox', onContextMenu, onArchive, onDelete, selectedThreadIds, onToggleSelection, onBulkModeChange, isAiSearching, onBulkMarkAsRead } = props;
  const { uiTheme } = useContext(AppContext);
  const [activePill, setActivePill] = useState('primary');
  const [isBulkSelecting, setIsBulkSelecting] = useState(false);
    
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    onBulkModeChange(isBulkSelecting);
  }, [isBulkSelecting, onBulkModeChange]);

  const areAllSelectedRead = useMemo(() => {
    if (selectedThreadIds.length === 0) return false;
    const selectedThreads = props.threads.filter(t => selectedThreadIds.includes(t.id));
    return selectedThreads.length > 0 && selectedThreads.every(t => t.isRead);
  }, [selectedThreadIds, props.threads]);

  useEffect(() => {
    // This effect synchronizes the active pill with the main active view (from sidebar navigation)
    const validPillCategory = pills.find(p => p.category === activeView);
    if (validPillCategory) {
        setActivePill(validPillCategory.category);
    } else if (activeView === 'inbox') {
        // Default to 'primary' when viewing the main inbox
        setActivePill('primary');
    }
  }, [activeView]);

  useEffect(() => {
      const activePillIndex = pills.findIndex(p => p.category === activePill);
      const containerEl = pillsContainerRef.current;
      if (containerEl && containerEl.children[activePillIndex]) {
          const activePillEl = containerEl.children[activePillIndex] as HTMLElement;
          const { offsetLeft, offsetWidth } = activePillEl;
          const scrollLeft = offsetLeft - (containerEl.clientWidth / 2) + (offsetWidth / 2);
          containerEl.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
  }, [activePill]);

  const toggleBulkSelect = (active: boolean) => {
      setIsBulkSelecting(active);
      if (!active) {
          props.onClearSelection();
      }
  };

  // --- Grouping Logic ---

  interface ThreadSection {
      title: string;
      threads: Thread[];
  }

  const sections = useMemo<ThreadSection[]>(() => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      const nextWeekStart = new Date(todayStart);
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);

      if (activeView === 'snoozed') {
          // SNOOZED VIEW: Sort by future snoozedUntil date
          const snoozedThreads = props.threads
            .filter(t => t.snoozedUntil && new Date(t.snoozedUntil) > now)
            .sort((a, b) => new Date(a.snoozedUntil!).getTime() - new Date(b.snoozedUntil!).getTime());

          const laterToday: Thread[] = [];
          const tomorrow: Thread[] = [];
          const thisWeek: Thread[] = [];
          const future: Thread[] = [];

          snoozedThreads.forEach(t => {
              const date = new Date(t.snoozedUntil!);
              if (date < tomorrowStart) {
                  laterToday.push(t);
              } else if (date < new Date(tomorrowStart.getTime() + 86400000)) { // Tomorrow end
                  tomorrow.push(t);
              } else if (date < nextWeekStart) {
                  thisWeek.push(t);
              } else {
                  future.push(t);
              }
          });

          return [
              { title: 'Later Today', threads: laterToday },
              { title: 'Tomorrow', threads: tomorrow },
              { title: 'This Week', threads: thisWeek },
              { title: 'Future', threads: future },
          ].filter(s => s.threads.length > 0);
      }

      // INBOX / OTHER VIEWS
      let filtered = props.threads;
      
      // Apply Pill Filtering only for Inbox or category views
      if (activeView === 'inbox' || pills.some(p => p.category === activeView)) {
          if (activePill !== 'all') {
              filtered = filtered.filter(t => t.category.toLowerCase() === activePill.toLowerCase());
          }
      } 
      // Specific View Filtering
      else if (activeView === 'todos') {
          filtered = filtered.filter(t => t.category === 'todos');
      }
      else if (activeView === 'starred') {
          filtered = filtered.filter(t => t.isStarred);
      }

      // Standard Date Grouping (Today, Yesterday, Older)
      const todayTh: Thread[] = [];
      const yesterdayTh: Thread[] = [];
      const olderTh: Thread[] = [];

      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);

      filtered.forEach(t => {
          const date = new Date(t.timestamp);
          if (date >= todayStart) {
              todayTh.push(t);
          } else if (date >= yesterdayStart) {
              yesterdayTh.push(t);
          } else {
              olderTh.push(t);
          }
      });

      return [
          { title: 'Today', threads: todayTh },
          { title: 'Yesterday', threads: yesterdayTh },
          { title: 'Older', threads: olderTh },
      ].filter(s => s.threads.length > 0);

  }, [props.threads, activeView, activePill]);


  // --- Empty States ---
  const renderEmptyState = () => {
      if (activeView === 'snoozed') {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4">
                <i className="fa-regular fa-clock text-5xl mb-4 text-primary/50"></i>
                <p className="font-medium text-foreground">No snoozed emails</p>
                <p className="text-sm mt-1">Snooze emails to see them here later.</p>
            </div>
          );
      }
      if (activeView === 'scheduled') {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4">
                <i className="fa-regular fa-calendar-check text-5xl mb-4 text-primary/50"></i>
                <p className="font-medium text-foreground">No scheduled emails</p>
                <p className="text-sm mt-1">Emails scheduled to send later will appear here.</p>
            </div>
          );
      }
      if (activeView === 'todos') {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4">
                <i className="fa-regular fa-circle-check text-5xl mb-4 text-primary/50"></i>
                <p className="font-medium text-foreground">You're all caught up!</p>
                <p className="text-sm mt-1">No pending to-dos.</p>
            </div>
          );
      }
      if (activeView === 'starred') {
          return (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4">
                <i className="fa-regular fa-star text-5xl mb-4 text-primary/50"></i>
                <p className="font-medium text-foreground">No starred emails</p>
                <p className="text-sm mt-1">Star important emails to see them here.</p>
            </div>
          );
      }
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4">
            <i className="fa-regular fa-envelope-open text-5xl mb-4 text-primary/50"></i>
            <p className="font-medium text-foreground">All caught up!</p>
        </div>
      );
  };

  const showPills = uiTheme === 'modern' && !isBulkSelecting && activeView === 'inbox';

  return (
    <div className="bg-background flex flex-col h-full w-full relative">
      <EmailListHeaderMobile 
        {...props} 
        title={formatViewTitle(activeView)} 
        isBulkMode={selectedThreadIds.length > 0} 
        selectedCount={selectedThreadIds.length}
        isBulkSelecting={isBulkSelecting}
        onToggleBulkSelect={toggleBulkSelect}
        areAllSelectedRead={areAllSelectedRead}
        onOpenCalendar={props.onOpenCalendar}
        areFiltersActive={props.areFiltersActive}
      />
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Filter Pills - Only show on Inbox */}
        {showPills && (
          <div className="px-3 py-3 sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
              <div ref={pillsContainerRef} className="flex space-x-2 overflow-x-auto no-scrollbar">
                  {pills.map((p, index) => 
                      <Pill 
                          key={p.label} 
                          label={p.label} 
                          icon={p.icon} 
                          isActive={p.category === activePill} 
                          onClick={() => setActivePill(p.category)}
                      />
                  )}
              </div>
          </div>
        )}
        
        {isAiSearching ? (
             <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground p-4">
                <i className="fa-solid fa-wand-magic-sparkles text-5xl mb-4 text-primary animate-pulse"></i>
                <p className="font-medium text-foreground">AI is searching...</p>
            </div>
        ) : sections.length === 0 ? (
            renderEmptyState()
        ) : (
            sections.map((section, idx) => (
                <React.Fragment key={section.title}>
                    <h2 className="px-4 pt-6 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-0">
                        {section.title}
                    </h2>
                    {section.threads.map(thread => (
                        <EmailListItemMobile
                            key={thread.id}
                            thread={thread}
                            isSelectedForBulk={selectedThreadIds.includes(thread.id)}
                            onSelect={onSelectThread}
                            selectedThreadIds={selectedThreadIds}
                            onToggleSelection={onToggleSelection}
                            onContextMenu={onContextMenu}
                            onArchive={onArchive}
                            onDelete={onDelete}
                            isBulkSelecting={isBulkSelecting}
                            setIsBulkSelecting={setIsBulkSelecting}
                            isSnoozedView={activeView === 'snoozed'}
                            {...props}
                        />
                    ))}
                </React.Fragment>
            ))
        )}
      </div>

       {!isBulkSelecting && <div className={cn(
          "z-10",
          uiTheme === 'classic'
              ? 'fixed bottom-20 right-4'
              : 'absolute bottom-24 right-4'
      )}>
          <button
            onClick={props.onCompose}
            className={cn(
                "flex items-center justify-center shadow-lg transition-all duration-200",
                uiTheme === 'classic'
                    ? 'h-12 bg-primary text-primary-foreground rounded-xl px-4 space-x-2 hover:bg-primary/90'
                    : 'h-14 w-14 rounded-full bg-white/40 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white dark:border-white/20 text-primary hover:bg-white/30 dark:hover:bg-zinc-800/40'
            )}
            aria-label="Compose new email"
          >
              <i className="fa-solid fa-pencil text-lg"></i>
              {uiTheme === 'classic' && <span className="font-semibold text-sm">Compose</span>}
          </button>
      </div>}
      
      {isBulkSelecting && (
        <BulkActionBarMobile 
            onFlag={() => console.log('Flagging selected emails')}
            onMove={() => console.log('Moving selected emails')}
            onDelete={props.onBulkDelete}
            onMarkAsRead={onBulkMarkAsRead}
            areAllSelectedRead={areAllSelectedRead}
            selectedCount={selectedThreadIds.length}
        />
      )}
    </div>
  );
};

const formatViewTitle = (view: string) => {
    if (view === 'inbox') return 'Inbox';
    if (view === 'todos') return 'Tasks';
    return view.charAt(0).toUpperCase() + view.slice(1);
};


export default EmailListMobile;
