import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useWindowDimensions, Platform, ScrollView, Pressable } from 'react-native';
import { gameMode } from "./game_side_controller";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';
import { router } from 'expo-router';
import { useInterstitialAd } from '@/context/interstitial-ad-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '@/hooks/useGameState';
import { t } from 'i18next';
import LanguageSelector from '../languageSelector';
import ConfirmPopup from '../popup/confirm-popup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnalyticsEvents, logEvent } from '@/utils/analytics';
import { useLanguage } from '@/hooks/useLanguage';

export default function GameMenu(
    { isOpen, setIsOpen, setIsSummaryOpen, setIsAddPlayerOpen, setIsModifyBtn, selectedMode, setSelectedMode, resetGame, setOpenChooseStartingScore }
        :
        {
            isOpen: boolean,
            setIsOpen: (bool: boolean) => void,
            setIsSummaryOpen: (bool: boolean) => void,
            setIsAddPlayerOpen: (bool: boolean) => void,
            setIsModifyBtn: (bool: boolean) => void,
            selectedMode: GameState['selectedMode'],
            setSelectedMode: GameState['setSelectedMode'],
            resetGame: () => void
            setOpenChooseStartingScore: (bool: boolean) => void
        }
) {
    const { width, height, } = useWindowDimensions();
    const isLandscape = width > height;
    const [orientation, setOrientation] = useState(isLandscape ? 'landscape' : 'portrait');
    const { currentLanguage } = useLanguage();
    const insets = useSafeAreaInsets();
    // Update orientation state when dimensions change
    useEffect(() => {
        setOrientation(isLandscape ? 'landscape' : 'portrait');
    }, [isLandscape]);

    const { showAd } = useInterstitialAd();



    const onExit = () => {
        showAd();
        AsyncStorage.removeItem('gameData').then(() => {
            console.log('exitGameSucces');
            setIsOpen(false);
            resetGame();
            router.back();
        })
    }

    const [confirmPopupType, setConfirmPopupType] = useState<'exit' | 'reset'>('exit');
    const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

    const confirmButtonText = useMemo(() => {
        return confirmPopupType === 'exit' ? t('exit') : t('resetZeroPoint');
    }, [confirmPopupType]);

    const cancelButtonText = useMemo(() => {
        return t('cancel');
    }, [confirmPopupType]);

    const confirmPopupTitle = useMemo(() => {
        return confirmPopupType === 'exit' ? t('confirmExitTitle') : t('confirmResetZeroPointTitle');
    }, [confirmPopupType]);

    const confirmPopupMessage = useMemo(() => {
        return confirmPopupType === 'exit' ? t('confirmExitMessage') : t('confirmResetZeroPointMessage');
    }, [confirmPopupType]);

    const onConfirm = useCallback(() => {
        if (confirmPopupType === 'exit') {
            onExit();
        } else {
            resetGame();
        }
    }, [confirmPopupType]);

    type menuBtnProps = {
        name: string;
        action: () => void;
        bgColor?: string;
        textColor?: string;
    }

    const list: menuBtnProps[] = useMemo(() => ([
        { name: t('addPlayer'), action: () => { logEvent(AnalyticsEvents.addPlayer); setIsAddPlayerOpen(true); setIsOpen(false) } },
        { name: t('showSummary'), action: () => { logEvent(AnalyticsEvents.showSummary); setIsSummaryOpen(true); setIsOpen(false) } },
        { name: t('modifyButton'), action: () => { logEvent(AnalyticsEvents.modify_button); setIsModifyBtn(true); setIsOpen(false) } },
        {
            name: t('resetZeroPoint'), action: () => {
                logEvent(AnalyticsEvents.reset_zero_point);
                setConfirmPopupType('reset');
                setOpenConfirmPopup(true);
                setIsOpen(false)
            }
        },
        {
            name: t('chooseStartingScore'), action: () => {
                logEvent(AnalyticsEvents.choose_starting_score);
                setOpenChooseStartingScore(true);
                setIsOpen(false);
            }
        },
        {
            name: t('exit'),
            bgColor: colors.red[600],
            action: () => {
                logEvent(AnalyticsEvents.exitGame);
                setConfirmPopupType('exit');
                setIsOpen(false);
                setOpenConfirmPopup(true);
            },
        },
    ]), [currentLanguage]);



    return (
        <>
            <Modal
                key={orientation}
                visible={isOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right', 'portrait-upside-down']}
            >

                <Pressable
                    style={styles.overlay}
                    onPress={() => setIsOpen(false)}
                >
                </Pressable>

                <View
                    style={[styles.modalContainer, {
                        maxHeight: height,
                        width: isLandscape ? width * 0.3 : 208,
                        maxWidth: isLandscape ? width * 0.4 : 300,
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    }]}>
                    <ScrollView
                        style={styles.content}
                        contentContainerStyle={styles.menuContainer}
                    >
                        <View style={styles.modeContainer}>
                            <LanguageSelector containerStyle={styles.languageContainer} />
                            <Text style={styles.modeTitle}>{t('currentMode')}</Text>
                            <View style={styles.pickerContainer}>
                                {gameMode.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.pickerOption,
                                            selectedMode === item.id && styles.pickerOptionSelected
                                        ]}
                                        onPress={() => setSelectedMode(item.id as 'free' | 'with-host')}
                                    >
                                        <Text style={[
                                            styles.pickerOptionText,
                                            selectedMode === item.id as 'free' | 'with-host' && styles.pickerOptionTextSelected
                                        ]}>
                                            {t(item.name)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.listContainer}>
                            {list.map((item) => (
                                <Button
                                    key={item.name}
                                    title={item.name}
                                    onClick={item.action}
                                    style={[styles.menuButton, item.bgColor && { backgroundColor: item.bgColor }]}
                                    textColor={item?.textColor ?? colors.white}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>

            </Modal >
            <ConfirmPopup
                variant={confirmPopupType === 'exit' ? 'danger' : 'primary'}
                visible={openConfirmPopup}
                confirmText={confirmButtonText}
                cancelText={cancelButtonText}
                title={confirmPopupTitle}
                message={confirmPopupMessage}
                onConfirm={() => {
                    setOpenConfirmPopup(false);
                    setTimeout(() => onConfirm(), 1000)
                }}
                onCancel={() => {
                    setOpenConfirmPopup(false);
                }}
                onClose={() => {
                    setOpenConfirmPopup(false);
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuContainer: {
        padding: 8,
    },
    content: {
        gap: 8,
    },
    modeContainer: {
        flexDirection: 'column',
        paddingVertical: 24,
        gap: 8,
        backgroundColor: colors['light-grey'][200],
        borderRadius: 8,
    },
    modeTitle: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: ResponsiveFontSize(14),
        color: colors['dark-grey'][900],
    },
    languageContainer: {
        alignSelf: 'center',
        padding: 8
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors['dark-grey'][400],
        padding: 4,
        borderRadius: 16,
        flexDirection: 'column',
        gap: 4,
    },
    pickerOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    pickerOptionSelected: {
        backgroundColor: colors.primary[700],
    },
    pickerOptionText: {
        fontSize: ResponsiveFontSize(14),
        color: colors.black,
        textAlign: 'center',
    },
    pickerOptionTextSelected: {
        color: colors.white,
    },
    listContainer: {
        flexDirection: 'column',
        gap: 10,
    },
    menuButton: {
        backgroundColor: colors.primary[800],
        borderRadius: 100,
    },
});
