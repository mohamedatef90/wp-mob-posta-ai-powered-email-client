import React from 'react';
import { Button } from '../ui/Button';
import { AICopilotIcon } from '../Icons';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

const AiFeatureIntroStep: React.FC<Props> = ({ onNext, onBack }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 relative">
             <div className="animate-fadeInUp flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-full"></div>
                    <div className="relative z-10 w-16 h-16 text-primary">
                        <AICopilotIcon />
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">Email, Reimagined</h1>
                <p className="text-lg text-muted-foreground max-w-xs mx-auto">
                    Experience a smarter inbox that understands you. Posta uses Gemini AI to automate the mundane.
                </p>
            </div>

            <div className="absolute bottom-10 w-full px-6 space-y-3">
                <Button size="lg" onClick={onNext} className="w-full rounded-full backdrop-blur-xl bg-primary/80 border border-white/20 shadow-lg">
                    Continue
                </Button>
                <Button variant="ghost" onClick={onBack} className="w-full rounded-full">
                    Back
                </Button>
            </div>
        </div>
    );
};

export default AiFeatureIntroStep;