import { Share2 } from 'lucide-react';
import type { AppMode, PfpStyle } from '../types';
import { getShareUrl } from '../utils/shareUtils';

interface ShareButtonProps {
  mode: AppMode;
  builderId?: string;
  pfpStyle?: PfpStyle;
  teamName?: string;
}

export function ShareButton({ mode, builderId, pfpStyle, teamName }: ShareButtonProps) {
  const handleShare = () => {
    const url = getShareUrl(mode, { builderId, pfpStyle, teamName });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn-secondary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm"
      aria-label="Share to X (Twitter)"
    >
      <Share2 className="h-5 w-5" aria-hidden="true" />
      Share to X
    </button>
  );
}
