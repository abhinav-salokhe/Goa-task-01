import type { FilterPreset } from '../types';
import { FILTER_OPTIONS } from '../types';

interface FilterSelectorProps {
  value: FilterPreset;
  onChange: (filter: FilterPreset) => void;
}

export function FilterSelector({ value, onChange }: FilterSelectorProps) {
  return (
    <div className="goa-card p-4">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
        Photo Filters
      </h3>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Photo filter">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={value === f.id}
            onClick={() => onChange(f.id)}
            className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              value === f.id
                ? 'bg-gradient-to-r from-goa-pink to-goa-sunset text-goa-bg shadow-md'
                : 'border border-goa-green/30 bg-goa-bg text-goa-muted hover:border-goa-green hover:text-goa-cream'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
