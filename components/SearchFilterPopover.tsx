import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Label } from './ui/Label';

export interface SearchFilters {
  sender: string;
  dateRange: 'any' | '7d' | '30d' | { start?: string; end?: string };
  status: 'any' | 'read' | 'unread' | 'sent' | 'starred' | 'snoozed';
}

interface SearchFilterPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (filters: Partial<SearchFilters>) => void;
}

const SearchFilterPopover: React.FC<SearchFilterPopoverProps> = ({ anchorEl, onClose, filters: initialFilters, onApply }) => {
    // Cast initial filters to local state type (simplified for UI)
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorEl && popoverRef.current) {
            const anchorRect = anchorEl.getBoundingClientRect();
            const popoverRect = popoverRef.current.getBoundingClientRect();
            
            let top = anchorRect.bottom + 8;
            let left = anchorRect.right - popoverRect.width;

            if (left < 8) {
                left = 8;
            }

            if (top + popoverRect.height > window.innerHeight - 8) {
                top = anchorRect.top - popoverRect.height - 8;
            }
            
            setPosition({ top, left });
        }
    }, [anchorEl]);
    
    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        const clearedFilters: SearchFilters = { sender: '', dateRange: 'any', status: 'any' };
        setFilters(clearedFilters);
        onApply(clearedFilters);
        onClose();
    };
    
    if (!anchorEl) return null;

    // Helper to safely get string values for select inputs
    const getDateRangeValue = () => {
        if (typeof filters.dateRange === 'string') return filters.dateRange;
        return 'any'; // Default to 'any' for custom ranges in this simple UI
    };

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
            <div
                ref={popoverRef}
                style={position}
                className="absolute z-50 w-80 bg-card rounded-xl shadow-2xl border border-border p-4 animate-scaleIn backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Advanced search filters"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">Filter Search</h3>
                    <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground">
                        <i className="fa-solid fa-xmark w-4 h-4"></i>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="sender">From</Label>
                        <Input 
                            id="sender" 
                            placeholder="e.g., Albus Dumbledore" 
                            value={filters.sender} 
                            onChange={e => setFilters(f => ({ ...f, sender: e.target.value }))} 
                        />
                    </div>
                    <div>
                        <Label htmlFor="date-range">Date</Label>
                        <Select 
                            id="date-range" 
                            value={getDateRangeValue()} 
                            onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value as any }))}
                        >
                            <option value="any">Any time</option>
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select 
                            id="status" 
                            value={filters.status} 
                            onChange={e => setFilters(f => ({ ...f, status: e.target.value as any }))}
                        >
                            <option value="any">All</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <Button variant="ghost" onClick={handleClear}>Clear</Button>
                    <Button onClick={handleApply}>Apply</Button>
                </div>
            </div>
        </>
    );
};

export default SearchFilterPopover;
