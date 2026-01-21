import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import PlayerList from '@/component/game/game_player_list';
import SideController from '@/component/game/game_side_controller';
import { colors } from '@/constant/colors';
import { useGameState } from '@/hooks/useGameState';

export default function GameScreen() {
    const gameState = useGameState();

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <PlayerList
                gameState={gameState}
            />
            <SideController
                gameState={gameState}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary[950],
        flexDirection: 'column',
        overflow: 'hidden',
    },
    containerLandscape: {
        flexDirection: 'row',
    },
});

