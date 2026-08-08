import { RotateCcw } from 'lucide-react';
import type { PhotoTransform } from '../types';
import { DEFAULT_PHOTO_TRANSFORM } from '../types';

interface PhotoControlsProps {
  transform: PhotoTransform;
  onChange: (partial: Partial<PhotoTransform>) => void;
  onReset: () => void;
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  display: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderControl({ label, value, min, max, step, display, onChange }: SliderControlProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-goa-muted">{label}</label>
        <span className="font-mono text-xs text-goa-yellow">{display(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="goa-slider"
        aria-label={label}
      />
    </div>
  );
}

export function PhotoControls({ transform, onChange, onReset }: PhotoControlsProps) {
  return (
    <div className="goa-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
          Photo Adjustments
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
          aria-label="Reset photo adjustments"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <SliderControl
          label="Zoom"
          value={transform.zoom}
          min={0.5}
          max={3}
          step={0.05}
          unit="x"
          display={(v) => `${v.toFixed(1)}x`}
          onChange={(v) => onChange({ zoom: v })}
        />
        <SliderControl
          label="Pan X"
          value={transform.panX}
          min={-300}
          max={300}
          step={1}
          unit="px"
          display={(v) => `${v}px`}
          onChange={(v) => onChange({ panX: v })}
        />
        <SliderControl
          label="Pan Y"
          value={transform.panY}
          min={-300}
          max={300}
          step={1}
          unit="px"
          display={(v) => `${v}px`}
          onChange={(v) => onChange({ panY: v })}
        />
        <SliderControl
          label="Rotate"
          value={transform.rotate}
          min={-180}
          max={180}
          step={1}
          unit="°"
          display={(v) => `${v}°`}
          onChange={(v) => onChange({ rotate: v })}
        />
      </div>
    </div>
  );
}

export function PhotoEditor(props: PhotoControlsProps) {
  return <PhotoControls {...props} />;
}

export { DEFAULT_PHOTO_TRANSFORM };
