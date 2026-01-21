import { Header } from '@/component/header';
import { Stack } from 'expo-router';
import { t } from 'i18next';

export default function HistoryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        header: () => <Header title={t('history')} />
      }} />
      <Stack.Screen
        name="detail"
        options={{
          header: () => <Header title={t('historyDetail')} />
        }}
      />
    </Stack>
  );
}
