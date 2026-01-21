
import { useState, useEffect, useMemo } from "react";
import { View, Modal, TouchableOpacity, Alert, Text, FlatList } from "react-native";
import { playerListItem } from "./game_data";
import * as XLSX from "xlsx";
import { lineDataType } from "../chart/sample_data";
import { Button } from "../button/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import DataTable, { COL_TYPES } from "react-native-datatable-component-v2";
import HistorySheet from "./summary-popup/history-sheet";
import { GameState } from "@/hooks/useGameState";

type playerSum = {
    id: number;
    total: number;
    name: string;
    cellIndex: number;
    history: number[];
}

type TableHeader = {
    label: string;
    id?: string; // For player headers: 'player-th-{id}'
    playerId?: number; // For player headers
}

type PopupSummaryProps = {
    gameState: GameState;
    isSummaryOpen: boolean;
    setIsSummaryOpen: (bool: boolean) => void;
}

const PopupSummary = ({ gameState, isSummaryOpen, setIsSummaryOpen }: PopupSummaryProps) => {
    const { list, currentPool } = gameState;
    const { history } = gameState;


    return (
        <Modal
            visible={isSummaryOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsSummaryOpen(false)}
        >
            <View style={{
                padding: 16,
                gap: 8,
                position: 'absolute',
                width: '90%',
                height: '90%',
                top: '5%',
                left: '5%',
                borderRadius: 8,
                backgroundColor: 'white',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <HistorySheet history={history || ({ playerData: list || [], history: [] })} />
                {/* <DataTable
                        data={list?.filter((item: playerListItem) => currentPool?.some(id => id === item.id))} // list of objects
                        // colNames={tableHeaders.map((item: TableHeader) => item.label)} //List of Strings
                        // colSettings={filterTableData.map((item: playerSum) => ({ name: item.name, type: COL_TYPES.STRING, width: '40%' }))}//List of Objects
                        noOfPages={1} //number
                        // backgroundColor={'rgba(23,2,4,0.2)'} //Table Background Color
                        // headerLabelStyle={{ color: 'grey', fontSize: 12 }} //Text Style Works
                        style={{ flex: 1 }}
                    /> */}

                {/* {!isExcelShow && <View style={{ flex: 0.8, backgroundColor: 'white' }}>
                        <LineGraph style="rounded-lg" datasets={datasets} labels={labels} />
                    </View>} */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        title="Export"
                        onClick={() => { }}
                        style={{ backgroundColor: '#10b981', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}
                        textColor="#ffffff"
                        fullWidth={false}
                    />
                    {/* <MySwitchButton swPaddingHorizontal="4" firstLable="Lịch sử" secondLabel="Biểu đồ" isOn={isExcelShow} setIsOn={setIsExcelShow} /> */}
                    <Button
                        title="Close"
                        onClick={() => setIsSummaryOpen(false)}
                        style={{ backgroundColor: '#ef4444', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}
                        textColor="#ffffff"
                        fullWidth={false}
                    />
                </View>

            </View>
        </Modal>
    )
}

export default PopupSummary;

// Helper function to get table headers from AsyncStorage data
export async function getTableHeadersFromStorage(playerList: playerListItem[], pool: number[]): Promise<string[]> {
    try {
        const headers: string[] = ['#', 'Game', 'Host'];
        pool.forEach((playerId: number) => {
            const player = playerList.find((item: playerListItem) => item.id === playerId);
            if (player) {
                headers.push(player.name);
            }
        });
        return headers;
    } catch (e) {
        return [];
    }
}

// Legacy function for web compatibility - now delegates to AsyncStorage version
export function getTableHeaders(table: HTMLElement): string[] {
    if (typeof document === 'undefined') return [];
    try {
        const headers: string[] = [];
        const headerCells = table.querySelectorAll("thead th");
        headerCells.forEach((cell) => {
            headers.push(cell.textContent || "");
        });
        return headers;
    } catch (e) {
        return [];
    }
}

// Helper function to extract player data from AsyncStorage
export async function extractPlayerDataFromStorage(
    playerList: playerListItem[],
    pool: number[],
    gameHistory: { [playerId: number]: number[] }
): Promise<playerSum[]> {
    try {
        const players: playerSum[] = [];
        pool.forEach((playerId: number, index: number) => {
            const player = playerList.find((item: playerListItem) => item.id === playerId);
            if (player) {
                players.push({
                    id: player.id,
                    name: player.name,
                    total: player.total,
                    cellIndex: index + 3, // After #, Game, Host columns
                    history: gameHistory[playerId] || [],
                });
            }
        });
        return players;
    } catch (e) {
        return [];
    }
}

// Legacy function for web compatibility
export function extractPlayerData(table: HTMLElement): playerSum[] {
    if (typeof document === 'undefined') return [];
    try {
        const players: playerSum[] = [];
        const headerCells = table.querySelectorAll("thead th");

        headerCells.forEach((cell, index) => {
            if (cell.id.includes("player-th-")) {
                const headerId = cell.id.split("-")[2];
                const totalValue = document.getElementById(`player-footer-${headerId}`)?.textContent;
                const total = parseInt(totalValue || "0", 10);
                const playerName = cell.textContent || "";

                players.push({
                    name: playerName,
                    total,
                    id: parseInt(headerId, 10),
                    cellIndex: index,
                    history: [],
                });
            }
        });
        return players;
    } catch (e) {
        return [];
    }
}

// Helper function to build worksheet data from AsyncStorage
export async function getWorksheetDataFromStorage(
    playerList: playerListItem[],
    pool: number[],
    gameRounds: Array<{ gameNumber: number; host?: string; scores: { [playerId: number]: number } }>,
    gameHistory: { [playerId: number]: number[] }
): Promise<(string | number)[][]> {
    try {
        const worksheetData: (string | number)[][] = [];
        const matrix: number[][] = [];

        // Build rows from game rounds
        gameRounds.forEach((round, roundIndex) => {
            const row: (string | number)[] = [
                roundIndex + 1, // Game number
                `Game ${roundIndex + 1}`, // Game label
                round.host || '', // Host
            ];
            const rowMatrix: number[] = [];

            // Add player scores for this round
            pool.forEach((playerId: number) => {
                const score = round.scores[playerId] || 0;
                row.push(score);
                rowMatrix.push(score);
            });

            matrix.push(rowMatrix);
            worksheetData.push(row);
        });

        // Add footer row with totals
        const footerRow: (string | number)[] = ['', 'Total', ''];
        pool.forEach((playerId: number) => {
            const player = playerList.find((item: playerListItem) => item.id === playerId);
            footerRow.push(player?.total || 0);
        });
        worksheetData.push(footerRow);

        return worksheetData;
    } catch (e) {
        console.warn('Error building worksheet data:', e);
        return [];
    }
}

// Legacy function for web compatibility
export function getWorksheetData(table: HTMLElement, players: playerSum[]): { worksheetData: (string | number)[][]; matrix: number[][] } {
    if (typeof document === 'undefined') return { worksheetData: [], matrix: [] };
    try {
        const worksheetData: (string | number)[][] = [];
        const rows = table.getElementsByTagName("tr");
        const matrix: number[][] = [];

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            const row: (string | number)[] = [];
            const rowMatrix: number[] = [];

            for (let j = 0; j < cells.length; j++) {
                if (j > 2 && i > 0) {
                    const value = Number(cells[j].textContent);
                    row.push(value);
                    rowMatrix.push(value);
                } else {
                    row.push(cells[j].textContent || "");
                }
            }

            matrix.push(rowMatrix);
            worksheetData.push(row);
        }

        // Remove header and footer rows from matrix
        matrix.shift();
        matrix.pop();

        // Populate player history from matrix
        for (let i = 0; i < (matrix[matrix.length - 1]?.length || 0); i++) {
            const playerHistory: number[] = [];
            for (let j = 0; j < matrix.length; j++) {
                (matrix[j][i] !== undefined) ? playerHistory.push(matrix[j][i]) : playerHistory.push(0);
            }
            if (players[i]) {
                players[i].history.push(...playerHistory);
            }
        }

        return { worksheetData, matrix };
    } catch (e) {
        return { worksheetData: [], matrix: [] };
    }
}

// Helper function to sort and rank players
export function rankPlayers(players: playerSum[]): playerSum[] {
    const sortedPlayers = players
        .filter(player => player.history.some(score => score !== 0)) // Filter out unplayed players
        .sort((a, b) => b.total - a.total); // Sort by total score

    return sortedPlayers;
}

// Helper function to get number of rows from AsyncStorage
export async function getRowsFromStorage(): Promise<number | undefined> {
    try {
        const roundsData = await AsyncStorage.getItem('gameRounds');
        if (!roundsData) return undefined;
        const rounds = JSON.parse(roundsData);
        // +2 for header and footer rows
        return rounds.length > 0 ? rounds.length + 2 : undefined;
    } catch (e) {
        return undefined;
    }
}

// Legacy function for web compatibility
export function getRows() {
    if (typeof document === 'undefined') return undefined;
    try {
        const table = document.getElementById("summary-table");
        if (!table) return undefined;
        const rows = table.getElementsByTagName("tr");
        if (rows.length < 2) return undefined;
        console.log(rows)
        return rows.length;
    } catch (e) {
        return undefined;
    }
}