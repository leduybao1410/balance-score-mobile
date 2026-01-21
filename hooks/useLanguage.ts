import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const isLanguage = (languageCode: string) => {
    return i18n.language === languageCode;
  };


  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isLanguage,
    currentLanguage: i18n.language,
  };
};
