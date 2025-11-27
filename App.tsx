

// ... (keep imports)
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import CopilotView from './components/CopilotView';
import ChatView from './components/ChatView';
import { MOCK_THREADS, you, youLiverpool, PROFESSIONAL_THREADS, youInnovate, allUsers } from './constants';
import type { Thread, Message } from './types';
import PrimarySidebar from './components/PrimarySidebar';
import DiscoverModal from './components/DiscoverModal';
import SnoozePopover from './components/SnoozePopover';
import { GoogleGenAI, Type } from '@google/genai';
import EmailView from './components/EmailView';
import Composer from './components/Composer';
import DriveView from './components/DriveView';
import EmailContextMenu from './components/EmailContextMenu';
import KebabMenu from './components/KebabMenu';
import Resizer from './components/ui/Resizer';
import SearchFilterPopover from './components/SearchFilterPopover';
import UndoSnackbar from './components/ui/UndoSnackbar';
import Onboarding from './components/onboarding/Onboarding';
import AIAssistantModal from './components/AIAssistantModal';
import { AppContext, Module, Theme, UiTheme, Domain } from './components/context/AppContext';

// New Mobile components
import MobileBottomNav from './components/MobileBottomNav';
import ComposerMobile from './components/Composer.mobile';
import { SettingsViewMobile } from './components/SettingsView.mobile';
import MailboxSidebar from './components/MailboxSidebar';
import { CalendarViewMobile, MockEvent } from './components/CalendarView.mobile';
import FilterScreenMobile from './components/FilterScreen.mobile';


export interface SearchFilters {
  query: string;
  sender: string;
  recipient: string;
  dateRange: 'any' | '7d' | '30d' | { start?: string; end?: string };
  status: 'any' | 'read' | 'unread' | 'sent' | 'starred' | 'snoozed';
  label: string;
  fileName: string;
  has: 'any' | 'attachment' | 'mention' | 'comment';
  attachmentType: 'any' | 'document' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'video';
}

const App: React.FC = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => localStorage.getItem('onboardingComplete') === 'true');
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);
  
  const [activeModule, setActiveModule] = useState<Module>('email');
  const [activeEmailView, setActiveEmailView] = useState('inbox');
  const [activeDomain, setActiveDomain] = useState<Domain | 'all'>('microhard');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerState, setComposerState] = useState<{ to: string; subject: string; body: string; } | null>(null);
  const [isComposerMinimized, setIsComposerMinimized] = useState(false);
  const [isComposerMaximized, setIsComposerMaximized] = useState(false);

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState(false);
  const [aiAssistantMode, setAiAssistantMode] = useState<'default' | 'scheduleMeeting'>('default');

  const [snoozeTarget, setSnoozeTarget] = useState<{ threadId: string; anchorEl: HTMLElement } | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<{ x: number; y: number; threadId: string } | null>(null);
  const [kebabMenuTarget, setKebabMenuTarget] = useState<{ x: number; y: number; threadId: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    sender: '',
    recipient: '',
    dateRange: 'any',
    status: 'any',
    label: '',
    fileName: '',
    has: 'any',
    attachmentType: 'any',
  });
  const [isSearchFilterOpen, setIsSearchFilterOpen] = useState(false);
  const [searchFilterAnchorEl, setSearchFilterAnchorEl] = useState<HTMLElement | null>(null);
  
  // Mobile specific state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMailboxSidebarOpen, setIsMailboxSidebarOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBulkModeActive, setIsBulkModeActive] = useState(false);
  const [previousActiveModule, setPreviousActiveModule] = useState<Module>('email');
  const [isFilterScreenOpen, setIsFilterScreenOpen] = useState(false);
  
  // Calendar Event Creation State
  const [calendarInitialEvent, setCalendarInitialEvent] = useState<Partial<MockEvent> | undefined>(undefined);


  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'system'
  );
  const [uiTheme, setUiTheme] = useState<UiTheme>(
    () => (localStorage.getItem('uiTheme') as UiTheme) || 'modern'
  );
  const [mobileMainView, setMobileMainView] = useState<'mailboxes' | 'list'>('list');


  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [threadSummary, setThreadSummary] = useState<{
    threadId: string | null;
    summary: string | null;
    isLoading: boolean;
    error: string | null;
  }>({ threadId: null, summary: null, isLoading: false, error: null });
  
  // AI Search State
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiFilteredThreadIds, setAiFilteredThreadIds] = useState<string[] | null>(null);
  const debounceTimeout = useRef<number | null>(null);
  
  // AI Reply State
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);


  // Undo Snackbar state
  const [undoState, setUndoState] = useState<{ message: string; onUndo: () => void; } | null>(null);
  const undoTimeoutRef = useRef<number | null>(null);

  // Sidebar resizing logic
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isResizingSidebar = useRef(false);
  const startSidebarX = useRef(0);
  const startSidebarWidth = useRef(0);

  // State for new settings view
  const [initialSettingsView, setInitialSettingsView] = useState<string | null>(null);

  useEffect(() => {
    if (uiTheme === 'classic') {
        setThreads(PROFESSIONAL_THREADS);
        setActiveDomain('innovate');
    } else {
        setThreads(MOCK_THREADS);
        setActiveDomain('microhard');
    }
    // Reset selections when data source changes
    setSelectedThreadId(null);
    setSelectedThreadIds([]);
  }, [uiTheme]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setIsOnboardingComplete(true);
  };

  const handleSidebarMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      isResizingSidebar.current = true;
      startSidebarX.current = e.clientX;
      startSidebarWidth.current = sidebarWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const handleSidebarMouseMove = useCallback((e: MouseEvent) => {
      if (!isResizingSidebar.current) return;
      const deltaX = e.clientX - startSidebarX.current;
      const newWidth = startSidebarWidth.current + deltaX;
      const minWidth = 220;
      const maxWidth = 400;
      setSidebarWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)));
  }, []);

  const handleSidebarMouseUp = useCallback(() => {
      isResizingSidebar.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      window.addEventListener('mousemove', handleSidebarMouseMove);
      window.addEventListener('mouseup', handleSidebarMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleSidebarMouseMove);
          window.removeEventListener('mouseup', handleSidebarMouseUp);
      };
  }, [handleSidebarMouseMove, handleSidebarMouseUp]);


  useEffect(() => {
    if (process.env.API_KEY) {
        try {
            const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
            setAi(genAI);
        } catch(e) {
            console.error("Failed to initialize GoogleGenAI", e);
        }
    }
  }, []);
  
  const performAiSearch = async (query: string) => {
      if (!ai) return;
      setIsAiSearching(true);
      try {
          const prompt = `You are an intelligent search keyword expander. A user is searching their email inbox with the query: "${query}". Generate a short, comma-separated list of 5-7 related keywords, synonyms, or concepts to improve the search results. Focus on terms that would likely appear in the body or subject of relevant emails. For example, if the query is "Q3 financial report", you might return "quarterly results, earnings, budget, forecast, revenue, expenses, financial statement". ONLY return the comma-separated list of keywords, with no preamble or explanation.`;
          
          const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
          const keywordsText = response.text;
          const keywords = keywordsText.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
          keywords.push(query.toLowerCase()); // Include the original query

          const matchingThreadIds = threads
              .filter(thread => {
                  const threadContent = [
                      thread.subject.toLowerCase(),
                      ...thread.participants.map(p => p.name.toLowerCase()),
                      ...thread.messages.map(m => m.body.replace(/<[^>]*>/g, '').toLowerCase())
                  ].join(' ');

                  return keywords.some(keyword => threadContent.includes(keyword));
              })
              .map(thread => thread.id);
          
          setAiFilteredThreadIds(matchingThreadIds);

      } catch (error) {
          console.error("AI Search failed:", error);
          setAiFilteredThreadIds(null); // Fallback to regular search on error
      } finally {
          setIsAiSearching(false);
      }
  };

  useEffect(() => {
      if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
      }

      const query = searchFilters.query.trim();

      if (!query) {
          setAiFilteredThreadIds(null);
          setIsAiSearching(false);
          return;
      }
      
      const isTopicQuery = query.split(' ').length > 1 && !query.includes('@');

      if (isTopicQuery && ai) {
          debounceTimeout.current = window.setTimeout(() => {
              performAiSearch(query);
          }, 500);
      } else {
          setAiFilteredThreadIds(null);
      }

  }, [searchFilters.query, ai, threads]);


  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  useEffect(() => {
    document.documentElement.dataset.uiTheme = uiTheme;
    localStorage.setItem('uiTheme', uiTheme);
    if (isMobile) {
      setMobileMainView('list');
    }
  }, [uiTheme, isMobile]);


  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);


  const selectedThread = useMemo(() => {
    return threads.find(thread => thread.id === selectedThreadId) || null;
  }, [selectedThreadId, threads]);

  const handleToggleSelection = (threadId: string) => {
    setSelectedThreadIds(prev =>
      prev.includes(threadId)
        ? prev.filter(id => id !== threadId)
        : [...prev, threadId]
    );
  };
  
  const handleClearSelection = () => {
    setSelectedThreadIds([]);
  };

  const closeUndo = () => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoState(null);
  };

  const handleArchiveThread = (threadId: string) => {
    const originalThreads = [...threads];
    const updatedThreads = originalThreads.map(t => t.id === threadId ? { ...t, isArchived: true } : t);
    setThreads(updatedThreads);

    if (selectedThreadId === threadId) setSelectedThreadId(null);
    if (selectedThreadIds.includes(threadId)) setSelectedThreadIds(prev => prev.filter(id => id !== threadId));
    
    closeUndo();
    setUndoState({
        message: "Thread archived.",
        onUndo: () => {
            setThreads(originalThreads);
            closeUndo();
        }
    });
    undoTimeoutRef.current = window.setTimeout(() => setUndoState(null), 5000);
  };

  const handleDeleteThread = (threadId: string) => {
      const originalThreads = [...threads];
      const updatedThreads = originalThreads.filter(t => t.id !== threadId);
      setThreads(updatedThreads);

      if (selectedThreadId === threadId) setSelectedThreadId(null);
      
      closeUndo();
      setUndoState({
        message: "Thread deleted.",
        onUndo: () => {
            setThreads(originalThreads);
            closeUndo();
        }
    });
    undoTimeoutRef.current = window.setTimeout(() => setUndoState(null), 5000);
  };
  
  const handleMarkAsReadThread = (threadId: string, isRead: boolean) => {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isRead } : t));
  };
  
  const handleToggleStarThread = (threadId: string) => {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, isStarred: !t.isStarred } : t));
  };
  
  const handleMoveToJunk = (threadId: string) => {
    handleArchiveThread(threadId);
  };

  const handleMuteThread = (threadId: string) => {
    console.log(`Muting thread ${threadId}.`);
  };

  const handleBlockSender = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
        const sender = thread.participants[0];
        console.log(`Blocking sender: ${sender.name}.`);
    }
  };

  const handleBulkMarkAsRead = () => {
    const selected = threads.filter(t => selectedThreadIds.includes(t.id));
    const areAllRead = selected.length > 0 && selected.every(t => t.isRead);
    const newReadStatus = !areAllRead;

    setThreads(prev =>
      prev.map(t =>
        selectedThreadIds.includes(t.id) ? { ...t, isRead: newReadStatus } : t
      )
    );
    setSelectedThreadIds([]);
  };

  const handleBulkDelete = () => {
    setThreads(prev => prev.filter(t => !selectedThreadIds.includes(t.id)));
    if (selectedThreadId && selectedThreadIds.includes(selectedThreadId)) {
        setSelectedThreadId(null);
    }
    setSelectedThreadIds([]);
  };

  const handleBulkArchive = () => {
    setThreads(prev => prev.map(t => selectedThreadIds.includes(t.id) ? { ...t, isArchived: true } : t));
    if (selectedThreadId && selectedThreadIds.includes(selectedThreadId)) {
        setSelectedThreadId(null);
    }
    setSelectedThreadIds([]);
  };

  const handleSelectThread = (id: string) => {
    setThreads(prev => 
        prev.map(t => t.id === id && !t.isRead ? { ...t, isRead: true } : t)
    );
    setSelectedThreadId(id);
    setSelectedThreadIds([]);
    setThreadSummary({ threadId: null, summary: null, isLoading: false, error: null });
  };
  
  const handleBack = () => {
    setSelectedThreadId(null);
  }

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(prev => {
        if (prev) {
            setAiAssistantMode('default');
        }
        return !prev;
    });
  }

  const handleCloseAIAssistant = () => {
    setIsAIAssistantOpen(false);
    setAiAssistantMode('default');
  }
  
  const handleScheduleMeeting = () => {
    setAiAssistantMode('scheduleMeeting');
    setIsAIAssistantOpen(true);
  }

  const handleOpenSnooze = (threadId: string, anchorEl: HTMLElement) => {
    setSnoozeTarget({ threadId, anchorEl });
  };

  const handleCloseSnooze = () => {
    setSnoozeTarget(null);
  };
  
  const handleOpenComposer = () => {
    setComposerState(null);
    setIsComposerOpen(true);
    setIsComposerMinimized(false);
    setIsComposerMaximized(false);
  };

  const handleCloseComposer = () => {
    setIsComposerOpen(false);
    setComposerState(null);
    setIsComposerMinimized(false);
    setIsComposerMaximized(false);
  };
  
  const handleToggleMinimizeComposer = () => {
    setIsComposerMinimized(prev => !prev);
  };

  const handleToggleMaximizeComposer = () => {
      setIsComposerMaximized(prev => !prev);
  };

  const handleSendEmail = (email: { to: string, cc: string, bcc: string, subject: string, body: string, attachments: File[] }) => {
      console.log("✅ Email Sent!", { ...email, attachments: email.attachments.map(f => f.name) });
      handleCloseComposer();
  };

  const handleComposeInteraction = (thread: Thread, type: 'reply' | 'reply-all' | 'forward', messageToReplyTo?: Message) => {
    const lastMessage = thread.messages[thread.messages.length - 1];
    const messageToQuote = messageToReplyTo || lastMessage;

    let to = '';
    let subject = '';
    
    const cleanedBody = messageToQuote.body.replace(/<[^>]*>/g, '').trim();
    const quotedBody = cleanedBody.split('\n').map(line => `> ${line}`).join('\n');
    const originalBody = `\n\n\n--- On ${new Date(messageToQuote.timestamp).toLocaleString()}, ${messageToQuote.sender.name} wrote: ---\n${quotedBody}`;

    switch (type) {
        case 'reply':
            to = messageToQuote.sender.email;
            subject = thread.subject.startsWith('Re:') ? thread.subject : `Re: ${thread.subject}`;
            break;
        case 'reply-all':
            to = thread.participants.filter(p => p.email !== you.email).map(p => p.email).join(', ');
            subject = thread.subject.startsWith('Re:') ? thread.subject : `Re: ${thread.subject}`;
            break;
        case 'forward':
            to = '';
            subject = thread.subject.startsWith('Fwd:') ? thread.subject : `Fwd: ${thread.subject}`;
            break;
    }

    setComposerState({ to, subject, body: originalBody });
    handleOpenComposer();
  };

  const handleOpenContextMenu = (event: React.MouseEvent, threadId: string) => {
    event.preventDefault();
    setContextMenuTarget({ x: event.clientX, y: event.clientY, threadId });
  };

  const handleCloseContextMenu = () => {
    setContextMenuTarget(null);
  };

  const handleOpenKebabMenu = (threadId: string, anchorEl: HTMLElement) => {
    const rect = anchorEl.getBoundingClientRect();
    setKebabMenuTarget({ x: rect.right - 256, y: rect.bottom + 4, threadId });
  };

  const handleCloseKebabMenu = () => {
    setKebabMenuTarget(null);
  };

  const handleSnoozeThread = (until: Date) => {
    if (!snoozeTarget && !contextMenuTarget) return;
    const threadId = snoozeTarget?.threadId || contextMenuTarget?.threadId;
    if (!threadId) return;

    setThreads(prevThreads => 
        prevThreads.map(t => 
            t.id === threadId 
                ? { ...t, snoozedUntil: until.toISOString() } 
                : t
        )
    );
    
    if (selectedThreadId === threadId) setSelectedThreadId(null);
    handleCloseSnooze();
    handleCloseContextMenu();
  };

  const handleUnsnoozeThread = (threadId: string) => {
    setThreads(prevThreads => 
        prevThreads.map(t => 
            t.id === threadId 
                ? { ...t, snoozedUntil: undefined } 
                : t
        )
    );
  };
  
  const handleNavigateEmail = (view: string, domain?: Domain) => {
    setActiveEmailView(view);
    if (view === 'inbox' && !domain) {
        setActiveDomain('all');
    } else if (domain) {
        setActiveDomain(domain);
    }
    setSelectedThreadId(null);
    setSelectedThreadIds([]);
    if (uiTheme === 'classic') {
      setIsMailboxSidebarOpen(false);
    }
  };
  
  const handleSummarizeThread = async () => {
    if (!selectedThread || !ai) return;

    setThreadSummary({ threadId: selectedThread.id, summary: null, isLoading: true, error: null });

    try {
        const threadContent = selectedThread.messages.map(m => `${m.sender.name}: ${m.body.replace(/<[^>]*>/g, '')}`).join('\n');
        const prompt = `Provide a concise, bulleted summary of the key points and any action items from the following email thread. Use markdown for formatting.\n\n${threadContent}`;
        
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });

        setThreadSummary({ threadId: selectedThread.id, summary: response.text, isLoading: false, error: null });
    } catch (e) {
        setThreadSummary({ threadId: selectedThread.id, summary: null, isLoading: false, error: 'Could not generate summary.' });
    }
  };
  
  const handleGenerateAiReply = async () => {
      if (!selectedThread || !ai) return;
      setIsGeneratingReply(true);
      
      try {
          const threadContent = selectedThread.messages.map(m => `${m.sender.name}: ${m.body.replace(/<[^>]*>/g, '')}`).join('\n');
          const prompt = `You are a helpful email assistant. Draft a professional, concise, and polite reply to the following email thread. Do not include placeholders like '[Your Name]' if you know the user's name (Alex), otherwise use '[Your Name]'. Return ONLY the body text of the email, no subject line or headers.\n\nThread Context:\n${threadContent}`;
          
          const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
          const replyBody = response.text.trim();
          
          // Prepare Composer
          const lastMessage = selectedThread.messages[selectedThread.messages.length - 1];
          const subject = selectedThread.subject.startsWith('Re:') ? selectedThread.subject : `Re: ${selectedThread.subject}`;
          
          setComposerState({
              to: lastMessage.sender.email,
              subject: subject,
              body: replyBody
          });
          
          setIsComposerOpen(true);

      } catch (e) {
          console.error("Failed to generate reply", e);
          alert("Failed to generate AI reply. Please try again.");
      } finally {
          setIsGeneratingReply(false);
      }
  };

  const handleOpenSearchFilters = (anchorEl: HTMLElement) => {
    setSearchFilterAnchorEl(anchorEl);
    setIsSearchFilterOpen(true);
  };
  
  const handleCloseSearchFilters = () => {
    setSearchFilterAnchorEl(null);
    setIsSearchFilterOpen(false);
  };
  
  const handleApplySearchFilters = (newFilters: Partial<SearchFilters>) => {
      setSearchFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleSearchQueryChange = (query: string) => {
      setSearchFilters(prev => ({ ...prev, query }));
  };

  const handleAddToCalendar = (thread: Thread) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Default to tomorrow
        startDate.setHours(10, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(11, 0, 0, 0);

        setCalendarInitialEvent({
            title: thread.subject.replace(/^(Invitation:|Re:|Fwd:)\s*/i, '').trim(),
            description: `From email: "${thread.subject}"\n\n` + thread.messages[0].body.replace(/<[^>]*>/g, '\n').substring(0, 200) + '...',
            start: startDate,
            end: endDate,
            location: 'TBD'
        });
        setIsCalendarOpen(true);
  };

  const { filteredThreads, isSearching, areFiltersActive } = useMemo(() => {
    const now = currentTime;
    const isSnoozed = (t: Thread) => t.snoozedUntil && new Date(t.snoozedUntil) > now;
    
    let baseFilteredThreads: Thread[];

    switch (activeEmailView) {
      case 'inbox':
        baseFilteredThreads = threads.filter(t => 
          !t.isArchived &&
          ['primary', 'promotions', 'social', 'updates', 'forums', 'finance', 'feedback', 'travel', 'todos'].includes(t.category) && 
          !isSnoozed(t)
        );
        break;
      case 'starred':
        baseFilteredThreads = threads.filter(t => t.isStarred && !t.isArchived);
        break;
      case 'snoozed':
        baseFilteredThreads = threads.filter(t => isSnoozed(t));
        break;
      case 'scheduled':
        // Placeholder for scheduled emails
        baseFilteredThreads = []; 
        break;
      case 'archive':
        baseFilteredThreads = threads.filter(t => t.isArchived);
        break;
      case 'todos':
        baseFilteredThreads = threads.filter(t => t.category === 'todos' && !t.isArchived && !isSnoozed(t));
        break;
      case 'sent':
         // Simple filter based on mock IDs for robustness in this demo context
         baseFilteredThreads = threads.filter(t => t.id.startsWith('sent-') || t.id.startsWith('lfc-sent-') || t.id.startsWith('prof-sent-'));
         break;
      case 'drafts':
         baseFilteredThreads = threads.filter(t => t.id.startsWith('draft') || t.id.startsWith('lfc-draft'));
         break;
      default:
        baseFilteredThreads = threads.filter(t => 
          !t.isArchived &&
          ['primary', 'promotions', 'social', 'updates', 'forums', 'finance', 'feedback', 'travel', 'todos'].includes(t.category) && 
          !isSnoozed(t)
        );
    }
    
    let result = baseFilteredThreads;

    if (activeDomain !== 'all') {
        result = result.filter(t => t.account === activeDomain);
    }

    if (showUnreadOnly) {
        result = result.filter(t => !t.isRead);
    }

    const hasSearchQuery = !!searchFilters.query.trim();
    const hasOtherFilters = !!searchFilters.sender.trim() || !!searchFilters.recipient.trim() || searchFilters.dateRange !== 'any' || searchFilters.status !== 'any' || searchFilters.label || searchFilters.fileName || searchFilters.has !== 'any' || searchFilters.attachmentType !== 'any';
    const isActuallySearching = hasSearchQuery || hasOtherFilters || aiFilteredThreadIds !== null;

    if (!isActuallySearching) {
        return { filteredThreads: result, isSearching: false, areFiltersActive: false };
    }

    // AI Search takes precedence
    if (aiFilteredThreadIds !== null) {
        const aiFiltered = result.filter(t => aiFilteredThreadIds.includes(t.id));
        return { filteredThreads: aiFiltered, isSearching: true, areFiltersActive: true };
    }
    
    // Regular text query
    if (hasSearchQuery) {
        const query = searchFilters.query.toLowerCase();
        result = result.filter(thread => 
            thread.subject.toLowerCase().includes(query) ||
            thread.participants.some(p => p.name.toLowerCase().includes(query) || p.email.toLowerCase().includes(query)) ||
            thread.messages.some(m => m.body.replace(/<[^>]*>/g, '').toLowerCase().includes(query))
        );
    }

    // Advanced Filters
    if (searchFilters.sender) {
        const senderLower = searchFilters.sender.toLowerCase();
        // Stricter check for From: check if any message sender matches
        result = result.filter(t => t.messages.some(m => m.sender.email.toLowerCase().includes(senderLower) || m.sender.name.toLowerCase().includes(senderLower)));
    }
    if (searchFilters.recipient) {
        const recipientLower = searchFilters.recipient.toLowerCase();
        // Check participants
        result = result.filter(t => t.participants.some(p => p.email.toLowerCase().includes(recipientLower) || p.name.toLowerCase().includes(recipientLower)));
    }
    if (searchFilters.status !== 'any') {
        if (searchFilters.status === 'read') result = result.filter(t => t.isRead);
        if (searchFilters.status === 'unread') result = result.filter(t => !t.isRead);
        if (searchFilters.status === 'starred') result = result.filter(t => t.isStarred);
        if (searchFilters.status === 'snoozed') result = result.filter(isSnoozed);
        if (searchFilters.status === 'sent') result = result.filter(t => t.id.startsWith('sent-'));
    }
    if (searchFilters.label) {
        const labelLower = searchFilters.label.toLowerCase();
        result = result.filter(t => t.tags?.some(tag => tag.toLowerCase() === labelLower));
    }
    if (searchFilters.fileName) {
        const fileNameLower = searchFilters.fileName.toLowerCase();
        result = result.filter(t => t.messages.some(m => m.attachments?.some(a => a.filename.toLowerCase().includes(fileNameLower))));
    }
    if (searchFilters.has !== 'any') {
        if (searchFilters.has === 'attachment') {
            result = result.filter(t => t.messages.some(m => m.attachments && m.attachments.length > 0));
        }
        // 'mention' and 'comment' are not in data model, so they won't filter anything.
    }
    if (searchFilters.attachmentType !== 'any') {
        const type = searchFilters.attachmentType;
        result = result.filter(t => t.messages.some(m => m.attachments?.some(a => {
            const name = a.filename.toLowerCase();
            const ext = name.split('.').pop();
            if (!ext) return false;
            switch(type) {
                case 'pdf': return ext === 'pdf';
                case 'image': return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
                case 'video': return ['mp4', 'mov', 'avi', 'mkv'].includes(ext);
                case 'document': return ['doc', 'docx', 'txt', 'rtf'].includes(ext);
                case 'spreadsheet': return ['xls', 'xlsx', 'csv'].includes(ext);
                case 'presentation': return ['ppt', 'pptx'].includes(ext);
                default: return false;
            }
        })));
    }
    if (searchFilters.dateRange !== 'any') {
        const now = new Date();
        let startDate = new Date();
        if (searchFilters.dateRange === '7d') {
            startDate.setDate(now.getDate() - 7);
        } else if (searchFilters.dateRange === '30d') {
            startDate.setDate(now.getDate() - 30);
        }
        result = result.filter(t => new Date(t.timestamp) >= startDate);
    }
    
    return { filteredThreads: result, isSearching: isActuallySearching, areFiltersActive: isActuallySearching };

  }, [threads, activeEmailView, currentTime, activeDomain, showUnreadOnly, searchFilters, aiFilteredThreadIds]);
  
  const handleNavigateThread = (direction: 'next' | 'prev') => {
    if (!selectedThreadId) return;
    const currentIndex = filteredThreads.findIndex(t => t.id === selectedThreadId);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < filteredThreads.length) {
        const nextThreadId = filteredThreads[nextIndex].id;
        handleSelectThread(nextThreadId);
    }
  };

  const snoozedCount = useMemo(() => {
      const now = currentTime;
      return threads.filter(t => t.snoozedUntil && new Date(t.snoozedUntil) > now).length;
  }, [threads, currentTime]);
  
  const unreadCounts = useMemo(() => {
    const now = currentTime;
    const isSnoozed = (t: Thread) => t.snoozedUntil && new Date(t.snoozedUntil) > now;
    const inboxThreads = threads.filter(t => !t.isArchived && ['primary', 'promotions', 'social', 'updates', 'forums'].includes(t.category) && !isSnoozed(t));
    
    return {
        microhard: inboxThreads.filter(t => t.account === 'microhard' && !t.isRead).length,
        liverpool: inboxThreads.filter(t => t.account === 'liverpool' && !t.isRead).length,
        innovate: inboxThreads.filter(t => t.account === 'innovate' && !t.isRead).length,
    }
  }, [threads, currentTime]);

  const totalUnread = unreadCounts.microhard + unreadCounts.liverpool + unreadCounts.innovate;

  const handleCloseMobileSettings = () => {
    setIsMobileSettingsOpen(false);
    setActiveModule(previousActiveModule);
  };

  const handleNavigateModule = (module: Module) => {
    if (module === 'settings') {
      if (activeModule !== 'settings') {
          setPreviousActiveModule(activeModule);
      }
      setActiveModule('settings');
      setIsMobileSettingsOpen(true);
    } else {
      setActiveModule(module);
      setIsMobileSettingsOpen(false); // Close settings if navigating to another module
    }
  };
  
  const currentUser = activeDomain === 'all' ? you : activeDomain === 'innovate' ? youInnovate : activeDomain === 'microhard' ? you : youLiverpool;
  
  const accounts = useMemo(() => {
    if (uiTheme === 'classic') {
        return [{ name: youInnovate.name, email: youInnovate.email, avatarUrl: youInnovate.avatarUrl }];
    }
    return [
        { name: you.name, email: you.email, avatarUrl: you.avatarUrl },
        { name: youLiverpool.name, email: youLiverpool.email, avatarUrl: youLiverpool.avatarUrl }
    ];
  }, [uiTheme]);

  const appContextValue = {
    accounts,
    theme,
    setTheme,
    uiTheme,
    setUiTheme,
    initialSettingsView,
    setInitialSettingsView,
    setActiveModule: handleNavigateModule,
    activeDomain,
  };

  const renderActiveView = (isMobileView: boolean) => {
    const emailProps = {
      isMobile: isMobileView,
      filteredThreads, selectedThreadId, handleSelectThread, activeEmailView, handleOpenSnooze,
      selectedThread, toggleAIAssistant, handleBack, setIsDiscoverModalOpen, handleScheduleMeeting,
      handleUnsnoozeThread, handleSummarizeThread, threadSummary, setThreadSummary, isAIAssistantOpen,
      handleCloseAIAssistant, aiAssistantMode, selectedThreadIds, handleToggleSelection, handleClearSelection,
      handleBulkArchive, handleBulkDelete, handleBulkMarkAsRead, handleOpenContextMenu, handleOpenKebabMenu,
      showUnreadOnly, onToggleUnreadFilter: () => setShowUnreadOnly(p => !p), handleComposeInteraction,
      handleArchiveThread, handleDeleteThread, handleMarkAsReadThread, handleToggleStarThread, searchQuery: searchFilters.query,
      onSearchQueryChange: handleSearchQueryChange, onOpenSearchFilters: handleOpenSearchFilters, isSearching,
      areFiltersActive, onNavigate: handleNavigateEmail, onCompose: handleOpenComposer, currentUser,
      toggleMailboxSidebar: () => setIsMailboxSidebarOpen(true),
      unreadCounts,
      snoozedCount,
      onBulkModeChange: setIsBulkModeActive,
      handleNavigateThread,
      mobileMainView,
      setMobileMainView,
      isAiSearching,
      onOpenCalendar: () => setIsCalendarOpen(true),
      onGenerateAiReply: handleGenerateAiReply,
      isGeneratingReply,
      onAddToCalendar: handleAddToCalendar,
      onOpenFilters: () => setIsFilterScreenOpen(true),
    };

    switch (activeModule) {
        case 'email': return <EmailView {...emailProps} />;
        case 'copilot': return <CopilotView />;
        case 'chat': return <ChatView />;
        case 'drive': return <DriveView />;
        default: return <EmailView {...emailProps} />;
    }
  };
  
  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  if (isMobile) {
    const showBottomNav = !isBulkModeActive && !selectedThreadId && !(uiTheme === 'modern' && mobileMainView === 'mailboxes');
    return (
      <AppContext.Provider value={appContextValue}>
        <div className="h-dvh w-screen flex flex-col overflow-hidden bg-background text-foreground">
          {isComposerOpen && <ComposerMobile onClose={handleCloseComposer} initialState={composerState} onSend={handleSendEmail} />}
          <SettingsViewMobile isOpen={isMobileSettingsOpen} onClose={handleCloseMobileSettings} />
          <CalendarViewMobile isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} initialEventData={calendarInitialEvent} />
          <FilterScreenMobile 
            isOpen={isFilterScreenOpen}
            onClose={() => setIsFilterScreenOpen(false)}
            currentFilters={searchFilters}
            onApplyFilters={handleApplySearchFilters}
            allUsers={allUsers}
          />
          
          {uiTheme === 'classic' && (
            <MailboxSidebar 
              isOpen={isMailboxSidebarOpen} 
              onClose={() => setIsMailboxSidebarOpen(false)} 
              onNavigate={handleNavigateEmail}
              activeView={activeEmailView}
            />
          )}
          
          <main className="flex-1 min-h-0">
            {renderActiveView(true)}
          </main>
          
          {showBottomNav && <MobileBottomNav activeModule={activeModule} onNavigate={handleNavigateModule} />}
           {contextMenuTarget && (
             <EmailContextMenu
                 x={contextMenuTarget.x}
                 y={contextMenuTarget.y}
                 thread={threads.find(t => t.id === contextMenuTarget.threadId) || null}
                 onClose={handleCloseContextMenu}
                 onArchive={handleArchiveThread}
                 onDelete={handleDeleteThread}
                 onMarkAsRead={handleMarkAsReadThread}
                 onToggleStar={handleToggleStarThread}
                 onSnooze={handleOpenSnooze}
                 onMoveToJunk={handleMoveToJunk}
                 onMute={handleMuteThread}
                 onBlockSender={handleBlockSender}
                 onToggleSelection={handleToggleSelection}
             />
            )}
        </div>
      </AppContext.Provider>
    );
  }

  // --- DESKTOP VIEW ---
  return (
    <AppContext.Provider value={appContextValue}>
      <div className="h-dvh w-screen flex overflow-hidden">
        <Composer isOpen={isComposerOpen} onClose={handleCloseComposer} initialState={composerState} isMinimized={isComposerMinimized} isMaximized={isComposerMaximized} onToggleMinimize={handleToggleMinimizeComposer} onToggleMaximize={handleToggleMaximizeComposer} onSend={handleSendEmail} />
        <DiscoverModal isOpen={isDiscoverModalOpen} onClose={() => setIsDiscoverModalOpen(false)} />
        <AIAssistantModal isOpen={isAIAssistantOpen} onClose={handleCloseAIAssistant} selectedThread={selectedThread} mode={aiAssistantMode} />
        {snoozeTarget && <SnoozePopover anchorEl={snoozeTarget.anchorEl} onClose={handleCloseSnooze} onSnooze={handleSnoozeThread} />}
        {isSearchFilterOpen && searchFilterAnchorEl && <SearchFilterPopover anchorEl={searchFilterAnchorEl} onClose={handleCloseSearchFilters} filters={{ sender: searchFilters.sender, dateRange: searchFilters.dateRange, status: searchFilters.status }} onApply={handleApplySearchFilters} />}
        {contextMenuTarget && <EmailContextMenu x={contextMenuTarget.x} y={contextMenuTarget.y} thread={threads.find(t => t.id === contextMenuTarget.threadId) || null} onClose={handleCloseContextMenu} onArchive={handleArchiveThread} onDelete={handleDeleteThread} onMarkAsRead={handleMarkAsReadThread} onToggleStar={handleToggleStarThread} onSnooze={handleOpenSnooze} onMoveToJunk={handleMoveToJunk} onMute={handleMuteThread} onBlockSender={handleBlockSender} onToggleSelection={handleToggleSelection} />}
        {kebabMenuTarget && <KebabMenu x={kebabMenuTarget.x} y={kebabMenuTarget.y} thread={threads.find(t => t.id === kebabMenuTarget.threadId) || null} onClose={handleCloseKebabMenu} onArchive={handleArchiveThread} onDelete={handleDeleteThread} onMarkAsRead={handleMarkAsReadThread} onRemindMe={handleOpenSnooze} onMoveToJunk={handleMoveToJunk} onMute={handleMuteThread} onBlockSender={handleBlockSender} onComposeInteraction={(thread, type) => { if (thread) handleComposeInteraction(thread, type) }} />}
        
        <PrimarySidebar activeModule={activeModule} onNavigate={handleNavigateModule} />
          
        {activeModule === 'email' && 
          <div className="md:flex h-full flex-shrink-0 relative">
              <Sidebar width={sidebarWidth} isSidebarOpen={true} activeView={activeEmailView} activeDomain={activeDomain} onNavigate={handleNavigateEmail} snoozedCount={snoozedCount} unreadCounts={unreadCounts} totalUnread={totalUnread} onComposeClick={handleOpenComposer} />
              <Resizer onMouseDown={handleSidebarMouseDown} className="hidden md:flex" />
          </div>
        }
        
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
           <div key={activeModule} className="flex-1 flex flex-col min-w-0 animate-fadeIn overflow-hidden">
              {renderActiveView(false)}
           </div>
        </main>

        {undoState && <UndoSnackbar message={undoState.message} onUndo={undoState.onUndo} onClose={closeUndo} />}
      </div>
    </AppContext.Provider>
  );
};

export default App;