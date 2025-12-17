import React from 'react';
import { Button } from '../ui/Button';

interface Props {
    onNext: () => void;
    onBack: () => void;
}

const AiFeatureDemoStep: React.FC<Props> = ({ onNext, onBack }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 relative">
             <div className="animate-fadeInUp w-full max-w-sm">
                {/* Mock UI Card */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl mb-10 transform rotate-2 mx-auto relative overflow-hidden max-w-[280px]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-secondary"></div>
                        <div className="space-y-1 text-left flex-1">
                            <div className="h-2 w-20 bg-secondary rounded"></div>
                            <div className="h-1.5 w-24 bg-muted/50 rounded"></div>
                        </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="h-1.5 w-full bg-muted/30 rounded"></div>
                        <div className="h-1.5 w-5/6 bg-muted/30 rounded"></div>
                        <div className="h-1.5 w-4/6 bg-muted/30 rounded"></div>
                    </div>

                    {/* AI Feature Visualization */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-3 text-left border border-purple-100 dark:border-purple-800/30">
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-wand-magic-sparkles text-xs text-primary"></i>
                            <span className="text-xs font-bold text-primary bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">AI Summary</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-start space-x-2">
                                <div className="w-1 h-1 rounded-full bg-primary mt-1.5"></div>
                                <p className="text-[10px] text-muted-foreground">Project timeline updated to Q4.</p>
                            </div>
                            <div className="flex items-start space-x-2">
                                <div className="w-1 h-1 rounded-full bg-primary mt-1.5"></div>
                                <p className="text-[10px] text-muted-foreground">Action: Review attached doc.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h1 className="text-3xl font-bold text-foreground mb-4">Instant Clarity</h1>
                <p className="text-lg text-muted-foreground max-w-xs mx-auto">
                    Summarize threads, draft replies, and extract action items with a single tap.
                </p>
            </div>

            <div className="absolute bottom-10 w-full px-6 space-y-3">
                <Button size="lg" onClick={onNext} className="w-full rounded-full backdrop-blur-xl bg-primary/80 border border-white/20 shadow-lg">
                    Next
                </Button>
                <Button variant="ghost" onClick={onBack} className="w-full rounded-full">
                    Back
                </Button>
            </div>
        </div>
    );
};

export default AiFeatureDemoStep;