import AsyncStorage from '@react-native-async-storage/async-storage';

export type Ritual = {
  name: string;
  checkins: Record<string, true>; // keyed by YYYY-MM-DD
};

const STORAGE_KEY = 'ember.ritual.v1';
export const FREE_RITUAL_LIMIT = 1;

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function loadRitual(): Promise<Ritual> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Ritual;
      if (typeof parsed?.name === 'string' && parsed.checkins) return parsed;
    }
  } catch {
    // fall through to default
  }
  return { name: 'Read one page', checkins: {} };
}

export async function saveRitual(ritual: Ritual): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ritual));
}

export function isKept(ritual: Ritual, key: string): boolean {
  return ritual.checkins[key] === true;
}

export function toggleCheckin(ritual: Ritual, key: string): Ritual {
  const checkins = { ...ritual.checkins };
  if (checkins[key]) {
    delete checkins[key];
  } else {
    checkins[key] = true;
  }
  return { ...ritual, checkins };
}

/** Count of consecutive kept days ending today, or yesterday if today isn't kept yet. */
export function streak(ritual: Ritual, now = new Date()): number {
  const keys = Object.keys(ritual.checkins).filter((k) => ritual.checkins[k]);
  if (keys.length === 0) return 0;

  const kept = new Set(keys);
  const day = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offset);
    return todayKey(d);
  };

  // A streak survives missing today so far; it breaks at yesterday.
  let start = 0;
  if (!kept.has(day(0)) && !kept.has(day(1))) return 0;
  if (!kept.has(day(0))) start = 1;

  let count = 0;
  while (kept.has(day(start + count))) count++;
  return count;
}

export function keptCount(ritual: Ritual): number {
  return Object.keys(ritual.checkins).filter((k) => ritual.checkins[k]).length;
}
