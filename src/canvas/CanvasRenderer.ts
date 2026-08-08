import type { PhotoTransform } from '../types';
import { applyFilterToContext, resetFilter } from '../utils/filters';

export const COLORS = {
  bg: '#011C17',
  bg2: '#022C24',
  surface: '#03382E',
  surface2: '#06483A',
  surface3: '#075746',
  pink: '#FF2B78',
  yellow: '#FFD21F',
  sunset: '#FF7A18',
  green: '#52B788',
  cyan: '#00D9FF',
  cream: '#FFF7D6',
  muted: '#9ABDB3',
};

export function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawPhotoInCircle(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
  transform: PhotoTransform,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  drawTransformedPhoto(ctx, image, cx, cy, radius * 2, radius * 2, transform);
  ctx.restore();
}

export function drawPhotoInRect(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  transform: PhotoTransform,
  radius = 0,
): void {
  ctx.save();
  if (radius > 0) {
    drawRoundedRect(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  drawTransformedPhoto(ctx, image, x + w / 2, y + h / 2, w, h, transform);
  ctx.restore();
}

export function drawTransformedPhoto(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  cx: number,
  cy: number,
  boxW: number,
  boxH: number,
  transform: PhotoTransform,
): void {
  const { zoom, panX, panY, rotate, filter } = transform;

  applyFilterToContext(ctx, filter);

  const imgAspect = image.width / image.height;
  const boxAspect = boxW / boxH;
  let drawW: number;
  let drawH: number;

  if (imgAspect > boxAspect) {
    drawH = boxH * zoom;
    drawW = drawH * imgAspect;
  } else {
    drawW = boxW * zoom;
    drawH = drawW / imgAspect;
  }

  ctx.save();
  ctx.translate(cx + panX, cy + panY);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  resetFilter(ctx);
}

export function drawPalmTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
  color = COLORS.green,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Trunk
  ctx.fillStyle = '#3D5A3A';
  ctx.fillRect(-4, -60, 8, 60);

  // Leaves
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    ctx.save();
    ctx.translate(0, -60);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -25, 8, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

export function drawSun(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color = COLORS.sunset,
): void {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, COLORS.yellow);
  gradient.addColorStop(0.6, color);
  gradient.addColorStop(1, 'rgba(255, 122, 24, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Rays
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * (radius + 5), y + Math.sin(angle) * (radius + 5));
    ctx.lineTo(x + Math.cos(angle) * (radius + 20), y + Math.sin(angle) * (radius + 20));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function drawWaves(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  color = COLORS.cyan,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;

  for (let row = 0; row < 3; row++) {
    ctx.beginPath();
    for (let i = 0; i <= width; i += 10) {
      const waveY = y + row * 12 + Math.sin(i * 0.05 + row) * 4;
      if (i === 0) ctx.moveTo(x + i, waveY);
      else ctx.lineTo(x + i, waveY);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function drawPostageStamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  text: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.1);

  // Stamp border with perforated edge
  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, size - 4, size - 4);

  // Inner content
  ctx.fillStyle = COLORS.surface;
  ctx.fillRect(6, 6, size - 12, size - 12);

  ctx.fillStyle = COLORS.pink;
  ctx.font = `bold ${size * 0.12}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('GOA', size / 2, size * 0.35);
  ctx.fillStyle = COLORS.yellow;
  ctx.font = `${size * 0.08}px "DM Sans", sans-serif`;
  ctx.fillText(text, size / 2, size * 0.55);
  ctx.fillStyle = COLORS.green;
  ctx.font = `bold ${size * 0.1}px "Space Grotesk", sans-serif`;
  ctx.fillText('INDIA', size / 2, size * 0.75);

  ctx.restore();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color = COLORS.yellow,
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? size : size * 0.4;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawCodeSymbol(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color = COLORS.cyan,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y);
  ctx.lineTo(x - size / 4, y - size / 3);
  ctx.lineTo(x - size / 4, y + size / 3);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + size / 2, y);
  ctx.lineTo(x + size / 4, y - size / 3);
  ctx.lineTo(x + size / 4, y + size / 3);
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawSticker(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  rotation = -0.15,
  bgColor = COLORS.pink,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.font = 'bold 14px "Space Grotesk", sans-serif';
  const metrics = ctx.measureText(text);
  const padX = 12;
  const padY = 6;
  const w = metrics.width + padX * 2;
  const h = 24 + padY;

  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 4);
  ctx.fill();

  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

export function drawTicketBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  ctx.save();
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 4]);
  drawRoundedRect(ctx, x, y, w, h, 12);
  ctx.stroke();
  ctx.setLineDash([]);

  // Notches
  const notchR = 8;
  ctx.fillStyle = COLORS.bg;
  ctx.beginPath();
  ctx.arc(x, y + h / 2, notchR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w, y + h / 2, notchR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawGradientText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  align: CanvasTextAlign = 'center',
): void {
  ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  const gradient = ctx.createLinearGradient(x - 100, y, x + 100, y);
  gradient.addColorStop(0, COLORS.pink);
  gradient.addColorStop(0.5, COLORS.sunset);
  gradient.addColorStop(1, COLORS.yellow);

  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function drawEmptyState(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  subtitle: string,
): void {
  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, COLORS.surface);
  bgGrad.addColorStop(0.5, COLORS.surface2);
  bgGrad.addColorStop(1, COLORS.bg);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Sun
  drawSun(ctx, width / 2, height * 0.28, 50);

  // Palms
  drawPalmTree(ctx, width * 0.15, height * 0.55, 0.8);
  drawPalmTree(ctx, width * 0.85, height * 0.55, 0.8, COLORS.green);

  // Waves
  drawWaves(ctx, 0, height * 0.65, width);

  // Stars
  drawStar(ctx, width * 0.2, height * 0.15, 6);
  drawStar(ctx, width * 0.8, height * 0.2, 4);
  drawStar(ctx, width * 0.65, height * 0.1, 5);

  // Text
  drawGradientText(ctx, title, width / 2, height * 0.78, Math.min(22, width * 0.04));

  ctx.fillStyle = COLORS.muted;
  ctx.font = `${Math.min(14, width * 0.025)}px "DM Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(subtitle, width / 2, height * 0.85);

  // Decorative border
  ctx.strokeStyle = 'rgba(82, 183, 136, 0.3)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 10, 10, width - 20, height - 20, 16);
  ctx.stroke();
}
