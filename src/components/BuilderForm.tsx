import { Shuffle } from 'lucide-react';
import type { BuilderData } from '../types';
import { BUILDER_CLASSES, MOTTO_OPTIONS } from '../types';
import { generateBuilderId } from '../utils/idGenerator';

interface BuilderFormProps {
  data: BuilderData;
  onChange: (partial: Partial<BuilderData>) => void;
  onRandomize: () => void;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

function Field({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-goa-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="goa-input font-display uppercase"
      />
    </div>
  );
}

export function BuilderForm({ data, onChange, onRandomize }: BuilderFormProps) {
  return (
    <div className="goa-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
          Personal Details
        </h3>
        <button
          type="button"
          onClick={onRandomize}
          className="btn-secondary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
          aria-label="Randomize builder details"
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          Randomize Builder
        </button>
      </div>

      <div className="space-y-3">
        <Field
          label="Full Name"
          value={data.fullName}
          onChange={(v) => onChange({ fullName: v })}
          placeholder="ABHINAV SALOKHE"
        />
        <Field
          label="Primary Role / Title"
          value={data.role}
          onChange={(v) => onChange({ role: v })}
          placeholder="FULL STACK DEVELOPER"
        />
        <Field
          label="Builder Class / Persona"
          value={data.builderClass}
          onChange={(v) => onChange({ builderClass: v })}
          placeholder="TERMINAL WIZARD"
        />
        <Field
          label="Tech Stack / Skills"
          value={data.techStack}
          onChange={(v) => onChange({ techStack: v })}
          placeholder="REACT • NODE • JAVA"
        />
        <Field
          label="Team Vibes / Motto"
          value={data.motto}
          onChange={(v) => onChange({ motto: v })}
          placeholder="BUILD • SHIP • REPEAT"
        />
      </div>

      <div className="mt-4 rounded-lg border border-goa-green/20 bg-goa-bg/50 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-goa-muted">Builder ID</p>
        <p className="mt-1 font-display text-lg font-bold text-goa-yellow">{data.builderId}</p>
        <p className="mt-2 text-xs text-goa-muted">Event: {data.eventDate}</p>
      </div>
    </div>
  );
}

export function BuilderClassSelector({
  onSelect,
}: {
  onSelect: (cls: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {BUILDER_CLASSES.map((cls) => (
        <button
          key={cls}
          type="button"
          onClick={() => onSelect(cls)}
          className="rounded-md border border-goa-green/20 bg-goa-bg px-2 py-1 text-[10px] font-bold uppercase text-goa-muted transition hover:border-goa-pink hover:text-goa-cream"
        >
          {cls}
        </button>
      ))}
    </div>
  );
}

export function randomizeBuilder(data: BuilderData): BuilderData {
  return {
    ...data,
    builderClass: BUILDER_CLASSES[Math.floor(Math.random() * BUILDER_CLASSES.length)],
    builderId: generateBuilderId(),
    motto: MOTTO_OPTIONS[Math.floor(Math.random() * MOTTO_OPTIONS.length)],
  };
}
