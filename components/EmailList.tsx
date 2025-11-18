import React, { useState, useRef, useMemo } from 'react';
import type { Thread } from '../types';
import EmailListItem from './EmailListItem';
import { Button } from './ui/Button';

const EMPTY_STATE_CONFIG: { [key: string]: { icon: string; text: string } } = {
  snoozed: { icon: 'fa-regular fa-clock', text: 'Nothing is snoozed' },
  sent: { icon: 'fa-regular fa-paper-plane', text: 'Nothing in Sent' },
  drafts: { icon: 'fa-regular fa-file-lines', text: 'No saved drafts' },
  archive: { icon: 'fa-solid fa-archive', text: 'The Archive is Empty' },
  folders: { icon: 'fa-regular fa-folder', text: 'This folder is empty' },
  finance: { icon: 'fa-solid fa-piggy-bank', text: 'No financial emails' },
  feedback: { icon: 'fa-solid fa-thumbs-up', text: 'No feedback emails' },
  travel: { icon: 'fa-solid fa-plane-departure', text: 'No travel emails' },
  default: { icon: 'fa-regular fa-envelope-open', text: 'This folder is empty' },
};

interface EmailListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (id: string) => void;
  activeView?: string;
  onSnoozeClick: (threadId: string, anchorEl: HTMLElement) => void;
  onOpenKebabMenu: (threadId: string, anchorEl: HTMLElement) => void;
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
}

const THREAD_ITEM_HEIGHT = 92;
const SECTION_HEADER_HEIGHT = 40;
const OVERSCAN_COUNT = 5;

const EmailList: React.FC<EmailListProps> = ({ 
    threads, 
    selectedThreadId, 
    onSelectThread, 
    activeView = 'inbox', 
    onSnoozeClick, 
    onOpenKebabMenu, 
    selectedThreadIds, 
    onToggleSelection, 
    onBulkArchive, 
    onBulkDelete, 
    onBulkMarkAsRead, 
    onContextMenu,
    onArchive,
    onDelete,
    onMarkAsRead,
    onToggleStar,
}) => {
    
  if (threads.length === 0) {
    const config = EMPTY_STATE_CONFIG[activeView] || EMPTY_STATE_CONFIG.default;
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 animate-fadeIn">
        <i className={`${config.icon} text-5xl mb-4`}></i>
        <p className="font-medium text-foreground">{config.text}</p>
        {activeView === 'archive' && <p className="text-sm mt-1">Archived messages will appear here.</p>}
        {activeView === 'snoozed' && <p className="text-sm mt-1">Snoozed emails will show up here until their time comes.</p>}
      </div>
    );
  }
    
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
  };
    
  const { allItems, totalHeight } = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfLastWeek = new Date(startOfToday);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const todayThreads = threads.filter(t => new Date(t.timestamp) >= startOfToday);
    const lastWeekThreads = threads.filter(t => new Date(t.timestamp) < startOfToday && new Date(t.timestamp) >= startOfLastWeek);
    const olderThreads = threads.filter(t => new Date(t.timestamp) < startOfLastWeek);
      
    const items: any[] = [];
    let currentOffset = 0;

    const addSection = (title: string, threadsInSection: Thread[]) => {
      if (threadsInSection.length > 0) {
        items.push({ type: 'header', title, height: SECTION_HEADER_HEIGHT, offset: currentOffset });
        currentOffset += SECTION_HEADER_HEIGHT;
        threadsInSection.forEach(thread => {
          items.push({ type: 'thread', data: thread, height: THREAD_ITEM_HEIGHT, offset: currentOffset });
          currentOffset += THREAD_ITEM_HEIGHT;
        });
      }
    };
    
    addSection('TODAY', todayThreads);
    addSection('LAST WEEK', lastWeekThreads);
    addSection('OLDER', olderThreads);
      
    return { allItems: items, totalHeight: currentOffset };
  }, [threads]);

  const containerHeight = containerRef.current?.clientHeight || 0;
  
  const startIndex = useMemo(() => {
      let start = 0;
      while (start < allItems.length && allItems[start].offset + allItems[start].height < scrollTop) {
          start++;
      }
      return Math.max(0, start - OVERSCAN_COUNT);
  }, [allItems, scrollTop]);

  const endIndex = useMemo(() => {
      let end = startIndex;
      while (end < allItems.length && allItems[end].offset < scrollTop + containerHeight) {
          end++;
      }
      return Math.min(allItems.length - 1, end + OVERSCAN_COUNT);
  }, [allItems, startIndex, scrollTop, containerHeight]);

  const visibleItems = allItems.slice(startIndex, endIndex + 1);

  const BulkActionBar = () => (
    <div className="p-2 border-b border-border bg-secondary flex items-center justify-between sticky top-0 z-10 animate-fadeInDown" style={{ animationDuration: '0.2s' }}>
        <span className="text-sm font-semibold text-secondary-foreground px-2">{selectedThreadIds.length} selected</span>
        <div className="flex items-center space-x-1">
          <Button onClick={onBulkArchive} variant="ghost" size="sm" className="text-muted-foreground"><i className="fa-solid fa-archive mr-2"></i>Archive</Button>
          <Button onClick={onBulkDelete} variant="ghost" size="sm" className="text-muted-foreground"><i className="fa-solid fa-trash mr-2"></i>Delete</Button>
          <Button onClick={onBulkMarkAsRead} variant="ghost" size="sm" className="text-muted-foreground"><i className="fa-regular fa-envelope-open mr-2"></i>Mark as Read</Button>
        </div>
      </div>
  );

  return (
    <div className="bg-background flex flex-col h-full w-full dark:backdrop-blur-xl">
      {selectedThreadIds.length > 0 && <BulkActionBar />}
      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(item => {
            if (item.type === 'header') {
              return (
                <div key={item.title} style={{ position: 'absolute', top: item.offset, height: item.height, width: '100%' }}>
                  <h2 className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>{item.title}</span>
                  </h2>
                </div>
              );
            }
            
            const thread = item.data;
            return (
              <div key={thread.id} style={{ position: 'absolute', top: item.offset, height: item.height, width: '100%' }}>
                <EmailListItem
                  thread={thread}
                  isSelected={thread.id === selectedThreadId}
                  isSelectedForBulk={selectedThreadIds.includes(thread.id)}
                  onSelect={onSelectThread}
                  selectedThreadIds={selectedThreadIds}
                  onToggleSelection={onToggleSelection}
                  onSnoozeClick={onSnoozeClick}
                  onOpenKebabMenu={onOpenKebabMenu}
                  onContextMenu={onContextMenu}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onMarkAsRead={onMarkAsRead}
                  onToggleStar={onToggleStar}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmailList;