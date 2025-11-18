import React from 'react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const GlassCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={cn(
      // Base Styles
      'backdrop-blur-2xl rounded-2xl shadow-xl transition-all duration-300',
      // Use CSS variables for theme-awareness
      'bg-card text-card-foreground border border-border hover:bg-accent',
      className
    )}
    {...props}
  />
);
// Subcomponents for consistency with other card types
const GlassCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 sm:p-6', className)} {...props} />
);

const GlassCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 sm:p-6 pt-0', className)} {...props} />
);

const GlassCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center p-4 sm:p-6 pt-0', className)} {...props} />
);

export { GlassCard, GlassCardHeader, GlassCardContent, GlassCardFooter };