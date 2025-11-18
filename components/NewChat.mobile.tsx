import React, { useState } from 'react';
import type { User } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { you } from '../constants';

interface NewChatMobileProps {
  onBack: () => void;
  users: User[];
  onSelectUser: (user: User) => void;
  onCreateGroup: (users: User[]) => void;
}

const NewChatMobile: React.FC<NewChatMobileProps> = ({ onBack, users, onSelectUser, onCreateGroup }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'group'>('list');
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<User[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<'microhard' | 'liverpool'>('microhard');

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
            {domainUsers.map(user => (
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
          <div className="flex items-center bg-secondary rounded-lg p-1">
              <button onClick={() => setSelectedDomain('microhard')} className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${selectedDomain === 'microhard' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}>Microhard</button>
              <button onClick={() => setSelectedDomain('liverpool')} className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${selectedDomain === 'liverpool' ? 'bg-card shadow-sm' : 'hover:bg-card/50'}`}>Liverpool FC</button>
          </div>
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
            autoFocus
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-2 border-b border-border">
           <button onClick={() => setViewMode('group')} className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <i className="fa-solid fa-users text-muted-foreground"></i>
                </div>
                <p className="text-sm font-semibold">Create Group</p>
           </button>
        </div>
        <div className="p-2">
            <h3 className="px-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">Contacts</h3>
            {filteredUsers.map(user => (
                <div key={user.email} onClick={() => onSelectUser(user)} className="flex items-start space-x-3 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  return viewMode === 'list' ? <ListView /> : <GroupView />;
};

export default NewChatMobile;