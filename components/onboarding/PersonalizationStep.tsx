import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface PersonalizationStepProps {
    onNext: () => void;
    onBack: () => void;
    updateData: (data: { fullName: string; displayName: string }) => void;
    data: { email: string; fullName: string; displayName: string };
}

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({ onNext, onBack, updateData, data }) => {
    const [fullName, setFullName] = useState(data.fullName);
    const [displayName, setDisplayName] = useState(data.displayName);

    useEffect(() => {
        // Auto-suggest display name if it's empty
        if (data.email && !displayName) {
            const nameFromEmail = data.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            setDisplayName(nameFromEmail);
        }
    }, [data.email, displayName]);

    const handleNext = () => {
        updateData({ fullName, displayName });
        onNext();
    };
    
    return (
        <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full text-center">
            <header>
                <h1 className="text-3xl font-bold text-foreground">Personalize Your Experience</h1>
                <p className="text-muted-foreground mt-2">This information will be used to set up your profile.</p>
            </header>
            <main className="mt-8 flex-1">
                <div className="space-y-6 text-left">
                    <div>
                        <label htmlFor="fullName" className="text-sm font-medium text-muted-foreground ml-1">Full Name</label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="e.g., Harry Potter"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-12 text-base backdrop-blur-xl bg-card/50 mt-1"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label htmlFor="displayName" className="text-sm font-medium text-muted-foreground ml-1">Account Display Name (optional)</label>
                        <Input
                            id="displayName"
                            type="text"
                            placeholder="e.g., Hogwarts Account"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="h-12 text-base backdrop-blur-xl bg-card/50 mt-1"
                        />
                    </div>
                    <div className="pt-4">
                        <Button size="lg" onClick={handleNext} disabled={!fullName} className="w-full rounded-full backdrop-blur-xl bg-primary/80 border border-white/20 shadow-lg">Continue</Button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PersonalizationStep;