import { STICKER_OPTIONS } from '../types';

interface StickerSelectorProps {
  value: string;
  onChange: (sticker: string) => void;
}

export function StickerSelector({ value, onChange }: StickerSelectorProps) {
  return (
    <div className="goa-card p-4">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
        Custom Corner Sticker
      </h3>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="BUILDER"
        className="goa-input mb-3 font-display uppercase"
        aria-label="Custom corner sticker text"
        maxLength={16}
      />
      <div className="flex flex-wrap gap-1.5">
        {STICKER_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
              value === s
                ? 'bg-goa-pink text-goa-cream'
                : 'border border-goa-green/30 bg-goa-bg text-goa-muted hover:border-goa-pink hover:text-goa-cream'
            }`}
          >
            +{s}
          </button>
        ))}
      </div>
    </div>
  );
}
