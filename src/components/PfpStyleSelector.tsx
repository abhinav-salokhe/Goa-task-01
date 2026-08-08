import type { PfpStyle } from '../types';
import { PFP_STYLES } from '../types';

interface PfpStyleSelectorProps {
  value: PfpStyle;
  onChange: (style: PfpStyle) => void;
}

const STYLE_COLORS: Record<PfpStyle, string> = {
  'tropical-sunset': 'from-goa-pink via-goa-sunset to-goa-green',
  'goa-postcard': 'from-goa-cream via-goa-surface to-goa-pink',
  'golden-sun': 'from-goa-yellow via-goa-sunset to-goa-pink',
  'cyber-beach': 'from-goa-cyan via-goa-bg to-goa-pink',
};

export function PfpStyleSelector({ value, onChange }: PfpStyleSelectorProps) {
  return (
    <div className="goa-card p-4">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
        Frame Style
      </h3>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="PFP frame style">
        {PFP_STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={value === s.id}
            onClick={() => onChange(s.id)}
            className={`relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
              value === s.id
                ? 'border-goa-pink shadow-lg shadow-goa-pink/20'
                : 'border-goa-green/20 hover:border-goa-green/50'
            }`}
          >
            <div
              className={`mb-2 h-8 rounded-lg bg-gradient-to-r ${STYLE_COLORS[s.id]}`}
              aria-hidden="true"
            />
            <p className="text-xs font-bold uppercase text-goa-cream">{s.label}</p>
            <p className="mt-0.5 text-[10px] text-goa-muted">{s.description}</p>
            {value === s.id && (
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-goa-pink" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
