import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, useWindowDimensions, Alert, } from 'react-native';
import { playerListItem } from "./game_data";
import { MaterialIcons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { gameMode } from "./game_side_controller";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';
import { GameState, useGameState } from '@/hooks/useGameState';
import { t } from 'i18next';

// Helper function to convert Tailwind color classes to React Native color values
function getColorFromTailwindClass(colorClass: string, type: 'bg' | 'text' = 'bg'): string {
    if (!colorClass) return colors['dark-grey'][500];

    // Remove bg- or text- prefix
    const colorName = colorClass.replace(/^(bg-|text-)/, '');

    // Handle gray/grey mapping
    if (colorName.startsWith('gray-')) {
        const shade = colorName.split('-')[1] as any;
        return (colors['dark-grey'] as any)[shade] || colors['dark-grey'][500];
    }

    // Split color name and shade (e.g., "red-500" -> ["red", "500"])
    const parts = colorName.split('-');
    if (parts.length !== 2) return colors['dark-grey'][500];

    const [colorNamePart, shade] = parts;

    // Map color names (handle blue -> primary, indigo -> primary, etc.)
    let mappedColorName = colorNamePart;
    if (colorNamePart === 'blue' || colorNamePart === 'indigo') {
        mappedColorName = 'primary';
    }

    // Get color from colors constant
    const colorObj = (colors as any)[mappedColorName];
    if (!colorObj) return colors['dark-grey'][500];

    const shadeNum = parseInt(shade, 10);
    const shadeKey = shadeNum as keyof typeof colorObj;

    return colorObj[shadeKey] || colors['dark-grey'][500];
}

export default function PlayerList(
    { gameState }
        :
        {
            gameState: GameState,
        }
) {
    const { list, currentPool, selectedId, isSwapPlayerOpen, selectedMode, selectedHost } = gameState;
    const { setCurrentPool, setSelectedId, setIsSwapPlayerOpen, setSelectedMode, setSelectedHost } = gameState;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [showNameInput, setShowNameInput] = useState(false);
    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
    const [newPlayerName, setNewPlayerName] = useState('');
    const editingPlayerName = useMemo(() => {
        return editingPlayerId && list?.find(p => p.id === editingPlayerId)?.name;
    }, [editingPlayerId, list]);

    function hidePlayer(playerId: number) {
        const newList = currentPool?.filter(id => id !== playerId);
        if (!newList) return;
        setCurrentPool(null);
        setSelectedId(null);
        setTimeout(() => {
            setCurrentPool(newList);
        }, 100)
    }

    function changeName(playerId: number) {
        const playerIndex = list?.findIndex(player => player.id == playerId);
        if (playerIndex === undefined || playerIndex === -1) return;
        setEditingPlayerId(playerId);
        setNewPlayerName(list![playerIndex].name);
        setShowNameInput(true);
    }

    function handleSaveName() {
        if (!list || editingPlayerId === null || !newPlayerName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên hợp lệ');
            return;
        }
        const playerIndex = list.findIndex(player => player.id === editingPlayerId);
        if (playerIndex === -1) return;
        const newList = [...list];
        newList[playerIndex].name = newPlayerName.trim();
        setShowNameInput(false);
        setEditingPlayerId(null);
        setNewPlayerName('');
        // Note: We're not calling setList here as it's passed as a prop
        // The parent component should handle the list update
    }

    const isHostMode = useMemo(() => selectedMode === 'with-host', [selectedMode]);

    function PlayerItem({ playerId }: { playerId: number }) {
        if (list == null) return null;

        const player: playerListItem | undefined = list.find(player => player.id == playerId);

        if (player == undefined) return null;

        const backgroundColor = getColorFromTailwindClass(player.bgColor, 'bg');
        const textColor = getColorFromTailwindClass(player.textColor, 'text');

        return (
            <TouchableOpacity
                key={player.id}
                style={[styles.playerCard, { backgroundColor, flexBasis: isLandscape ? '31%' : '47%' }]}
                onPress={() => setSelectedId(player.id)}
                activeOpacity={0.8}
            >
                {isHostMode && selectedHost == player.id && (
                    <FontAwesome5 name="crown" size={ResponsiveFontSize(32)} color={colors.white} style={styles.crownIcon} />
                )}
                <Text style={[styles.playerName, { fontSize: isLandscape ? ResponsiveFontSize(14) : ResponsiveFontSize(24) }]}>{player.name}</Text>
                <Text style={styles.playerScore}>{player.point}</Text>
                {(player.id == selectedId) && (
                    <>
                        <TouchableOpacity
                            style={styles.hideButton}
                            onPress={() => hidePlayer(player.id)}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="eye-off" size={ResponsiveFontSize(20)} color={colors['dark-grey'][700]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.swapButton}
                            onPress={() => setIsSwapPlayerOpen(true)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="swap-horiz" size={ResponsiveFontSize(20)} color={textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.editButton, { borderRadius: isLandscape ? ResponsiveFontSize(12) : ResponsiveFontSize(25) }]}
                            onPress={() => changeName(player.id)}
                            activeOpacity={0.7}
                        >
                            <FontAwesome name="pencil" size={ResponsiveFontSize(20)} color={colors.white} />
                        </TouchableOpacity>

                        {!isHostMode ? (
                            <View style={styles.editLabel}>
                                <Text style={[styles.editLabelText, { color: textColor, fontSize: isLandscape ? ResponsiveFontSize(14) : ResponsiveFontSize(20) }]}>Edit</Text>
                            </View>
                        ) : (
                            isHostMode && selectedHost === player.id ? (
                                <Button
                                    title="UnHost"
                                    onClick={() => setSelectedHost(null)}
                                    style={[styles.hostButton, { backgroundColor: colors.white }]}
                                    textColor={textColor}
                                    fontSize={ResponsiveFontSize(20)}
                                />
                            ) : (
                                <Button
                                    title="Host"
                                    onClick={() => setSelectedHost(player.id)}
                                    style={[styles.hostButton, { backgroundColor: colors.white }]}
                                    textColor={textColor}
                                    fontSize={ResponsiveFontSize(20)}
                                />
                            )
                        )}
                    </>
                )}
            </TouchableOpacity>
        )
    }

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
            >
                {(currentPool) && currentPool.map(playerId => (<PlayerItem key={playerId} playerId={playerId} />))}
            </ScrollView>
            <Modal
                visible={showNameInput}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setShowNameInput(false);
                    setEditingPlayerId(null);
                    setNewPlayerName('');
                }}
            >
                <View style={styles.nameInputOverlay}>
                    <View style={[styles.nameInputContainer, { width: isLandscape ? width * 0.4 : width * 0.8 }]}>
                        <Text style={styles.nameInputTitle}>
                            {t('enterNewNameFor', { name: editingPlayerName })}
                        </Text>
                        <TextInput
                            style={styles.nameInput}
                            value={newPlayerName}
                            onChangeText={setNewPlayerName}
                            placeholder={t('playerName')}
                            autoFocus
                        />
                        <View style={styles.nameInputButtons}>
                            <Button
                                title={t('cancel')}
                                onClick={() => {
                                    setShowNameInput(false);
                                    setEditingPlayerId(null);
                                    setNewPlayerName('');
                                }}
                                variant="outline"
                                style={styles.nameInputCancelButton}
                            />
                            <Button
                                title={t('save')}
                                onClick={handleSaveName}
                                style={styles.nameInputSaveButton}
                                textColor={colors.white}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'flex-start',
        paddingBottom: 16,
    },
    playerCard: {
        minHeight: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        position: 'relative',
    },
    crownIcon: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    playerName: {
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 8,
    },
    playerScore: {
        color: colors.white,
        fontSize: ResponsiveFontSize(100),
        lineHeight: ResponsiveFontSize(100),
        fontWeight: 'bold',
    },
    hideButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: colors['light-grey'][100],
        borderRadius: ResponsiveFontSize(20),
        width: ResponsiveFontSize(32),
        height: ResponsiveFontSize(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    swapButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: colors.white,
        borderRadius: ResponsiveFontSize(25),
        width: ResponsiveFontSize(40),
        height: ResponsiveFontSize(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: ResponsiveFontSize(40),
        height: ResponsiveFontSize(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    editLabel: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editLabelText: {
        fontWeight: 'bold',
    },
    hostButton: {
        position: 'absolute',
        left: '50%',
        bottom: 40,
        transform: [{ translateX: -40 }],
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    nameInputOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameInputContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        maxWidth: 400,
        gap: 16,
    },
    nameInputTitle: {
        fontSize: ResponsiveFontSize(18),
        fontWeight: '600',
        color: colors['dark-grey'][900],
        textAlign: 'center',
    },
    nameInput: {
        borderWidth: 1,
        borderColor: colors['dark-grey'][300],
        borderRadius: 8,
        padding: 12,
        fontSize: ResponsiveFontSize(16),
        backgroundColor: colors.white,
    },
    nameInputButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    nameInputCancelButton: {
        flex: 1,
    },
    nameInputSaveButton: {
        flex: 1,
        backgroundColor: colors.primary[700],
    },
});
