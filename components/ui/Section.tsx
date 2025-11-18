import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mt-12 first:mt-0">
        <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2 mb-6">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </section>
);

export { Section };