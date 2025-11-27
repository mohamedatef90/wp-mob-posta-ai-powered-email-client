

import React, { useState, useRef, useEffect, useContext } from 'react';
import { XMarkIcon, SearchIcon, PlusIcon, ChevronRightIcon, CalendarDaysIcon, MapPinIcon, BellIcon, GlobeAmericasIcon, RepeatIcon, EyeIcon, EyeSlashIcon, UserIcon, ClockIcon, TrashIcon } from './Icons';
import { Button } from './ui/Button';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { AppContext } from './context/AppContext';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Helper ---
const toLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
};

const getDateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const formatTimeRange = (start: Date, end: Date) => {
    const startTime = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
};

// --- Interfaces ---
export interface MockEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
    location?: string;
    color: string; // 'blue' | 'green' | 'purple'
}

// --- Event Details Modal ---
const EventDetailModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    event: MockEvent | null;
    onEdit: (event: MockEvent) => void;
    onDelete: (eventId: string) => void;
}> = ({ isOpen, onClose, event, onEdit, onDelete }) => {
    if (!isOpen || !event) return null;

    const timeRange = formatTimeRange(event.start, event.end);

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
                        <p className="text-primary font-medium mt-1">{timeRange}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-accent">
                        <XMarkIcon className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {event.location && (
                        <div className="flex items-center text-sm text-foreground">
                            <MapPinIcon className="w-6 h-6 text-muted-foreground mr-3" />
                            {event.location}
                        </div>
                    )}
                    <div className="flex items-start text-sm text-foreground">
                        <div className="w-3 h-3 mr-3 flex items-center justify-center mt-1.5">
                            <div className={`w-2 h-2 rounded-full bg-${event.color}-500`}></div>
                        </div>
                        <p className="text-muted-foreground pt-0.5">{event.description || 'No description'}</p>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button onClick={() => onEdit(event)} variant="secondary" className="flex-1 bg-secondary hover:bg-secondary/80">Edit</Button>
                    <Button onClick={() => onDelete(event.id)} variant="destructive" className="flex-1">Delete</Button>
                </div>
            </div>
        </div>
    );
};


// --- Reusable UI for Add Event ---

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
        {onClick && !hasToggle && <ChevronRightIcon className="h-6 w-6 text-muted-foreground ml-2" />}
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

// --- Reminder Modals ---

const CustomReminderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (value: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [val, setVal] = useState('10');
    const [unit, setUnit] = useState('minutes');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(`${val} ${unit} before`);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-card w-full max-w-xs rounded-2xl shadow-xl p-6 animate-scaleIn" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4 text-foreground">Custom Reminder</h3>
                <div className="flex gap-2 mb-6">
                    <input 
                        type="number" 
                        value={val} 
                        onChange={e => setVal(e.target.value)}
                        className="w-20 bg-secondary border-none rounded-lg p-2 text-center focus:ring-2 focus:ring-primary outline-none text-foreground"
                    />
                    <div className="flex-1 relative">
                        <select 
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                            className="w-full bg-secondary appearance-none rounded-lg p-2 px-3 outline-none focus:ring-2 focus:ring-primary text-foreground"
                        >
                            <option value="minutes">minutes</option>
                            <option value="hours">hours</option>
                            <option value="days">days</option>
                            <option value="weeks">weeks</option>
                        </select>
                        <ChevronRightIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-muted-foreground" />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Set</Button>
                </div>
            </div>
        </div>
    )
}

const ReminderOptionsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedValue: string;
    onSelect: (value: string) => void;
}> = ({ isOpen, onClose, selectedValue, onSelect }) => {
    const [showCustom, setShowCustom] = useState(false);

    if (!isOpen) return null;

    const options = [
        'None',
        'At time of event',
        '5 minutes before',
        '10 minutes before',
        '15 minutes before',
        '30 minutes before',
        '1 hour before',
        '1 day before',
        'Custom...'
    ];

    const handleSelectOption = (opt: string) => {
        if (opt === 'Custom...') {
            setShowCustom(true);
        } else {
            onSelect(opt);
            onClose();
        }
    };

    if (showCustom) {
        return <CustomReminderModal isOpen={true} onClose={() => {setShowCustom(false); onClose();}} onSave={(val) => { onSelect(val); onClose(); }} />;
    }

    return (
        <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-fadeInUp" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-lg text-center text-foreground">Remind me</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => handleSelectOption(opt)}
                            className={cn(
                                "w-full text-left px-6 py-3.5 text-base transition-colors flex justify-between items-center",
                                opt === selectedValue ? 'text-primary font-semibold bg-primary/5' : 'text-foreground hover:bg-accent'
                            )}
                        >
                            {opt}
                            {opt === selectedValue && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        </button>
                    ))}
                </div>
                <div className="p-2">
                    <button onClick={onClose} className="w-full py-3 rounded-xl font-semibold text-primary hover:bg-accent transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// --- Add/Edit Event Screen ---

interface AddEventScreenProps {
    onClose: () => void;
    initialStartDate?: string;
    eventToEdit?: MockEvent | null;
    onSave: (event: MockEvent) => void;
    initialData?: Partial<MockEvent>;
}

const AddEventScreen: React.FC<AddEventScreenProps> = ({ onClose, initialStartDate, eventToEdit, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [startDate, setStartDate] = useState(toLocalISOString(new Date()));
    const [endDate, setEndDate] = useState(toLocalISOString(new Date(new Date().getTime() + 3600000)));
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isBusy, setIsBusy] = useState(true);
    const [remindMe, setRemindMe] = useState('10 minutes before');
    const [repeat, setRepeat] = useState('Never');
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setStartDate(toLocalISOString(eventToEdit.start));
            setEndDate(toLocalISOString(eventToEdit.end));
            setLocation(eventToEdit.location || '');
            setDescription(eventToEdit.description || '');
        } else if (initialData) {
            setTitle(initialData.title || '');
            if (initialData.start) setStartDate(toLocalISOString(initialData.start));
            if (initialData.end) setEndDate(toLocalISOString(initialData.end));
            setLocation(initialData.location || '');
            setDescription(initialData.description || '');
        } else if (initialStartDate) {
            setStartDate(initialStartDate);
            const start = new Date(initialStartDate);
            setEndDate(toLocalISOString(new Date(start.getTime() + 3600000)));
        }
    }, [eventToEdit, initialStartDate, initialData]);

    const handleSave = () => {
        const newEvent: MockEvent = {
            id: eventToEdit ? eventToEdit.id : `evt-${Date.now()}`,
            title: title || 'New Event',
            start: new Date(startDate),
            end: new Date(endDate),
            description: description,
            location: location,
            color: eventToEdit ? eventToEdit.color : 'blue' // Default color or preserve existing
        };
        onSave(newEvent);
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-background z-50 flex flex-col animate-fadeInUp">
            <header className="bg-card flex items-center justify-between p-4 border-b border-border shrink-0">
                <button onClick={onClose} className="text-base font-medium text-primary">Cancel</button>
                <h2 className="text-lg font-bold text-foreground">{eventToEdit ? 'Edit Event' : 'New Event'}</h2>
                <button onClick={handleSave} className="text-base font-bold text-primary" disabled={!title}>
                    {eventToEdit ? 'Save' : 'Add'}
                </button>
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
                            className="w-full bg-transparent text-lg font-medium placeholder:text-muted-foreground focus:outline-none text-foreground"
                            autoFocus
                        />
                    </SettingsItem>
                     <SettingsItem title="People" value="None" onClick={() => {}} icon={<UserIcon className="w-6 h-6" />} />
                </SettingsCard>

                {/* Card 2: Time Details */}
                <SettingsCard>
                    <SettingsItem 
                        title="All-day" 
                        hasToggle 
                        isToggleOn={allDay} 
                        onToggle={setAllDay} 
                        icon={<ClockIcon className="w-6 h-6" />}
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
                     <SettingsItem title="Time Zone" value="GMT+00:00" onClick={() => {}} icon={<GlobeAmericasIcon className="w-6 h-6" />} />
                     <SettingsItem title="Repeat" value={repeat} onClick={() => {}} icon={<RepeatIcon className="w-6 h-6" />} />
                </SettingsCard>

                {/* Card 3: Location */}
                <SettingsCard>
                    <SettingsItem>
                        <MapPinIcon className="w-6 h-6 text-muted-foreground mr-4" />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none text-foreground"
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
                            className="w-full bg-transparent placeholder:text-muted-foreground focus:outline-none resize-none h-24 text-foreground"
                        />
                    </SettingsItem>
                </SettingsCard>

                {/* Card 5: Settings */}
                <SettingsCard>
                    <SettingsItem 
                        title="Remind me" 
                        value={remindMe} 
                        onClick={() => setIsReminderModalOpen(true)} 
                        icon={<BellIcon className="w-6 h-6" />} 
                    />
                    <SettingsItem title="Show as" value={isBusy ? "Busy" : "Free"} onClick={() => setIsBusy(!isBusy)} icon={<EyeIcon className="w-6 h-6" />} />
                    <SettingsItem 
                        title="Private" 
                        hasToggle 
                        isToggleOn={isPrivate} 
                        onToggle={setIsPrivate} 
                        icon={isPrivate ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                    />
                </SettingsCard>

                {eventToEdit && (
                     <div className="w-full">
                        <Button variant="destructive" className="w-full bg-card border border-border text-destructive hover:bg-destructive/10" onClick={() => {}}>
                            Delete Event
                        </Button>
                     </div>
                )}
            </main>
            <ReminderOptionsModal 
                isOpen={isReminderModalOpen} 
                onClose={() => setIsReminderModalOpen(false)}
                selectedValue={remindMe}
                onSelect={setRemindMe}
            />
        </div>
    );
};

// --- Main Calendar View ---

interface CalendarViewMobileProps {
  isOpen: boolean;
  onClose: () => void;
  initialEventData?: Partial<MockEvent>;
}

export const CalendarViewMobile: React.FC<CalendarViewMobileProps> = ({ isOpen, onClose, initialEventData }) => {
    const { accounts, activeDomain } = useContext(AppContext);
    const [viewMode, setViewMode] = useState<'Agenda' | 'Day' | 'Month'>('Agenda');
    const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    
    // Events State
    const [events, setEvents] = useState<MockEvent[]>([]);
    
    // Event Detail Modal State
    const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
    // Event to Edit (passed to AddEventScreen)
    const [eventToEdit, setEventToEdit] = useState<MockEvent | null>(null);

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

    // Initialize Mock Events
    useEffect(() => {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();

        // Only initialize if empty
        if (events.length === 0) {
            const initialEvents: MockEvent[] = [
                {
                    id: 'evt-1',
                    title: 'Standup Meeting',
                    start: new Date(y, m, d, 9, 0),
                    end: new Date(y, m, d, 10, 0),
                    description: 'Daily sync with the engineering team.',
                    location: 'Zoom',
                    color: 'blue'
                },
                {
                    id: 'evt-2',
                    title: 'Team Lunch',
                    start: new Date(y, m, d + (5 - today.getDay()), 13, 0), // Next Friday or this Friday
                    end: new Date(y, m, d + (5 - today.getDay()), 14, 0),
                    description: 'Weekly team lunch at The Local.',
                    location: 'The Local',
                    color: 'green'
                },
                {
                    id: 'evt-3',
                    title: 'Design Review',
                    start: new Date(y, m, 15, 15, 0),
                    end: new Date(y, m, 15, 16, 0),
                    description: 'Reviewing new mockups for Q3.',
                    location: 'Meeting Room A',
                    color: 'purple'
                }
            ];
            setEvents(initialEvents);
        }
    }, []);

    // Handle incoming initialEventData (from "Add to Calendar" button)
    useEffect(() => {
        if (initialEventData) {
            setEventToEdit(null); // New event mode
            setIsAddEventOpen(true);
        }
    }, [initialEventData]);

    // Scroll to selected day when it changes (specifically for Agenda view)
    useEffect(() => {
        if (viewMode === 'Agenda' && daysContainerRef.current) {
            const key = getDateKey(selectedDay);
            const button = daysContainerRef.current.querySelector(`button[data-date="${key}"]`) as HTMLElement;
            
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
        setEventToEdit(null);
        onClose();
    };
    
    const openAddEvent = (startDate?: Date) => {
        setEventToEdit(null); // Ensure we are in "Add" mode
        if (startDate) {
            setNewEventStartDate(toLocalISOString(startDate));
        } else {
            setNewEventStartDate(undefined);
        }
        setIsAddEventOpen(true);
    };

    const openEditEvent = (event: MockEvent) => {
        setEventToEdit(event);
        setSelectedEvent(null); // Close detail modal
        setIsAddEventOpen(true);
    };

    const handleDeleteEvent = (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(e => e.id !== eventId));
            setSelectedEvent(null);
        }
    };

    const handleSaveEvent = (event: MockEvent) => {
        setEvents(prev => {
            const existingIndex = prev.findIndex(e => e.id === event.id);
            if (existingIndex >= 0) {
                const updatedEvents = [...prev];
                updatedEvents[existingIndex] = event;
                return updatedEvents;
            } else {
                return [...prev, event];
            }
        });
    };
    
    const handleGoToToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDay(now);
    };

    const getEventsForDate = (date: Date): MockEvent[] => {
        return events.filter(e => 
            e.start.getDate() === date.getDate() && 
            e.start.getMonth() === date.getMonth() && 
            e.start.getFullYear() === date.getFullYear()
        );
    }

    const getEventCount = (date: Date) => {
        return getEventsForDate(date).length;
    };

    const handleDayClickMonthView = (date: Date) => {
        const dayEvents = getEventsForDate(date);
        if (dayEvents.length > 0) {
            setSelectedEvent(dayEvents[0]); 
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
                    {/* Calendar Days */}
                    {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - 3; // Offset start day
                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                        
                        // Helper to check if this specific day has events
                        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dayHasEvents = day > 0 && day <= 31 && getEventCount(dateToCheck) > 0;

                        return (
                            <button 
                                key={i} 
                                onClick={() => {
                                    if (day > 0 && day <= 31) {
                                        const date = new Date(currentDate);
                                        date.setDate(day); 
                                        date.setHours(9, 0, 0, 0);
                                        handleDayClickMonthView(date);
                                    }
                                }}
                                className="aspect-square flex flex-col items-center justify-start pt-1 relative rounded-full hover:bg-secondary transition-colors"
                            >
                                {day > 0 && day <= 31 ? (
                                    <>
                                        <span className={cn(
                                            "text-sm w-7 h-7 flex items-center justify-center rounded-full", 
                                            isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                                        )}>{day}</span>
                                        {/* Event Dot */}
                                        {dayHasEvents && (
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
             
             // Filter events for the selected day to render them on the grid
             const todaysEvents = getEventsForDate(selectedDay);

             return (
                <div className="flex flex-col h-full">
                    {/* Horizontal Days Strip */}
                    <div ref={daysContainerRef} className="flex overflow-x-auto border-b border-border no-scrollbar p-2 gap-2 shrink-0 bg-card z-10 scroll-smooth">
                        {days.map(d => {
                             const isSelected = d.getDate() === selectedDay.getDate() && d.getMonth() === selectedDay.getMonth();
                             const isToday = d.toDateString() === new Date().toDateString();
                             const hasEvents = getEventCount(d) > 0;
                             const key = getDateKey(d);

                             return (
                                 <button 
                                    key={key}
                                    data-date={key}
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
                         {/* Current Time Indicator */}
                        {selectedDay.toDateString() === new Date().toDateString() && (
                            <div className="absolute left-0 right-0 z-10 pointer-events-none flex items-center" style={{ top: `calc(${new Date().getHours()} * 4rem + (${new Date().getMinutes()} / 60 * 4rem))` }}>
                                <div className="w-12 text-right pr-2 text-xs font-bold text-red-500">
                                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                                <div className="flex-1 h-px bg-red-500">
                                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                        )}

                        {hours.map(h => {
                            // Find events starting in this hour
                            const eventsStartingHere = todaysEvents.filter(e => e.start.getHours() === h);

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
                                        
                                        {eventsStartingHere.map(evt => {
                                            // Calculate height based on duration (1 hour = 4rem = 64px)
                                            const durationHours = (evt.end.getTime() - evt.start.getTime()) / 3600000;
                                            const height = Math.max(durationHours * 4, 2); // Min height 2rem
                                            const top = (evt.start.getMinutes() / 60) * 4;
                                            
                                            return (
                                                <div 
                                                    key={evt.id}
                                                    onClick={(e) => handleEventClick(e, evt)}
                                                    className={`absolute left-1 right-1 bg-${evt.color}-100 dark:bg-${evt.color}-500/20 border-l-2 border-${evt.color}-500 p-1 rounded text-xs text-${evt.color}-700 dark:text-${evt.color}-100 overflow-hidden shadow-sm z-10 cursor-pointer active:scale-95 transition-transform`}
                                                    style={{ top: `${top}rem`, height: `${height}rem` }}
                                                >
                                                    <span className="font-semibold block truncate">{evt.title}</span>
                                                    <div className="text-[10px] opacity-80 truncate">{formatTimeRange(evt.start, evt.end)}</div>
                                                </div>
                                            );
                                        })}
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
                <CalendarDaysIcon className="w-10 h-10 mb-4 opacity-20" />
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
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search events" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/50 focus:bg-secondary rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                                    <ChevronRightIcon className={`ml-2 w-6 h-6 text-muted-foreground transition-transform duration-200 ${isMonthDropdownOpen ? 'rotate-90' : ''}`} />
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
                                className="h-7 px-3 text-xs font-semibold bg-secondary/50 hover:bg-secondary text-primary rounded-full transition-colors"
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
                                <ChevronRightIcon className={`ml-1.5 w-6 h-6 transition-transform duration-200 ${isViewDropdownOpen ? 'rotate-90' : ''}`} />
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
                    <main className="flex-grow overflow-y-auto bg-card relative rounded-t-2xl">
                        {renderContent()}
                    </main>
                </div>

                {/* Floating Action Button (Liquid Glass Style) */}
                <div className="absolute bottom-8 right-6 z-30">
                    <button
                        onClick={() => openAddEvent()}
                        className="h-12 w-12 rounded-full bg-white/40 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white dark:border-white/20 text-primary shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 hover:bg-white/30 dark:hover:bg-zinc-800/40"
                        aria-label="Add event"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Add/Edit Event Screen Overlay */}
                {isAddEventOpen && (
                    <AddEventScreen 
                        onClose={() => setIsAddEventOpen(false)} 
                        initialStartDate={newEventStartDate} 
                        eventToEdit={eventToEdit}
                        onSave={handleSaveEvent}
                        initialData={initialEventData}
                    />
                )}

                {/* Event Details Modal */}
                <EventDetailModal 
                    isOpen={!!selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                    event={selectedEvent} 
                    onEdit={openEditEvent}
                    onDelete={handleDeleteEvent}
                />

            </div>
        </div>
    );
};