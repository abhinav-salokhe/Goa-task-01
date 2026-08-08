import { useEffect, useRef } from 'react';
import type { PhotoTransform, PfpStyle } from '../types';
import { renderPfpFrame } from '../canvas/pfpRenderer';

interface PfpPreviewProps {
  photo: HTMLImageElement | null;
  transform: PhotoTransform;
  style: PfpStyle;
  sticker: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function PfpPreview({
  photo,
  transform,
  style,
  sticker,
  onCanvasReady,
}: PfpPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = renderPfpFrame(photo, transform, style, sticker);
    const preview = canvasRef.current;
    if (preview) {
      const ctx = preview.getContext('2d');
      if (ctx) {
        preview.width = canvas.width;
        preview.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
      }
    }
    onCanvasReady?.(canvas);
  }, [photo, transform, style, sticker, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto h-auto max-h-[70vh] w-full max-w-md rounded-xl shadow-2xl"
      aria-label="PFP frame preview"
    />
  );
}
