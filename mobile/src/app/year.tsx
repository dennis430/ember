import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRitual } from '@/lib/ritual-context';
import { isKept, keptCount, todayKey } from '@/lib/ritual';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function YearScreen() {
  const { ritual } = useRitual();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [year] = useState(() => new Date().getFullYear());

  if (!ritual) return <ThemedView style={styles.flex} />;

  const today = todayKey();

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.six,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
        },
      ]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{year} in pixels</ThemedText>
        <ThemedText type="subtitle" themeColor="textSecondary">
          {keptCount(ritual)} days kept. Every square is a morning you showed up.
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.gridCard}>
        <View style={styles.weekdayRow} aria-hidden>
          {WEEKDAYS.map((d, i) => (
            <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.weekday}>
              {d}
            </ThemedText>
          ))}
        </View>
        <View style={styles.months}>
          {MONTHS.map((name, month) => {
            const count = daysInMonth(year, month);
            const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
            return (
              <View key={name} style={styles.month}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.monthLabel}>
                  {name}
                </ThemedText>
                <View style={styles.cells}>
                  {Array.from({ length: firstOffset }).map((_, i) => (
                    <View key={`pad-${i}`} style={styles.cell} />
                  ))}
                  {Array.from({ length: count }).map((_, i) => {
                    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                    const isToday = key === today;
                    const lit = isKept(ritual, key);
                    return (
                      <View
                        key={key}
                        style={[
                          styles.cell,
                          { backgroundColor: lit ? theme.accent : theme.accentSoft },
                          isToday && { borderWidth: 2, borderColor: theme.ember },
                        ]}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ThemedView>

      <ThemedView style={styles.legend}>
        <LegendSwatch color={theme.accentSoft} label="not yet" />
        <LegendSwatch color={theme.accent} label="kept" />
        <LegendSwatch color={theme.ember} label="today" />
      </ThemedView>
    </ScrollView>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const CELL = 22;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    alignSelf: 'stretch',
    gap: Spacing.one,
  },
  gridCard: {
    alignSelf: 'stretch',
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  weekdayRow: {
    flexDirection: 'row',
    gap: 4,
    paddingLeft: 34,
  },
  weekday: { width: CELL - 4, textAlign: 'center' },
  months: { gap: Spacing.two },
  month: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  monthLabel: { width: 30 },
  cells: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cell: {
    width: CELL - 4,
    height: CELL - 4,
    borderRadius: 4,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
});
