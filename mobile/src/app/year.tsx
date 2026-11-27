import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRitual } from '@/lib/ritual-context';
import { isKept, todayKey } from '@/lib/ritual';

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
  const keptThisYear = Object.keys(ritual.checkins).filter(key => key.startsWith(year + '-') && isKept(ritual, key)).length;

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
        },
      ]}>
      <ThemedView style={styles.header}>
        <ThemedText accessibilityRole="header" style={styles.title}>{year} in pixels</ThemedText>
        <ThemedText themeColor="textSecondary">
          {keptThisYear} {keptThisYear === 1 ? 'day' : 'days'} kept this year.
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.gridCard}>
        <View style={styles.months}>
          {MONTHS.map((name, month) => {
            const count = daysInMonth(year, month);
            const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
            const monthPrefix = year + '-' + String(month + 1).padStart(2, '0') + '-';
            const keptDays = Object.keys(ritual.checkins)
              .filter(key => key.startsWith(monthPrefix) && isKept(ritual, key))
              .sort()
              .map(key => Number(key.slice(-2)));
            return (
              <View key={name} style={styles.month}>
                <ThemedText type="smallBold" accessibilityRole="header">{name}</ThemedText>
                <View style={styles.weekdayRow} aria-hidden>
                  {WEEKDAYS.map((day, i) => <ThemedText key={i} style={styles.weekday} themeColor="textSecondary">{day}</ThemedText>)}
                </View>
                <View
                  accessible
                  accessibilityLabel={keptDays.length ? name + ', days kept: ' + keptDays.join(', ') : name + ', no check-ins'}
                  style={styles.cells}>
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
                          { backgroundColor: lit ? theme.accent : theme.background, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.textSecondary },
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
        <LegendSwatch color={theme.background} label="Unmarked" />
        <LegendSwatch color={theme.accent} label="Kept" />
        <LegendSwatch color={theme.background} borderColor={theme.ember} label="Today" />
      </ThemedView>
    </ScrollView>
  );
}

function LegendSwatch({ color, borderColor, label }: { color: string; borderColor?: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { backgroundColor: color, borderWidth: borderColor ? 2 : StyleSheet.hairlineWidth, borderColor: borderColor ?? theme.textSecondary }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const CELL = 13;
const GAP = 3;
const MONTH_WIDTH = 7 * CELL + 6 * GAP;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    maxWidth: 620, width: '100%', alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: { fontFamily: Fonts.serif, fontSize: 38, lineHeight: 45 },
  header: {
    alignSelf: 'stretch',
    gap: Spacing.one,
  },
  gridCard: {
    alignSelf: 'stretch',
    padding: Spacing.three,
    borderRadius: 4,
  },
  weekdayRow: { flexDirection: 'row', gap: GAP },
  weekday: { width: CELL, textAlign: 'center', fontSize: 11, lineHeight: 18 },
  months: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', columnGap: Spacing.three, rowGap: Spacing.four },
  month: { width: MONTH_WIDTH, gap: Spacing.one },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  cell: { width: CELL, height: CELL, borderRadius: 2 },
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
