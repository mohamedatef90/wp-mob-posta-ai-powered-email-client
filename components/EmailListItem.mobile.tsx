import React, { useRef, useState, useContext } from 'react';
import type { Thread } from '../types';
import { AppContext } from './context/AppContext';

interface EmailListItemProps {
  thread: Thread;
  isSelectedForBulk: boolean;
  onSelect: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, threadId: string) => void;
  onArchive: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  selectedThreadIds: string[];
  onToggleStar: (threadId: string) => void;
  isBulkSelecting: boolean;
  setIsBulkSelecting: (isSelecting: boolean) => void;
  onMarkAsRead: (threadId: string, isRead: boolean) => void;
  onSnoozeClick: (threadId: string, anchorEl: HTMLElement) => void;
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const EmailListItemMobile: React.FC<EmailListItemProps> = ({ 
  thread, 
  isSelectedForBulk, 
  onSelect, 
  onToggleSelection, 
  onContextMenu,
  onArchive,
  onDelete,
  selectedThreadIds,
  onToggleStar,
  isBulkSelecting,
  setIsBulkSelecting,
  onMarkAsRead,
  onSnoozeClick,
}) => {
  const { uiTheme } = useContext(AppContext);
  const itemRef = useRef<HTMLDivElement>(null);
  const gestureState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    direction: 'none' as 'none' | 'horizontal' | 'vertical',
    moved: false
  });
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  // Modern theme constants
  const RIGHT_SWIPE_ACTIONS_WIDTH = 160;
  const LEFT_SWIPE_ACTIONS_WIDTH = 160;
  const SWIPE_ACTIVATION_THRESHOLD = 60;

  const handleDragStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    gestureState.current = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      direction: 'none',
      moved: false,
    };
    itemRef.current?.classList.add('!duration-0');
    
    longPressTriggered.current = false;
    longPressTimer.current = window.setTimeout(() => {
        if (uiTheme === 'modern') {
            const fakeEvent = {
                preventDefault: () => {},
                clientX: gestureState.current.startX,
                clientY: gestureState.current.startY,
            } as unknown as React.MouseEvent;
            
            onContextMenu(fakeEvent, thread.id);
            if (navigator.vibrate) navigator.vibrate(50);
            longPressTriggered.current = true;
        } else {
            setIsBulkSelecting(true);
            onToggleSelection(thread.id);
            if (navigator.vibrate) navigator.vibrate(50);
            longPressTriggered.current = true;
        }
        
        longPressTimer.current = null;
    }, 500);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!gestureState.current.isDragging) return;
    
    const deltaX = clientX - gestureState.current.startX;
    const deltaY = clientY - gestureState.current.startY;
    
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    }

    if (!gestureState.current.moved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        gestureState.current.moved = true;
    }

    if (gestureState.current.direction === 'none' && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        gestureState.current.direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    }

    if (gestureState.current.direction === 'horizontal') {
      if (uiTheme === 'modern') {
        const isPastRightLimit = deltaX > RIGHT_SWIPE_ACTIONS_WIDTH;
        const isPastLeftLimit = deltaX < -LEFT_SWIPE_ACTIONS_WIDTH;
        let newTranslateX = deltaX;
        if (isPastRightLimit) {
            const overflow = deltaX - RIGHT_SWIPE_ACTIONS_WIDTH;
            newTranslateX = RIGHT_SWIPE_ACTIONS_WIDTH + overflow * 0.4;
        } else if (isPastLeftLimit) {
            const overflow = deltaX + LEFT_SWIPE_ACTIONS_WIDTH;
            newTranslateX = -LEFT_SWIPE_ACTIONS_WIDTH + overflow * 0.4;
        }
        setTranslateX(newTranslateX);
      } else {
        setTranslateX(deltaX);
      }
    }
  };

  const closeActions = () => {
    setIsAnimating(true);
    setTranslateX(0);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDragEndModern = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!gestureState.current.isDragging) return;
    
    const wasHorizontal = gestureState.current.direction === 'horizontal';
    gestureState.current.isDragging = false;
    itemRef.current?.classList.remove('!duration-0');
    
    if (!wasHorizontal) return;
    
    setIsAnimating(true);
    
    if (translateX > SWIPE_ACTIVATION_THRESHOLD) {
        setTranslateX(RIGHT_SWIPE_ACTIONS_WIDTH);
    } else if (translateX < -SWIPE_ACTIVATION_THRESHOLD) {
        setTranslateX(-LEFT_SWIPE_ACTIONS_WIDTH);
    } else {
        setTranslateX(0);
    }
    
    setTimeout(() => {
        setIsAnimating(false);
    }, 300);
  };
  
  const handleDragEndClassic = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!gestureState.current.isDragging) return;
    
    const wasHorizontal = gestureState.current.direction === 'horizontal';
    gestureState.current.isDragging = false;
    itemRef.current?.classList.remove('!duration-0');
    
    if (!wasHorizontal) return;

    const itemWidth = itemRef.current?.offsetWidth || 0;
    const threshold = itemWidth * 0.25;
    
    setIsAnimating(true);
    let action: (() => void) | null = null;

    if (translateX < -threshold) { // Left swipe -> Archive
      setTranslateX(-itemWidth);
      action = () => onArchive(thread.id);
    } else if (translateX > threshold) { // Right swipe -> Delete
      setTranslateX(itemWidth);
      action = () => onDelete(thread.id);
    } else {
      setTranslateX(0);
    }
    
    setTimeout(() => {
        action?.();
        setIsAnimating(false);
        if (action) setTimeout(() => setTranslateX(0), 300);
    }, 300);
  };

  const handleDragEnd = uiTheme === 'modern' ? handleDragEndModern : handleDragEndClassic;

  const handleClickModern = (e: React.MouseEvent) => {
    if(e.detail === 0 || longPressTriggered.current || gestureState.current.moved) return;
    if (translateX !== 0) {
      closeActions();
      return;
    }
    if (isBulkSelecting) {
        onToggleSelection(thread.id);
    } else {
        onSelect(thread.id);
    }
  };

  const handleClickClassic = (e: React.MouseEvent) => {
    if(e.detail === 0 || longPressTriggered.current || gestureState.current.moved) return;
    if (isBulkSelecting) {
        onToggleSelection(thread.id);
    } else {
        onSelect(thread.id);
    }
  };

  const handleClick = uiTheme === 'modern' ? handleClickModern : handleClickClassic;
  
  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gestureState.current.isDragging) return;
    handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    if (gestureState.current.direction === 'horizontal') e.preventDefault();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  const sender = thread.messages[thread.messages.length - 1].sender;
  const isHighlighted = isSelectedForBulk;
  const isInBulkMode = isBulkSelecting || selectedThreadIds.length > 0;

  // Modern theme actions
  const handleArchiveAction = (e: React.MouseEvent) => { e.stopPropagation(); onArchive(thread.id); closeActions(); };
  const handleDeleteAction = (e: React.MouseEvent) => { e.stopPropagation(); onDelete(thread.id); closeActions(); };
  const handleSnoozeAction = (e: React.MouseEvent) => { e.stopPropagation(); onSnoozeClick(thread.id, e.currentTarget as HTMLElement); closeActions(); };
  const handleMarkReadAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(thread.id, !thread.isRead);
    closeActions();
  };

  const ModernBackgroundActions = () => {
    // Right swipe (positive translateX)
    const rightSwipeProgress = Math.min(1, Math.max(0, translateX / RIGHT_SWIPE_ACTIONS_WIDTH));
    const rightIconScale = 0.6 + rightSwipeProgress * 0.4;

    // Left swipe (negative translateX)
    const snoozeProgress = Math.min(1, Math.max(0, -translateX / (LEFT_SWIPE_ACTIONS_WIDTH / 2)));
    const snoozeScale = 0.6 + snoozeProgress * 0.4;

    const deleteProgress = Math.min(1, Math.max(0, (-translateX - (LEFT_SWIPE_ACTIONS_WIDTH / 2)) / (LEFT_SWIPE_ACTIONS_WIDTH / 2)));
    const deleteScale = 0.6 + deleteProgress * 0.4;

    return (
      <div className="absolute inset-0 bg-secondary flex items-center justify-between">
        {/* Right-swipe actions (revealed on left) */}
        <div className="pl-6 flex items-center space-x-4">
          <button
            onClick={handleMarkReadAction}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-blue-500"
            aria-label={thread.isRead ? "Mark as Unread" : "Mark as Read"}
            style={{ transform: `scale(${rightIconScale})`, opacity: rightSwipeProgress }}
          >
            <i className={`fa-solid ${thread.isRead ? 'fa-envelope' : 'fa-envelope-open'} text-2xl`}></i>
          </button>
          <button
            onClick={handleArchiveAction}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-green-500"
            aria-label="Archive"
            style={{ transform: `scale(${rightIconScale})`, opacity: rightSwipeProgress }}
          >
            <i className="fa-solid fa-archive text-2xl"></i>
          </button>
        </div>

        {/* Left-swipe actions (revealed on the right) */}
        <div className="pr-6 flex items-center space-x-4">
          <button
            onClick={handleDeleteAction}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-red-500"
            aria-label="Delete"
            style={{ transform: `scale(${deleteScale})`, opacity: deleteProgress }}
          >
            <i className="fa-solid fa-trash text-2xl"></i>
          </button>
          <button
            onClick={handleSnoozeAction}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-orange-500"
            aria-label="Snooze"
            style={{ transform: `scale(${snoozeScale})`, opacity: snoozeProgress }}
          >
            <i className="fa-regular fa-clock text-2xl"></i>
          </button>
        </div>
      </div>
    );
  };

  const ClassicBackgroundActions = () => (
      <div className="absolute inset-0 flex items-center justify-between text-white text-xl overflow-hidden">
        <div style={{ width: Math.max(0, translateX), backgroundColor: 'hsl(var(--destructive))' }} className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 h-full">
            <i className="fa-solid fa-trash transition-opacity" style={{ opacity: Math.min(1, translateX / 60) }}></i>
        </div>
        <div style={{ width: Math.max(0, -translateX), backgroundColor: 'hsl(160 70% 40%)' }} className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 h-full">
            <i className="fa-solid fa-archive transition-opacity" style={{ opacity: Math.min(1, -translateX / 60) }}></i>
        </div>
      </div>
    );
  
  const ItemContent = (
    <div
      ref={itemRef}
      style={{ transform: `translateX(${translateX}px)`}}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onClick={handleClick}
      className={cn(
          'relative group flex items-start p-3 border-b border-border cursor-pointer transition-transform duration-300 ease-out bg-background',
          isHighlighted ? 'bg-secondary' : '',
          isAnimating && '!duration-300'
      )}
    >
      <div className={cn("flex-shrink-0 flex items-center justify-center w-12 h-10 mr-2")}>
          {isInBulkMode ? (
               <div className={cn('rounded-full border-2 flex items-center justify-center w-6 h-6', isHighlighted ? 'bg-primary border-primary' : 'border-muted')}>
                  {isHighlighted && <i className={cn("fa-solid fa-check text-white text-xs")}></i>}
               </div>
          ) : (
              <>
                  {!thread.isRead && <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>}
                  <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full" />
              </>
          )}
      </div>
      
      <div className={`flex-1 min-w-0`}>
        <div className="flex justify-between items-baseline">
          <p className="text-base truncate font-bold text-foreground">
            {sender.name}
          </p>
          <p className="text-sm text-muted-foreground whitespace-nowrap ml-2">{formatDate(thread.timestamp)}</p>
        </div>

        <div className="flex justify-between items-start">
          <div className="min-w-0">
              <p className="text-sm truncate font-bold text-foreground">
                  {thread.subject}
              </p>
              <p className="text-sm text-muted-foreground truncate pr-4 mt-0.5 font-normal">
                  {thread.messages[thread.messages.length - 1].body.replace(/<[^>]*>/g, '').substring(0, 80)}
              </p>
          </div>
           <button 
              onClick={(e) => { e.stopPropagation(); onToggleStar(thread.id); }} 
              className="h-7 w-7 -mr-1 flex items-center justify-center rounded-full flex-shrink-0 text-muted-foreground hover:bg-accent" 
              title={thread.isStarred ? 'Unstar' : 'Star'}
          >
              <i className={cn('fa-star text-xl', thread.isStarred ? 'fa-solid text-yellow-500' : 'fa-regular')}></i>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden bg-background">
      {uiTheme === 'modern' ? <ModernBackgroundActions /> : <ClassicBackgroundActions />}
      {ItemContent}
    </div>
  );
};

export default EmailListItemMobile;