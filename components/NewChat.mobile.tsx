
import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { you } from '../constants';

interface NewChatMobileProps {
  onBack: () => void;
  users: User[];
  onSelectUser: (user: User, inviteText?: string) => void;
  onCreateGroup: (users: User[]) => void;
}

const EXTERNAL_CONTACTS: User[] = [
    { name: 'Sarah Connor', email: 'sarah.connor@gmail.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sarah', department: 'External' },
    { name: 'John Wick', email: 'j.wick@continental.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=John', department: 'External' },
    { name: 'Ellen Ripley', email: 'ripley@weyland.corp', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Ellen', department: 'External' },
    { name: 'Marty McFly', email: 'marty@future.net', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Marty', department: 'External' },
    { name: 'Tony Stark', email: 'tony@stark.io', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Tony', department: 'External' },
];

const NewChatMobile: React.FC<NewChatMobileProps> = ({ onBack, users, onSelectUser, onCreateGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'group'>('list');
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<User[]>([]);
  
  const [searchScope, setSearchScope] = useState<'domain' | 'contact'>('domain');
  const [selectedDomain, setSelectedDomain] = useState<'microhard' | 'liverpool'>('microhard');
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  // Filter users based on scope
  let displayedUsers: User[] = [];
  
  if (searchScope === 'domain') {
      displayedUsers = users.filter(user => 
        user.email !== you.email && 
        (selectedDomain === 'microhard' 
          ? user.email.endsWith('@microhard.com') 
          : user.email.endsWith('@liverpool.uk.fc'))
      );
  } else {
      displayedUsers = EXTERNAL_CONTACTS;
  }

  const filteredUsers = displayedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserInGroup = (user: User) => {
    setSelectedGroupUsers(prev => 
      prev.find(u => u.email === user.email)
        ? prev.filter(u => u.email !== user.email)
        : [...prev, user]
    );
  };
  
  const handleCreateGroupClick = () => {
    onCreateGroup(selectedGroupUsers);
  };

  const handleUserClick = (user: User) => {
      if (searchScope === 'contact') {
          onSelectUser(user, "Hey, I'm using Posta to chat. Join me here: https://posta.app/invite/u/alex");
      } else {
          onSelectUser(user);
      }
  };

  const GroupView: React.FC = () => (
    <div className="flex flex-col h-full animate-fadeIn">
       <header className="p-2 flex-shrink-0 border-b border-border flex items-center justify-between">
         <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setViewMode('list')}><i className="fa-solid fa-arrow-left"></i></Button>
            <div className="ml-2">
                <h3 className="font-semibold text-lg">New Group</h3>
                <p className="text-xs text-muted-foreground">{selectedGroupUsers.length} selected</p>
            </div>
          </div>
          <Button onClick={handleCreateGroupClick} disabled={selectedGroupUsers.length < 2}>Create</Button>
       </header>
       <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
            {displayedUsers.map(user => (
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
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </label>
            ))}
       </div>
    </div>
  );

  const ListView: React.FC = () => (
    <div className="flex flex-col h-full">
      <header className="p-2 flex items-center flex-shrink-0 border-b border-border">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <i className="fa-solid fa-arrow-left w-5 h-5 text-muted-foreground"></i>
          </Button>
          <div className="ml-2">
            <h2 className="text-lg font-bold">New Chat</h2>
            <p className="text-xs text-muted-foreground">Select a contact or create a group</p>
          </div>
      </header>
      <div className="p-2 border-b border-border">
          {/* Type Toggle */}
          <div className="flex items-center bg-secondary rounded-lg p-1 mb-2">
              <button onClick={() => setSearchScope('domain')} className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${searchScope === 'domain' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:bg-card/50'}`}>Domain</button>
              <button onClick={() => setSearchScope('contact')} className={`flex-1 rounded-md py-1.5 text-sm font-semibold transition-colors ${searchScope === 'contact' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:bg-card/50'}`}>Contact</button>
          </div>
          
          {/* Domain Dropdown */}
          {searchScope === 'domain' && (
             <div className="relative">
                <button 
                    onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)} 
                    className="w-full flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                    <span>{selectedDomain === 'microhard' ? 'Microhard' : 'Liverpool FC'}</span>
                    <i className={`fa-solid fa-chevron-down w-3 h-3 text-muted-foreground transition-transform duration-200 ${isDomainDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                
                {isDomainDropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDomainDropdownOpen(false)}></div>
                        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden animate-fadeInDown">
                             <button 
                                onClick={() => { setSelectedDomain('microhard'); setIsDomainDropdownOpen(false); }} 
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${selectedDomain === 'microhard' ? 'text-primary font-semibold bg-secondary/50' : ''}`}
                             >
                                Microhard
                             </button>
                             <div className="border-t border-border"></div>
                             <button 
                                onClick={() => { setSelectedDomain('liverpool'); setIsDomainDropdownOpen(false); }} 
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${selectedDomain === 'liverpool' ? 'text-primary font-semibold bg-secondary/50' : ''}`}
                             >
                                Liverpool FC
                             </button>
                        </div>
                    </>
                )}
             </div>
          )}
      </div>
      <div className="p-3 border-b border-border">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"></i>
          <Input
            type="text"
            placeholder="Search name or email..."
            className="w-full bg-secondary border-none rounded-lg pl-9 pr-4 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {searchScope === 'domain' && (
            <div className="p-2 border-b border-border">
            <button onClick={() => setViewMode('group')} className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <i className="fa-solid fa-users text-muted-foreground"></i>
                    </div>
                    <p className="text-sm font-semibold">Create Group</p>
            </button>
            </div>
        )}
        <div className="p-2">
            <h3 className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">
                {searchScope === 'domain' ? 'Contacts' : 'External Contacts'}
            </h3>
            {filteredUsers.map(user => (
                <div key={user.email} onClick={() => handleUserClick(user)} className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  {searchScope === 'contact' && <i className="fa-solid fa-paper-plane text-muted-foreground text-xs self-center"></i>}
                </div>
            ))}
            {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                    No contacts found.
                </div>
            )}
        </div>
      </div>
    </div>
  );

  return viewMode === 'list' ? <ListView /> : <GroupView />;
};

export default NewChatMobile;
