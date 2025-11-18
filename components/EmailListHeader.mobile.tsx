import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { AppContext } from './context/AppContext';
import { ChevronLeftIcon } from './Icons';

interface EmailListHeaderMobileProps {
  isBulkMode: boolean;
  selectedCount: number;
  onClearSelection: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkMarkAsRead: () => void;
  toggleEmailSidebar?: () => void;
  onBack?: () => void;
  title: string;
  currentUser: User;
  onCompose: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isBulkSelecting?: boolean;
  onToggleBulkSelect?: (active: boolean) => void;
  isAiSearching?: boolean;
  areAllSelectedRead?: boolean;
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const EmailListHeaderMobile: React.FC<EmailListHeaderMobileProps> = ({
  isBulkMode,
  selectedCount,
  onClearSelection,
  onBulkArchive,
  onBulkDelete,
  onBulkMarkAsRead,
  toggleEmailSidebar,
  onBack,
  title,
  currentUser,
  onCompose,
  searchQuery,
  onSearchQueryChange,
  isBulkSelecting,
  onToggleBulkSelect,
  isAiSearching,
  areAllSelectedRead,
}) => {
  const { setActiveModule, setInitialSettingsView, activeDomain, uiTheme } = useContext(AppContext);
  
  const placeholders = useMemo(() => [
    "Search by sender, e.g. 'Priya Sharma'",
    "Find topics, like 'Project Phoenix'",
    "Look for 'Q3 budget spreadsheets'",
    "Search for attachments from last week",
    "What were the action items from Evelyn?",
  ], []);

  const [placeholder, setPlaceholder] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // If the user is typing, show a static placeholder and stop the animation.
    if (searchQuery) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setPlaceholder("Search mail");
      return;
    }

    let phIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPh = placeholders[phIndex];
      
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      const displayText = currentPh.substring(0, charIndex);
      setPlaceholder(displayText);
      
      let typingSpeed = isDeleting ? 50 : 50;

      if (!isDeleting && charIndex === currentPh.length) {
        // Pause at end
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        // Move to next placeholder
        isDeleting = false;
        phIndex = (phIndex + 1) % placeholders.length;
        typingSpeed = 500;
      }
      
      typingTimeoutRef.current = window.setTimeout(type, typingSpeed);
    };

    // Start animation with an initial delay
    typingTimeoutRef.current = window.setTimeout(type, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchQuery, placeholders]);


  const handleAvatarClick = () => {
    if (setInitialSettingsView) {
      setInitialSettingsView('account');
    }
    if (setActiveModule) {
      setActiveModule('settings');
    }
  };

  // FIX: Replaced outdated 'hogwarts' domain reference with 'microhard'.
  const domainName = activeDomain === 'all' 
    ? 'All Inboxes' 
    : activeDomain === 'innovate' 
      ? 'Innovate Inc.' 
      : activeDomain === 'microhard' 
          ? 'Microhard' 
          : 'Liverpool FC';
  
  const subtitle = title === 'Inbox' ? domainName : '';


  if (isBulkMode && !isBulkSelecting) {
    return (
      <div className="px-2 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between flex-shrink-0 bg-background/60 backdrop-blur-xl animate-fadeInDown sticky top-0 z-20" style={{ animationDuration: '0.2s' }}>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onClearSelection} className="h-9 w-9">
            <i className="fa-solid fa-xmark w-5 h-5"></i>
          </Button>
          <span className="font-semibold text-lg">{selectedCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onBulkArchive} className="h-9 w-9" title="Archive"><i className="fa-solid fa-archive w-5 h-5"></i></Button>
          <Button variant="ghost" size="icon" onClick={onBulkDelete} className="h-9 w-9" title="Delete"><i className="fa-solid fa-trash w-5 h-5"></i></Button>
          <Button variant="ghost" size="icon" onClick={onBulkMarkAsRead} className="h-9 w-9" title={areAllSelectedRead ? 'Mark as Unread' : 'Mark as Read'}>
            <i className={`w-5 h-5 ${areAllSelectedRead ? 'fa-regular fa-envelope' : 'fa-regular fa-envelope-open'}`}></i>
          </Button>
        </div>
      </div>
    );
  }

  if (uiTheme === 'classic') {
    return (
      <div className="px-3 pt-3 pb-2 sticky top-0 bg-background z-20">
        <div className="bg-card rounded-full shadow flex items-center px-2 py-1 space-x-2 border border-border">
          <Button variant="ghost" size="icon" onClick={toggleEmailSidebar}>
            <i className="fa-solid fa-bars w-5 h-5 text-muted-foreground"></i>
          </Button>
          <input
            type="text"
            placeholder="Search in mail"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-base text-foreground placeholder:text-muted-foreground"
          />
          <button onClick={handleAvatarClick} className="h-8 w-8 rounded-full flex-shrink-0">
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full rounded-full" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 sticky top-0 bg-card/20 backdrop-blur-lg z-20 space-y-3">
      {isBulkSelecting ? (
        <div className="flex items-center justify-between">
          <button onClick={() => { /* TODO: select all */ }} className="font-semibold text-base text-primary px-2 py-2">Select All</button>
          <button onClick={() => onToggleBulkSelect?.(false)} className="font-semibold text-base text-primary px-2 py-2">Close</button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {onBack && (
                <button
                  onClick={onBack}
                  aria-label="Back to Mailboxes"
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-white/80 dark:bg-zinc-800/20 backdrop-blur-sm border border-white/20 dark:border-white/20 text-foreground shadow-sm"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
              )}
              <div className="ml-2">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground -mt-1">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-1">
               <button onClick={() => onToggleBulkSelect?.(true)} className="px-4 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border shadow-sm text-base font-semibold text-primary hover:bg-accent transition-colors">Select</button>
            </div>
          </div>
          <div className="relative p-0.5 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full">
            <div className="relative bg-background rounded-full">
               <div
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-600",
                    isAiSearching && "animate-spin"
                  )}
                  style={{
                    maskImage: "url('https://static.thenounproject.com/png/ai-model-icon-7645705-512.png')",
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: "url('https://static.thenounproject.com/png/ai-model-icon-7645705-512.png')",
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                ></div>
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="w-full bg-transparent border-none rounded-full pl-12 pr-4 h-11 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailListHeaderMobile;