import { Plus, X } from 'lucide-react';
import type { SquadMember } from '../types';
import { UploadZone } from './UploadZone';
import { revokeImageUrl } from '../utils/imageUtils';

interface SquadUploaderProps {
  members: SquadMember[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onPhotoUpload: (id: string, image: HTMLImageElement, url: string) => void;
  onMemberChange: (id: string, partial: Partial<SquadMember>) => void;
  onError: (message: string) => void;
}

export function SquadUploader({
  members,
  onAdd,
  onRemove,
  onPhotoUpload,
  onMemberChange,
  onError,
}: SquadUploaderProps) {
  return (
    <div className="space-y-4">
      {members.map((member, index) => (
        <div key={member.id} className="goa-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-display text-sm font-bold uppercase text-goa-cream">
              Member {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => {
                revokeImageUrl(member.photo.imageUrl);
                onRemove(member.id);
              }}
              className="rounded-lg p-1.5 text-goa-muted transition hover:bg-goa-pink/20 hover:text-goa-pink"
              aria-label={`Remove member ${index + 1}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <UploadZone
            compact
            label={`Photo ${index + 1}`}
            onUpload={(image, url) => onPhotoUpload(member.id, image, url)}
            onError={onError}
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-goa-muted">
                Name
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => onMemberChange(member.id, { name: e.target.value })}
                placeholder="Optional"
                className="goa-input text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-goa-muted">
                Role
              </label>
              <input
                type="text"
                value={member.role}
                onChange={(e) => onMemberChange(member.id, { role: e.target.value })}
                placeholder="Optional"
                className="goa-input text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      {members.length < 4 && (
        <button
          type="button"
          onClick={onAdd}
          className="btn-secondary flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm"
          aria-label="Add squad member"
        >
          <Plus className="h-4 w-4" />
          Add Member ({members.length}/4)
        </button>
      )}
    </div>
  );
}

interface SquadFormProps {
  teamName: string;
  teamMotto: string;
  onChange: (partial: { teamName?: string; teamMotto?: string }) => void;
}

export function SquadForm({ teamName, teamMotto, onChange }: SquadFormProps) {
  return (
    <div className="goa-card p-4">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-goa-cream">
        Squad Details
      </h3>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-goa-muted">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => onChange({ teamName: e.target.value })}
            placeholder="GOA CODE CREW"
            className="goa-input font-display uppercase"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-goa-muted">
            Team Motto (Optional)
          </label>
          <input
            type="text"
            value={teamMotto}
            onChange={(e) => onChange({ teamMotto: e.target.value })}
            placeholder="BUILD TOGETHER"
            className="goa-input font-display uppercase"
          />
        </div>
      </div>
    </div>
  );
}
