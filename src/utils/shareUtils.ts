import type { AppMode, PfpStyle } from '../types';

export function getShareUrl(mode: AppMode, extras: {
  builderId?: string;
  pfpStyle?: PfpStyle;
  teamName?: string;
}): string {
  let text = 'Just created my Goa Builder identity 🌴🚀\n\nBuild in Paradise.\n\n#GoaBuilder';

  if (mode === 'builder' && extras.builderId) {
    text = `Just created my Goa Builder identity 🌴🚀\n\n${extras.builderId}\n\nBuild in Paradise.\n\n#GoaBuilder`;
  } else if (mode === 'pfp' && extras.pfpStyle) {
    const styleName = extras.pfpStyle.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    text = `Just created my Goa Builder PFP Frame 🌴🚀\n\nStyle: ${styleName}\n\nBuild in Paradise.\n\n#GoaBuilder`;
  } else if (mode === 'squad' && extras.teamName) {
    text = `Just created our Goa Squad Frame 🌴🚀\n\nSquad: ${extras.teamName}\n\nBuild in Paradise.\n\n#GoaBuilder`;
  }

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed'));
      },
      type,
      quality,
    );
  });
}
