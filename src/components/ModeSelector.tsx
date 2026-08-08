import { UserCircle, IdCard, Users } from 'lucide-react';
import type { AppMode } from '../types';

interface ModeSelectorProps {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

const MODES: {
  id: AppMode;
  label: string;
  format: string;
  description: string;
  icon: typeof UserCircle;
}[] = [
  {
    id: 'pfp',
    format: 'FORMAT A',
    label: 'PFP FRAME',
    description: 'Profile picture frame with tropical styles',
    icon: UserCircle,
  },
  {
    id: 'builder',
    format: 'FORMAT B',
    label: 'BUILDER ID',
    description: 'Collectible developer pass card',
    icon: IdCard,
  },
  {
    id: 'squad',
    format: 'FORMAT C',
    label: 'SQUAD FRAME',
    description: 'Team poster for 2–4 builders',
    icon: Users,
  },
];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-3 animate-slide-up"
      role="tablist"
      aria-label="Generator mode"
    >
      {MODES.map((m) => {
        const Icon = m.icon;
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${m.id}`}
            onClick={() => onChange(m.id)}
            className={`group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-300 ${
              isActive
                ? 'tab-active border-goa-pink/50'
                : 'border-goa-green/20 bg-goa-surface/60 hover:border-goa-green/40 hover:bg-goa-surface'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-goa-muted">
                {m.format}
              </span>
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? 'text-goa-pink' : 'text-goa-muted group-hover:text-goa-green'
                }`}
                aria-hidden="true"
              />
            </div>
            <span className="font-display text-lg font-bold uppercase tracking-tight text-goa-cream">
              {m.label}
            </span>
            <span className="text-xs text-goa-muted">{m.description}</span>
          </button>
        );
      })}
    </div>
  );
}
