import React, { useContext } from 'react';
import type { Module } from './context/AppContext';
import { AppContext } from './context/AppContext';
import { AICopilotIcon } from './Icons';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface MobileBottomNavProps {
  activeModule: Module;
  onNavigate: (module: Module) => void;
}

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  module: Module;
  isActive: boolean;
  onClick: (module: Module) => void;
  uiTheme: 'modern' | 'classic';
}> = ({ icon, label, module, isActive, onClick, uiTheme }) => {
  if (uiTheme === 'classic') {
    return (
      <button
        onClick={() => onClick(module)}
        title={label}
        aria-label={label}
        className={cn(
          'flex flex-col items-center justify-center h-full flex-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-background',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        <div className="w-6 h-6 flex items-center justify-center text-xl">{icon}</div>
        <span className="text-xs font-medium mt-1">{label}</span>
      </button>
    );
  }

  // Modern theme
  return (
    <button
      onClick={() => onClick(module)}
      title={label}
      aria-label={label}
      className={cn(
        'flex items-center justify-center h-10 transition-all duration-300 ease-in-out rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        isActive
          ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4'
          : 'text-zinc-500 dark:text-zinc-400 w-10'
      )}
    >
      <div className={cn('w-6 h-6 text-lg flex items-center justify-center', isActive && 'mr-2')}>
        {icon}
      </div>
      {isActive && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
};


const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeModule, onNavigate }) => {
  const { uiTheme } = useContext(AppContext);

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        uiTheme === 'modern' && "px-4 pb-4"
      )} 
      style={uiTheme === 'modern' ? {paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'} : { paddingBottom: 'env(safe-area-inset-bottom)'}}
    >
        <div 
            className={cn(
                "w-full flex justify-around items-center",
                uiTheme === 'modern'
                    ? 'max-w-md mx-auto h-16 bg-white/20 dark:bg-zinc-800/20 backdrop-blur-sm border-2 border-white dark:border-white/20 rounded-[2rem] shadow-lg px-2'
                    : 'h-16 bg-card border-t border-border'
            )}
        >
            <NavButton uiTheme={uiTheme} icon={<i className="fa-solid fa-inbox"></i>} label="Email" module="email" isActive={activeModule === 'email'} onClick={onNavigate} />
            <NavButton uiTheme={uiTheme} icon={<AICopilotIcon />} label="Copilot" module="copilot" isActive={activeModule === 'copilot'} onClick={onNavigate} />
            <NavButton uiTheme={uiTheme} icon={<i className="fa-solid fa-comment-dots"></i>} label="Chat" module="chat" isActive={activeModule === 'chat'} onClick={onNavigate} />
            <NavButton uiTheme={uiTheme} icon={<i className="fa-solid fa-cloud"></i>} label="Drive" module="drive" isActive={activeModule === 'drive'} onClick={onNavigate} />
            <NavButton uiTheme={uiTheme} icon={<i className="fa-solid fa-gear"></i>} label="Settings" module="settings" isActive={activeModule === 'settings'} onClick={onNavigate} />
        </div>
    </nav>
  );
};

export default MobileBottomNav;