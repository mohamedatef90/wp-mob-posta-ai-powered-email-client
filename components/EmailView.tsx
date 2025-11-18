import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import EmailListHeader from './EmailListHeader';
import EmailList from './EmailList';
import EmailDetailHeader from './EmailDetailHeader';
import EmailDetail from './EmailDetail';
import type { Thread, Message, User } from '../types';
import Resizer from './ui/Resizer';
// FIX: Import Domain type to ensure consistency.
import { AppContext, type Domain } from './context/AppContext';

// New Mobile Components
import EmailListMobile from './EmailListMobile';
import EmailDetailMobile from './EmailDetail.mobile';
import EmailDetailHeaderMobile from './EmailDetailHeader.mobile';
import EmailDetailActionBar from './EmailDetailActionBar';
import { MailboxesView } from './MailboxesView';

interface EmailViewProps {
  isMobile: boolean;
  filteredThreads: Thread[];
  selectedThreadId: string | null;
  handleSelectThread: (id: string) => void;
  activeEmailView: string;
  handleOpenSnooze: (threadId: string, anchorEl: HTMLElement) => void;
  selectedThread: Thread | null;
  toggleAIAssistant: () => void;
  handleBack: () => void;
  setIsDiscoverModalOpen: (isOpen: boolean) => void;
  handleScheduleMeeting: () => void;
  handleUnsnoozeThread: (threadId: string) => void;
  handleSummarizeThread: () => void;
  threadSummary: {
    threadId: string | null;
    summary: string | null;
    isLoading: boolean;
    error: string | null;
  };
  setThreadSummary: React.Dispatch<React.SetStateAction<{
    threadId: string | null;
    summary: string | null;
    isLoading: boolean;
    error: string | null;
  }>>;
  isAIAssistantOpen: boolean;
  handleCloseAIAssistant: () => void;
  aiAssistantMode: 'default' | 'scheduleMeeting';
  selectedThreadIds: string[];
  handleToggleSelection: (id: string) => void;
  handleClearSelection: () => void;
  handleBulkArchive: () => void;
  handleBulkDelete: () => void;
  handleBulkMarkAsRead: () => void;
  handleOpenContextMenu: (event: React.MouseEvent, threadId: string) => void;
  handleOpenKebabMenu: (threadId: string, anchorEl: HTMLElement) => void;
  showUnreadOnly: boolean;
  onToggleUnreadFilter: () => void;
  handleComposeInteraction: (thread: Thread, type: 'reply' | 'reply-all' | 'forward', messageToReplyTo?: Message) => void;
  handleArchiveThread: (threadId: string) => void;
  handleDeleteThread: (threadId: string) => void;
  handleMarkAsReadThread: (threadId: string, isRead: boolean) => void;
  handleToggleStarThread: (threadId: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenSearchFilters: (anchorEl: HTMLElement) => void;
  isSearching: boolean;
  areFiltersActive: boolean;
  // FIX: Changed domain type from hardcoded list to the 'Domain' type to match the rest of the application.
  onNavigate: (view: string, domain?: Domain) => void;
  onCompose: () => void;
  currentUser: User;
  toggleMailboxSidebar: () => void;
  // FIX: Changed 'hogwarts' to 'microhard' in unreadCounts to match expected data structure.
  unreadCounts: { microhard: number; liverpool: number; innovate: number; };
  snoozedCount: number;
  onBulkModeChange: (isActive: boolean) => void;
  handleNavigateThread: (direction: 'next' | 'prev') => void;
  mobileMainView: 'mailboxes' | 'list';
  setMobileMainView: React.Dispatch<React.SetStateAction<'mailboxes' | 'list'>>;
  isAiSearching: boolean;
  onOpenCalendar?: () => void;
  onGenerateAiReply?: () => void;
  isGeneratingReply?: boolean;
}

const EmailView: React.FC<EmailViewProps> = (props) => {
  const { isMobile, selectedThreadId, selectedThread, mobileMainView, setMobileMainView } = props;
  const { uiTheme } = useContext(AppContext);

  // --- MOBILE VIEW ---
  if (isMobile) {
    // Detail View is the highest priority and is consistent across themes
    if (selectedThreadId && selectedThread) {
      const currentIndex = props.filteredThreads.findIndex(t => t.id === selectedThreadId);
      const canNavigatePrev = currentIndex > 0;
      const canNavigateNext = currentIndex < props.filteredThreads.length - 1;

      return (
        <div className="h-full w-full relative">
            <div className="h-full w-full overflow-y-auto">
                <EmailDetailMobile
                    thread={selectedThread}
                    summaryState={props.threadSummary}
                    onClearSummary={() => props.setThreadSummary({ threadId: null, summary: null, isLoading: false, error: null })}
                    onComposeInteraction={(type, msg) => props.handleComposeInteraction(selectedThread, type, msg)}
                    onToggleStar={() => props.handleToggleStarThread(selectedThread.id)}
                    onOpenKebabMenu={(anchorEl) => selectedThread && props.handleOpenKebabMenu(selectedThread.id, anchorEl)}
                    onSummarize={props.handleSummarizeThread}
                    onGenerateAiReply={props.onGenerateAiReply}
                    isGeneratingReply={props.isGeneratingReply}
                />
            </div>
            <EmailDetailHeaderMobile
                thread={selectedThread}
                isDetailView={true}
                onBack={props.handleBack}
                onDiscoverClick={() => props.setIsDiscoverModalOpen(true)}
                onScheduleMeetingClick={props.handleScheduleMeeting}
                onSnoozeClick={(e) => selectedThread && props.handleOpenSnooze(selectedThread.id, e.currentTarget)}
                onOpenKebabMenu={props.handleOpenKebabMenu}
                onUnsnooze={props.handleUnsnoozeThread}
                onSummarize={props.handleSummarizeThread}
                isSummarizing={props.threadSummary.isLoading}
                onComposeInteraction={(type) => selectedThread && props.handleComposeInteraction(selectedThread, type)}
                onToggleStar={() => selectedThread && props.handleToggleStarThread(selectedThread.id)}
                searchQuery={props.searchQuery}
                onSearchQueryChange={props.onSearchQueryChange}
                onOpenSearchFilters={props.onOpenSearchFilters}
                areFiltersActive={props.areFiltersActive}
                activeEmailView={props.activeEmailView}
                onArchive={props.handleArchiveThread}
                onDelete={props.handleDeleteThread}
                onMarkAsRead={props.handleMarkAsReadThread}
                onNavigateThread={props.handleNavigateThread}
                canNavigatePrev={canNavigatePrev}
                canNavigateNext={canNavigateNext}
            />
            <EmailDetailActionBar 
              thread={selectedThread} 
              onComposeInteraction={props.handleComposeInteraction} 
              onArchive={props.handleArchiveThread}
              onDelete={props.handleDeleteThread}
            />
        </div>
      );
    }
    
    // Modern Theme Navigation Flow
    if (uiTheme === 'modern') {
      if (mobileMainView === 'list') {
        return (
          <EmailListMobile
            threads={props.filteredThreads}
            selectedThreadId={props.selectedThreadId}
            onSelectThread={props.handleSelectThread}
            activeView={props.activeEmailView}
            onSnoozeClick={props.handleOpenSnooze}
            selectedThreadIds={props.selectedThreadIds}
            onToggleSelection={props.handleToggleSelection}
            onBulkArchive={props.handleBulkArchive}
            onBulkDelete={props.handleBulkDelete}
            onBulkMarkAsRead={props.handleBulkMarkAsRead}
            onContextMenu={props.handleOpenContextMenu}
            onArchive={props.handleArchiveThread}
            onDelete={props.handleDeleteThread}
            onMarkAsRead={props.handleMarkAsReadThread}
            onToggleStar={props.handleToggleStarThread}
            onOpenKebabMenu={props.handleOpenKebabMenu}
            toggleEmailSidebar={props.toggleMailboxSidebar}
            onClearSelection={props.handleClearSelection}
            currentUser={props.currentUser}
            onCompose={props.onCompose}
            onNavigate={props.onNavigate}
            searchQuery={props.searchQuery}
            onSearchQueryChange={props.onSearchQueryChange}
            onBack={() => setMobileMainView('mailboxes')}
            onBulkModeChange={props.onBulkModeChange}
            isAiSearching={props.isAiSearching}
            onOpenCalendar={props.onOpenCalendar}
          />
        );
      }
      
      return (
        <MailboxesView
          onNavigate={(view, domain) => {
            props.onNavigate(view, domain);
            setMobileMainView('list');
          }}
          unreadCounts={props.unreadCounts}
          snoozedCount={props.snoozedCount}
          activeView={props.activeEmailView}
        />
      );
    }

    // Classic Theme (Default List View)
    return <EmailListMobile
        threads={props.filteredThreads}
        selectedThreadId={props.selectedThreadId}
        onSelectThread={props.handleSelectThread}
        activeView={props.activeEmailView}
        onSnoozeClick={props.handleOpenSnooze}
        selectedThreadIds={props.selectedThreadIds}
        onToggleSelection={props.handleToggleSelection}
        onBulkArchive={props.handleBulkArchive}
        onBulkDelete={props.handleBulkDelete}
        onBulkMarkAsRead={props.handleBulkMarkAsRead}
        onContextMenu={props.handleOpenContextMenu}
        onArchive={props.handleArchiveThread}
        onDelete={props.handleDeleteThread}
        onMarkAsRead={props.handleMarkAsReadThread}
        onToggleStar={props.handleToggleStarThread}
        onOpenKebabMenu={props.handleOpenKebabMenu}
        toggleEmailSidebar={props.toggleMailboxSidebar}
        onClearSelection={props.handleClearSelection}
        currentUser={props.currentUser}
        onCompose={props.onCompose}
        onNavigate={props.onNavigate}
        searchQuery={props.searchQuery}
        onSearchQueryChange={props.onSearchQueryChange}
        onBulkModeChange={props.onBulkModeChange}
        isAiSearching={props.isAiSearching}
        onOpenCalendar={props.onOpenCalendar}
    />;
  }

  // --- DESKTOP VIEW ---
  const [listWidth, setListWidth] = useState(384);
  const isResizingList = useRef(false);
  const startListX = useRef(0);
  const startListWidth = useRef(0);

  const handleListMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      isResizingList.current = true;
      startListX.current = e.clientX;
      startListWidth.current = listWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
  }, [listWidth]);

  const handleListMouseMove = useCallback((e: MouseEvent) => {
      if (!isResizingList.current) return;
      const deltaX = e.clientX - startListX.current;
      const newWidth = startListWidth.current + deltaX;
      setListWidth(Math.max(300, Math.min(newWidth, 600)));
  }, []);

  const handleListMouseUp = useCallback(() => {
      isResizingList.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
      window.addEventListener('mousemove', handleListMouseMove);
      window.addEventListener('mouseup', handleListMouseUp);
      return () => {
          window.removeEventListener('mousemove', handleListMouseMove);
          window.removeEventListener('mouseup', handleListMouseUp);
      };
  }, [handleListMouseMove, handleListMouseUp]);

  return (
    <div className="flex h-full w-full">
      <div style={{ width: `${listWidth}px` }} className="flex flex-col h-full flex-shrink-0">
        <EmailListHeader isSearching={props.isSearching} selectedThreadIds={props.selectedThreadIds} />
        <EmailList
            threads={props.filteredThreads}
            selectedThreadId={props.selectedThreadId}
            onSelectThread={props.handleSelectThread}
            activeView={props.activeEmailView}
            onSnoozeClick={props.handleOpenSnooze}
            onOpenKebabMenu={props.handleOpenKebabMenu}
            selectedThreadIds={props.selectedThreadIds}
            onToggleSelection={props.handleToggleSelection}
            onBulkArchive={props.handleBulkArchive}
            onBulkDelete={props.handleBulkDelete}
            onBulkMarkAsRead={props.handleBulkMarkAsRead}
            onContextMenu={props.handleOpenContextMenu}
            onArchive={props.handleArchiveThread}
            onDelete={props.handleDeleteThread}
            onMarkAsRead={props.handleMarkAsReadThread}
            onToggleStar={props.handleToggleStarThread}
        />
      </div>
      <Resizer onMouseDown={handleListMouseDown} />
      <div className="flex-1 flex flex-col min-w-0">
        <EmailDetailHeader
            thread={selectedThread}
            isDetailView={!!selectedThread}
            onToggleAIAssistant={props.toggleAIAssistant}
            onBack={props.handleBack}
            onDiscoverClick={() => props.setIsDiscoverModalOpen(true)}
            onScheduleMeetingClick={props.handleScheduleMeeting}
            onSnoozeClick={(e) => selectedThread && props.handleOpenSnooze(selectedThread.id, e.currentTarget)}
            onOpenKebabMenu={props.handleOpenKebabMenu}
            onUnsnooze={props.handleUnsnoozeThread}
            onSummarize={props.handleSummarizeThread}
            isSummarizing={props.threadSummary.isLoading}
            onComposeInteraction={(type) => selectedThread && props.handleComposeInteraction(selectedThread, type)}
            onToggleStar={() => selectedThread && props.handleToggleStarThread(selectedThread.id)}
            searchQuery={props.searchQuery}
            onSearchQueryChange={props.onSearchQueryChange}
            onOpenSearchFilters={props.onOpenSearchFilters}
            areFiltersActive={props.areFiltersActive}
            onGenerateAiReply={props.onGenerateAiReply}
            isGeneratingReply={props.isGeneratingReply}
        />
        <div className="flex-1 flex min-h-0 relative">
          <EmailDetail
            thread={selectedThread}
            summaryState={props.threadSummary}
            onClearSummary={() => props.setThreadSummary({ threadId: null, summary: null, isLoading: false, error: null })}
            onComposeInteraction={(type, msg) => selectedThread && props.handleComposeInteraction(selectedThread, type, msg)}
            onToggleStar={() => selectedThread && props.handleToggleStarThread(selectedThread.id)}
            onOpenKebabMenu={(anchorEl) => selectedThread && props.handleOpenKebabMenu(selectedThread.id, anchorEl)}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailView;