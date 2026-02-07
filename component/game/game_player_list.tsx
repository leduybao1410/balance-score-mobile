import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, useWindowDimensions, Alert, } from 'react-native';
import { playerListItem } from "./game_data";
import { MaterialIcons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constant/colors';
import { myFontStyle, ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';
import { GameState } from '@/hooks/useGameState';
import ChangeNamePopup from './game_popup_change_name';
import { styles } from './game_player_list.styles';

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
    { gameState }: { gameState: GameState, }
) {
    const { list, currentPool, selectedId, selectedMode, selectedHost } = gameState;
    const { setCurrentPool, setSelectedId, setIsSwapPlayerOpen, setSelectedHost } = gameState;

    const { width, height } = useWindowDimensions();
    const isLandscape = useMemo(() => width > height, [width, height]);
    const [showNameInput, setShowNameInput] = useState(false);
    const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
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
        setShowNameInput(true);
    }

    function handleSaveName(newPlayerName: string) {
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
        // Note: We're not calling setList here as it's passed as a prop
        // The parent component should handle the list update
    }

    const isHostMode = useMemo(() => selectedMode === 'with-host' || selectedMode === 'winner-takes-all', [selectedMode]);

    const PlayerItem = useCallback(({ playerId }: { playerId: number }) => {
        if (list == null) return null;

        const player: playerListItem | undefined = list.find(player => player.id == playerId);

        if (player == undefined) return null;

        const backgroundColor = getColorFromTailwindClass(player.bgColor, 'bg');
        const textColor = getColorFromTailwindClass(player.textColor, 'text');

        return (
            <TouchableOpacity
                key={player.id}
                style={[styles.playerCard, { backgroundColor, flexBasis: (isLandscape || width > 800) ? '31%' : '47%' }]}
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
                            <MaterialCommunityIcons name="eye-off" size={ResponsiveFontSize(16)} color={colors['dark-grey'][700]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.swapButton}
                            onPress={() => setIsSwapPlayerOpen(true)}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="swap-horiz" size={ResponsiveFontSize(20)} color={textColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.editButton, { borderRadius: ResponsiveFontSize(10) }]}
                            onPress={() => changeName(player.id)}
                            activeOpacity={0.7}
                        >
                            <FontAwesome name="pencil" size={ResponsiveFontSize(20)} color={colors.white} />
                        </TouchableOpacity>

                        {!isHostMode ? (
                            <View style={styles.editLabel}>
                                <Text style={[styles.editLabelText, {
                                    color: textColor,
                                    ...myFontStyle.small
                                }]}>
                                    Edit
                                </Text>
                            </View>
                        ) : (
                            isHostMode && selectedHost === player.id ? (
                                <Button
                                    title="UnHost"
                                    fullWidth={false}
                                    onClick={() => setSelectedHost(null)}
                                    style={[styles.hostButton, { backgroundColor: colors.white }]}
                                    textColor={textColor}
                                    textStyle={{ ...myFontStyle.normal }}
                                    fontSize={ResponsiveFontSize(20)}
                                />
                            ) : (
                                <Button
                                    title="Host"
                                    fullWidth={false}
                                    onClick={() => setSelectedHost(player.id)}
                                    style={[styles.hostButton, { backgroundColor: colors.white }]}
                                    textColor={textColor}
                                    textStyle={{ ...myFontStyle.normal }}
                                    fontSize={ResponsiveFontSize(20)}
                                />
                            )
                        )}
                    </>
                )}
            </TouchableOpacity>
        )
    }, [list, selectedId, selectedHost, isLandscape, selectedMode]);

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
            <ChangeNamePopup
                setEditingPlayerId={setEditingPlayerId}
                open={showNameInput}
                setOpen={setShowNameInput}
                playerName={editingPlayerName || ''}
                handleSaveName={handleSaveName}
            />
        </>
    );
}

