import React from 'react';

interface EmailListHeaderProps {
    isSearching: boolean;
    selectedThreadIds: string[];
}

const EmailListHeader: React.FC<EmailListHeaderProps> = ({ 
    isSearching, 
    selectedThreadIds,
}) => {
  const isBulkMode = selectedThreadIds.length > 0;

  // This is the desktop-only header for search results.
  // It should only be visible when searching and not in bulk selection mode.
  if (!isSearching || isBulkMode) {
    return null;
  }

  return (
      <div className="p-3 border-b border-border flex-shrink-0 bg-background/80 backdrop-blur-lg block">
        <h1 className="text-xl font-bold text-foreground">Search Results</h1>
      </div>
  );
};

export default EmailListHeader;