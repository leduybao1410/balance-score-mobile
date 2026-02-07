import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { playerList, playerListItem } from '@/component/game/game_data';
import { gameMode } from '@/component/game/game_side_controller';
import { History, HistoryItem, useGameHistory } from './useGameHistory';
import { useLocalSearchParams } from 'expo-router';
import { getConfigData } from '@/app/setting';


type GameMode = 'free' | 'with-host' | 'winner-takes-all';

export type GameState = {
    //STATE
    list: playerListItem[] | null;
    currentPool: number[] | null;
    selectedId: number | null;
    isSwapPlayerOpen: boolean;
    selectedMode: GameMode;
    selectedHost: number | null;
    history: History | null;
    startingScore: number;
    openChooseStartingScore: boolean;
    //ACTIONS
    setList: (list: playerListItem[] | null) => void;
    setCurrentPool: Dispatch<SetStateAction<number[] | null>>;
    setSelectedId: (selectedId: number | null) => void;
    setIsSwapPlayerOpen: (isSwapPlayerOpen: boolean) => void;
    setSelectedMode: (selectedMode: GameMode) => void;
    setSelectedHost: (selectedHost: number | null) => void;
    setHistory: (history: History | null) => void;
    addHistory: (history: HistoryItem, playerData: playerListItem[]) => void;
    setStartingScore: (startingScore: number) => void;
    setOpenChooseStartingScore: (openChooseStartingScore: boolean) => void;
}
export function useGameState(): GameState {
    const params = useLocalSearchParams();
    const folderName = (params.folderName as string) || '';
    const [startingScore, setStartingScore] = useState<number>(0);
    const [openChooseStartingScore, setOpenChooseStartingScore] = useState<boolean>(false);
    const [list, setList] = useState<playerListItem[] | null>(null);
    const [currentPool, setCurrentPool] = useState<number[] | null>([1, 2, 3, 4]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isSwapPlayerOpen, setIsSwapPlayerOpen] = useState<boolean>(false);
    const [selectedMode, setSelectedMode] = useState<GameMode>(gameMode[0].id);
    const [selectedHost, setSelectedHost] = useState<number | null>(null);

    const { history, setHistory, addHistory } = useGameHistory({ folderName, playerData: list || [] });

    useEffect(() => {
        getConfigData().then((data) => {
            const newList = data.map((item) => ({ ...item, point: 0 }));
            setList(newList);
        });
    }, [folderName])

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
        // Starting score state
        startingScore,
        setStartingScore,
        // Open choose starting score state
        openChooseStartingScore,
        setOpenChooseStartingScore,
    };
}
