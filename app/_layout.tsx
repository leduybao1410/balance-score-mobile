import { Stack } from 'expo-router';
import '../global.css';
import { StatusBar } from 'react-native';
import { InterstitialAdProvider } from '@/context/interstitial-ad-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constant/colors';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors['dark-grey'][100] }} >
      <InterstitialAdProvider>
        <StatusBar hidden />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="game" options={{ title: 'Game' }} />
          <Stack.Screen name="history" options={{ title: 'History' }} />
          <Stack.Screen name="setting" options={{ title: 'Setting' }} />
        </Stack>
      </InterstitialAdProvider>
    </SafeAreaView >
  );
}
