import { playerListItem } from '@/component/game/game_data';
import { folderHelpers } from '@/libs/helpers/folder-helpers';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';
import { GameState } from './useGameState';


export type HistoryItem = {
    data: {
        id: number;
        point: number;
        host: boolean;
    }[];
    mode: GameState['selectedMode'];
    row: number;
}


export type History = {
    playerData: playerListItem[];
    history: HistoryItem[];
}

export type GameHistory = {
    history: History | null;
    setHistory: Dispatch<SetStateAction<History | null>>;
    addHistory: (history: HistoryItem, playerData: playerListItem[]) => void;
}

export function useGameHistory({ folderName, playerData }: { folderName: string, playerData: playerListItem[] }): GameHistory {
    const [history, setHistory] = useState<History | null>(null);

    useEffect(() => {
        if (!folderName) {
            setHistory({ playerData: playerData, history: [] });
            return;
        }

        folderHelpers.checkFileExists(folderName, 'history.json').then((exists) => {
            if (exists) {
                folderHelpers.readFileContent(folderName, 'history.json').then((content: string) => {
                    if (content) {
                        try {
                            const parsed = JSON.parse(content);
                            setHistory({
                                playerData: parsed.playerData || [],
                                history: parsed.history || []
                            });
                        } catch (error) {
                            console.error('Error parsing history:', error);
                            setHistory({ playerData: playerData, history: [] });
                        }
                    } else {
                        console.log('set history empty');
                        setHistory({ playerData: playerData, history: [] });
                    }
                }).catch((error) => {
                    console.error('Error reading history file:', error);
                    setHistory({ playerData: playerData, history: [] });
                });
            } else {
                console.log('create history file');
                folderHelpers.createFile(folderName, 'history.json', JSON.stringify({ playerData: playerData, history: [] }));
                setHistory({ playerData: playerData, history: [] });
            }
        }).catch((error) => {
            console.error('Error checking history file:', error);
            setHistory({ playerData: playerData, history: [] });
        });
    }, [folderName]);

    const addHistory = useCallback((history: HistoryItem, playerData: playerListItem[]) => {
        setHistory(prev => {
            if (!prev) return { playerData: playerData, history: [] };
            return { playerData: playerData, history: [...prev.history, history] };
        });
    }, [playerData]);

    useEffect(() => {
        if (history == null || !folderName) return;
        const optimizeData = history.history.map(item => ({
            d: item.data.map(data => ({
                id: data.id,
                p: data.point,
                h: data.host ? 1 : 0,
            })),
            m: item.mode === 'free' ? 0 : 1,
            r: item.row,
        }));
        const writeData = {
            playerData,
            history: optimizeData
        }
        folderHelpers.createFile(folderName, 'history.json', JSON.stringify(writeData));

    }, [history, folderName])



    return { history, setHistory, addHistory };
}