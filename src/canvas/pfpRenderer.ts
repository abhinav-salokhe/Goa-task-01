import type { PhotoTransform, PfpStyle } from '../types';
import {
  COLORS,
  createCanvas,
  drawCodeSymbol,
  drawEmptyState,
  drawGradientText,
  drawPalmTree,
  drawPhotoInCircle,
  drawPostageStamp,
  drawRoundedRect,
  drawStar,
  drawSticker,
  drawSun,
  drawWaves,
} from './CanvasRenderer';

const PFP_SIZE = 1080;

function drawTropicalSunsetFrame(ctx: CanvasRenderingContext2D, size: number): void {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
  bgGrad.addColorStop(0, '#FF2B78');
  bgGrad.addColorStop(0.3, '#FF7A18');
  bgGrad.addColorStop(0.6, '#FFD21F');
  bgGrad.addColorStop(1, '#52B788');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  drawSun(ctx, size * 0.5, size * 0.25, size * 0.12, COLORS.sunset);
  drawPalmTree(ctx, size * 0.08, size * 0.85, 0.7);
  drawPalmTree(ctx, size * 0.92, size * 0.85, 0.7);
  drawWaves(ctx, 0, size * 0.78, size, COLORS.cream);
  drawStar(ctx, size * 0.15, size * 0.12, size * 0.015);
  drawStar(ctx, size * 0.85, size * 0.08, size * 0.012);
}

function drawGoaPostcardFrame(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, size, size);

  // Vintage border
  ctx.strokeStyle = COLORS.surface;
  ctx.lineWidth = size * 0.02;
  ctx.strokeRect(size * 0.03, size * 0.03, size * 0.94, size * 0.94);

  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = size * 0.005;
  ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);

  // Postcard header
  ctx.fillStyle = COLORS.surface;
  ctx.fillRect(0, 0, size, size * 0.08);

  ctx.fillStyle = COLORS.cream;
  ctx.font = `bold ${size * 0.035}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('GOA POSTCARD', size / 2, size * 0.055);

  drawPostageStamp(ctx, size * 0.75, size * 0.02, size * 0.12, '2026');
  drawPostageStamp(ctx, size * 0.02, size * 0.82, size * 0.1, 'GOA');

  // Decorative lines
  ctx.strokeStyle = 'rgba(255, 43, 120, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(size * 0.1, size * 0.15 + i * size * 0.03);
    ctx.lineTo(size * 0.4, size * 0.15 + i * size * 0.03);
    ctx.stroke();
  }
}

function drawGoldenSunFrame(ctx: CanvasRenderingContext2D, size: number): void {
  const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.7);
  bgGrad.addColorStop(0, '#FFD21F');
  bgGrad.addColorStop(0.4, '#FF7A18');
  bgGrad.addColorStop(0.8, '#FF2B78');
  bgGrad.addColorStop(1, '#022C24');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  drawSun(ctx, size / 2, size / 2, size * 0.35, COLORS.yellow);

  // Golden ring
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = size * 0.015;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 247, 214, 0.5)';
  ctx.lineWidth = size * 0.005;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  drawStar(ctx, size * 0.1, size * 0.1, size * 0.02, COLORS.cream);
  drawStar(ctx, size * 0.9, size * 0.15, size * 0.015, COLORS.cream);
  drawStar(ctx, size * 0.85, size * 0.9, size * 0.018, COLORS.cream);
}

function drawCyberBeachFrame(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, size, size);

  // Neon grid
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.15)';
  ctx.lineWidth = 1;
  const gridSize = size / 20;
  for (let i = 0; i <= 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(size, i * gridSize);
    ctx.stroke();
  }

  // Neon glow border
  const glowGrad = ctx.createLinearGradient(0, 0, size, size);
  glowGrad.addColorStop(0, COLORS.cyan);
  glowGrad.addColorStop(0.5, COLORS.pink);
  glowGrad.addColorStop(1, COLORS.cyan);

  ctx.shadowColor = COLORS.cyan;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = glowGrad;
  ctx.lineWidth = size * 0.012;
  drawRoundedRect(ctx, size * 0.02, size * 0.02, size * 0.96, size * 0.96, size * 0.04);
  ctx.stroke();
  ctx.shadowBlur = 0;

  drawWaves(ctx, 0, size * 0.85, size, COLORS.cyan);
  drawCodeSymbol(ctx, size * 0.08, size * 0.08, size * 0.06, COLORS.pink);
  drawCodeSymbol(ctx, size * 0.92, size * 0.92, size * 0.05, COLORS.cyan);

  // Corner accents
  ctx.fillStyle = COLORS.pink;
  ctx.globalAlpha = 0.6;
  ctx.fillRect(0, 0, size * 0.06, size * 0.006);
  ctx.fillRect(0, 0, size * 0.006, size * 0.06);
  ctx.fillRect(size * 0.94, size * 0.94, size * 0.06, size * 0.006);
  ctx.fillRect(size * 0.994, size * 0.94, size * 0.006, size * 0.06);
  ctx.globalAlpha = 1;
}

function drawFrameByStyle(ctx: CanvasRenderingContext2D, size: number, style: PfpStyle): void {
  switch (style) {
    case 'tropical-sunset':
      drawTropicalSunsetFrame(ctx, size);
      break;
    case 'goa-postcard':
      drawGoaPostcardFrame(ctx, size);
      break;
    case 'golden-sun':
      drawGoldenSunFrame(ctx, size);
      break;
    case 'cyber-beach':
      drawCyberBeachFrame(ctx, size);
      break;
  }
}

export function renderPfpFrame(
  photo: HTMLImageElement | null,
  transform: PhotoTransform,
  style: PfpStyle,
  sticker: string,
): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas(PFP_SIZE, PFP_SIZE);

  if (!photo) {
    drawEmptyState(ctx, PFP_SIZE, PFP_SIZE, 'YOUR PFP FRAME STARTS HERE', 'Upload a photo and pick a frame style.');
    return canvas;
  }

  drawFrameByStyle(ctx, PFP_SIZE, style);

  const photoRadius = PFP_SIZE * 0.32;
  const cx = PFP_SIZE / 2;
  const cy = PFP_SIZE / 2;

  // Inner shadow ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 4, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  drawPhotoInCircle(ctx, photo, cx, cy, photoRadius, transform);

  // Outer ring
  ctx.strokeStyle = COLORS.cream;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 2, 0, Math.PI * 2);
  ctx.stroke();

  // Sticker
  if (sticker) {
    drawSticker(ctx, sticker, PFP_SIZE * 0.82, PFP_SIZE * 0.82, -0.2, COLORS.pink);
  }

  // Style label
  const styleLabels: Record<PfpStyle, string> = {
    'tropical-sunset': 'TROPICAL SUNSET',
    'goa-postcard': 'GOA POSTCARD',
    'golden-sun': 'GOLDEN SUN',
    'cyber-beach': 'CYBER BEACH',
  };

  ctx.fillStyle = 'rgba(1, 28, 23, 0.7)';
  drawRoundedRect(ctx, PFP_SIZE * 0.25, PFP_SIZE * 0.02, PFP_SIZE * 0.5, PFP_SIZE * 0.06, 8);
  ctx.fill();

  drawGradientText(ctx, styleLabels[style], PFP_SIZE / 2, PFP_SIZE * 0.05, PFP_SIZE * 0.028);

  return canvas;
}

export { PFP_SIZE };
