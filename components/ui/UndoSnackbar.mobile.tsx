import React from 'react';
import { Button } from './Button';

interface UndoSnackbarProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
}

const UndoSnackbarMobile: React.FC<UndoSnackbarProps> = ({ message, onUndo, onClose }) => {
  return (
    <div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-card border border-border shadow-lg rounded-lg px-4 py-3 flex items-center justify-between animate-fadeInUp backdrop-blur-xl"
      style={{ animationDuration: '0.3s' }}
      role="status"
      aria-live="polite"
    >
      <span className="text-sm text-card-foreground">{message}</span>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onUndo} className="font-semibold text-primary">Undo</Button>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground">
            <i className="fa-solid fa-xmark w-4 h-4"></i>
        </Button>
      </div>
    </div>
  );
};

export default UndoSnackbarMobile;