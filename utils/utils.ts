import * as Application from 'expo-application';
import { Platform } from 'react-native';

export const renderHitSlop = () => {
    return {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
    }
}

export const getUniqueAppId = () =>
    Platform.OS === 'android'
        ? Application.getAndroidId()
        : Application.getIosIdForVendorAsync();
