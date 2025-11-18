import React, { createContext } from 'react';

// Re-define Module type here to avoid circular dependency with App.tsx
export type Module = 'email' | 'copilot' | 'chat' | 'drive' | 'settings';
export type Theme = 'light' | 'dark' | 'system';
export type UiTheme = 'modern' | 'classic';

export interface Account {
    name: string;
    email: string;
    avatarUrl?: string;
}

export type Domain = 'microhard' | 'liverpool' | 'innovate';

interface AppContextType {
    accounts: Account[];
    theme: Theme;
    setTheme: (theme: Theme) => void;
    uiTheme: UiTheme;
    setUiTheme: (theme: UiTheme) => void;
    initialSettingsView: string | null;
    setInitialSettingsView: (view: string | null) => void;
    setActiveModule: (module: Module) => void;
    activeDomain: Domain | 'all';
}

export const AppContext = createContext<AppContextType>({
    accounts: [],
    theme: 'system',
    setTheme: () => {},
    uiTheme: 'modern',
    setUiTheme: () => {},
    initialSettingsView: null,
    setInitialSettingsView: () => {},
    setActiveModule: () => {},
    // FIX: Changed default activeDomain to 'all' to match modern UI default and type.
    activeDomain: 'all',
});
