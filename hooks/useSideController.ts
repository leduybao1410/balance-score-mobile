import { useEffect, useState, useMemo, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playerListItem } from "@/component/game/game_data";
import { GameState } from "./useGameState";
import { HistoryItem } from "./useGameHistory";
import { useInterstitialAd } from "@/context/interstitial-ad-context";
import { t } from "i18next";
import { AnalyticsEvents, logEvent } from "@/utils/analytics";

export function useSideController(gameState: GameState) {
    const { list, currentPool, selectedId, selectedMode, selectedHost, startingScore } = gameState;
    const { setCurrentPool, setList, setStartingScore, addHistory } = gameState;

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
            console.log('gameData', token)
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
            return balance + (player?.point ?? 0) - startingScore;
        }, 0);
    }, [list, currentPool]);

    const addPointForHostMode = useCallback((newList: playerListItem[], value: number, hostIndex: number) => {
        if (hostIndex === -1) return;
        newList[hostIndex] = { ...newList[hostIndex], point: newList[hostIndex].point - value };
    }, []);

    const addPointForWinnerTakesAllMode = useCallback((newList: playerListItem[], value: number, hostIndex: number) => {
        if (!list || !currentPool) return;
        if (hostIndex === -1) return;
        newList.forEach((player) => {
            if (player.id !== selectedHost) {
                player.point -= value;
            }
        });
    }, [list, currentPool, selectedHost]);


    const addPoint = useCallback((value: number) => {
        if (selectedId == null) {
            Alert.alert('Thông báo', 'vui lòng chọn người chơi để cộng điểm!');
            return;
        }

        if (selectedId === selectedHost && selectedMode === 'with-host') {
            Alert.alert('Thông báo', 'Vui lòng UnHost nhà cái để có thể điều chỉnh thủ công điểm của nhà cái');
            return;
        }

        if (selectedMode !== 'free' && selectedHost == null) {
            Alert.alert('Thông báo', 'Vui lòng chọn nhà cái để có thể cộng điểm!');
            return;
        }

        if (!list) return;


        const newList = [...list];

        const playerIndex = newList.findIndex(player => player.id === selectedId);
        if (playerIndex === -1) return;

        if (selectedMode !== 'winner-takes-all') {

            newList[playerIndex] = { ...newList[playerIndex], point: newList[playerIndex].point + value };
        }

        const hostIndex = newList.findIndex(player => player.id === selectedHost);
        if (selectedMode === 'with-host' && selectedHost && hostIndex !== -1) {
            addPointForHostMode(newList, value, hostIndex);
        }

        if (selectedMode === 'winner-takes-all' && selectedHost && hostIndex !== -1) {
            const quantity = ((currentPool?.length ?? 0) - 1);
            newList[hostIndex] = { ...newList[hostIndex], point: newList[hostIndex].point + (value * quantity) };
            addPointForWinnerTakesAllMode(newList, value, hostIndex);
        }

        setList(newList);

    }, [selectedId, selectedHost, selectedMode, list, setList, currentPool]);


    const { showAd } = useInterstitialAd();
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
        // console.log('newList', newList);
        // console.log('newHistory', newHistory);

        currentPool.forEach(playerId => {
            const player = playerMap.get(playerId);
            if (player) {
                player.total += player.point;
                player.point = (startingScore ?? 0);
            }
        });


        setList(newList);
        setRowIndex(prev => prev + 1);
        if (rowIndex % 5 === 0) {
            showAd();
        }
    }, [list, currentPool, addHistory, setList, selectedId, balanceScore]);

    // Handle summary with balance check
    const summary = useCallback(async () => {
        if (!list || !currentPool) return;
        logEvent(AnalyticsEvents.next_set, {
            game_index: rowIndex,
        });
        const modeLog = selectedMode === 'free' ?
            AnalyticsEvents.mode_free
            :
            selectedMode === 'with-host' ?
                AnalyticsEvents.mode_with_host
                :
                AnalyticsEvents.mode_winner_takes_all;

        logEvent(modeLog);
        if (balanceScore == 0 && list.every(player => player.point === startingScore)) {
            Alert.alert(
                t('alertTitle'),
                t('noChangeInGame'),
                [
                    { text: t('ok'), style: 'default' },
                ]
            );
            return;
        }

        if (balanceScore !== 0) {
            Alert.alert(
                t('alertTitle'),
                t('warningBalanceNotEqual'),
                [
                    { text: t('cancel'), style: 'cancel' },
                    {
                        text: t('continue'),
                        onPress: proceedWithSummary
                    },
                ]
            );
            return;
        }

        await proceedWithSummary();
    }, [list, currentPool, balanceScore, proceedWithSummary, selectedMode]);

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

    const resetGame = useCallback(() => {
        if (!list) return;
        const newList = [...list];
        newList.map(player => {
            return { ...player, point: 0 };
        });
        setList(newList);
    }, [setList, list]);

    const onSelectStartingScore = useCallback((startingScore: number) => {
        if (!list) return;
        setStartingScore(startingScore);
        setList(list.map(player => ({ ...player, point: startingScore })));
    }, [setStartingScore, list]);

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
        resetGame,
        onSelectStartingScore,
    };
}
