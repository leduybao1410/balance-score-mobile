import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { playerList, playerListItem } from '@/component/game/game_data';
import PlayerList from '@/component/game/game_player_list';
import SideController, { gameMode } from '@/component/game/game_side_controller';
import { colors } from '@/constant/colors';

export default function GameScreen() {
    // const [gameID, setGameID] = useState<number | null>(null);
    const [list, setList] = useState<playerListItem[] | null>(playerList);
    const [currentPool, setCurrentPool] = useState<number[] | null>([1, 2, 3, 4]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isSwapPlayerOpen, setIsSwapPlayerOpen] = useState<boolean>(false);
    const [selectedMode, setSelectedMode] = useState<string>(gameMode[0].name);
    const [selectedHost, setSelectedHost] = useState<number | null>(null);

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    useEffect(() => {
        if (selectedMode == gameMode[0].name) {
            setSelectedHost(null);
        }
    }, [selectedMode]);

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <PlayerList
                selectedHost={selectedHost}
                setSelectedHost={setSelectedHost}
                selectedMode={selectedMode}
                setIsSwapPlayerOpen={setIsSwapPlayerOpen}
                list={list}
                currentPool={currentPool}
                selecetedId={selectedId}
                setSelectedID={setSelectedId}
                setCurrentPool={setCurrentPool}
            />
            <SideController
                selectedHost={selectedHost}
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                isSwapPlayerOpen={isSwapPlayerOpen}
                setIsSwapPlayerOpen={setIsSwapPlayerOpen}
                list={list}
                currentPool={currentPool}
                setCurrentPool={setCurrentPool}
                setList={setList}
                selecetedId={selectedId}
                setSelectedID={setSelectedId}
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

