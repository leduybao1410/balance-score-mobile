import { useEffect, useState, useMemo, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playerListItem } from "@/component/game/game_data";
import { GameState } from "./useGameState";
import { HistoryItem } from "./useGameHistory";
import { gameMode } from "@/component/game/game_side_controller";

export function useSideController(gameState: GameState) {
    const { list, currentPool, selectedId, selectedMode, selectedHost, addHistory } = gameState;
    const { setCurrentPool, setList } = gameState;

    // UI State
    const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState<boolean>(false);
    const [isModifyBtn, setIsModifyBtn] = useState<boolean>(false);
    const [isDialogOpen, setIsDialog] = useState<boolean>(false);

    // Button configuration state
    const [singlePointValue, setSinglePointValue] = useState<number[] | null>([-1, 1]);
    const [multiplePointValue, setMultiplePointValue] = useState<number[] | null>([-4, -2, 2, 4]);

    // Check for existing game data on mount
    useEffect(() => {
        AsyncStorage.getItem('gameData').then((token) => {
            if (token) {
                setIsDialog(true);
            }
        });
    }, []);

    // Initialize existing game from storage
    const initialzedExistGame = useCallback(async () => {
        const token = await AsyncStorage.getItem('gameData');
        if (!token) return;
        const { newList, currentPool } = JSON.parse(token);
        setList(newList);
        setCurrentPool(currentPool);
    }, [setList, setCurrentPool]);

    // Calculate balance score with optimized O(n) complexity
    const balanceScore = useMemo(() => {
        if (!list || !currentPool) return 0;

        // Create a Map for O(1) lookups instead of O(n) find operations
        const playerMap = new Map(list.map(player => [player.id, player]));

        return currentPool.reduce((balance, playerId) => {
            const player = playerMap.get(playerId);
            return balance + (player?.point ?? 0);
        }, 0);
    }, [list, currentPool]);


    const addPoint = useCallback((value: number) => {
        if (selectedId == null) {
            Alert.alert('Thông báo', 'vui lòng chọn người chơi để cộng điểm!');
            return;
        }
        if (selectedId === selectedHost) {
            Alert.alert('Thông báo', 'Vui lòng UnHost nhà cái để có thể điều chỉnh thủ công điểm của nhà cái');
            return;
        }
        if (!list) return;

        const newList = [...list];
        let hostIndex = null;
        if (selectedMode === 'with-host' && selectedHost) {
            hostIndex = newList.findIndex(player => player.id === selectedHost);
        }
        const playerIndex = newList.findIndex(player => player.id === selectedId);
        if (playerIndex === -1) return;

        newList[playerIndex] = { ...newList[playerIndex], point: newList[playerIndex].point + value };
        if (selectedMode === 'with-host' && hostIndex !== null) {
            newList[hostIndex] = { ...newList[hostIndex], point: newList[hostIndex].point - value };
        }
        setList(newList);

    }, [selectedId, selectedHost, selectedMode, list, setList]);

    const [rowIndex, setRowIndex] = useState<number>(1);
    // Proceed with summary after confirmation
    const proceedWithSummary = useCallback(async () => {
        if (!list || !currentPool) return;

        // Optimize: create Map for O(1) lookups instead of multiple find operations
        const newList = list.map(player => ({ ...player }));
        const playerMap = new Map(newList.map(player => [player.id, player]));

        const newHistory: HistoryItem = {
            data: currentPool.map(playerId => {
                const player = playerMap.get(playerId);
                if (player) {
                    return { id: player.id, point: player.point, host: player.id === selectedHost };
                }
                return null;
            }).filter(history => history !== null) as { id: number; point: number; host: boolean }[],
            row: rowIndex,
            mode: selectedMode,
        };

        addHistory(newHistory, newList);

        currentPool.forEach(playerId => {
            const player = playerMap.get(playerId);
            if (player) {
                player.total += player.point;
                player.point = 0;
            }
        });


        setList(newList);
        setRowIndex(prev => prev + 1);
    }, [list, currentPool, addHistory, setList, selectedId, balanceScore]);

    // Handle summary with balance check
    const summary = useCallback(async () => {
        if (!list || !currentPool) return;

        if (balanceScore !== 0) {
            Alert.alert(
                'Cảnh báo',
                'Điểm đang không cân bằng bạn có muốn tiếp tục?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Tiếp tục',
                        onPress: proceedWithSummary
                    },
                ]
            );
            return;
        }

        await proceedWithSummary();
    }, [list, currentPool, balanceScore, proceedWithSummary]);

    // Menu handlers
    const showMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, []);

    // Dialog handlers
    const handleDialogConfirm = useCallback(() => {
        initialzedExistGame();
        setIsDialog(false);
    }, [initialzedExistGame]);

    const handleDialogCancel = useCallback(() => {
        setIsDialog(false);
    }, []);

    return {
        // State
        balanceScore,
        isSummaryOpen,
        isMenuOpen,
        isAddPlayerOpen,
        isModifyBtn,
        isDialogOpen,
        singlePointValue,
        multiplePointValue,

        // Setters
        setIsSummaryOpen,
        setIsMenuOpen,
        setIsAddPlayerOpen,
        setIsModifyBtn,
        setSinglePointValue,
        setMultiplePointValue,

        // Handlers
        addPoint,
        summary,
        showMenu,
        handleDialogConfirm,
        handleDialogCancel,
    };
}
