import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle } from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { myFontStyle } from './responsive-text';
import { colors } from '@/constant/colors';
import CustomModal from './modal/modal';
import { HorizontalView } from './view';

const LanguageSelector: React.FC<{ containerStyle?: ViewStyle }> = ({ containerStyle }) => {
  const { t, changeLanguage, currentLanguage } = useLanguage();

  const [open, setOpen] = useState(false);
  const languages = [
    { code: 'vn', name: t('vietnamese'), flag: require(`../assets/flag/vn.png`) },
    { code: 'en', name: t('english'), flag: require(`../assets/flag/us.png`) },
    { code: 'kr', name: t('korean'), flag: require(`../assets/flag/kr.png`) },
    { code: 'cn', name: t('chinese'), flag: require(`../assets/flag/cn.png`) },
  ];

  const selectedLanguage = useMemo(() => {
    return languages.find(language => language.code === currentLanguage);
  }, [currentLanguage]);


  return (
    <>
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={() => setOpen(true)}>
        <HorizontalView>
          {currentLanguage && < Image
            source={selectedLanguage?.flag}
            style={{ borderRadius: 10, borderWidth: 1, borderColor: colors['dark-grey'][700] }}
            resizeMode='cover'
            width={20}
            height={20}
          />}
          <Text>{selectedLanguage?.code.toUpperCase()}</Text>
        </HorizontalView>
      </TouchableOpacity>
      <CustomModal
        open={open}
        showCloseButton={false}
        showTitle={false}
        setOpen={setOpen}
      >
        <View style={styles.languageContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageButton,
                currentLanguage === language.code && styles.activeLanguage,
              ]}
              onPress={() => changeLanguage(language.code)}>
              <Image source={language.flag} style={styles.flag} />
              <Text
                style={[
                  styles.languageText,
                  currentLanguage === language.code && styles.activeLanguageText,
                ]}>
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </CustomModal>

    </>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: myFontStyle.extraLarge.fontSize,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: colors.primary[700],
  },
  languageContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary[300],
    backgroundColor: 'white',
  },
  activeLanguage: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  languageText: {
    color: colors.primary[700],
    fontWeight: '500',
    fontSize: myFontStyle.normal.fontSize,
  },
  activeLanguageText: {
    color: 'white',
  },
  flag: {
    objectFit: 'contain',
    width: 20,
    height: 20,
  },
});

export default LanguageSelector;
