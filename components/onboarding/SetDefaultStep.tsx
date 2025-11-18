import React from 'react';
import { Button } from '../ui/Button';

interface SetDefaultStepProps {
    onComplete: () => void;
    onBack: () => void;
}

const SetDefaultStep: React.FC<SetDefaultStepProps> = ({ onComplete, onBack }) => {
    return (
         <div className="w-full max-w-md mx-auto flex flex-col justify-center h-full text-center">
            <header>
                <h1 className="text-3xl font-bold text-foreground">Make This Your Default Email App?</h1>
                <p className="text-muted-foreground mt-2">Open email links, files, and mailto: actions automatically in PostaGate.</p>
            </header>
            <main className="mt-8 flex-1 flex flex-col items-center justify-center">
                 <div className="relative">
                    <i className="fa-regular fa-envelope text-8xl text-primary/50"></i>
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center shadow-lg border-2 border-background">
                        <i className="fa-solid fa-check text-xl"></i>
                    </div>
                </div>
                <div className="w-full mt-8 space-y-3">
                     <Button size="lg" onClick={onComplete} className="w-full rounded-full backdrop-blur-xl bg-primary/80 border border-white/20 shadow-lg">Set as Default</Button>
                     <Button variant="ghost" size="lg" onClick={onComplete} className="w-full rounded-full">Skip for Now</Button>
                </div>
            </main>
        </div>
    );
};

export default SetDefaultStep;