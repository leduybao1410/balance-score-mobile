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

const screen = Dimensions.get('window');

export default function HomeScreen() {
  const bannerAd = Platform.OS === 'ios' ? ADS_ID.banner.ios : ADS_ID.banner.android;
  const { showAd } = useInterstitialAd();



  const handleStartNow = () => {
    showAd(async () => {
      // Navigate to game screen after ad is closed
      const folderName = folderHelpers.generateFolderName();
      await folderHelpers.initFolder(folderName);
      router.push({
        pathname: '/game',
        params: {
          folderName,
        },
      });
    });
  };

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
            No memorization required!
          </SubText>
          <SubText style={styles.subtitle}>
            No expertise required!
          </SubText>
        </VerticalView>
        <VerticalView gap={10}
          justifyContent='flex-start'
          alignItems='stretch' styles={styles.menuContainer}>
          <MenuCardBtn
            title='Start Now'
            onPress={handleStartNow}
            containerStyle={styles.menuItemContainer}
            backgroundColor={colors.green[700]}
            textColor={colors.white}
          />
          <MenuCardBtn
            containerStyle={styles.menuItemContainer}
            title='History'
            onPress={() => { router.push('/history') }}
          />
          <MenuCardBtn
            title='Setting'
            onPress={() => { router.push('/setting') }}
            backgroundColor={colors['dark-grey'][300]}
            textColor={colors['dark-grey'][800]}
          />
        </VerticalView>
      </VerticalView>
      <BannerAd
        unitId={bannerAd}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
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
