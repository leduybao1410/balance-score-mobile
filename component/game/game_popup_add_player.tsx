import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { playerList, playerListItem } from "./game_data";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';

const { width, height } = Dimensions.get('window');

const PopupAddPlayer = ({ isOpen, setIsOpen, currentPool, setCurrentPool, list, setList }:
    {
        isOpen: boolean, setIsOpen: (bool: boolean) => void, currentPool: number[] | null, setCurrentPool: (array: number[] | null) => void,
        list: playerListItem[] | null, setList: (array: playerListItem[] | null) => void
    }) => {
    const [showNameInput, setShowNameInput] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');

    if (!currentPool) return null;
    const outsidePlayer = playerList.filter(player => !currentPool.includes(player.id))

    const addPlayer = (playerId: number) => {
        const newList = [...currentPool];
        newList.push(playerId);
        setCurrentPool(null);
        setTimeout(() => {
            setCurrentPool(newList);
            setIsOpen(false);
        }, 100)
    }

    const handleAddNewName = () => {
        if (!list || !currentPool) return;
        if (!newPlayerName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên người chơi');
            return;
        }
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
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setIsOpen(false)}
            >
                <View style={styles.popupContainer}>
                    <View style={styles.popup}>
                        <Text style={styles.title}>Thêm người chơi</Text>
                        <ScrollView
                            style={styles.playerList}
                            contentContainerStyle={styles.playerListContent}
                        >
                            {outsidePlayer.map(player => (
                                <TouchableOpacity
                                    key={player.id}
                                    style={styles.playerButton}
                                    onPress={() => addPlayer(player.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.playerButtonText}>{player.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button
                            title="Thêm tên mới"
                            onClick={() => setShowNameInput(true)}
                            style={styles.addButton}
                            textColor={colors.white}
                        />
                        {showNameInput && (
                            <Modal
                                visible={showNameInput}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={() => {
                                    setShowNameInput(false);
                                    setNewPlayerName('');
                                }}
                            >
                                <View style={styles.inputOverlay}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputTitle}>Nhập tên người chơi mới</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={newPlayerName}
                                            onChangeText={setNewPlayerName}
                                            placeholder="Tên người chơi"
                                            autoFocus
                                        />
                                        <View style={styles.inputButtons}>
                                            <Button
                                                title="Hủy"
                                                onClick={() => {
                                                    setShowNameInput(false);
                                                    setNewPlayerName('');
                                                }}
                                                variant="outline"
                                                style={styles.cancelButton}
                                            />
                                            <Button
                                                title="Thêm"
                                                onClick={handleAddNewName}
                                                style={styles.confirmButton}
                                                textColor={colors.white}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
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
    popup: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        gap: 8,
        maxHeight: height * 0.75,
    },
    title: {
        textAlign: 'center',
        fontSize: ResponsiveFontSize(20),
        fontWeight: 'bold',
        color: colors['dark-grey'][900],
        marginBottom: 8,
    },
    playerList: {
        backgroundColor: colors.green[600],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors['dark-grey'][400],
        maxHeight: height * 0.4,
    },
    playerListContent: {
        padding: 8,
        gap: 8,
    },
    playerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    playerButtonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: ResponsiveFontSize(18),
        color: colors['dark-grey'][900],
    },
    addButton: {
        backgroundColor: colors.primary[500],
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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