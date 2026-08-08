import type { FilterPreset } from '../types';

export interface FilterValues {
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
}

export function getFilterValues(preset: FilterPreset): FilterValues {
  switch (preset) {
    case 'vibrant':
      return { brightness: 1.05, contrast: 1.2, saturate: 1.4, hueRotate: 0, grayscale: 0, sepia: 0 };
    case 'sunset':
      return { brightness: 1.08, contrast: 1.1, saturate: 1.3, hueRotate: 15, grayscale: 0, sepia: 0.2 };
    case 'tropical':
      return { brightness: 1.05, contrast: 1.15, saturate: 1.5, hueRotate: -10, grayscale: 0, sepia: 0.1 };
    case 'cyber':
      return { brightness: 1.1, contrast: 1.35, saturate: 1.2, hueRotate: 180, grayscale: 0, sepia: 0 };
    case 'bw':
      return { brightness: 1, contrast: 1.15, saturate: 0, hueRotate: 0, grayscale: 1, sepia: 0 };
    default:
      return { brightness: 1, contrast: 1, saturate: 1, hueRotate: 0, grayscale: 0, sepia: 0 };
  }
}

export function filterToCss(preset: FilterPreset): string {
  const f = getFilterValues(preset);
  return [
    `brightness(${f.brightness})`,
    `contrast(${f.contrast})`,
    `saturate(${f.saturate})`,
    `hue-rotate(${f.hueRotate}deg)`,
    `grayscale(${f.grayscale})`,
    `sepia(${f.sepia})`,
  ].join(' ');
}

export function applyFilterToContext(ctx: CanvasRenderingContext2D, preset: FilterPreset): void {
  const f = getFilterValues(preset);
  ctx.filter = [
    `brightness(${f.brightness})`,
    `contrast(${f.contrast})`,
    `saturate(${f.saturate})`,
    `hue-rotate(${f.hueRotate}deg)`,
    `grayscale(${f.grayscale})`,
    `sepia(${f.sepia})`,
  ].join(' ');
}

export function resetFilter(ctx: CanvasRenderingContext2D): void {
  ctx.filter = 'none';
}
