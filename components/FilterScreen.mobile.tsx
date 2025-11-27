

import React, { useState, useMemo, useEffect } from 'react';
import type { SearchFilters } from '../App';
import { ChevronRightIcon, ArrowLeftIcon, SearchIcon, XMarkIcon } from './Icons';
import type { User } from '../types';

type PartialSearchFilters = Partial<SearchFilters>;

interface FilterScreenMobileProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: SearchFilters;
  onApplyFilters: (filters: PartialSearchFilters) => void;
  allUsers: User[];
}

const ALL_LABELS = ['urgent', 'q3-strategy', 'team-event', 'social', 'action-required', 'confidential', 'security'];

const DEFAULT_FILTERS: PartialSearchFilters = {
    sender: '',
    recipient: '',
    dateRange: 'any',
    status: 'any',
    label: '',
    has: 'any',
    attachmentType: 'any',
};

// --- Reusable Components ---

const FilterHeader: React.FC<{ 
    title: string; 
    onBack?: () => void; 
    onDone?: () => void; 
    onCancel?: () => void; 
    onClear?: () => void;
    showClear?: boolean;
}> = ({ title, onBack, onDone, onCancel, onClear, showClear }) => (
    <header className="flex items-center justify-between p-4 shrink-0 bg-transparent">
        {onBack ? (
            <button onClick={onBack} className="text-base font-medium text-primary flex items-center w-24 text-left">
                <ArrowLeftIcon className="w-5 h-5 mr-1"/> Back
            </button>
        ) : showClear && onClear ? (
             <button onClick={onClear} className="text-base font-medium text-primary w-24 text-left">Clear</button>
        ) : onCancel ? (
             <button onClick={onCancel} className="text-base font-medium text-primary w-24 text-left">Cancel</button>
        ) : <div className="w-24"></div>}
        <h2 className="text-lg font-bold text-foreground text-center flex-1 truncate">{title}</h2>
        {onDone ? (
             <button onClick={onDone} className="text-base font-bold text-primary w-24 text-right">Done</button>
        ) : <div className="w-24"></div>}
    </header>
);


const FilterItem: React.FC<{ title: string; hint: string; value: string; onClick: () => void; }> = ({ title, hint, value, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-4 active:bg-secondary">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mt-1">{hint}</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground max-w-[120px] truncate">{value}</span>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
            </div>
        </div>
    </button>
);

const RadioItem: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-4 active:bg-secondary flex justify-between items-center">
        <span className="font-medium text-foreground">{label}</span>
        {isSelected && <i className="fa-solid fa-check text-primary"></i>}
    </button>
);

const ListItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden ${className}`}>
        {React.Children.map(children, (child, index) => (
            <>
                {child}
                {index < React.Children.count(children) - 1 && <div className="border-t border-border mx-4" />}
            </>
        ))}
    </div>
);


// --- Sub-Screens ---
type SubScreenProps = {
    onBack: () => void;
    onSelect: (value: any) => void;
    currentValue: any;
}

const IsScreen: React.FC<SubScreenProps> = ({ onBack, onSelect, currentValue }) => {
    const options: SearchFilters['status'][] = ['any', 'unread', 'read', 'sent', 'starred', 'snoozed'];
    const labels: Record<SearchFilters['status'], string> = { any: 'Any', unread: 'Is unread', read: 'Is read', sent: 'Is sent', starred: 'Is starred', snoozed: 'Is snoozed' };
    return (
        <div className="h-full flex flex-col">
            <FilterHeader title="Is" onBack={onBack} />
            <main className="flex-1 overflow-y-auto p-4">
                <ListItem>
                    {options.map(opt => <RadioItem key={opt} label={labels[opt]} isSelected={currentValue === opt} onClick={() => onSelect(opt)} />)}
                </ListItem>
            </main>
        </div>
    )
};

const UserSelectScreen: React.FC<SubScreenProps & { allUsers: User[], title: string }> = ({ onBack, onSelect, currentValue, allUsers, title }) => {
    const [query, setQuery] = useState('');
    const filteredUsers = useMemo(() => {
        if (!query) return allUsers;
        const q = query.toLowerCase();
        return allUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [query, allUsers]);
    return (
        <div className="h-full flex flex-col">
            <FilterHeader title={title} onBack={onBack} />
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" placeholder="Search contacts..." value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-secondary rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
            </div>
            <main className="flex-1 overflow-y-auto p-4">
                <ListItem>
                     <RadioItem label="Anyone" isSelected={!currentValue} onClick={() => onSelect('')} />
                     {filteredUsers.map(user => <RadioItem key={user.email} label={user.name} isSelected={currentValue === user.email} onClick={() => onSelect(user.email)} />)}
                </ListItem>
            </main>
        </div>
    )
};

const AttachmentTypeScreen: React.FC<SubScreenProps> = ({ onBack, onSelect, currentValue }) => {
    const options: SearchFilters['attachmentType'][] = ['any', 'document', 'spreadsheet', 'presentation', 'pdf', 'image', 'video'];
    const labels: Record<string, string> = { 
        any: 'Any', 
        document: 'Documents', 
        spreadsheet: 'Spreadsheets', 
        presentation: 'Presentations', 
        pdf: 'PDFs', 
        image: 'Images', 
        video: 'Videos' 
    };
    return (
        <div className="h-full flex flex-col">
            <FilterHeader title="Attachment" onBack={onBack} />
            <main className="flex-1 overflow-y-auto p-4">
                <ListItem>
                    {options.map(opt => <RadioItem key={opt} label={labels[opt]} isSelected={currentValue === opt} onClick={() => onSelect(opt)} />)}
                </ListItem>
            </main>
        </div>
    )
};

const LabelScreen: React.FC<SubScreenProps> = ({ onBack, onSelect, currentValue }) => (
    <div className="h-full flex flex-col">
        <FilterHeader title="Label" onBack={onBack} />
        <main className="flex-1 overflow-y-auto p-4">
            <ListItem>
                <RadioItem label="Any" isSelected={!currentValue} onClick={() => onSelect('')} />
                {ALL_LABELS.map(label => <RadioItem key={label} label={label} isSelected={currentValue === label} onClick={() => onSelect(label)} />)}
            </ListItem>
        </main>
    </div>
);

const DateScreen: React.FC<SubScreenProps> = ({ onBack, onSelect, currentValue }) => {
    const isCustom = typeof currentValue === 'object' && currentValue !== null;
    const [startDate, setStartDate] = useState(isCustom ? currentValue.start : '');
    const [endDate, setEndDate] = useState(isCustom ? currentValue.end : '');

    const options = ['any', '7d', '30d', 'custom'];
    const labels: Record<string, string> = { any: 'Any time', '7d': 'Last 7 days', '30d': 'Last 30 days', 'custom': 'Custom range' };

    useEffect(() => {
        if (startDate || endDate) {
             onSelect({ start: startDate, end: endDate });
        }
    }, [startDate, endDate]);

    const handleOptionSelect = (opt: string) => {
        if (opt === 'custom') {
            onSelect({ start: startDate, end: endDate }); 
        } else {
            onSelect(opt);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <FilterHeader title="Date" onBack={onBack} />
            <main className="flex-1 overflow-y-auto p-4">
                <ListItem>
                    {options.map(opt => (
                        <RadioItem 
                            key={opt} 
                            label={labels[opt]} 
                            isSelected={opt === 'custom' ? isCustom : currentValue === opt} 
                            onClick={() => handleOptionSelect(opt)} 
                        />
                    ))}
                </ListItem>
                
                {(isCustom) && (
                    <div className="mt-4 bg-white dark:bg-card rounded-xl shadow-sm border border-border p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">From</label>
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-secondary p-3 rounded-lg outline-none text-foreground focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">To</label>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-secondary p-3 rounded-lg outline-none text-foreground focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
};

const HasScreen: React.FC<SubScreenProps> = ({ onBack, onSelect, currentValue }) => {
    const options: SearchFilters['has'][] = ['any', 'attachment', 'mention', 'comment'];
    const labels = { any: 'Any', attachment: 'Attachment', mention: 'Mention', comment: 'Comment' };
    return (
        <div className="h-full flex flex-col">
            <FilterHeader title="Has" onBack={onBack} />
            <main className="flex-1 overflow-y-auto p-4">
                <ListItem>
                    {options.map(opt => <RadioItem key={opt} label={labels[opt]} isSelected={currentValue === opt} onClick={() => onSelect(opt)} />)}
                </ListItem>
            </main>
        </div>
    )
};


// --- Main Filter Screen ---
const FilterScreenMobile: React.FC<FilterScreenMobileProps> = ({ isOpen, onClose, currentFilters, onApplyFilters, allUsers }) => {
  const [view, setView] = useState('main');
  const [tempFilters, setTempFilters] = useState<PartialSearchFilters>(currentFilters);
  const [isRendering, setIsRendering] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendering(true);
    } else {
      const timer = setTimeout(() => setIsRendering(false), 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
        setTempFilters(currentFilters);
        setView('main');
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };
  
  const handleSelect = (key: keyof PartialSearchFilters) => (value: any) => {
      setTempFilters(prev => ({ ...prev, [key]: value }));
      if (key !== 'dateRange' || typeof value !== 'object') {
          setView('main');
      }
  };

  const handleClear = () => {
      setTempFilters({ ...tempFilters, ...DEFAULT_FILTERS });
  };

  const hasActiveFilters = useMemo(() => {
      return tempFilters.sender !== DEFAULT_FILTERS.sender ||
             tempFilters.recipient !== DEFAULT_FILTERS.recipient ||
             tempFilters.dateRange !== DEFAULT_FILTERS.dateRange ||
             tempFilters.status !== DEFAULT_FILTERS.status ||
             tempFilters.label !== DEFAULT_FILTERS.label ||
             tempFilters.has !== DEFAULT_FILTERS.has ||
             tempFilters.attachmentType !== DEFAULT_FILTERS.attachmentType;
  }, [tempFilters]);

  const renderView = () => {
      switch (view) {
          case 'is': return <IsScreen onBack={() => setView('main')} onSelect={handleSelect('status')} currentValue={tempFilters.status} />;
          case 'from': return <UserSelectScreen title="From" onBack={() => setView('main')} onSelect={handleSelect('sender')} currentValue={tempFilters.sender} allUsers={allUsers} />;
          case 'to': return <UserSelectScreen title="To" onBack={() => setView('main')} onSelect={handleSelect('recipient')} currentValue={tempFilters.recipient} allUsers={allUsers} />;
          case 'attachmentType': return <AttachmentTypeScreen onBack={() => setView('main')} onSelect={handleSelect('attachmentType')} currentValue={tempFilters.attachmentType} />;
          case 'label': return <LabelScreen onBack={() => setView('main')} onSelect={handleSelect('label')} currentValue={tempFilters.label} />;
          case 'date': return <DateScreen onBack={() => setView('main')} onSelect={handleSelect('dateRange')} currentValue={tempFilters.dateRange} />;
          case 'has': return <HasScreen onBack={() => setView('main')} onSelect={handleSelect('has')} currentValue={tempFilters.has} />;
          default:
              const isLabels: Record<string, string> = { any: 'Any', unread: 'Unread', read: 'Read', sent: 'Sent', starred: 'Starred', snoozed: 'Snoozed' };
              const dateLabels: Record<string, string> = { any: 'Any time', '7d': 'Last 7 days', '30d': 'Last 30 days' };
              const hasLabels: Record<string, string> = { any: 'Any', attachment: 'Attachment', mention: 'Mention', comment: 'Comment' };
              
              const fromLabel = tempFilters.sender ? allUsers.find(u => u.email === tempFilters.sender)?.name || tempFilters.sender : 'Anyone';
              const toLabel = tempFilters.recipient ? allUsers.find(u => u.email === tempFilters.recipient)?.name || tempFilters.recipient : 'Anyone';
              const attachmentLabel = tempFilters.attachmentType && tempFilters.attachmentType !== 'any' 
                ? tempFilters.attachmentType.charAt(0).toUpperCase() + tempFilters.attachmentType.slice(1) 
                : 'Any';
              
              let dateLabel = 'Any time';
              if (typeof tempFilters.dateRange === 'string') {
                  dateLabel = dateLabels[tempFilters.dateRange] || 'Any time';
              } else if (tempFilters.dateRange) {
                  dateLabel = 'Custom range';
              }

              return (
                  <div className="h-full flex flex-col">
                      <FilterHeader 
                        title="Filters" 
                        onDone={handleApply} 
                        onCancel={onClose} 
                        showClear={hasActiveFilters}
                        onClear={handleClear}
                      />
                      <main className="flex-1 overflow-y-auto">
                          <ListItem className="m-4">
                              <FilterItem title="From" hint="Sender" value={fromLabel} onClick={() => setView('from')} />
                              <FilterItem title="To" hint="Recipient" value={toLabel} onClick={() => setView('to')} />
                              <FilterItem title="Is" hint="Status" value={isLabels[tempFilters.status as string] || 'Any'} onClick={() => setView('is')} />
                              <FilterItem title="Attachment" hint="File type" value={attachmentLabel} onClick={() => setView('attachmentType')} />
                              <FilterItem title="Date" hint="Time period" value={dateLabel} onClick={() => setView('date')} />
                              <FilterItem title="Label" hint="Tags" value={tempFilters.label || 'Any'} onClick={() => setView('label')} />
                              <FilterItem title="Has" hint="Attributes" value={hasLabels[tempFilters.has as string] || 'Any'} onClick={() => setView('has')} />
                          </ListItem>
                      </main>
                  </div>
              )
      }
  };

  if (!isRendering) return null;
  
  return (
    <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ease-in-out ${isOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none opacity-0'}`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
    >
        <div 
            className={`absolute bottom-0 left-0 right-0 h-[95dvh] bg-[#fcfcfc] dark:bg-background rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full"></div>
            </div>
            <div className="flex-1 min-h-0">
              {renderView()}
            </div>
        </div>
    </div>
  );
};

export default FilterScreenMobile;