import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => Promise<void>;
  filename: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function DownloadButton({
  onDownload,
  filename,
  disabled = false,
  isLoading = false,
}: DownloadButtonProps) {
  return (
    <button
      type="button"
      onClick={onDownload}
      disabled={disabled || isLoading}
      className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={`Download ${filename}`}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-5 w-5" aria-hidden="true" />
      )}
      Download PNG
    </button>
  );
}
