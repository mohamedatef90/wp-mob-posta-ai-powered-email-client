import React from 'react';
import type { Thread } from '../types';
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from './ui/ContextMenu';

interface KebabMenuProps {
  x: number;
  y: number;
  thread: Thread | null;
  onClose: () => void;
  onMarkAsRead: (threadId: string, isRead: boolean) => void;
  onRemindMe: (threadId: string, anchorEl: HTMLElement) => void;
  onMoveToJunk: (threadId: string) => void;
  onMute: (threadId: string) => void;
  onDelete: (threadId: string) => void;
  onBlockSender: (threadId: string) => void;
  onArchive: (threadId: string) => void;
  onComposeInteraction: (thread: Thread, type: 'reply' | 'reply-all' | 'forward') => void;
}

const KebabMenu: React.FC<KebabMenuProps> = ({
  x, y, thread, onClose, onMarkAsRead, onRemindMe, onMoveToJunk, onMute, onDelete, onBlockSender, onArchive, onComposeInteraction
}) => {
  const fakeAnchorRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const fakeAnchor = document.createElement('div');
    fakeAnchor.style.position = 'fixed';
    fakeAnchor.style.top = `${y}px`;
    fakeAnchor.style.left = `${x}px`;
    fakeAnchor.style.width = '1px';
    fakeAnchor.style.height = '1px';
    document.body.appendChild(fakeAnchor);
    fakeAnchorRef.current = fakeAnchor;

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
  };
  
  const handleRemindMeAction = () => {
    if (fakeAnchorRef.current) {
        onRemindMe(thread.id, fakeAnchorRef.current);
    }
    onClose();
  }

  const handleCompose = (type: 'reply' | 'reply-all' | 'forward') => {
    if(thread) {
        onComposeInteraction(thread, type);
    }
    onClose();
  }

  return (
    <ContextMenu x={x} y={y} onClose={onClose}>
      <ContextMenuItem onClick={() => console.log('Open')}>Open</ContextMenuItem>
      <ContextMenuItem onClick={() => console.log('Send Again')}>Send Again</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => handleCompose('reply')}>Reply</ContextMenuItem>
      <ContextMenuItem onClick={() => handleCompose('reply-all')}>Reply All</ContextMenuItem>
      <ContextMenuItem onClick={() => handleCompose('forward')}>Forward</ContextMenuItem>
      <ContextMenuItem onClick={() => console.log('Forward as Attachment')}>Forward as Attachment</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleRemindMeAction}>Remind Me</ContextMenuItem>
      {thread.isRead ? (
          <ContextMenuItem onClick={() => handleMarkReadAction(false)}>Mark as Unread</ContextMenuItem>
      ) : (
          <ContextMenuItem onClick={() => handleMarkReadAction(true)}>Mark as Read</ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => handleAction(onMoveToJunk)}>Move to Junk</ContextMenuItem>
      <ContextMenuItem onClick={() => handleAction(onMute)}>Mute</ContextMenuItem>
      <ContextMenuItem destructive onClick={() => handleAction(onDelete)}>Delete</ContextMenuItem>
      <ContextMenuItem onClick={() => handleAction(onBlockSender)}>Block Sender</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => console.log('Categorize Sender')}>Categorize Sender</ContextMenuItem>
      <ContextMenuItem onClick={() => console.log('Clear Time-Sensitive')}>Clear Time-Sensitive</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => handleAction(onArchive)}>Archive</ContextMenuItem>
      <ContextMenuItem onClick={() => console.log('Move to Adobe')}>Move to "Adobe"</ContextMenuItem>
      <ContextMenuItem disabled>Move to</ContextMenuItem>
      <ContextMenuItem disabled>Copy to</ContextMenuItem>
      <ContextMenuItem disabled>Apply Rules</ContextMenuItem>
    </ContextMenu>
  );
};

export default KebabMenu;
