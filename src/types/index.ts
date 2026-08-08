export type AppMode = 'pfp' | 'builder' | 'squad';

export type FilterPreset = 'normal' | 'vibrant' | 'sunset' | 'tropical' | 'cyber' | 'bw';

export type PfpStyle = 'tropical-sunset' | 'goa-postcard' | 'golden-sun' | 'cyber-beach';

export interface PhotoTransform {
  zoom: number;
  panX: number;
  panY: number;
  rotate: number;
  filter: FilterPreset;
}

export interface PhotoState extends PhotoTransform {
  image: HTMLImageElement | null;
  imageUrl: string | null;
}

export interface BuilderData {
  fullName: string;
  role: string;
  builderClass: string;
  techStack: string;
  motto: string;
  builderId: string;
  eventDate: string;
}

export interface PfpSettings {
  style: PfpStyle;
  sticker: string;
}

export interface SquadMember {
  id: string;
  name: string;
  role: string;
  photo: PhotoState;
}

export interface SquadSettings {
  teamName: string;
  teamMotto: string;
  members: SquadMember[];
}

export const BUILDER_CLASSES = [
  'TERMINAL WIZARD',
  'CODE NOMAD',
  'PIXEL ALCHEMIST',
  'STACK SURFER',
  'DEBUG DETECTIVE',
  'AI EXPLORER',
  'CLOUD RIDER',
  'FULLSTACK PIRATE',
  'BUG HUNTER',
  'SHIPMASTER',
] as const;

export const MOTTO_OPTIONS = [
  'BUILD • SHIP • REPEAT',
  'CODE IN PARADISE',
  'SHIP FAST • BREAK NOTHING',
  'HACK THE BEACH',
  'DEPLOY WITH SUNSET',
  'STACK OVERFLOW IRL',
  'GIT PUSH • GOA VIBES',
  'DEBUG BY THE SEA',
  'FULL STACK • FULL SUN',
  'BUILD TOGETHER',
] as const;

export const STICKER_OPTIONS = [
  'BUILDER',
  'SHIPPER',
  'FULLSTACK',
  'REACT',
  'NODE',
  'JAVA',
  'AI BUILDER',
  'TOP 1%',
] as const;

export const FILTER_OPTIONS: { id: FilterPreset; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'vibrant', label: 'Vibrant' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'tropical', label: 'Tropical' },
  { id: 'cyber', label: 'Cyber' },
  { id: 'bw', label: 'B&W' },
];

export const PFP_STYLES: { id: PfpStyle; label: string; description: string }[] = [
  { id: 'tropical-sunset', label: 'Tropical Sunset', description: 'Pink, yellow & palm vibes' },
  { id: 'goa-postcard', label: 'Goa Postcard', description: 'Vintage cream & postage' },
  { id: 'golden-sun', label: 'Golden Sun', description: 'Gold & orange sunset' },
  { id: 'cyber-beach', label: 'Cyber Beach', description: 'Neon cyan & pink glow' },
];

export const DEFAULT_PHOTO_TRANSFORM: PhotoTransform = {
  zoom: 1,
  panX: 0,
  panY: 0,
  rotate: 0,
  filter: 'normal',
};

export function createEmptyPhotoState(): PhotoState {
  return {
    ...DEFAULT_PHOTO_TRANSFORM,
    image: null,
    imageUrl: null,
  };
}

export function createDefaultBuilderData(): BuilderData {
  return {
    fullName: 'ABHINAV SALOKHE',
    role: 'FULL STACK DEVELOPER',
    builderClass: 'TERMINAL WIZARD',
    techStack: 'REACT • NODE • JAVA',
    motto: 'BUILD • SHIP • REPEAT',
    builderId: '#GOA26-A7F3',
    eventDate: '28–31 OCT 2026',
  };
}

export function createDefaultPfpSettings(): PfpSettings {
  return {
    style: 'tropical-sunset',
    sticker: 'BUILDER',
  };
}

export function createDefaultSquadSettings(): SquadSettings {
  return {
    teamName: 'GOA CODE CREW',
    teamMotto: 'BUILD TOGETHER',
    members: [],
  };
}

export function createSquadMember(id: string): SquadMember {
  return {
    id,
    name: '',
    role: '',
    photo: createEmptyPhotoState(),
  };
}
