import { useEffect, useRef } from 'react';
import type { SquadMember } from '../types';
import { renderSquadFrame } from '../canvas/squadRenderer';

interface SquadPreviewProps {
  members: SquadMember[];
  teamName: string;
  teamMotto: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function SquadPreview({
  members,
  teamName,
  teamMotto,
  onCanvasReady,
}: SquadPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = renderSquadFrame(members, teamName, teamMotto);
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
  }, [members, teamName, teamMotto, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="h-auto max-h-[70vh] w-full rounded-xl shadow-2xl"
      aria-label="Squad frame preview"
    />
  );
}
