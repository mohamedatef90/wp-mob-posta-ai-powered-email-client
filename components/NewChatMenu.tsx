import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { you } from '../constants';

interface NewChatMenuProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  anchorEl: HTMLElement | null;
  onSelectUser: (user: User) => void;
  onCreateGroup: (users: User[]) => void;
}

const NewChatMenu: React.FC<NewChatMenuProps> = ({ isOpen, onClose, users, anchorEl, onSelectUser, onCreateGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'group' | 'info'>('list');
  const [infoUser, setInfoUser] = useState<User | null>(null);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<User[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<'microhard' | 'liverpool'>('microhard');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
        // Reset state on open
        setViewMode('list');
        setSearchTerm('');
        setInfoUser(null);
        setSelectedGroupUsers([]);
        document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);


  if (!isOpen || !anchorEl) return null;

  const domainUsers = users.filter(user => 
    user.email !== you.email && 
    (selectedDomain === 'microhard' 
      ? user.email.endsWith('@microhard.com') 
      : user.email.endsWith('@liverpool.uk.fc'))
  );

  const filteredUsers = domainUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const allOtherUsers = domainUsers;


  const handleToggleUserInGroup = (user: User) => {
      setSelectedGroupUsers(prev => 
          prev.find(u => u.email === user.email)
            ? prev.filter(u => u.email !== user.email)
            : [...prev, user]
      );
  };
  
  const handleCreateGroupClick = () => {
    onCreateGroup(selectedGroupUsers);
    onClose();
  }

  const anchorRect = anchorEl.getBoundingClientRect();
  const position = {
      top: anchorRect.bottom + 8,
      left: Math.max(8, anchorRect.right - 400),
  };
  
  const renderContent = () => {
      if (viewMode === 'info' && infoUser) {
          return (
                <div className="p-3 animate-fadeIn h-full flex flex-col">
                    <Button variant="ghost" onClick={() => setViewMode('list')} className="mb-3 space-x-2 self-start hover:bg-accent">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Back</span>
                    </Button>
                    <div className="flex flex-col items-center text-center">
                        <img src={infoUser.avatarUrl} alt={infoUser.name} className="w-20 h-20 rounded-full mb-3" />
                        <p className="font-bold text-lg">{infoUser.name}</p>
                        <p className="text-sm text-foreground/80">{infoUser.email}</p>
                        <div className="mt-4 text-left w-full space-y-2 text-sm p-3 bg-secondary rounded-lg">
                            <p><i className="fa-solid fa-briefcase w-5 text-center mr-2 text-foreground/60"></i>{infoUser.department || 'No Department'}</p>
                            <p><i className="fa-solid fa-phone w-5 text-center mr-2 text-foreground/60"></i>{infoUser.phone || 'No Phone'}</p>
                        </div>
                    </div>
                </div>
          );
      }

      if (viewMode === 'group') {
          return (
              <div className="flex flex-col h-full animate-fadeIn">
                   <div className="p-3 border-b border-border flex items-center space-x-3">
                       <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" onClick={() => setViewMode('list')}><i className="fa-solid fa-arrow-left"></i></Button>
                       <div>
                           <h3 className="font-semibold">New Group</h3>
                           <p className="text-xs text-foreground/80">{selectedGroupUsers.length} selected</p>
                       </div>
                   </div>
                   <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                        {allOtherUsers.map(user => (
                            <label key={user.email} className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={!!selectedGroupUsers.find(u => u.email === user.email)}
                                    onChange={() => handleToggleUserInGroup(user)}
                                    className="mt-3 h-4 w-4 rounded border-input bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                                />
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{user.name}</p>
                                    <p className="text-xs text-foreground/80 truncate">{user.email}</p>
                                </div>
                            </label>
                        ))}
                   </div>
                   <div className="p-3 border-t border-border flex justify-end space-x-2">
                       <Button variant="ghost" className="hover:bg-accent" onClick={() => setViewMode('list')}>Cancel</Button>
                       <Button onClick={handleCreateGroupClick} disabled={selectedGroupUsers.length === 0}>Confirm</Button>
                   </div>
              </div>
          );
      }
      
      return (
          <div className="flex flex-col h-full">
              <div className="p-3 flex items-center space-x-3 border-b border-border">
                  <img src={you.avatarUrl} alt={you.name} className="w-10 h-10 rounded-full" />
                  <div>
                      <p className="font-semibold">{you.name}</p>
                      <p className="text-sm text-foreground/80">{you.email}</p>
                  </div>
              </div>
              <div className="p-2 border-b border-border">
                <div className="flex items-center bg-secondary rounded-lg p-1">
                    <button onClick={() => setSelectedDomain('microhard')} className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${selectedDomain === 'microhard' ? 'bg-card' : 'hover:bg-card/50'}`}>Microhard</button>
                    <button onClick={() => setSelectedDomain('liverpool')} className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${selectedDomain === 'liverpool' ? 'bg-card' : 'hover:bg-card/50'}`}>Liverpool FC</button>
                </div>
             </div>
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60"></i>
                  <Input
                    type="text"
                    placeholder="Search members..."
                    className="w-full bg-secondary border-none rounded-lg pl-9 pr-4 py-2 text-sm placeholder:text-foreground/60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="p-2 border-b border-border">
                 <Button variant="ghost" onClick={() => setViewMode('group')} className="w-full justify-start space-x-3 hover:bg-accent text-foreground">
                    <i className="fa-solid fa-users w-5 h-5 text-foreground/80"></i>
                    <span>Create Group</span>
                 </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                <h3 className="px-2 pb-1 text-xs font-semibold text-foreground/80 uppercase">Members</h3>
                {filteredUsers.map(user => (
                    <div key={user.email} onClick={() => onSelectUser(user)} className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-foreground/80 truncate">{user.email}</p>
                      </div>
                       <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 flex-shrink-0 hover:bg-accent"
                            onClick={(e) => { e.stopPropagation(); setInfoUser(user); setViewMode('info'); }}
                        >
                            <i className="fa-solid fa-circle-info w-4 h-4 text-foreground/60"></i>
                        </Button>
                    </div>
                ))}
              </div>
          </div>
      );
  }


  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        ref={menuRef}
        style={position}
        className="fixed z-50 w-[400px] h-auto max-h-[90dvh] backdrop-blur-xl rounded-2xl shadow-xl bg-card border border-border flex flex-col animate-scaleIn text-foreground"
        role="dialog"
      >
        {renderContent()}
      </div>
    </>
  );
};

export default NewChatMenu;