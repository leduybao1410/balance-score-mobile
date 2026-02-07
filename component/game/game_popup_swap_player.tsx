import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { playerList } from "./game_data";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';

const { width, height } = Dimensions.get('window');

const PopupSwapPlayer = ({ selecetedId, setSelectedID, isOpen, setIsOpen, currentPool, setCurrentPool }:
    {
        selecetedId: number | null,
        setSelectedID: (id: number | null) => void,
        isOpen: boolean,
        setIsOpen: (bool: boolean) => void,
        currentPool: number[] | null,
        setCurrentPool: Dispatch<SetStateAction<number[] | null>>,
    }) => {
    if (!currentPool) return null;
    const outsidePlayer = playerList.filter(player => !currentPool.includes(player.id))

    const swapPlayer = (playerId: number) => {
        const newList = currentPool.filter(id => id !== selecetedId);

        newList.push(playerId);
        console.log('newList', newList, playerId);
        setCurrentPool(() => ([...newList]));
        setIsOpen(false);
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
                        <Text style={styles.title}>Đổi người</Text>
                        <ScrollView
                            style={styles.playerList}
                            contentContainerStyle={styles.playerListContent}
                        >
                            {outsidePlayer.map(player => (
                                <TouchableOpacity
                                    key={player.id}
                                    style={styles.playerButton}
                                    onPress={() => swapPlayer(player.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.playerButtonText}>{player.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
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
        backgroundColor: colors['dark-grey'][300],
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors['dark-grey'][400],
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
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    playerButtonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: ResponsiveFontSize(16),
        color: colors['dark-grey'][900],
    },
});

export default PopupSwapPlayer;