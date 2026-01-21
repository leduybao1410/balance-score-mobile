import { Header } from '@/component/header';
import { Stack } from 'expo-router';

export default function HistoryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'History',
        header: () => <Header title="History" />
      }} />
      <Stack.Screen
        name="detail"
        options={{
          title: 'History Detail',
          header: () => <Header title="History Detail" />
        }}
      />
    </Stack>
  );
}
