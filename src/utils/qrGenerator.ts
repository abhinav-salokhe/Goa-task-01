import QRCode from 'qrcode';

export async function generateQRCodeDataUrl(text: string, size = 200): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: {
      dark: '#011C17',
      light: '#FFF7D6',
    },
    errorCorrectionLevel: 'M',
  });
}

export async function loadQRCodeImage(text: string, size = 200): Promise<HTMLImageElement> {
  const dataUrl = await generateQRCodeDataUrl(text, size);
  return loadImageFromUrl(dataUrl);
}

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}
