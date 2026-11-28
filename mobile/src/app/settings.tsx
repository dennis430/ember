import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { API_URL } from '@/lib/config';
import { useRitual } from '@/lib/ritual-context';
import { keptCount } from '@/lib/ritual';

export default function SettingsScreen() {
  const { ritual, renameRitual } = useRitual();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<string | null>(null);

  if (!ritual) return <ThemedView style={styles.flex} />;

  const name = draft ?? ritual.name;

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.four }]}>
      <ThemedView style={styles.section}>
        <ThemedText accessibilityRole="header" style={styles.title}>Your ritual</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Keep it tiny. One habit you can do in a couple of minutes, most days.
        </ThemedText>
        <TextInput
          value={name}
          onChangeText={setDraft}
          onEndEditing={() => renameRitual(name)}
          onSubmitEditing={() => renameRitual(name)}
          maxLength={60}
          accessibilityLabel="Ritual name"
          style={[
            styles.input,
            { color: theme.text, borderColor: theme.border, backgroundColor: theme.backgroundElement },
          ]}
        />
        <ThemedText type="small" themeColor="textSecondary">
          {keptCount(ritual)} {keptCount(ritual) === 1 ? 'morning' : 'mornings'} kept so far.
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.planCard}>
        <ThemedText type="smallBold">Ember Unlimited · $2.99/month</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Unlimited rituals, sync across your devices, and gentle streak reminders.
          Subscriptions are planned for the App Store release. Today every
          feature you see is free.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="small" themeColor="textSecondary">
          Your check-ins are stored privately on this device. Daily prompts come from{' '}
          {API_URL.replace(/^https?:\/\//, '')}.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    width: '100%', maxWidth: 620, alignSelf: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  title: { fontFamily: Fonts.serif, fontSize: 38, lineHeight: 45 },
  section: { gap: Spacing.two },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 17,
  },
  planCard: {
    borderRadius: 4,
    padding: Spacing.four,
    gap: Spacing.two,
  },
});
