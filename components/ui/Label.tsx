import React from 'react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
    <label className={cn("text-sm font-medium text-muted-foreground block mb-1.5", className)} {...props} />
);

export { Label };