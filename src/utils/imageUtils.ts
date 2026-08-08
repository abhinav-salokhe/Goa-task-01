import heic2any from 'heic2any';
import { loadImageFromFile, loadImageFromUrl } from './qrGenerator';

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export function isAcceptedFile(file: File): boolean {
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext);
}

export function isHeicFile(file: File): boolean {
  const ext = file.name.toLowerCase();
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    ext.endsWith('.heic') ||
    ext.endsWith('.heif')
  );
}

export async function processUploadedFile(file: File): Promise<{ image: HTMLImageElement; url: string }> {
  if (!isAcceptedFile(file)) {
    throw new Error("That image format isn't supported. Please use JPG, PNG, WEBP, or HEIC.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Please use an image under 15MB.');
  }

  let processedFile = file;

  if (isHeicFile(file)) {
    try {
      const result = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.92,
      });
      const blob = Array.isArray(result) ? result[0] : result;
      processedFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), {
        type: 'image/jpeg',
      });
    } catch {
      throw new Error('HEIC conversion failed. Please try converting to JPG first.');
    }
  }

  const image = await loadImageFromFile(processedFile);
  const url = URL.createObjectURL(processedFile);
  return { image, url };
}

export function revokeImageUrl(url: string | null): void {
  if (url) URL.revokeObjectURL(url);
}

export { loadImageFromUrl, loadImageFromFile };
