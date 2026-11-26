import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  loadRitual,
  saveRitual,
  todayKey,
  type Ritual,
} from '@/lib/ritual';

type RitualContextValue = {
  ritual: Ritual | null; // null while loading from storage
  keepToday: () => void;
  unkeepToday: () => void;
  renameRitual: (name: string) => void;
};

const RitualContext = createContext<RitualContextValue | null>(null);

export function RitualProvider({ children }: { children: ReactNode }) {
  const [ritual, setRitual] = useState<Ritual | null>(null);

  useEffect(() => {
    loadRitual().then(setRitual);
  }, []);

  const update = (next: Ritual) => {
    setRitual(next);
    saveRitual(next).catch(() => {
      // storage write failed; state stays optimistic in memory
    });
  };

  const value: RitualContextValue = {
    ritual,
    keepToday: () => {
      if (!ritual) return;
      update({ ...ritual, checkins: { ...ritual.checkins, [todayKey()]: true } });
    },
    unkeepToday: () => {
      if (!ritual) return;
      const checkins = { ...ritual.checkins };
      delete checkins[todayKey()];
      update({ ...ritual, checkins });
    },
    renameRitual: (name: string) => {
      if (!ritual) return;
      const trimmed = name.trim();
      update({ ...ritual, name: trimmed.length > 0 ? trimmed : ritual.name });
    },
  };

  return <RitualContext.Provider value={value}>{children}</RitualContext.Provider>;
}

export function useRitual(): RitualContextValue {
  const ctx = useContext(RitualContext);
  if (!ctx) throw new Error('useRitual must be used inside RitualProvider');
  return ctx;
}
