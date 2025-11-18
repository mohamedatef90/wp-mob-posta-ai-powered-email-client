import React from 'react';
import type { Thread } from '../types';
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from './ui/ContextMenu';

interface EmailContextMenuProps {
  x: number;
  y: number;
  thread: Thread | null;
  onClose: () => void;
  onArchive: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onMarkAsRead: (threadId: string, isRead: boolean) => void;
  onToggleStar: (threadId: string) => void;
  onSnooze: (threadId: string, anchorEl: HTMLElement) => void;
  onMoveToJunk: (threadId: string) => void;
  onMute: (threadId: string) => void;
  onBlockSender: (threadId: string) => void;
  onToggleSelection: (threadId: string) => void;
}

const EmailContextMenu: React.FC<EmailContextMenuProps> = ({ 
    x, y, thread, onClose, onArchive, onDelete, onMarkAsRead, onToggleStar, onSnooze,
    onMoveToJunk, onMute, onBlockSender, onToggleSelection
}) => {
    const fakeAnchorRef = React.useRef<HTMLDivElement | null>(null);

    // Create and position a fake anchor element for the SnoozePopover
    React.useEffect(() => {
        const fakeAnchor = document.createElement('div');
        fakeAnchor.style.position = 'fixed';
        fakeAnchor.style.top = `${y}px`;
        fakeAnchor.style.left = `${x}px`;
        fakeAnchor.style.width = '1px';
        fakeAnchor.style.height = '1px';
        document.body.appendChild(fakeAnchor);
        fakeAnchorRef.current = fakeAnchor;

        // Cleanup fake anchor when component unmounts
        return () => {
            if (fakeAnchorRef.current && document.body.contains(fakeAnchorRef.current)) {
                document.body.removeChild(fakeAnchorRef.current);
            }
        };
    }, [x, y]);

    if (!thread) return null;
    
    const handleAction = (action: (threadId: string) => void) => {
        action(thread.id);
        onClose();
    };
    
    const handleMarkReadAction = (isRead: boolean) => {
        onMarkAsRead(thread.id, isRead);
        onClose();
    }
    
    const handleSnoozeAction = () => {
        if (fakeAnchorRef.current) {
            onSnooze(thread.id, fakeAnchorRef.current);
        }
        onClose();
    }
    
    return (
        <ContextMenu x={x} y={y} onClose={onClose}>
            <ContextMenuItem icon="fa-solid fa-check-to-slot" onClick={() => handleAction(onToggleSelection)}>
                Select
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem icon="fa-solid fa-reply" onClick={onClose} disabled>Reply</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-reply-all" onClick={onClose} disabled>Reply All</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-reply transform -scale-x-100" onClick={onClose} disabled>Forward</ContextMenuItem>
            <ContextMenuSeparator />
            {thread.isRead ? (
                <ContextMenuItem icon="fa-regular fa-envelope" onClick={() => handleMarkReadAction(false)}>Mark as Unread</ContextMenuItem>
            ) : (
                <ContextMenuItem icon="fa-regular fa-envelope-open" onClick={() => handleMarkReadAction(true)}>Mark as Read</ContextMenuItem>
            )}
            <ContextMenuItem icon="fa-regular fa-clock" onClick={handleSnoozeAction}>Snooze</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-box-archive" onClick={() => handleAction(onMoveToJunk)}>Move to Junk</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-volume-xmark" onClick={() => handleAction(onMute)}>Mute</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-ban" onClick={() => handleAction(onBlockSender)}>Block Sender</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-trash" destructive onClick={() => handleAction(onDelete)}>Delete</ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMenuItem icon={thread.isStarred ? 'fa-solid fa-flag text-yellow-400' : 'fa-regular fa-flag'} onClick={() => handleAction(onToggleStar)}>
                {thread.isStarred ? 'Remove Flag' : 'Flag'}
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            <ContextMenuItem icon="fa-solid fa-archive" onClick={() => handleAction(onArchive)}>Archive</ContextMenuItem>
            <ContextMenuItem icon="fa-solid fa-folder-plus" onClick={onClose} disabled>Move to...</ContextMenuItem>
        </ContextMenu>
    );
};

export default EmailContextMenu;