import React from 'react';
import ReactDOM from 'react-dom';

export const OutOfOfficeModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({isOpen, onClose}) => {
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/30 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-4" onClick={e => e.stopPropagation()}>
                <h2 className="font-semibold text-lg">Out of Office</h2>
                <p className="text-sm text-muted-foreground mt-2">This is a placeholder for Out of Office settings.</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-md hover:bg-accent">Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
};
