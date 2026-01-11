import { StyleSheet, Text, View } from 'react-native';
import { MenuCardBtn } from '@/component/home/menu-card-btn';
import { VerticalView } from '@/component/view';
import { colors } from '@/constant/colors';
import { SubText } from '@/component/text/sub-text';
import { myFontStyle, ResponsiveFontSize } from '@/component/responsive-text';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// const ICON_SIZE = 32;

export default function HomeScreen() {
  return (
    <VerticalView
      gap={20}
      alignItems='stretch'
      justifyContent='center'
      styles={styles.container} >
      <VerticalView >
        <Text style={styles.title} >Balance Score</Text>
        <SubText style={styles.subtitle}>
          Make your life easier
        </SubText>
      </VerticalView>
      <VerticalView gap={10}
        justifyContent='flex-start'
        alignItems='stretch' styles={styles.menuContainer}>
        <MenuCardBtn
          title='Start Now'
          onPress={() => { router.push('/game') }}
        // iconPosition='top'
        // icon={<MaterialIcons
        //   name="play-arrow" size={ICON_SIZE} color={colors['dark-grey'][800]} />}
        />
        <MenuCardBtn
          title='History'
          onPress={() => { }}
        // icon={<MaterialIcons
        //   name="bookmark" size={ICON_SIZE} color={colors['dark-grey'][800]} />}
        />
        <MenuCardBtn
          title='Setting'
          onPress={() => { }}
        // icon={<MaterialIcons
        //   name="bookmark" size={ICON_SIZE} color={colors['dark-grey'][800]} />}
        />
      </VerticalView>
    </VerticalView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['dark-grey'][100],
    padding: 20,
  },
  title: {
    fontSize: ResponsiveFontSize(24),
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: ResponsiveFontSize(20),
    lineHeight: ResponsiveFontSize(20) * 1.5,
    color: colors['dark-grey'][700],
    textAlign: 'center',
  },
  menuContainer: {
    flexShrink: 1,
  },
});
