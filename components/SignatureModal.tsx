import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './ui/Button';

export const SignatureModal: React.FC<{ isOpen: boolean, onClose: () => void, signature: string, onSave: (sig: string) => void }> = ({ isOpen, onClose, signature, onSave }) => {
    const [sig, setSig] = useState(signature);
    if (!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-background rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="p-4 font-semibold border-b border-border text-foreground">Edit Signature</h2>
                <div className="p-4">
                    <textarea value={sig} onChange={e => setSig(e.target.value)} className="w-full h-32 p-2 border rounded bg-secondary text-foreground" />
                </div>
                <div className="p-4 flex justify-end space-x-2 border-t border-border">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { onSave(sig); onClose(); }}>Save</Button>
                </div>
            </div>
        </div>,
        document.body
    );
};