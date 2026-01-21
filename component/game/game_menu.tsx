import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useWindowDimensions, Platform } from 'react-native';
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

    const { showAd } = useInterstitialAd();


    const list = [
        { name: t('addPlayer'), action: () => { setIsAddPlayerOpen(true); setIsOpen(false) } },
        { name: t('showSummary'), action: () => { setIsSummaryOpen(true); setIsOpen(false) } },
        { name: t('modifyButton'), action: () => { setIsModifyBtn(true); setIsOpen(false) } },
        {
            name: t('exit'),
            action: () => {
                showAd(() => {
                    AsyncStorage.removeItem('gameData').then(() => {
                        setIsOpen(false);
                        router.back();
                    })

                });
            }
        },
    ];


    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsOpen(false)}
        >

            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setIsOpen(false)}
            >
                <View style={[
                    styles.menuContainer,
                    {
                        width: isLandscape ? width * 0.3 : 208,
                        maxWidth: isLandscape ? width * 0.4 : 300,
                    }
                ]}>
                    <View style={styles.content}>
                        <LanguageSelector />
                        <View style={styles.modeContainer}>

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
                                    style={styles.menuButton}
                                    textColor={colors.white}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        backgroundColor: colors.white,
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        gap: 8,
    },
    modeContainer: {
        flexDirection: 'column',
        padding: 8,
        paddingVertical: 16,
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
        gap: 8,
    },
    menuButton: {
        backgroundColor: colors.primary[800],
        borderRadius: 8,
    },
});

export default GameMenu;