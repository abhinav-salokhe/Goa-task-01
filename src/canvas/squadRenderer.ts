import type { SquadMember } from '../types';
import {
  COLORS,
  createCanvas,
  drawEmptyState,
  drawGradientText,
  drawPalmTree,
  drawPhotoInCircle,
  drawRoundedRect,
  drawStar,
  drawSun,
  drawWaves,
} from './CanvasRenderer';

const SQUAD_W = 1600;
const SQUAD_H = 1200;

interface SlotLayout {
  cx: number;
  cy: number;
  radius: number;
}

function getSlotLayouts(count: number): SlotLayout[] {
  switch (count) {
    case 2:
      return [
        { cx: SQUAD_W * 0.32, cy: SQUAD_H * 0.42, radius: 160 },
        { cx: SQUAD_W * 0.68, cy: SQUAD_H * 0.42, radius: 160 },
      ];
    case 3:
      return [
        { cx: SQUAD_W * 0.5, cy: SQUAD_H * 0.32, radius: 140 },
        { cx: SQUAD_W * 0.28, cy: SQUAD_H * 0.58, radius: 130 },
        { cx: SQUAD_W * 0.72, cy: SQUAD_H * 0.58, radius: 130 },
      ];
    case 4:
      return [
        { cx: SQUAD_W * 0.3, cy: SQUAD_H * 0.35, radius: 120 },
        { cx: SQUAD_W * 0.7, cy: SQUAD_H * 0.35, radius: 120 },
        { cx: SQUAD_W * 0.3, cy: SQUAD_H * 0.62, radius: 120 },
        { cx: SQUAD_W * 0.7, cy: SQUAD_H * 0.62, radius: 120 },
      ];
    default:
      return [];
  }
}

function drawSquadBackground(ctx: CanvasRenderingContext2D): void {
  const bgGrad = ctx.createLinearGradient(0, 0, SQUAD_W, SQUAD_H);
  bgGrad.addColorStop(0, '#011C17');
  bgGrad.addColorStop(0.3, '#03382E');
  bgGrad.addColorStop(0.7, '#06483A');
  bgGrad.addColorStop(1, '#022C24');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SQUAD_W, SQUAD_H);

  drawSun(ctx, SQUAD_W * 0.5, 80, 50);
  drawPalmTree(ctx, 60, SQUAD_H - 60, 1);
  drawPalmTree(ctx, SQUAD_W - 60, SQUAD_H - 60, 1);
  drawWaves(ctx, 0, SQUAD_H - 120, SQUAD_W);
  drawStar(ctx, 100, 60, 6);
  drawStar(ctx, SQUAD_W - 100, 50, 5);

  // Border
  ctx.strokeStyle = 'rgba(255, 210, 31, 0.4)';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 20, 20, SQUAD_W - 40, SQUAD_H - 40, 16);
  ctx.stroke();
}

function drawMemberSlot(
  ctx: CanvasRenderingContext2D,
  member: SquadMember,
  slot: SlotLayout,
): void {
  const { cx, cy, radius } = slot;

  // Ring
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
  ctx.stroke();

  if (member.photo.image) {
    drawPhotoInCircle(ctx, member.photo.image, cx, cy, radius, member.photo);
  } else {
    ctx.fillStyle = COLORS.surface;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.muted;
    ctx.font = '16px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', cx, cy + 6);
  }

  // Name
  if (member.name) {
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(member.name.toUpperCase(), cx, cy + radius + 35);
  }

  // Role
  if (member.role) {
    ctx.fillStyle = COLORS.cyan;
    ctx.font = '14px "DM Sans", sans-serif';
    ctx.fillText(member.role.toUpperCase(), cx, cy + radius + 58);
  }
}

export function renderSquadFrame(
  members: SquadMember[],
  teamName: string,
  teamMotto: string,
): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas(SQUAD_W, SQUAD_H);

  const validMembers = members.filter((m) => m.photo.image);
  if (validMembers.length < 2) {
    drawEmptyState(
      ctx,
      SQUAD_W,
      SQUAD_H,
      'YOUR SQUAD FRAME STARTS HERE',
      'Upload 2–4 photos to build your squad poster.',
    );
    return canvas;
  }

  drawSquadBackground(ctx);

  // Header
  drawGradientText(ctx, 'SQUAD BUILDER', SQUAD_W / 2, 140, 48);

  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 36px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(teamName.toUpperCase(), SQUAD_W / 2, 200);

  if (teamMotto) {
    ctx.fillStyle = COLORS.yellow;
    ctx.font = '18px "Space Grotesk", sans-serif';
    ctx.fillText(`"${teamMotto.toUpperCase()}"`, SQUAD_W / 2, 235);
  }

  // Divider
  const divGrad = ctx.createLinearGradient(SQUAD_W * 0.2, 0, SQUAD_W * 0.8, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.5, COLORS.pink);
  divGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(SQUAD_W * 0.15, 260);
  ctx.lineTo(SQUAD_W * 0.85, 260);
  ctx.stroke();

  const layouts = getSlotLayouts(validMembers.length);
  validMembers.forEach((member, i) => {
    if (layouts[i]) {
      drawMemberSlot(ctx, member, layouts[i]);
    }
  });

  // Footer
  ctx.fillStyle = COLORS.green;
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUILD TOGETHER • SHIP FROM GOA', SQUAD_W / 2, SQUAD_H - 60);

  const barGrad = ctx.createLinearGradient(0, SQUAD_H - 30, SQUAD_W, SQUAD_H - 30);
  barGrad.addColorStop(0, COLORS.pink);
  barGrad.addColorStop(0.5, COLORS.sunset);
  barGrad.addColorStop(1, COLORS.yellow);
  ctx.fillStyle = barGrad;
  ctx.fillRect(40, SQUAD_H - 35, SQUAD_W - 80, 4);

  return canvas;
}

export { SQUAD_W, SQUAD_H };
