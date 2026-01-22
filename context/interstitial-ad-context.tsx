import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { ADS_ID } from '@/constant/ads-id';

interface InterstitialAdContextType {
  showAd: (onClosed?: () => void) => void;
  isLoaded: boolean;
  loadAd: () => void;
}

const InterstitialAdContext = createContext<InterstitialAdContextType | undefined>(undefined);

interface InterstitialAdProviderProps {
  children: ReactNode;
}

export function InterstitialAdProvider({ children }: InterstitialAdProviderProps) {
  const interstitialAdUnitId = Platform.OS === 'ios' ? ADS_ID.interstitial.ios : ADS_ID.interstitial.android;
  const [isLoaded, setIsLoaded] = useState(false);
  const onClosedCallbackRef = useRef<(() => void) | undefined>(undefined);

  const interstitialAd = useRef(
    InterstitialAd.createForAdRequest(interstitialAdUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })
  ).current;

  const loadAd = () => {
    interstitialAd.load();
  };

  const showAd = (onClosed?: () => void) => {
    onClosed?.();
    // return;
    if (interstitialAd.loaded) {
      onClosedCallbackRef.current = onClosed;
      interstitialAd.show();
    } else {
      // If ad is not loaded yet, execute callback immediately
      if (onClosed) {
        onClosed();
      }
    }
  };

  useEffect(() => {
    // Load the interstitial ad when component mounts
    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      // Execute callback if provided
      if (onClosedCallbackRef.current) {
        onClosedCallbackRef.current();
        onClosedCallbackRef.current = undefined;
      }
      // Reload ad for next time
      interstitialAd.load();
    });

    const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
      setIsLoaded(false);
    });

    // Load the ad
    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const value: InterstitialAdContextType = {
    showAd,
    isLoaded,
    loadAd,
  };

  return (
    <InterstitialAdContext.Provider value={value}>
      {children}
    </InterstitialAdContext.Provider>
  );
}

export function useInterstitialAd() {
  const context = useContext(InterstitialAdContext);
  if (context === undefined) {
    throw new Error('useInterstitialAd must be used within an InterstitialAdProvider');
  }
  return context;
}
