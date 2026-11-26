import { NativeTabs, NativeTabsTriggerIconProps } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.backgroundElement}
      labelStyle={{ color: colors.textSecondary }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          selectedColor={colors.ember}
        />
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="year">
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          selectedColor={colors.ember}
        />
        <NativeTabs.Trigger.Label>Year</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon md="settings" sf="gearshape" selectedColor={colors.ember} />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
