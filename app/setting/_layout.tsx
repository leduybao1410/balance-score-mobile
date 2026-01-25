import { Header } from '@/component/header';
import { Stack } from 'expo-router';
import { t } from 'i18next';

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'Setting',
        header: () => <Header title={t('settings')} />
      }} />
    </Stack>
  );
}
