import React, { useRef, useState, useEffect } from 'react';
import type { Thread } from '../types';

interface EmailListItemProps {
  thread: Thread;
  isSelected: boolean;
  isSelectedForBulk: boolean;
  onSelect: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onSnoozeClick: (threadId: string, anchorEl: HTMLElement) => void;
  onOpenKebabMenu: (threadId: string, anchorEl: HTMLElement) => void;
  onContextMenu: (event: React.MouseEvent, threadId: string) => void;
  onArchive: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onMarkAsRead: (threadId: string, isRead: boolean) => void;
  onToggleStar: (threadId: string) => void;
  selectedThreadIds: string[];
}

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const EmailListItem: React.FC<EmailListItemProps> = ({ 
  thread, 
  isSelected, 
  isSelectedForBulk, 
  onSelect, 
  onToggleSelection, 
  onSnoozeClick, 
  onOpenKebabMenu, 
  onContextMenu,
  onArchive,
  onDelete,
  onMarkAsRead,
  onToggleStar,
  selectedThreadIds
}) => {
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
    if (selectedThreadIds.length === 0) {
        longPressTimer.current = window.setTimeout(() => {
            onToggleSelection(thread.id);
            longPressTriggered.current = true;
            longPressTimer.current = null;
        }, 500);
    }
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

    if (!gestureState.current.moved) {
        if(Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            gestureState.current.moved = true;
        }
    }

    if (gestureState.current.direction === 'none') {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          gestureState.current.direction = 'horizontal';
        } else {
          gestureState.current.direction = 'vertical';
        }
      }
    }

    if (gestureState.current.direction === 'horizontal') {
      setTranslateX(deltaX);
    }
  };

  const handleDragEnd = () => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
    }
    
    if (!gestureState.current.isDragging) return;
    
    const wasHorizontal = gestureState.current.direction === 'horizontal';
    
    gestureState.current.isDragging = false;
    itemRef.current?.classList.remove('!duration-0');
    
    if (!wasHorizontal) {
        return;
    }

    const itemWidth = itemRef.current?.offsetWidth || 0;
    const threshold = itemWidth * 0.3; // Make it easier to trigger
    
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
        if (action) {
          // After action is performed, reset position after a delay to allow the item to be removed from the list.
          setTimeout(() => setTranslateX(0), 300);
        }
    }, 300);
  };

  const handleClick = (e: React.MouseEvent) => {
    if(e.detail === 0 || longPressTriggered.current || gestureState.current.moved) return;

    if (selectedThreadIds.length > 0) {
        onToggleSelection(thread.id);
    } else {
        onSelect(thread.id);
    }
  };
  
  // Touch Events
  const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gestureState.current.isDragging) return;
     if (longPressTimer.current || gestureState.current.direction === 'none') {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
    if (gestureState.current.direction === 'horizontal') {
        e.preventDefault();
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  
  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
      handleDragStart(e.clientX, e.clientY);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
  const handleMouseUp = () => {
      handleDragEnd();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (date > startOfDay) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - now.getDay());

    if (date > startOfWeek) {
        return dayName;
    }

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  const sender = thread.messages[thread.messages.length - 1].sender;
  const isHighlighted = isSelected || isSelectedForBulk;
  const isInBulkMode = selectedThreadIds.length > 0;

  const BackgroundActions = () => {
    const actionTriggerDistance = 60; // Make icon appear sooner

    // Left swipe (Archive)
    const leftSwipeProgress = Math.min(1, Math.max(0, -translateX) / actionTriggerDistance);
    const leftIconScale = 0.8 + leftSwipeProgress * 0.4; // More pronounced scale effect

    // Right swipe (Delete)
    const rightSwipeProgress = Math.min(1, Math.max(0, translateX) / actionTriggerDistance);
    const rightIconScale = 0.8 + rightSwipeProgress * 0.4;

    return (
      <div className="absolute inset-0 flex items-center justify-between text-white text-xl overflow-hidden rounded-lg">
        {/* Left Swipe Action (Archive) */}
        <div 
            style={{ 
                width: Math.max(0, -translateX), 
                backgroundColor: 'hsl(160 70% 40%)' // A nice green
            }} 
            className="absolute inset-y-0 right-0 flex items-center justify-end pr-6 h-full"
        >
            <i 
                className="fa-solid fa-archive transition-all ease-out"
                style={{ 
                    opacity: leftSwipeProgress,
                    transform: `scale(${leftIconScale})`
                }}
            ></i>
        </div>
        
        {/* Right Swipe Action (Delete) */}
        <div 
            style={{ 
                width: Math.max(0, translateX), 
                backgroundColor: 'hsl(var(--destructive))' 
            }} 
            className="absolute inset-y-0 left-0 flex items-center justify-start pl-6 h-full"
        >
            <i 
                className="fa-solid fa-trash transition-all ease-out"
                style={{ 
                    opacity: rightSwipeProgress,
                    transform: `scale(${rightIconScale})`
                }}
            ></i>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-card">
      <BackgroundActions />
      <div
        ref={itemRef}
        style={{ transform: `translateX(${translateX}px)`}}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onClick={handleClick}
        onContextMenu={(e) => onContextMenu(e, thread.id)}
        className={cn(
            'relative group flex items-start p-3 border-b border-border cursor-pointer transition-transform duration-300 ease-out bg-card',
            isHighlighted ? 'bg-secondary' : '',
            isAnimating && '!duration-300'
        )}
      >
        <div className="w-10 h-10 mr-3 flex-shrink-0 flex items-center justify-center">
            {isInBulkMode ? (
                 <input 
                    type="checkbox"
                    checked={isSelectedForBulk}
                    onChange={() => onToggleSelection(thread.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 rounded border-input bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                    aria-label={`Select email from ${sender.name}`}
                />
            ) : (
                <>
                    {/* Desktop checkbox */}
                    <div className="w-6 h-10 flex-shrink-0 items-center justify-center mr-2 flex">
                        <input 
                            type="checkbox"
                            checked={isSelectedForBulk}
                            onChange={() => onToggleSelection(thread.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-5 w-5 rounded border-input bg-transparent text-primary focus:ring-primary focus:ring-offset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Select email from ${sender.name}`}
                            />
                    </div>
                    {/* Desktop Avatar */}
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full block" />
                    </div>
                </>
            )}
        </div>
        
        <div className={`flex-1 min-w-0`}>
          <div className="flex justify-between items-baseline">
            <p className={`text-sm truncate ${!thread.isRead && !isSelected ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium'}`}>
              {sender.name}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-muted-foreground whitespace-nowrap group-hover:hidden">{formatDate(thread.timestamp)}</p>
              {/* Show filled star when not hovering */}
              {thread.isStarred && (
                  <div className="flex group-hover:hidden items-center text-yellow-400" title="Starred">
                      <i className="fa-solid fa-star w-4 h-4"></i>
                  </div>
              )}
              {/* Show all actions on hover */}
              <div className="hidden group-hover:flex items-center text-muted-foreground">
                  <button onClick={(e) => { e.stopPropagation(); onToggleStar(thread.id); }} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-background" title={thread.isStarred ? 'Unstar' : 'Star'}>
                      <i className={cn('w-4 h-4', thread.isStarred ? 'fa-solid fa-star text-yellow-400' : 'fa-regular fa-star')}></i>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onSnoozeClick(thread.id, e.currentTarget); }} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-background" title="Snooze"><i className="fa-regular fa-clock w-4 h-4"></i></button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenKebabMenu(thread.id, e.currentTarget); }} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-background" title="More options"><i className="fa-solid fa-ellipsis-v w-4 h-4"></i></button>
              </div>
            </div>
          </div>
          <p className={`text-sm truncate ${!thread.isRead && !isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            {thread.subject}
          </p>
          <p className="text-sm text-muted-foreground truncate pr-4 mt-1">
            {thread.messages[thread.messages.length - 1].body.replace(/<[^>]*>/g, '').substring(0, 80)}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailListItem;