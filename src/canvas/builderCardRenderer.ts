import type { BuilderData, PhotoTransform } from '../types';
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
  drawTicketBorder,
  drawWaves,
  drawSticker,
} from './CanvasRenderer';
import { loadQRCodeImage } from '../utils/qrGenerator';

const CARD_W = 1200;
const CARD_H = 1500;

// Local helpers for advanced details
function drawBackgroundGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(82, 183, 136, 0.04)'; // faint green grid
  ctx.lineWidth = 1;
  const spacing = 40;
  for (let x = 60; x < w - 60; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 60);
    ctx.lineTo(x, h - 60);
    ctx.stroke();
  }
  for (let y = 60; y < h - 60; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(w - 60, y);
    ctx.stroke();
  }
}

function drawCornerRegistrationMarks(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(255, 247, 214, 0.2)'; // faint cream
  ctx.lineWidth = 1.5;
  const margin = 70;
  const size = 16;
  const corners = [
    { x: margin, y: margin },
    { x: w - margin, y: margin },
    { x: margin, y: h - margin },
    { x: w - margin, y: h - margin }
  ];
  corners.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawPostmarkCancellation(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.strokeStyle = 'rgba(255, 43, 120, 0.25)'; // pink ink cancellation
  ctx.lineWidth = 2.5;
  // Wavy cancellation lines
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    for (let x = cx - 140; x <= cx + 140; x += 10) {
      const y = cy + i * 14 + Math.sin((x - cx) * 0.04) * 6;
      if (x === cx - 140) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Circular post office ink stamp
  ctx.beginPath();
  ctx.arc(cx - 40, cy + 30, 45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 43, 120, 0.35)';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('COASTAL MAIL', cx - 40, cy + 18);
  ctx.fillText('★ GOA ★', cx - 40, cy + 30);
  ctx.fillText('28.10.2026', cx - 40, cy + 42);
}

function drawTravelStamp(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, rotation = 0.2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)'; // Cyan stamp
  ctx.lineWidth = 3;
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  const metrics = ctx.measureText(text);
  const w = metrics.width + 20;
  const h = 32;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = 'rgba(0, 217, 255, 0.35)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export async function renderBuilderCard(
  photo: HTMLImageElement | null,
  transform: PhotoTransform,
  data: BuilderData,
): Promise<HTMLCanvasElement> {
  const [canvas, ctx] = createCanvas(CARD_W, CARD_H);

  if (!photo) {
    drawEmptyState(ctx, CARD_W, CARD_H, 'YOUR BUILDER ID STARTS HERE', 'Upload a photo and build your Goa identity.');
    return canvas;
  }

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bgGrad.addColorStop(0, '#022C24');
  bgGrad.addColorStop(0.3, '#03382E');
  bgGrad.addColorStop(0.7, '#06483A');
  bgGrad.addColorStop(1, '#011C17');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // 2. Texture & Grids
  drawBackgroundGrid(ctx, CARD_W, CARD_H);
  drawCornerRegistrationMarks(ctx, CARD_W, CARD_H);

  // Micro code symbols in background
  drawCodeSymbol(ctx, 120, 250, 24);
  drawCodeSymbol(ctx, CARD_W - 120, 680, 20);
  drawStar(ctx, 150, 620, 5, COLORS.yellow);
  drawStar(ctx, CARD_W - 180, 260, 6, COLORS.pink);

  // Ticket border around the whole pass
  drawTicketBorder(ctx, 40, 40, CARD_W - 80, CARD_H - 80);

  // Inner card background
  ctx.fillStyle = 'rgba(3, 56, 46, 0.4)';
  drawRoundedRect(ctx, 60, 60, CARD_W - 120, CARD_H - 120, 20);
  ctx.fill();

  // 3. TOP HEADER SECTION
  // Left: GOA BUILDER & Date/Collectible text
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 50px "Space Grotesk", sans-serif';
  ctx.fillText('GOA BUILDER', 90, 135);

  ctx.fillStyle = COLORS.pink;
  ctx.font = 'bold 22px "Space Grotesk", sans-serif';
  ctx.fillText('TROPICAL DEVELOPER PASS', 460, 130);

  ctx.fillStyle = COLORS.muted;
  ctx.font = 'bold 12px monospace';
  ctx.fillText('OFFICIAL CONFLICT-FREE COLLECTIBLE // EST. 2026', 90, 175);
  ctx.fillText('DATE: 28-31 OCT 2026 // LOC: GOA, INDIA', 460, 175);

  // Right: Postage stamp + cancellation mark
  const stampX = CARD_W - 220;
  const stampY = 85;
  const stampSize = 130;
  drawPostageStamp(ctx, stampX, stampY, stampSize, 'PASS');
  drawPostmarkCancellation(ctx, stampX + stampSize / 2, stampY + stampSize / 2);

  // Divider line under header
  ctx.strokeStyle = 'rgba(255, 247, 214, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 215);
  ctx.lineTo(CARD_W - 90, 215);
  ctx.stroke();

  // 4. MAIN IDENTITY SECTION
  const identityY = 250;
  const identityH = 340;

  // Background for identity section
  ctx.fillStyle = 'rgba(6, 72, 58, 0.3)';
  drawRoundedRect(ctx, 90, identityY, 1020, identityH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 247, 214, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left: Portrait Photo Frame (CX=270, CY=420)
  const photoCx = 270;
  const photoCy = identityY + identityH / 2;
  const photoR = 120;

  // Render multi-layered rings around portrait
  ctx.strokeStyle = COLORS.cream;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR + 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR + 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR + 18, 0, Math.PI * 2);
  ctx.stroke();

  drawPhotoInCircle(ctx, photo, photoCx, photoCy, photoR, transform);

  // Rotated sticker overlapping the portrait frame (top left offset)
  drawSticker(ctx, '+BUILDER', photoCx - 90, photoCy - 90, -0.15, COLORS.pink);

  // Right: Name, Role, Divider, Builder Class badge
  const textStartX = 440;
  ctx.textAlign = 'left';

  // Name (Autoscale text size to fit block if very long)
  let nameFontSize = 58;
  const maxNameWidth = 620;
  ctx.font = `bold ${nameFontSize}px "Space Grotesk", sans-serif`;
  while (ctx.measureText(data.fullName.toUpperCase()).width > maxNameWidth && nameFontSize > 36) {
    nameFontSize -= 4;
    ctx.font = `bold ${nameFontSize}px "Space Grotesk", sans-serif`;
  }
  ctx.fillStyle = COLORS.cream;
  ctx.fillText(data.fullName.toUpperCase(), textStartX, identityY + 95);

  // Role
  ctx.fillStyle = COLORS.cyan;
  ctx.font = '600 24px "Space Grotesk", sans-serif';
  ctx.fillText(data.role.toUpperCase(), textStartX, identityY + 140);

  // Small separator
  const badgeSepY = identityY + 165;
  ctx.strokeStyle = 'rgba(255, 43, 120, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(textStartX, badgeSepY);
  ctx.lineTo(textStartX + 200, badgeSepY);
  ctx.stroke();

  // Builder Class Ticket/Pill
  ctx.fillStyle = COLORS.muted;
  ctx.font = 'bold 11px monospace';
  ctx.fillText('BUILDER CLASS', textStartX, identityY + 205);

  const pillX = textStartX;
  const pillY = identityY + 220;
  const pillW = 420;
  const pillH = 70;
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
  pillGrad.addColorStop(0, COLORS.pink);
  pillGrad.addColorStop(0.5, COLORS.sunset);
  pillGrad.addColorStop(1, COLORS.yellow);

  ctx.fillStyle = pillGrad;
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 12);
  ctx.fill();

  ctx.strokeStyle = COLORS.cream;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ticket notch circles inside the pill for physical badge aesthetic
  ctx.fillStyle = 'rgba(6, 72, 58, 1)';
  ctx.beginPath();
  ctx.arc(pillX, pillY + pillH / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(pillX + pillW, pillY + pillH / 2, 6, 0, Math.PI * 2);
  ctx.fill();

  // Class Text
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.builderClass.toUpperCase(), pillX + pillW / 2, pillY + pillH / 2);

  // Restore text alignment
  ctx.textBaseline = 'alphabetic';

  // 5. TECH STACK SECTION
  const techY = 620;
  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.muted;
  ctx.font = 'bold 12px monospace';
  ctx.fillText('DEVELOPER TECH STACK // TRAVEL TAGS', 90, techY + 30);

  // Parse tech stack into individual tags
  // Usually bullet-separated (•), comma-separated, or space-separated
  const tags = data.techStack
    .split(/[•,]/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  let curX = 90;
  let curY = techY + 45;
  const tagH = 46;
  const tagGapX = 12;
  const tagGapY = 10;
  const tagPadX = 18;

  ctx.font = 'bold 16px monospace';
  tags.forEach(tagText => {
    const textW = ctx.measureText(tagText.toUpperCase()).width;
    const tagW = textW + tagPadX * 2 + 10; // Extra room for a tiny symbol

    // Wrap tag if it overflows card boundary
    if (curX + tagW > CARD_W - 90) {
      curX = 90;
      curY += tagH + tagGapY;
    }

    // Draw Tag
    ctx.fillStyle = 'rgba(3, 56, 46, 0.9)';
    drawRoundedRect(ctx, curX, curY, tagW, tagH, 6);
    ctx.fill();

    // Border
    ctx.strokeStyle = COLORS.yellow;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Decorative pink indicator strip on left of tag
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(curX + 1, curY + 6, 4, tagH - 12);

    // Render Text
    ctx.fillStyle = COLORS.cream;
    ctx.textAlign = 'left';
    ctx.fillText(tagText.toUpperCase(), curX + tagPadX + 4, curY + 28);

    curX += tagW + tagGapX;
  });

  // 6. MOTTO SECTION
  // Slogan strip across the card
  const mottoY = 810;
  const mottoH = 64;
  const mottoGrad = ctx.createLinearGradient(90, mottoY, CARD_W - 90, mottoY);
  mottoGrad.addColorStop(0, 'rgba(255, 43, 120, 0.15)');
  mottoGrad.addColorStop(0.5, 'rgba(255, 210, 31, 0.08)');
  mottoGrad.addColorStop(1, 'rgba(0, 217, 255, 0.15)');

  ctx.fillStyle = mottoGrad;
  drawRoundedRect(ctx, 90, mottoY, CARD_W - 180, mottoH, 8);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 247, 214, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Top/bottom neon highlight borders inside strip
  ctx.strokeStyle = COLORS.pink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(110, mottoY + 2);
  ctx.lineTo(CARD_W - 110, mottoY + 2);
  ctx.stroke();

  ctx.strokeStyle = COLORS.yellow;
  ctx.beginPath();
  ctx.moveTo(110, mottoY + mottoH - 2);
  ctx.lineTo(CARD_W - 110, mottoY + mottoH - 2);
  ctx.stroke();

  // Draw motto text centered in the strip
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = COLORS.cream;
  ctx.font = 'italic bold 22px "Space Grotesk", sans-serif';
  ctx.fillText(`“ ${data.motto.toUpperCase()} ”`, CARD_W / 2, mottoY + mottoH / 2);

  // Tiny graphic star details inside the motto strip
  drawStar(ctx, 130, mottoY + mottoH / 2, 6, COLORS.yellow);
  drawStar(ctx, CARD_W - 130, mottoY + mottoH / 2, 6, COLORS.pink);

  ctx.textBaseline = 'alphabetic'; // Restore standard baseline

  // 7. LOWER INFORMATION SECTION
  const infoY = 910;

  // Let's add some visual separation: horizontal ticket perforation/notches
  // Notch circles on left/right outer margins at info section top boundary
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(40, infoY - 15, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(CARD_W - 40, infoY - 15, 12, 0, Math.PI * 2);
  ctx.fill();

  // Dotted perforation line across
  ctx.strokeStyle = 'rgba(255, 247, 214, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(60, infoY - 15);
  ctx.lineTo(CARD_W - 60, infoY - 15);
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Left Block: Builder ID Details (Receipt/Ticket aesthetic)
  const blockLX = 90;
  const blockLY = infoY + 15;
  const blockLW = 560;
  const blockLH = 210;

  ctx.fillStyle = 'rgba(1, 28, 23, 0.5)';
  drawRoundedRect(ctx, blockLX, blockLY, blockLW, blockLH, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(82, 183, 136, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Left Block Details
  ctx.textAlign = 'left';
  ctx.fillStyle = COLORS.muted;
  ctx.font = 'bold 11px monospace';
  ctx.fillText('BUILDER IDENTITY VERIFICATION', blockLX + 24, blockLY + 36);

  ctx.fillStyle = COLORS.cream;
  ctx.font = 'bold 44px "Space Grotesk", sans-serif';
  ctx.fillText(data.builderId, blockLX + 24, blockLY + 86);

  ctx.fillStyle = COLORS.cyan;
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.fillText('LOC // GOA, INDIA', blockLX + 24, blockLY + 128);

  ctx.fillStyle = COLORS.cream;
  ctx.font = '16px monospace';
  ctx.fillText(`DATE // ${data.eventDate.toUpperCase()}`, blockLX + 24, blockLY + 154);

  // Micro terminal metadata code
  ctx.fillStyle = 'rgba(154, 189, 179, 0.5)';
  ctx.font = '9px monospace';
  ctx.fillText('SYS.REF // COASTAL-DEV-LAB-SECURE-ID-PASS-GOA-2026', blockLX + 24, blockLY + 185);

  // Right Block: QR code frame (Passport style)
  const blockRX = CARD_W - 470;
  const blockRY = infoY + 15;
  const qrFrameW = 380;
  const qrFrameH = 210;

  ctx.fillStyle = 'rgba(6, 72, 58, 0.2)';
  drawRoundedRect(ctx, blockRX, blockRY, qrFrameW, qrFrameH, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 247, 214, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // QR Code render inside a ticket-like frame
  const qrUrl = `https://example.com/goa-builder/${data.builderId.replace('#', '')}`;
  try {
    const qrSize = 150;
    const qrImg = await loadQRCodeImage(qrUrl, qrSize);
    const qrX = blockRX + 30;
    const qrY = blockRY + (qrFrameH - qrSize) / 2;

    // White/Cream background for QR code
    ctx.fillStyle = COLORS.cream;
    drawRoundedRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 6);
    ctx.fill();

    // Draw QR
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    // Label beside QR code
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 14px "Space Grotesk", sans-serif';
    ctx.fillText('SCAN TO VALIDATE', qrX + qrSize + 24, qrY + 45);

    ctx.fillStyle = COLORS.pink;
    ctx.font = 'bold 11px monospace';
    ctx.fillText('STATUS: VERIFIED', qrX + qrSize + 24, qrY + 75);

    ctx.fillStyle = COLORS.muted;
    ctx.font = '9px monospace';
    ctx.fillText('BLOCKCHAIN ADDR:', qrX + qrSize + 24, qrY + 105);
    ctx.fillText(data.builderId.replace('#', '0x'), qrX + qrSize + 24, qrY + 120);

  } catch {
    // QR code failsafe text
    ctx.fillStyle = COLORS.muted;
    ctx.font = '14px monospace';
    ctx.fillText('[QR ERROR]', blockRX + 50, blockRY + 110);
  }

  // 8. BOTTOM FOOTER SECTION
  const footerY = 1220;

  // Travel stamp decorative marks in corners of footer
  drawTravelStamp(ctx, 160, footerY + 80, 'COASTAL DEV LAB', -0.12);

  // Palms on the lower left/right corners
  drawPalmTree(ctx, 80, CARD_H - 110, 1.4, COLORS.green);
  drawPalmTree(ctx, CARD_W - 80, CARD_H - 110, 1.4, COLORS.green);

  // Styled waves
  drawWaves(ctx, 120, CARD_H - 180, CARD_W - 240, COLORS.cyan);

  // Footer text
  ctx.textAlign = 'center';
  drawGradientText(ctx, '🌴 GOA • INDIA 🌴', CARD_W / 2, CARD_H - 120, 38);

  ctx.fillStyle = COLORS.green;
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.fillText('BUILD IN PARADISE', CARD_W / 2, CARD_H - 72);

  // Bottom neon decorative lines
  const barY = CARD_H - 48;
  const barGrad = ctx.createLinearGradient(0, barY, CARD_W, barY);
  barGrad.addColorStop(0, COLORS.pink);
  barGrad.addColorStop(0.5, COLORS.sunset);
  barGrad.addColorStop(1, COLORS.yellow);
  ctx.fillStyle = barGrad;
  ctx.fillRect(60, barY, CARD_W - 120, 5);

  return canvas;
}

export { CARD_W as BUILDER_CARD_W, CARD_H as BUILDER_CARD_H };
