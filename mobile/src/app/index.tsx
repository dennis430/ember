import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { API_URL } from '@/lib/config';
import { fetchDailyPrompt } from '@/lib/prompt';
import { useRitual } from '@/lib/ritual-context';
import { isKept, keptCount, streak, todayKey } from '@/lib/ritual';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Still up?';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function TodayScreen() {
  const { ritual, keepToday, unkeepToday } = useRitual();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState<string | null>(null);

  const dateKey = todayKey();

  useEffect(() => {
    let active = true;
    fetchDailyPrompt(dateKey, API_URL).then(({ prompt }) => {
      if (!active) return;
      setPrompt(prompt);
    });
    return () => {
      active = false;
    };
  }, [dateKey]);

  if (!ritual) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  const kept = isKept(ritual, dateKey);
  const currentStreak = streak(ritual);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.four }]}>
      <View style={styles.entry}>
        <ThemedText type="small" themeColor="textSecondary">
          {greeting()} · {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </ThemedText>
        <ThemedText accessibilityRole="header" style={styles.ritual}>{ritual.name}</ThemedText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={kept ? 'Ritual kept today. Tap to undo.' : 'Keep today\u2019s ritual'}
        accessibilityState={{ selected: kept }}
        onPress={() => (kept ? unkeepToday() : keepToday())}
        style={({ pressed }) => [styles.flameButton, { backgroundColor: kept ? theme.backgroundSelected : theme.accent, opacity: pressed ? 0.82 : 1 }]}
      >
        <SymbolView
          name={{ ios: 'flame.fill', android: 'local_fire_department' }}
          size={32}
          tintColor={kept ? theme.accent : theme.background}
        />
        <ThemedText
          type="smallBold"
          style={{ color: kept ? theme.text : theme.background }}>
          {kept ? 'Kept today · Undo' : 'I kept it today'}
        </ThemedText>
      </Pressable>

      <ThemedView style={styles.statRow}>
        <Stat label="day streak" value={String(currentStreak)} />
        <Stat label="days kept" value={String(keptCount(ritual))} />
      </ThemedView>
      <View style={[styles.reflection, { borderColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary">Daily reflection</ThemedText>
        <ThemedText style={styles.prompt}>{prompt ?? 'Loading today’s reflection…'}</ThemedText>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView style={styles.stat}>
      <ThemedText style={styles.number}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%', maxWidth: 620, alignSelf: 'center', paddingHorizontal: Spacing.four,
    gap: Spacing.four, paddingBottom: BottomTabInset + Spacing.four,
  },
  center: { flex: 1, justifyContent: 'center' },
  entry: { gap: Spacing.two },
  ritual: { fontFamily: Fonts.serif, fontSize: 44, lineHeight: 50 },
  flameButton: { minHeight: 70, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two, padding: Spacing.three },
  statRow: { flexDirection: 'row', gap: Spacing.four },
  stat: { flex: 1, gap: 2 },
  number: { fontSize: 32, lineHeight: 38, fontFamily: Fonts.serif, fontVariant: ['tabular-nums'] },
  reflection: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: Spacing.three, gap: Spacing.two },
  prompt: { fontSize: 24, lineHeight: 32, fontFamily: Fonts.serif },
});
