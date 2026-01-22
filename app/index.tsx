import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { MenuCardBtn } from '@/component/home/menu-card-btn';
import { VerticalView } from '@/component/view';
import { colors } from '@/constant/colors';
import { SubText } from '@/component/text/sub-text';
import { myFontStyle, ResponsiveFontSize } from '@/component/responsive-text';
import { router } from 'expo-router';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { ADS_ID } from '@/constant/ads-id';
import { useInterstitialAd } from '@/context/interstitial-ad-context';
import { folderHelpers } from '@/libs/helpers/folder-helpers';
import LanguageSelector from '@/component/languageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

const screen = Dimensions.get('window');

export const bannerAd = Platform.OS === 'ios' ? ADS_ID.banner.ios : ADS_ID.banner.android;

export default function HomeScreen() {
  const { showAd } = useInterstitialAd();
  const { t } = useLanguage();



  const handleStartNow = () => {
    showAd();
    // Navigate to game screen after ad is closed
    const folderName = folderHelpers.generateFolderName();
    folderHelpers.initFolder(folderName).then(() => {
      router.push({
        pathname: '/game',
        params: {
          folderName,
        },
      });
    })

  };

  const onStartNowPress = usePreventDoublePress(handleStartNow, 1000)

  return (
    <>
      <VerticalView
        gap={20}
        alignItems='center'
        justifyContent='center'
        styles={styles.container} >

        <Logo />
        <VerticalView gap={0}>
          <Text style={styles.title} >Balance Score Board</Text>
          <SubText style={styles.subtitle}>
            {t('noMemorizationRequired')}
          </SubText>
          <SubText style={styles.subtitle}>
            {t('noExpertiseRequired')}
          </SubText>
          <SubText style={styles.subtitle}>
            {t('justPlay')}
          </SubText>
        </VerticalView>
        <VerticalView gap={10}
          justifyContent='flex-start'
          alignItems='stretch' styles={styles.menuContainer}>
          <MenuCardBtn
            title={t('startNow')}
            onPress={() => onStartNowPress?.()}
            containerStyle={styles.menuItemContainer}
            backgroundColor={colors.green[700]}
            textColor={colors.white}
          />
          <MenuCardBtn
            containerStyle={styles.menuItemContainer}
            title={t('history')}
            onPress={() => { router.push('/history') }}
          />
          <MenuCardBtn
            title={t('settings')}
            onPress={() => { router.push('/setting') }}
            backgroundColor={colors['dark-grey'][300]}
            textColor={colors['dark-grey'][800]}
          />

        </VerticalView>
      </VerticalView>
      <BannerAd
        unitId={bannerAd}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      <LanguageSelector />
    </>
  );
}

const Logo = () => {
  return (
    <View style={{
      borderColor: colors['dark-grey'][200],
      elevation: 8,
      borderRadius: 16,
      aspectRatio: 1,
      overflow: 'hidden'
    }}>
      <Image
        source={require('@/assets/logo.png')}
        style={{ width: 180, height: 180, }}
        resizeMode='contain'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['dark-grey'][100],
    padding: 20,
  },
  menuItemContainer: {
    width: screen.width * 0.5,
  },
  title: {
    fontSize: ResponsiveFontSize(24),
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    ...myFontStyle.small,
    color: colors['dark-grey'][700],
    textAlign: 'center',
  },
  menuContainer: {
    flexShrink: 1,
  },
});
