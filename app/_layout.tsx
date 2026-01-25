import { Stack } from 'expo-router';
import '../global.css';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { InterstitialAdProvider } from '@/context/interstitial-ad-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constant/colors';
import '../i18n';
import ToastManager from 'toastify-react-native';
import { toastConfig } from '@/component/toast/toast-config';

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors['dark-grey'][100] }} >
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <InterstitialAdProvider>
          <ToastManager config={toastConfig} />
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
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}
