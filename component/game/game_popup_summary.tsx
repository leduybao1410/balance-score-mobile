
import { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, Alert, Text } from "react-native";
import { playerListItem } from "./game_data";
import * as XLSX from "xlsx";
import { lineDataType } from "../chart/sample_data";
import LineGraph from "./game_line_chart";
import MySwitchButton from "../switch/switch_button";
import { Button } from "../button/button";

type playerSum = {
    id: number;
    total: number;
    name: string;
    cellIndex: number;
    history: number[];
}

const PopupSummary = ({ list, currentPool, isSummaryOpen, setIsSummaryOpen }: { list: playerListItem[] | null, currentPool: number[] | null, isSummaryOpen: boolean, setIsSummaryOpen: (bool: boolean) => void }) => {
    const [isExcelShow, setIsExcelShow] = useState<boolean>(true);

    function initializeTableHeader() {
        // Note: DOM APIs don't exist in React Native
        // This function needs to be refactored to use React state instead
        if (typeof document === 'undefined') return;
        if (!list || !currentPool) return;
        try {
            const tableHead = document.getElementById("summary-table-head");
            if (!tableHead) return;
            let headerRow = "<tr>";
            headerRow += `<th>#</th>`;
            headerRow += `<th>Game</th>`;
            headerRow += `<th>Host</th>`;
            currentPool.forEach((id) => {
                const playerIndex = list.findIndex((item) => item.id === id);
                headerRow += `<th id='player-th-${id}'>${list[playerIndex].name}</th>`;
            });
            headerRow += "</tr>";
            tableHead.innerHTML = headerRow;
        } catch (e) {
            // DOM APIs not available in React Native
            console.warn('DOM APIs not available in React Native');
        }
    }

    useEffect(() => {
        // Skip in React Native environment
        if (typeof document !== 'undefined') {
            initializeTableHeader();
        }
    }, [])

    // Helper function to add ranking data to worksheet
    function addRankingDataToWorksheet(worksheetData: (string | number)[][], players: playerSum[]): void {
        worksheetData.push([]); // Add a blank line
        worksheetData.push(["Ranking", "Name", "Total", "Win", "Draw", "Lost", "Best Game", "Worst Game"]);

        players.forEach((player, rank) => {
            const history = player.history;
            const wins = history.filter(score => score > 0).length;
            const draws = history.filter(score => score === 0).length;
            const losses = history.filter(score => score < 0).length;
            const bestGame = Math.max(...history);
            const worstLoss = Math.min(...history) < 0 ? Math.min(...history) : 0;

            worksheetData.push([
                rank + 1,
                player.name,
                player.total,
                wins,
                draws,
                losses,
                bestGame,
                worstLoss,
            ]);
        });
    }

    // Main export function
    function exportFileExcel(): void {
        if (typeof document === 'undefined') {
            Alert.alert('Thông báo', 'Tính năng xuất Excel chưa được hỗ trợ trên thiết bị di động');
            return;
        }
        try {
            const table = document.getElementById("summary-table");
            if (!table) return;

            const workbook = XLSX.utils.book_new();

            // Extract headers, player data, and worksheet data
            const headers = getTableHeaders(table);
            const players = extractPlayerData(table);
            const { worksheetData } = getWorksheetData(table, players);

            // Add headers to worksheet
            worksheetData.unshift(headers);

            // Rank and sort players
            const rankedPlayers = rankPlayers(players);

            // Add ranking data to worksheet
            addRankingDataToWorksheet(worksheetData, rankedPlayers);

            // Create worksheet and add to workbook
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

            // Generate and download the file
            const today = new Date();
            const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
            XLSX.writeFile(workbook, `summary_${formattedDate}.xlsx`);
        } catch (e) {
            Alert.alert('Lỗi', 'Không thể xuất file Excel');
        }
    }

    function getRandomRGBColor() {
        // Generate random values for red, green, and blue (0-255)
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        // Return the RGB color string
        return `${r}, ${g}, ${b}`;
    }

    const [datasets, setDataSets] = useState<lineDataType[] | []>([]);
    const [labels, setLabels] = useState<string[] | []>([]);


    function generateDataset() {
        if (typeof document === 'undefined') return;
        try {
            const table = document.getElementById("summary-table");
            if (!table) return;
            // const headers = getTableHeaders(table);
            const players = extractPlayerData(table);
            const { worksheetData } = getWorksheetData(table, players);
            // console.log(players);
            const arr: lineDataType[] = [];
            players.forEach(player => {
                const randomColor = getRandomRGBColor();
                const acummulativeHistory: number[] = [];
                let currentTotal = 0;
                player.history.forEach(ele => {
                    currentTotal += ele;
                    acummulativeHistory.push(currentTotal);
                })
                const playerData: lineDataType = {
                    label: player.name,
                    data: acummulativeHistory,
                    borderColor: `rgba(${randomColor},1)`,
                    backgroundColor: `rgba(${randomColor},0.7)`,
                    tension: 0.2,
                }
                arr.push(playerData);
            })
            const labels: string[] = [];
            if (players.length > 0 && players[0].history.length > 0) {
                players[0]['history'].forEach((ele, index) => labels.push(`${index + 1}`));
            }
            setDataSets(arr);
            setLabels(labels);
        } catch (e) {
            console.warn('Error generating dataset:', e);
        }
    }



    useEffect(() => {

        if (!isExcelShow) {
            if (getRows() !== undefined) {
                generateDataset()
            } else {
                Alert.alert('Lỗi', 'Chưa có dữ liệu để hiện thị biểu đồ');
                setIsExcelShow(!isExcelShow);
            }

        }
    }, [isExcelShow])

    useEffect(() => {
        if (!isSummaryOpen) setIsExcelShow(true);
    }, [isSummaryOpen])

    return (
        <Modal
            visible={isSummaryOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsSummaryOpen(false)}
        >
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                activeOpacity={1}
                onPress={() => setIsSummaryOpen(false)}
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
                    {isExcelShow && (
                        <View style={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: '#d1d5db',
                            width: '100%',
                            flex: 1,
                            padding: 16,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Note: HTML table elements don't work in React Native */}
                            {/* This component needs to be refactored to use React Native components */}
                            <Text style={{ color: '#666', textAlign: 'center' }}>
                                Bảng tổng kết chưa được triển khai cho React Native
                            </Text>
                        </View>
                    )}

                    {!isExcelShow && <View style={{ flex: 0.8, backgroundColor: 'white' }}>
                        <LineGraph style="rounded-lg" datasets={datasets} labels={labels} />
                    </View>}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            title="Export"
                            onClick={exportFileExcel}
                            style={{ backgroundColor: '#10b981', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}
                            textColor="#ffffff"
                            fullWidth={false}
                        />
                        <MySwitchButton swPaddingHorizontal="4" firstLable="Lịch sử" secondLabel="Biểu đồ" isOn={isExcelShow} setIsOn={setIsExcelShow} />
                        <Button
                            title="Close"
                            onClick={() => setIsSummaryOpen(false)}
                            style={{ backgroundColor: '#ef4444', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 }}
                            textColor="#ffffff"
                            fullWidth={false}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default PopupSummary;

// Helper function to get table headers
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

// Helper function to extract player data
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

// Helper function to extract table rows and build worksheet data
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