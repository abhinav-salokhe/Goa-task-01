import { useCallback, useRef, useState } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { processUploadedFile } from '../utils/imageUtils';

interface UploadZoneProps {
  onUpload: (image: HTMLImageElement, url: string) => void;
  onError: (message: string) => void;
  label?: string;
  compact?: boolean;
}

export function UploadZone({
  onUpload,
  onError,
  label = 'Upload Photo',
  compact = false,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const { image, url } = await processUploadedFile(file);
        onUpload(image, url);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to upload image');
      } finally {
        setIsLoading(false);
      }
    },
    [onUpload, onError],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="goa-card p-4">
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-goa-muted">
        {label}
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload photo area. Click or drag and drop an image."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
          compact ? 'px-4 py-6' : 'px-6 py-10'
        } ${
          isDragging
            ? 'border-goa-pink bg-goa-pink/10'
            : 'border-goa-green/30 bg-goa-bg/50 hover:border-goa-pink/50 hover:bg-goa-surface/50'
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-goa-pink" aria-hidden="true" />
        ) : (
          <>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-goa-surface-2">
              {isDragging ? (
                <ImageIcon className="h-6 w-6 text-goa-pink" aria-hidden="true" />
              ) : (
                <Upload className="h-6 w-6 text-goa-green" aria-hidden="true" />
              )}
            </div>
            <p className="font-display text-sm font-bold uppercase text-goa-cream">
              Drop your photo here
            </p>
            <p className="mt-1 text-xs text-goa-muted">or click to browse</p>
            {!compact && (
              <p className="mt-3 text-center text-[11px] text-goa-muted/80">
                Supports portrait, landscape, off-center crops & iPhone HEIC
              </p>
            )}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          className="sr-only"
          aria-hidden="true"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
