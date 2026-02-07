import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { playerListItem } from "./game_data";
import { colors } from '@/constant/colors';
import { myFontStyle, ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';
import { t } from 'i18next';
import { HorizontalView, VerticalView } from '../view';
import CustomModal from '../modal/modal';
import { logEvent, AnalyticsEvents } from '@/utils/analytics';

const { width, height } = Dimensions.get('window');

const PopupAddPlayer = ({ isOpen, setIsOpen, currentPool, setCurrentPool, list, setList }:
    {
        isOpen: boolean, setIsOpen: (bool: boolean) => void, currentPool: number[] | null, setCurrentPool: (array: number[] | null) => void,
        list: playerListItem[] | null, setList: (array: playerListItem[] | null) => void
    }) => {
    const [showNameInput, setShowNameInput] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) setSelectedIds([]);
    }, [isOpen]);

    if (!currentPool) return null;
    const outsidePlayer = list?.filter(player => !currentPool.includes(player.id)) || [];

    const togglePlayerSelection = (playerId: number) => {
        setSelectedIds(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const addSelectedPlayers = () => {
        if (selectedIds.length === 0) return;
        logEvent(AnalyticsEvents.addPlayer, { count: selectedIds.length });
        const newList = [...currentPool, ...selectedIds];
        setCurrentPool(null);
        setTimeout(() => {
            setCurrentPool(newList);
            setSelectedIds([]);
            setIsOpen(false);
        }, 100);
    };

    const handleAddNewName = () => {
        if (!list || !currentPool) return;
        if (!newPlayerName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người chơi');
            return;
        }
        logEvent(AnalyticsEvents.addPlayer, { count: 1 });
        const randomBgColor = generateBackgroundColor();
        const randomTextColor = generateTextColor(randomBgColor);
        const newPlayer: playerListItem = {
            id: list.length + 1,
            name: newPlayerName.trim(),
            point: 0,
            total: 0,
            textColor: randomTextColor,
            bgColor: randomBgColor,
        }
        const newList = [...list];
        newList.push(newPlayer);
        setList(newList);
        const newCurrentPool = [...currentPool];
        newCurrentPool.push(newPlayer.id);
        setCurrentPool(null);
        setNewPlayerName('');
        setShowNameInput(false);
        setTimeout(() => {
            setCurrentPool(newCurrentPool);
            setIsOpen(false);
        }, 100)
    }

    return (
        <>
            <CustomModal
                open={isOpen}
                setOpen={setIsOpen}
                showTitle={false}
                showDivider={false}
                modalStyle={{
                    backgroundColor: colors.white,
                    width: width * 0.9,
                    minHeight: '50%',
                    maxWidth: width * 0.9,
                    maxHeight: '80%',
                }}
                showCloseButton={false}
            >
                <VerticalView alignItems='stretch' justifyContent='space-between' gap={16} >
                    <VerticalView alignItems="stretch" >
                        <Text style={styles.title}>{t('addPlayer')}</Text>
                        <ScrollView
                            style={styles.playerList}
                            contentContainerStyle={styles.playerListContent}
                        >
                            {outsidePlayer.map(player => {
                                const isSelected = selectedIds.includes(player.id);
                                return (
                                    <TouchableOpacity
                                        key={player.id}
                                        style={[styles.playerButton, isSelected && styles.playerButtonSelected]}
                                        onPress={() => togglePlayerSelection(player.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Checkbox
                                            value={isSelected}
                                            onValueChange={() => togglePlayerSelection(player.id)}
                                            color={colors['dark-grey'][700]}
                                            style={styles.playerCheckbox}
                                        />
                                        <Text style={[styles.playerButtonText, isSelected && styles.playerButtonTextSelected]} numberOfLines={1}>{player.name}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </VerticalView>
                    <HorizontalView gap={12} styles={{ flexGrow: 0 }}>
                        <Button
                            fullWidth={false}
                            title={t('addNewName')}
                            onClick={() => {
                                setIsOpen(false);
                                setTimeout(() => setShowNameInput(true), 500)
                            }}
                            style={styles.addButton}
                            textColor={colors['dark-grey'][800]}
                        />
                        <Button
                            fullWidth={false}
                            style={{ flex: 1 }}
                            // variant='outline'
                            title={t('addSelected')}
                            onClick={addSelectedPlayers}
                            // style={[
                            //     styles.addSelectedButton,
                            //     // selectedIds.length === 0 && styles.addSelectedButtonDisabled
                            // ]}
                            // textColor={colors.white}
                            disabled={selectedIds.length === 0}
                        />
                    </HorizontalView>
                </VerticalView>
            </CustomModal>
            {/* <Modal
                visible={showNameInput}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setShowNameInput(false);
                    setNewPlayerName('');
                }}
            >
                
            </Modal> */}
            <CustomModal
                open={showNameInput}
                setOpen={setShowNameInput}
                showTitle={false}
                showCloseButton={false}
                showDivider={false}
                modalStyle={{
                    backgroundColor: colors.white,
                    minHeight: '30%',
                    maxHeight: '60%',
                    width: '100%',
                    maxWidth: '90%',
                }}
            >
                <VerticalView alignItems="stretch" styles={{ width: '100%' }}>
                    <Text style={styles.inputTitle}>Nhập tên người chơi mới</Text>
                    <TextInput
                        style={styles.input}
                        value={newPlayerName}
                        onChangeText={setNewPlayerName}
                        placeholder={t('playerName')}
                        autoFocus
                    />
                    <View style={styles.inputButtons}>
                        <Button
                            title={t('cancel')}
                            onClick={() => {
                                setShowNameInput(false);
                                setNewPlayerName('');
                            }}
                            variant="outline"
                            style={styles.cancelButton}
                        />
                        <Button
                            title={t('apply')}
                            onClick={handleAddNewName}
                            style={styles.confirmButton}
                            textColor={colors.white}
                        />
                    </View>
                </VerticalView>
            </CustomModal>

        </>
    )
}

function generateBackgroundColor(): string {
    const colorClasses = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-gray-500",
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
}

function generateTextColor(bgColor: string): string {
    const colorMap: { [key: string]: string } = {
        "bg-red-500": "text-red-500",
        "bg-blue-500": "text-blue-500",
        "bg-green-500": "text-green-500",
        "bg-yellow-500": "text-yellow-500",
        "bg-purple-500": "text-purple-500",
        "bg-pink-500": "text-pink-500",
        "bg-indigo-500": "text-indigo-500",
        "bg-gray-500": "text-gray-500",
    };
    return colorMap[bgColor] || "text-gray-500";
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        width: width * 0.9,
        maxWidth: 400,
        minHeight: 200,
    },
    title: {
        textAlign: 'center',
        ...myFontStyle.normal,
        fontWeight: 'semibold',
        color: colors['dark-grey'][900],
    },
    playerList: {
        backgroundColor: colors['dark-grey'][300],
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors['dark-grey'][400],
    },
    playerListContent: {
        padding: 8,
        gap: 8,
    },
    playerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 12,
    },
    playerCheckbox: {
        margin: 0,
        borderRadius: 4,
        borderWidth: 1,
    },
    playerButtonText: {
        flex: 1,
        fontWeight: '600',
        fontSize: ResponsiveFontSize(18),
        color: colors['dark-grey'][900],
    },
    playerButtonTextSelected: {
        color: colors.white,
    },
    playerButtonSelected: {
        backgroundColor: colors['dark-grey'][600],
    },
    addSelectedButton: {
        backgroundColor: colors.primary[600],
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    addSelectedButtonDisabled: {
        opacity: 0.5,
    },
    addButton: {
        flex: 1,
        backgroundColor: colors['dark-grey'][300],
    },
    inputOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        width: width * 0.8,
        maxWidth: 400,
        gap: 16,
    },
    inputTitle: {
        fontSize: ResponsiveFontSize(18),
        fontWeight: '600',
        color: colors['dark-grey'][900],
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: colors['dark-grey'][300],
        borderRadius: 8,
        padding: 12,
        fontSize: ResponsiveFontSize(16),
        backgroundColor: colors.white,
    },
    inputButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: colors.primary[700],
    },
});

export default PopupAddPlayer;