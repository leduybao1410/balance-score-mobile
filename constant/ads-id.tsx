
// Banner Ad Unit IDs (for displaying ads - replace with your actual Ad Unit IDs from AdMob console)
// Format: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY (note the / instead of ~)
const IOS_BANNER_AD_UNIT_ID = "ca-app-pub-3488842401803401/3068944985";
const ANDROID_BANNER_AD_UNIT_ID = "ca-app-pub-3488842401803401/4493707291";

// Interstitial Ad Unit IDs (for popup ads - replace with your actual Interstitial Ad Unit IDs from AdMob console)
// Format: ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY (note the / instead of ~)
const IOS_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3488842401803401/4559294089"; // TODO: Replace with actual iOS Interstitial Ad Unit ID
const ANDROID_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3488842401803401/2773431516"; // TODO: Replace with actual Android Interstitial Ad Unit ID

export const ADS_ID = {
    banner: {
        android: ANDROID_BANNER_AD_UNIT_ID,
        ios: IOS_BANNER_AD_UNIT_ID,
    },
    interstitial: {
        android: ANDROID_INTERSTITIAL_AD_UNIT_ID,
        ios: IOS_INTERSTITIAL_AD_UNIT_ID,
    },
}