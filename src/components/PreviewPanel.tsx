import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';

interface PreviewPanelProps {
  children: ReactNode;
  label?: string;
}

export function PreviewPanel({ children, label = 'Live Preview' }: PreviewPanelProps) {
  return (
    <div className="goa-card flex flex-col p-4 md:p-6 animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <Eye className="h-4 w-4 text-goa-pink" aria-hidden="true" />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
          {label}
        </h3>
        <span className="ml-auto rounded-full bg-goa-green/20 px-2 py-0.5 text-[10px] font-bold uppercase text-goa-green">
          Real-time
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-goa-bg/50 p-2">
        {children}
      </div>
    </div>
  );
}
