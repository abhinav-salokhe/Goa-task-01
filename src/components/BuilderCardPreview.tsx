import { useEffect, useRef } from 'react';
import type { BuilderData, PhotoTransform } from '../types';
import { renderBuilderCard } from '../canvas/builderCardRenderer';

interface BuilderCardPreviewProps {
  photo: HTMLImageElement | null;
  transform: PhotoTransform;
  data: BuilderData;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function BuilderCardPreview({
  photo,
  transform,
  data,
  onCanvasReady,
}: BuilderCardPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const canvas = await renderBuilderCard(photo, transform, data);
      if (cancelled) return;

      exportCanvasRef.current = canvas;

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
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [photo, transform, data, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="h-auto max-h-[70vh] w-full rounded-xl shadow-2xl"
      aria-label="Builder ID card preview"
    />
  );
}

export function getBuilderExportCanvas(): HTMLCanvasElement | null {
  return null;
}
