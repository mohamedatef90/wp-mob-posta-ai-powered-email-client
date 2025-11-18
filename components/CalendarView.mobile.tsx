
import React, { useState, useRef, useEffect, useContext } from 'react';
import { XMarkIcon, SearchIcon, PlusIcon, ChevronRightIcon, CalendarDaysIcon, MapPinIcon, BellIcon, GlobeAmericasIcon, RepeatIcon, EyeIcon, EyeSlashIcon, UserIcon, ClockIcon } from './Icons';
import { Button } from './ui/Button';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { AppContext } from './context/AppContext';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Helper ---
const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
};

// --- Event Details Modal ---
interface MockEvent {
    title: string;
    timeRange: string;
    description: string;
    location?: string;
    color: string; // 'blue' | 'green' | 'purple'
}

const EventDetailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    event: MockEvent | null;
}> = ({ isOpen, onClose, event }) => {
    if (!isOpen || !event) return null;

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="w-full sm:max-w-md bg-card border-t sm:border border-border rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-fadeInUp"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-foreground">{event.title}</h3>
                        <p className="text-primary font-medium mt-1">{event.timeRange}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-accent">
                        <XMarkIcon className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {event.location && (
                        <div className="flex items-center text-sm text-foreground">
                            <MapPinIcon className="w-5 h-5 text-muted-foreground mr-3" />
                            {event.location}
                        </div>
                    )}
                    <div className="flex items-start text-sm text-foreground">
                        <div className="w-5 h-5 mr-3 flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full bg-${event.color}-500`}></div>
                        </div>
                        <p className="text-muted-foreground">{event.description}</p>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button onClick={() => alert('Edit Event')} variant="secondary" className="flex-1">Edit</Button>
                    <Button onClick={() => alert('Delete Event')} variant="destructive" className="flex-1">Delete</Button>
                </div>
            </div>
        </div>
    );
};


// --- Reusable UI for Add Event ---

const SettingsSection: React.FC<{ title: string, className?: string }> = ({ title, className }) => (
    <h3 className={`px-4 pt-4 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider ${className}`}>{title}</h3>
);
  
const SettingsCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
      <div className={`bg-card rounded-xl shadow-sm border border-border ${className}`}>
          {React.Children.map(children, (child, index) => (
              <>
                  {child}
                  {index < React.Children.count(children) - 1 && (
                       <div className="border-t border-border mx-4"></div>
                  )}
              </>
          ))}
      </div>
);
  
const SettingsItem: React.FC<{
    title?: string;
    description?: string;
    value?: string;
    hasToggle?: boolean;
    isToggleOn?: boolean;
    onToggle?: (isOn: boolean) => void;
    onClick?: () => void;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}> = ({ title, description, value, hasToggle, isToggleOn, onToggle, onClick, icon, children, className }) => {
    
    if (children) {
         return <div className={cn("flex items-center w-full px-4 py-3", className)}>{children}</div>
    }

    const content = (
      <>
        {icon && <div className="mr-4 text-muted-foreground">{icon}</div>}
        <div className="flex-grow min-w-0">
          {title && <p className="font-medium text-foreground">{title}</p>}
          {description && <p className="text-sm text-muted-foreground truncate">{description}</p>}
        </div>
        {value && !description && <p className="text-sm text-primary ml-4">{value}</p>}
        {onClick && !hasToggle && <ChevronRightIcon className="h-4 w-4 text-muted-foreground ml-2" />}
        {hasToggle && onToggle && (
          <ToggleSwitch checked={!!isToggleOn} onChange={onToggle} label={title} />
        )}
      </>
    );
  
    const itemClasses = "flex items-center w-full text-left px-4 py-3";
  
    if (onClick) {
      return (
        <button onClick={onClick} className={`${itemClasses} active:bg-secondary`}>
          {content}
        </button>
      );
    }
    
    return (
      <div className={itemClasses}>
        {content}
      </div>
    );
};

// --- Add Event Screen ---

const AddEventScreen: React.FC<{ onClose: () => void; initialStartDate?: string }> = ({ onClose, initialStartDate }) => {
    const [title, setTitle] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [startDate, setStartDate] = useState(initialStartDate || toLocalISOString(new Date()));
    
    // Default end date to 1 hour after start date
    const defaultEndDate = new Date(new Date(startDate).getTime() + 3600000);
    const [endDate, setEndDate] = useState(toLocalISOString(defaultEndDate));
    
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isBusy, setIsBusy] = useState(true); // Show as: Busy/Free
    const [remindMe, setRemindMe] = useState('10 minutes before');
    const [repeat, setRepeat] = useState('Never');

    const handleSave = () => {
        // Logic to save event would go here
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-background z-50 flex flex-col animate-fadeInUp">
            <header className="bg-card flex items-center justify-between p-4 border-b border-border shrink-0">
                <button onClick={onClose} className="text-base font-medium text-primary">Cancel</button>
                <h2 className="text-lg font-bold text-foreground">New Event</h2>
                <button onClick={handleSave} className="text-base font-bold text-primary" disabled={!title}>Add</button>
            </header>
            <main className="flex-grow overflow-y-auto p-4 space-y-6 bg-background">
                
                {/* Card 1: Title & People */}
                <SettingsCard>
                    <SettingsItem>
                        <input 
                            type="text" 
                            placeholder="Title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-lg font-medium placeholder:text-muted-foreground focus:outline-none"
                            autoFocus
                        />
                    </SettingsItem>
                     <SettingsItem title="People" value="None" onClick={() => {}} icon={<UserIcon className="w-5 h-5" />} />
                </SettingsCard>

                {/* Card 2: Time Details */}
                <SettingsCard>
                    <SettingsItem 
                        title="All-day" 
                        hasToggle 
                        isToggleOn={allDay} 
                        onToggle={setAllDay} 
                        icon={<ClockIcon className="w-5 h-5" />}
                    />
                    <SettingsItem>
                         <div className="flex flex-col w-full space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-foreground">Starts</span>
                                <input 
                                    type="datetime-local" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent text-primary focus:outline-none text-right"
                                />
                            </div>
                             <div className="border-t border-border"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-foreground">Ends</span>
                                <input 
                                    type="datetime-local" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent text-primary focus:outline-none text-right"
                                />
                            </div>
                         </div>
                    </SettingsItem>
                     <SettingsItem title="Time Zone" value="GMT+00:00" onClick={() => {}} icon={<GlobeAmericasIcon className="w-5 h-5" />} />
                     <SettingsItem title="Repeat" value={repeat} onClick={() => {}} icon={<RepeatIcon className="w-5 h-5" />} />
                </SettingsCard>

                {/* Card 3: Location */}
                <SettingsCard>
                    <SettingsItem>
                        <MapPinIcon className="w-5 h-5 text-muted-foreground mr-4" />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none"
                        />
                    </SettingsItem>
                </SettingsCard>

                {/* Card 4: Description */}
                <SettingsCard>
                    <SettingsItem>
                        <textarea 
                            placeholder="Notes" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none resize-none h-24"
                        />
                    </SettingsItem>
                </SettingsCard>

                {/* Card 5: Settings */}
                <SettingsCard>
                    <SettingsItem title="Remind me" value={remindMe} onClick={() => {}} icon={<BellIcon className="w-5 h-5" />} />
                    <SettingsItem title="Show as" value={isBusy ? "Busy" : "Free"} onClick={() => setIsBusy(!isBusy)} icon={<EyeIcon className="w-5 h-5" />} />
                    <SettingsItem 
                        title="Private" 
                        hasToggle 
                        isToggleOn={isPrivate} 
                        onToggle={setIsPrivate} 
                        icon={isPrivate ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    />
                </SettingsCard>

            </main>
        </div>
    );
};

// --- Main Calendar View ---

interface CalendarViewMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarViewMobile: React.FC<CalendarViewMobileProps> = ({ isOpen, onClose }) => {
    const { accounts, activeDomain } = useContext(AppContext);
    const [viewMode, setViewMode] = useState<'Agenda' | 'Day' | 'Month'>('Agenda');
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    
    // Event Detail Modal State
    const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
    
    // Scroll Refs
    const daysContainerRef = useRef<HTMLDivElement>(null);

    // To pre-fill the Add Event modal
    const [newEventStartDate, setNewEventStartDate] = useState<string | undefined>(undefined);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentAccount = activeDomain === 'innovate' 
        ? accounts[0] 
        : accounts.find(a => a.email.includes(activeDomain)) || accounts[0];
        
    const firstName = currentAccount?.name.split(' ')[0] || 'User';

    // Scroll to selected day when it changes (specifically for Agenda view)
    useEffect(() => {
        if (viewMode === 'Agenda' && daysContainerRef.current) {
            const selectedDateString = selectedDay.toISOString();
            const button = daysContainerRef.current.querySelector(`button[data-date="${selectedDateString}"]`) as HTMLElement;
            
            if (button) {
                const container = daysContainerRef.current;
                const scrollLeft = button.offsetLeft - (container.clientWidth / 2) + (button.clientWidth / 2);
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [selectedDay, viewMode]);

    const handleClose = () => {
        setIsViewDropdownOpen(false);
        setIsAddEventOpen(false);
        setIsMonthDropdownOpen(false);
        setSelectedEvent(null);
        onClose();
    };
    
    const openAddEvent = (startDate?: Date) => {
        if (startDate) {
            setNewEventStartDate(toLocalISOString(startDate));
        } else {
            setNewEventStartDate(undefined);
        }
        setIsAddEventOpen(true);
    };
    
    const handleGoToToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDay(now);
        // The useEffect above will handle scrolling
    };

    const getEventsForDate = (date: Date): MockEvent[] => {
        const day = date.getDay();
        const d = date.getDate();
        const events: MockEvent[] = [];
        
        if (day >= 1 && day <= 5) {
             events.push({ title: 'Standup Meeting', timeRange: '9:00 - 10:00', description: 'Daily sync with the engineering team.', location: 'Zoom', color: 'blue' });
        }
        if (day === 5) {
             events.push({ title: 'Team Lunch', timeRange: '1:00 - 2:00', description: 'Weekly team lunch at The Local.', location: 'The Local', color: 'green' });
        }
        if (d === 15) {
             events.push({ title: 'Design Review', timeRange: '3:00 - 4:00', description: 'Reviewing new mockups for Q3.', location: 'Meeting Room A', color: 'purple' });
        }
        return events;
    }

    const getEventCount = (date: Date) => {
        return getEventsForDate(date).length;
    };

    const handleDayClickMonthView = (date: Date) => {
        const events = getEventsForDate(date);
        if (events.length > 0) {
            // Show first event
            setSelectedEvent(events[0]); 
        } else {
             openAddEvent(date);
        }
    }

    const handleEventClick = (e: React.MouseEvent, event: MockEvent) => {
        e.stopPropagation();
        setSelectedEvent(event);
    }

    const renderContent = () => {
        if (viewMode === 'Month') {
            return (
                <div className="p-4 grid grid-cols-7 gap-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-xs font-bold text-muted-foreground mb-2">{d}</div>
                    ))}
                    {/* Mock Calendar Days */}
                    {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 3; // Offset start day
                        const isToday = day === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth();
                        
                        return (
                            <button 
                                key={i} 
                                onClick={() => {
                                    const date = new Date(currentDate);
                                    date.setDate(day > 0 ? day : 1); 
                                    date.setHours(9, 0, 0, 0);
                                    if (day > 0 && day <= 31) handleDayClickMonthView(date);
                                }}
                                className="aspect-square flex flex-col items-center justify-start pt-1 relative rounded-full hover:bg-secondary transition-colors"
                            >
                                {day > 0 && day <= 31 ? (
                                    <>
                                        <span className={cn(
                                            "text-sm w-7 h-7 flex items-center justify-center rounded-full", 
                                            isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                                        )}>{day}</span>
                                        {/* Mock Event Dot */}
                                        {(day === 5 || day === 12 || day === 15) && (
                                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-1"></span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-sm text-muted-foreground/30">{day <= 0 ? 30 + day : day - 31}</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            );
        }
        if (viewMode === 'Agenda') {
             const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
             const days = Array.from({ length: daysInMonth }, (_, i) => {
                 const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                 return d;
             });
             const hours = Array.from({ length: 24 }, (_, i) => i);

             return (
                <div className="flex flex-col h-full">
                    {/* Horizontal Days Strip */}
                    <div ref={daysContainerRef} className="flex overflow-x-auto border-b border-border no-scrollbar p-2 gap-2 shrink-0 bg-card z-10 scroll-smooth">
                        {days.map(d => {
                             const isSelected = d.getDate() === selectedDay.getDate() && d.getMonth() === selectedDay.getMonth();
                             const isToday = d.toDateString() === new Date().toDateString();
                             const hasEvents = getEventCount(d) > 0;

                             return (
                                 <button 
                                    key={d.toISOString()}
                                    data-date={d.toISOString()}
                                    onClick={() => setSelectedDay(d)}
                                    className={cn(
                                        "flex flex-col items-center justify-center min-w-[3.5rem] py-2 rounded-xl transition-all relative flex-shrink-0",
                                        isSelected ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
                                    )}
                                 >
                                     <span className="text-xs font-medium uppercase mb-0.5">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                     <span className={cn("text-lg font-bold", isToday && !isSelected && "text-primary")}>{d.getDate()}</span>
                                     
                                     {/* Event Dot Indicator */}
                                     {hasEvents && (
                                         <div className={cn(
                                             "w-1 h-1 rounded-full mt-1",
                                             isSelected ? "bg-primary-foreground" : "bg-primary"
                                         )}></div>
                                     )}
                                 </button>
                             )
                        })}
                    </div>
                    
                    {/* Vertical Hours Grid */}
                    <div className="flex-1 overflow-y-auto p-0 relative">
                         {/* Current Time Indicator (Mock position for demo) */}
                        {selectedDay.toDateString() === new Date().toDateString() && (
                            <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center" style={{ top: 'calc(14 * 4rem + 2rem)' }}>
                                <div className="w-12 text-right pr-2 text-xs font-bold text-red-500">
                                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                <div className="flex-1 h-px bg-red-500">
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                        )}

                        {hours.map(h => {
                            const mockEventStandup = { title: 'Standup Meeting', timeRange: '9:00 - 10:00', description: 'Daily sync.', color: 'blue' };
                            const mockEventLunch = { title: 'Team Lunch', timeRange: '1:00 - 2:00', description: 'Weekly team lunch.', color: 'green' };
                            const mockEventDesign = { title: 'Design Review', timeRange: '3:00 - 4:00', description: 'Review Q3.', color: 'purple' };

                            return (
                                <div 
                                    key={h} 
                                    className="flex h-16 border-b border-border/40 relative group"
                                    onClick={() => {
                                        const d = new Date(selectedDay);
                                        d.setHours(h, 0, 0, 0);
                                        openAddEvent(d);
                                    }}
                                >
                                    <span className="w-12 text-[10px] text-muted-foreground -mt-2 pl-2 pt-0.5">{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</span>
                                    <div className="flex-1 relative border-l border-border/40 hover:bg-secondary/20 transition-colors">
                                        
                                        {/* Mock Events Logic */}
                                        {h === 9 && selectedDay.getDay() >= 1 && selectedDay.getDay() <= 5 && (
                                            <div 
                                                onClick={(e) => handleEventClick(e, mockEventStandup)}
                                                className="absolute top-2 left-1 right-1 bg-blue-100 dark:bg-blue-500/20 border-l-2 border-blue-500 p-1 rounded text-xs text-blue-700 dark:text-blue-100 overflow-hidden shadow-sm z-10 cursor-pointer active:scale-95 transition-transform"
                                            >
                                                <span className="font-semibold">{mockEventStandup.title}</span>
                                                <div className="text-[10px] opacity-80">{mockEventStandup.timeRange}</div>
                                            </div>
                                        )}
                                        {h === 13 && selectedDay.getDay() === 5 && (
                                             <div 
                                                onClick={(e) => handleEventClick(e, mockEventLunch)}
                                                className="absolute top-4 left-1 right-1 bg-green-100 dark:bg-green-500/20 border-l-2 border-green-500 p-1 rounded text-xs text-green-700 dark:text-green-100 overflow-hidden shadow-sm z-10 cursor-pointer active:scale-95 transition-transform"
                                            >
                                                <span className="font-semibold">{mockEventLunch.title}</span>
                                                <div className="text-[10px] opacity-80">{mockEventLunch.timeRange}</div>
                                            </div>
                                        )}
                                         {h === 15 && selectedDay.getDate() === 15 && (
                                             <div 
                                                onClick={(e) => handleEventClick(e, mockEventDesign)}
                                                className="absolute top-0 left-1 right-1 bottom-0 bg-purple-100 dark:bg-purple-500/20 border-l-2 border-purple-500 p-1 rounded text-xs text-purple-700 dark:text-purple-100 overflow-hidden shadow-sm z-10 cursor-pointer active:scale-95 transition-transform"
                                            >
                                                <span className="font-semibold">{mockEventDesign.title}</span>
                                                <div className="text-[10px] opacity-80">{mockEventDesign.timeRange}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
             )
        }
        
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <CalendarDaysIcon className="w-16 h-16 mb-4 opacity-20" />
                <p>No events for this view.</p>
            </div>
        );
    };

    const eventCount = getEventCount(selectedDay);
    const isToday = selectedDay.toDateString() === new Date().toDateString();
    const dayLabel = isToday ? "today" : `on ${selectedDay.toLocaleDateString('en-US', { weekday: 'long' })}`;

    return (
        <div 
            className={cn(
                "fixed inset-0 z-50 transition-opacity duration-500 ease-in-out",
                isOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none opacity-0'
            )}
            onClick={handleClose}
        >
            <div 
                className={cn(
                    "absolute bottom-0 left-0 right-0 h-[95dvh] bg-background rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-500 ease-out settings-mobile-light",
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing">
                    <div className="w-10 h-1.5 bg-muted-foreground/30 rounded-full"></div>
                </div>

                {/* Top Header: Close & Search */}
                <div className="flex items-center px-4 pb-2 gap-3 shrink-0">
                     <button onClick={handleClose} className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors">
                        <XMarkIcon className="w-6 h-6 text-foreground" />
                     </button>
                     <div className="flex-1 relative group">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search events" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/50 focus:bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                     </div>
                </div>

                 {/* Greeting & Status */}
                <div className="px-4 pt-4 pb-4 animate-fadeIn shrink-0">
                    <h2 className="text-3xl font-bold text-foreground">Hello, {firstName}</h2>
                    <p className="text-muted-foreground mt-1">
                        {eventCount > 0 
                            ? `You have ${eventCount} event${eventCount > 1 ? 's' : ''} ${dayLabel} waiting for you.` 
                            : `You have no events ${dayLabel}.`}
                    </p>
                </div>

                {/* Calendar Card Container */}
                <div className="flex-1 flex flex-col bg-card rounded-t-3xl overflow-hidden shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] border-t border-border/40">
                    {/* Title & View Switcher Header */}
                    <div className="px-4 pt-5 pb-2 flex items-center justify-between shrink-0 relative z-20 bg-card">
                         <div className="flex items-center gap-3">
                             <div className="relative">
                                <button 
                                    onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                                    className="flex items-center text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
                                >
                                    <span>{monthNames[currentDate.getMonth()]}</span>
                                    <span className="ml-2 font-light text-muted-foreground">{currentDate.getFullYear()}</span>
                                    <ChevronRightIcon className={`ml-2 w-4 h-4 text-muted-foreground transition-transform duration-200 ${isMonthDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>
                                
                                {/* Month Dropdown */}
                                {isMonthDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsMonthDropdownOpen(false)}></div>
                                        <div className="absolute top-full left-0 mt-2 w-56 bg-popover border border-border rounded-2xl shadow-2xl z-20 max-h-80 overflow-y-auto animate-scaleIn origin-top-left no-scrollbar">
                                            <div className="p-2 space-y-1">
                                                {monthNames.map((m, idx) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => {
                                                            const newDate = new Date(currentDate);
                                                            newDate.setMonth(idx);
                                                            setCurrentDate(newDate);
                                                            setIsMonthDropdownOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                            idx === currentDate.getMonth() ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                                                        )}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleGoToToday}
                                className="h-8 px-3 text-xs font-semibold bg-secondary/50 hover:bg-secondary text-primary rounded-full transition-colors"
                            >
                                Today
                            </Button>
                        </div>

                        {/* View Switcher */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                                className="px-3 py-1.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground text-sm font-semibold flex items-center transition-colors"
                            >
                                {viewMode}
                                <ChevronRightIcon className={`ml-1.5 w-3.5 h-3.5 transition-transform duration-200 ${isViewDropdownOpen ? 'rotate-90' : ''}`} />
                            </button>
                            {isViewDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsViewDropdownOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-36 bg-popover border border-border rounded-xl shadow-xl z-20 flex flex-col overflow-hidden animate-fadeInDown origin-top-right p-1">
                                        {['Agenda', 'Day', 'Month'].map((mode) => (
                                            <button 
                                                key={mode}
                                                onClick={() => { setViewMode(mode as any); setIsViewDropdownOpen(false); }}
                                                className={cn(
                                                    "px-4 py-2 text-left text-sm rounded-lg transition-colors font-medium",
                                                    viewMode === mode ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent"
                                                )}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-grow overflow-y-auto bg-card relative">
                        {renderContent()}
                    </main>
                </div>

                {/* Floating Action Button (Liquid Glass Style) */}
                <div className="absolute bottom-8 right-6 z-30">
                    <button
                        onClick={() => openAddEvent()}
                        className="h-14 w-14 rounded-full bg-white/40 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white dark:border-white/20 text-primary shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 hover:bg-white/30 dark:hover:bg-zinc-800/40"
                        aria-label="Add event"
                    >
                        <PlusIcon className="w-7 h-7" />
                    </button>
                </div>

                {/* Add Event Screen Overlay */}
                {isAddEventOpen && <AddEventScreen onClose={() => setIsAddEventOpen(false)} initialStartDate={newEventStartDate} />}

                {/* Event Details Modal */}
                <EventDetailModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} event={selectedEvent} />

            </div>
        </div>
    );
};
