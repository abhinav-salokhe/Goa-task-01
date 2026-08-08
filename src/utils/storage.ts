const STORAGE_KEY = 'goa-builder-prefs';

export interface StoredPrefs {
  mode?: string;
  pfpStyle?: string;
  builderName?: string;
  builderRole?: string;
  builderStack?: string;
  builderMotto?: string;
  builderClass?: string;
}

export function loadPrefs(): StoredPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredPrefs;
  } catch {
    return {};
  }
}

export function savePrefs(prefs: StoredPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota errors
  }
}
