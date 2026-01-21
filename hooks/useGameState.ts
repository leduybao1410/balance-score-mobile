import { useState, useEffect } from 'react';
import { playerList, playerListItem } from '@/component/game/game_data';
import { gameMode } from '@/component/game/game_side_controller';
import { History, HistoryItem, useGameHistory } from './useGameHistory';
import { useLocalSearchParams } from 'expo-router';


export type GameState = {
    //STATE
    list: playerListItem[] | null;
    currentPool: number[] | null;
    selectedId: number | null;
    isSwapPlayerOpen: boolean;
    selectedMode: 'free' | 'with-host';
    selectedHost: number | null;
    history: History | null;
    //ACTIONS
    setList: (list: playerListItem[] | null) => void;
    setCurrentPool: (currentPool: number[] | null) => void;
    setSelectedId: (selectedId: number | null) => void;
    setIsSwapPlayerOpen: (isSwapPlayerOpen: boolean) => void;
    setSelectedMode: (selectedMode: 'free' | 'with-host') => void;
    setSelectedHost: (selectedHost: number | null) => void;
    setHistory: (history: History | null) => void;
    addHistory: (history: HistoryItem, playerData: playerListItem[]) => void;
}
export function useGameState(): GameState {
    const params = useLocalSearchParams();
    const folderName = (params.folderName as string) || '';
    const [list, setList] = useState<playerListItem[] | null>(playerList);
    const [currentPool, setCurrentPool] = useState<number[] | null>([1, 2, 3, 4]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isSwapPlayerOpen, setIsSwapPlayerOpen] = useState<boolean>(false);
    const [selectedMode, setSelectedMode] = useState<'free' | 'with-host'>('free');
    const [selectedHost, setSelectedHost] = useState<number | null>(null);

    const { history, setHistory, addHistory } = useGameHistory({ folderName, playerData: list || [] });

    // Reset selectedHost when mode changes to "Tự do"
    useEffect(() => {
        if (selectedMode === gameMode[0].name) {
            setSelectedHost(null);
        }
    }, [selectedMode]);

    return {
        // List state
        list,
        setList,
        // Current pool state
        currentPool,
        setCurrentPool,
        // Selected ID state
        selectedId,
        setSelectedId,
        // Swap player state
        isSwapPlayerOpen,
        setIsSwapPlayerOpen,
        // Selected mode state
        selectedMode,
        setSelectedMode,
        // Selected host state
        selectedHost,
        setSelectedHost,
        // History state
        history,
        setHistory,
        addHistory,
    };
}
