import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface MeetingDetails {
    title: string;
    date?: string;
    time?: string;
}

interface CalendarCardProps {
    participants: User[];
    onClose: () => void;
    suggestedDetails: MeetingDetails | null;
    isLoading: boolean;
}

const CalendarCardMobile: React.FC<CalendarCardProps> = ({ participants, onClose, suggestedDetails, isLoading }) => {
    const [title, setTitle] = useState('Sync Up');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('14:00');

    useEffect(() => {
        if (suggestedDetails) {
            setTitle(suggestedDetails.title || 'Sync Up');
            if (suggestedDetails.date) setDate(suggestedDetails.date);
            if (suggestedDetails.time) setTime(suggestedDetails.time);
        }
    }, [suggestedDetails]);

    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-xl p-4 animate-fadeInUp h-[500px] flex items-center justify-center">
                <div className="text-center">
                     <i className="fa-solid fa-wand-magic-sparkles text-3xl text-primary animate-pulse mb-2"></i>
                     <p className="text-sm text-muted-foreground">AI is finding the best time...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl p-4 animate-fadeInUp">
            <h3 className="font-semibold text-lg text-foreground mb-4">Schedule a meeting</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="text-sm font-medium text-muted-foreground">Title</label>
                    <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full bg-secondary p-2.5 rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="date" className="text-sm font-medium text-muted-foreground">Date</label>
                        <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full bg-secondary p-2.5 rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                        <label htmlFor="time" className="text-sm font-medium text-muted-foreground">Time</label>
                        <input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-1 w-full bg-secondary p-2.5 rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-muted-foreground">Participants</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {participants.map(p => (
                            <div key={p.email} className="bg-secondary px-3 py-1.5 rounded-full flex items-center space-x-2">
                                <img src={p.avatarUrl} alt={p.name} className="w-5 h-5 rounded-full"/>
                                <span className="text-sm text-secondary-foreground font-medium">{p.name}</span>
                                <button className="text-muted-foreground hover:text-foreground text-xs"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                        ))}
                        <button className="text-primary text-sm font-medium hover:underline bg-secondary px-3 py-1.5 rounded-full">+ Add</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="location" className="text-sm font-medium text-muted-foreground">Location / Link</label>
                    <input id="location" type="text" placeholder="e.g., Google Meet link" className="mt-1 w-full bg-secondary p-2.5 rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                    <label htmlFor="description" className="text-sm font-medium text-muted-foreground">Description</label>
                    <textarea id="description" rows={3} placeholder="Add a brief description..." className="mt-1 w-full bg-secondary p-2.5 rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"></textarea>
                </div>
            </div>
            <div className="flex flex-col-reverse gap-2 mt-6">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent w-full">Cancel</button>
                <button onClick={onClose} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center justify-center space-x-2 w-full">
                    <i className="fa-solid fa-check"></i>
                    <span>Create Event</span>
                </button>
            </div>
        </div>
    );
};

export default CalendarCardMobile;
