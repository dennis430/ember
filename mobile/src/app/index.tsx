import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
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
  const [promptLive, setPromptLive] = useState(false);

  const dateKey = todayKey();

  useEffect(() => {
    let active = true;
    fetchDailyPrompt(dateKey, API_URL).then(({ prompt, fromNetwork }) => {
      if (!active) return;
      setPrompt(prompt);
      setPromptLive(fromNetwork);
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
    <ThemedView style={styles.container}>
      <ThemedView
        type="backgroundElement"
        style={[styles.card, { marginTop: insets.top + Spacing.four }]}>
        <ThemedText type="small" themeColor="textSecondary">
          {greeting()} · {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </ThemedText>
        <ThemedText type="title">{ritual.name}</ThemedText>
        <ThemedText type="subtitle" themeColor="textSecondary">
          {prompt ?? 'Loading today\u2019s reflection\u2026'}
        </ThemedText>
        {promptLive && (
          <ThemedText type="small" themeColor="textSecondary">
            Today&rsquo;s prompt, fresh from ember
          </ThemedText>
        )}
      </ThemedView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={kept ? 'Ritual kept today. Tap to undo.' : 'Keep today\u2019s ritual'}
        accessibilityState={{ selected: kept }}
        onPress={() => (kept ? unkeepToday() : keepToday())}
        style={({ pressed }) => [styles.flameButton, pressed && { transform: [{ scale: 0.97 }] }]}
      >
        <SymbolView
          name={{ ios: 'flame.fill', android: 'local_fire_department' }}
          size={72}
          tintColor={kept ? '#FBFAF6' : theme.ember}
        />
        <ThemedText
          type="title"
          style={{ color: kept ? '#FBFAF6' : theme.text, textAlign: 'center' }}>
          {kept ? 'Kept. See you tomorrow.' : 'I kept it today'}
        </ThemedText>
      </Pressable>

      <ThemedView style={styles.statRow}>
        <Stat label="day streak" value={String(currentStreak)} />
        <Stat label="days kept" value={String(keptCount(ritual))} />
        <Stat label="free ritual" value="1 of 1" />
      </ThemedView>
    </ThemedView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <ThemedView type="backgroundElement" style={styles.stat}>
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  center: { justifyContent: 'center' },
  card: {
    alignSelf: 'stretch',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  flameButton: {
    alignSelf: 'stretch',
    minHeight: 220,
    borderRadius: Spacing.four * 2,
    backgroundColor: '#55684A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  statRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    flex: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 2,
  },
});
