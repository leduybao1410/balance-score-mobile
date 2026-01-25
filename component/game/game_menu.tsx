import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useWindowDimensions, Platform, ScrollView } from 'react-native';
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

const GameMenu = (
    { isOpen, setIsOpen, setIsSummaryOpen, setIsAddPlayerOpen, setIsModifyBtn, selectedMode, setSelectedMode }
        :
        {
            isOpen: boolean,
            setIsOpen: (bool: boolean) => void,
            setIsSummaryOpen: (bool: boolean) => void,
            setIsAddPlayerOpen: (bool: boolean) => void,
            setIsModifyBtn: (bool: boolean) => void,
            selectedMode: GameState['selectedMode'],
            setSelectedMode: GameState['setSelectedMode']
        }
) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [orientation, setOrientation] = useState(isLandscape ? 'landscape' : 'portrait');

    // Update orientation state when dimensions change
    useEffect(() => {
        setOrientation(isLandscape ? 'landscape' : 'portrait');
    }, [isLandscape]);

    const { showAd } = useInterstitialAd();


    const [showConfirmExit, setShowConfirmExit] = useState(false);

    const onExit = () => {
        showAd();
        AsyncStorage.removeItem('gameData').then(() => {
            setIsOpen(false);
            router.back();
        })
    }

    type menuBtnProps = {
        name: string;
        action: () => void;
        bgColor?: string;
        textColor?: string;
    }

    const list: menuBtnProps[] = [
        { name: t('addPlayer'), action: () => { setIsAddPlayerOpen(true); setIsOpen(false) } },
        { name: t('showSummary'), action: () => { setIsSummaryOpen(true); setIsOpen(false) } },
        { name: t('modifyButton'), action: () => { setIsModifyBtn(true); setIsOpen(false) } },
        {
            name: t('exit'),
            bgColor: colors.red[600],
            action: () => {
                setIsOpen(false);
                setShowConfirmExit(true);
            },
        },
    ];


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

                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >

                    <ScrollView
                        contentContainerStyle={styles.menuContainer}
                        style={[
                            {
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                height: '100%',
                                width: isLandscape ? width * 0.3 : 208,
                                maxWidth: isLandscape ? width * 0.4 : 300,
                            }
                        ]}>
                        <View style={styles.content}>

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
                        </View>
                    </ScrollView>
                </TouchableOpacity>
            </Modal >
            <ConfirmPopup
                visible={showConfirmExit}
                confirmText={t('exit')}
                cancelText={t('cancel')}
                title={t('confirmExitTitle')}
                message={t('confirmExitMessage')}
                onConfirm={() => {
                    setShowConfirmExit(false);
                    setTimeout(() => onExit(), 1000)
                }}
                onCancel={() => {
                    setShowConfirmExit(false);
                }}
                onClose={() => {
                    setShowConfirmExit(false);
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuContainer: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8,
    },
    content: {
        flex: 1,
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    modeContainer: {
        flexDirection: 'column',
        padding: 8,
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
        backgroundColor: colors.primary[500],
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

export default GameMenu;