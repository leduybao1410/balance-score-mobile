import { Header } from '@/component/header';
import { Stack } from 'expo-router';

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'Setting',
        header: () => <Header title="Setting" />
      }} />
    </Stack>
  );
}
