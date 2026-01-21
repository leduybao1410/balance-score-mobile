import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import language resources
import en from './locales/en.json';
import kr from './locales/kr.json';
import vn from './locales/vn.json';
import cn from './locales/cn.json';

const resources = {
  vn: {
    translation: vn,
  },
  en: {
    translation: en,
  },
  kr: {
    translation: kr,
  },
  cn: {
    translation: cn,
  },
};

export const LANGUAGE_KEY = 'app_language';

const getInitialLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLang) {
      return storedLang;
    }
  } catch (e) {
    // ignore error, fallback to device locale
  }
  return getLocales()[0]?.languageCode || 'vn';
};

let initialLanguagePromise = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: undefined, // will be set after resolving promise
  fallbackLng: 'vn',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  compatibilityJSON: 'v4', // For React Native compatibility
  // react-i18next will wait for this promise before rendering
  initImmediate: false,
});

// Set language after getting from storage or device
initialLanguagePromise.then((lng) => {
  i18n.changeLanguage(lng);
});

// Listen for language changes and store them
i18n.on('languageChanged', async (lng) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  } catch (e) {
    // ignore error
  }
});

export default i18n;
