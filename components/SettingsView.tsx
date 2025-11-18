import React, { useState, useContext } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { AppContext } from './context/AppContext';

type Theme = 'light' | 'dark' | 'system';

// --- Reusable UI Components ---

const SettingsItem: React.FC<{ label: string; description?: string; children?: React.ReactNode; }> = ({ label, description, children }) => (
    <div className="flex justify-between items-center py-4 border-b border-border">
        <div className="pr-4">
            <h4 className="font-medium text-foreground whitespace-nowrap">{label}</h4>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const SettingsSection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <section className="mt-8 first:mt-0">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
        <div className="mt-4">{children}</div>
    </section>
);


const ContentPage: React.FC<{ title: string; subtitle?: string; headerActions?: React.ReactNode; children: React.ReactNode }> = ({ title, subtitle, headerActions, children }) => (
    <div className="flex flex-col h-full">
        <header className="p-6 lg:p-8 flex-shrink-0 border-b border-border">
            <div className="flex items-center justify-between">
                 <div className="flex items-center min-w-0">
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-foreground truncate">{title}</h2>
                        {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
                    </div>
                </div>
                {headerActions && <div className="flex-shrink-0 ml-4">{headerActions}</div>}
            </div>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-8">
            {children}
        </div>
    </div>
);

// --- Settings Pages ---

const ManageAccountPage: React.FC<{ accountEmail: string; onBack: () => void }> = ({ accountEmail, onBack }) => {
    const [toggles, setToggles] = useState({ syncEmails: true, syncCalendars: false, syncTasks: true, syncContacts: false, autoCc: false, showImages: true, autoDownload: false });
    const [isSignatureEnabled, setIsSignatureEnabled] = useState(true);
    const [signature, setSignature] = useState('Best regards,\n\nHarry Potter');
    
    const headerActions = <Button variant="destructive" size="sm">Remove Account</Button>;
    
    return (
        <ContentPage title="Manage Account" subtitle={accountEmail} headerActions={headerActions}>
            <button onClick={onBack} className="text-sm text-primary mb-4 hover:underline">&larr; Back to Accounts</button>
            <SettingsSection title="Sync Settings">
                <SettingsItem label="Sync Emails"><ToggleSwitch checked={toggles.syncEmails} onChange={v => setToggles(s => ({...s, syncEmails: v}))} /></SettingsItem>
            </SettingsSection>
        </ContentPage>
    );
};

const AccountsPage: React.FC<{ onNavigate: (view: string, data?: any) => void }> = ({ onNavigate }) => {
    const { accounts } = useContext(AppContext);
    
    return (
        <ContentPage title="Accounts" headerActions={<Button size="sm">Add Account</Button>}>
            <SettingsSection title="Manage Accounts">
                {accounts.map(account => (
                    <div key={account.email} className="bg-secondary rounded-lg p-4 flex justify-between items-center mb-2">
                        <div>
                            <p className="font-semibold text-foreground">{account.name}</p>
                            <p className="text-sm text-muted-foreground">{account.email}</p>
                        </div>
                        <button onClick={() => onNavigate('manage-account', { email: account.email })} className="text-sm font-semibold text-primary hover:underline">Manage &rarr;</button>
                    </div>
                ))}
            </SettingsSection>
        </ContentPage>
    );
};


const GeneralSettingsPage: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => (
    <ContentPage title="General">
        <SettingsSection title="Appearance">
            <SettingsItem label="Theme">
                <Select value={theme} onChange={e => setTheme(e.target.value as Theme)} className="w-32">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                </Select>
            </SettingsItem>
        </SettingsSection>
    </ContentPage>
);

const NavItem: React.FC<{label: string, icon: string, isActive: boolean, onClick: () => void}> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md font-medium ${isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
        <i className={`${icon} w-5 text-center`}></i>
        <span>{label}</span>
    </button>
);

// --- Main Settings View ---

const SettingsView: React.FC = () => {
    const [page, setPage] = useState<{ view: string; data?: any }>({ view: 'general' });
    const { theme, setTheme } = useContext(AppContext);

    const renderPage = () => {
        switch (page.view) {
            case 'accounts':
                return <AccountsPage onNavigate={(view, data) => setPage({ view, data })} />;
            case 'manage-account':
                return <ManageAccountPage accountEmail={page.data?.email || ''} onBack={() => setPage({ view: 'accounts' })} />;
            case 'general':
            default:
                return <GeneralSettingsPage theme={theme} setTheme={setTheme} />;
        }
    };
    
    return (
        <div className="h-full w-full flex bg-background">
             <nav className="w-64 border-r border-border p-4 h-full overflow-y-auto shrink-0 hidden md:block">
                <h2 className="font-bold text-lg mb-4 px-3">Settings</h2>
                <ul className="space-y-1">
                    <li><NavItem label="General" icon="fa-solid fa-sliders" isActive={page.view === 'general'} onClick={() => setPage({ view: 'general' })} /></li>
                    <li><NavItem label="Accounts" icon="fa-solid fa-users" isActive={page.view.includes('account')} onClick={() => setPage({ view: 'accounts' })} /></li>
                </ul>
            </nav>
            <main className="flex-1 h-full overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
}

export default SettingsView;