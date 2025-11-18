import React, { useState, useEffect, useRef } from 'react';

interface SnoozePopoverProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onSnooze: (until: Date) => void;
}

interface SnoozeOption {
    id: string;
    label: string;
    getTime: () => string;
    getUntil: () => Date;
}

const getSnoozeOptions = (): SnoozeOption[] => {
    const now = new Date();
    
    // Later Today
    const laterToday = new Date(now);
    laterToday.setHours(now.getHours() + 3);

    // Tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    // This Weekend
    const thisWeekend = new Date(now);
    const day = now.getDay();
    const daysUntilSaturday = day === 6 ? 7 : 6 - day;
    thisWeekend.setDate(now.getDate() + daysUntilSaturday);
    thisWeekend.setHours(9, 0, 0, 0);

    // Next Week
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + (8 - day) % 7 + (day === 0 ? 1 : 0));
    nextWeek.setHours(9, 0, 0, 0);

    return [
        { id: 'later-today', label: 'Later Today', getTime: () => laterToday.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), getUntil: () => laterToday },
        { id: 'tomorrow', label: 'Tomorrow', getTime: () => '9:00 AM', getUntil: () => tomorrow },
        { id: 'this-weekend', label: 'This Weekend', getTime: () => 'Sat 9:00 AM', getUntil: () => thisWeekend },
        { id: 'next-week', label: 'Next Week', getTime: () => 'Mon 9:00 AM', getUntil: () => nextWeek },
    ];
};

const SnoozeOptionButton: React.FC<{ option: SnoozeOption; onSelect: (date: Date) => void; }> = ({ option, onSelect }) => (
    <button
        onClick={() => onSelect(option.getUntil())}
        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
    >
        <div className="flex items-center justify-between w-full">
            <span>{option.label}</span>
            <span className="text-muted-foreground">{option.getTime()}</span>
        </div>
    </button>
);


const SnoozePopover: React.FC<SnoozePopoverProps> = ({ anchorEl, onClose, onSnooze }) => {
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!anchorEl || !popoverRef.current) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();

        let top = anchorRect.bottom + 8;
        let left = anchorRect.left;

        if (left + popoverRect.width > window.innerWidth - 16) {
            left = anchorRect.right - popoverRect.width;
        }

        if (top + popoverRect.height > window.innerHeight - 16) {
            top = anchorRect.top - popoverRect.height - 8;
        }

        setPosition({ top, left });

    }, [anchorEl]);

    if (!anchorEl) return null;
    
    const snoozeOptions = getSnoozeOptions();

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
            <div
                ref={popoverRef}
                style={position}
                className="absolute z-50 w-64 bg-card rounded-xl shadow-2xl border border-border p-2 animate-scaleIn backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Snooze options"
            >
                <div className="px-2 py-1 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">Snooze until...</h3>
                </div>
                <div className="flex flex-col">
                    {snoozeOptions.map(option => (
                        <SnoozeOptionButton key={option.id} option={option} onSelect={onSnooze} />
                    ))}
                    <div className="h-px bg-border my-2"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors flex items-center space-x-3">
                         <i className="fa-regular fa-calendar-days w-4 h-4 text-muted-foreground"></i>
                         <span>Pick a date & time</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SnoozePopover;