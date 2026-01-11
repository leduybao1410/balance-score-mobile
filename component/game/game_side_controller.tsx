import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, useWindowDimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BalanceContainer from "./game_balance_container";
import { playerListItem } from "./game_data";
import PopupSummary from "./game_popup_summary";
import GameMenu from "./game_menu";
import PopupAddPlayer from "./game_popup_add_player";
import PopupSwapPlayer from "./game_popup_swap_player";
import PopupModifyButton from "./game_popup_modify_button";
import ConfirmPopup from "../popup/confirm-popup";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';


export const gameMode = [
    { id: 'tien-len', name: 'Tiến lên' },
    { id: 'xi-dach', name: 'Xì dách' },
    { id: 'bai-cao', name: 'Bài cào' },
]

export default function SideController({ selectedMode, setSelectedMode, currentPool, setCurrentPool, list, setList, selecetedId, setSelectedID, isSwapPlayerOpen, setIsSwapPlayerOpen, selectedHost }
    :
    {
        list: playerListItem[] | null,
        currentPool: number[] | null,
        setCurrentPool: (array: number[] | null) => void,
        selecetedId: number | null,
        setSelectedID: (id: number | null) => void
        setList: (array: playerListItem[] | null) => void,
        isSwapPlayerOpen: boolean,
        setIsSwapPlayerOpen: (bool: boolean) => void,
        selectedMode: string,
        setSelectedMode: (value: string) => void,
        selectedHost: number | null,
    }) {

    const [balanceScore, setBalanceScore] = useState<number>(0);
    const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState<boolean>(false);
    const [isModifyBtn, setIsModifyBtn] = useState<boolean>(false);
    const [gameTokenId, setGameTokenId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialog] = useState<boolean>(false);

    useEffect(() => {
        if (gameTokenId == null) {
            AsyncStorage.getItem('gameData').then((token) => {
                if (!token) return;
                setIsDialog(true);
            });
        }
    }, [gameTokenId])


    const initialzedExistGame = async () => {
        const token = await AsyncStorage.getItem('gameData');
        if (!token) return;
        const { newList, currentPool } = JSON.parse(token);
        setList(newList);
        setCurrentPool(currentPool);
    }


    function checkBalance() {
        if (list == null || currentPool == null) return;
        let balance = 0;
        currentPool.forEach(playerId => {
            const player = list.find(item => item.id == playerId);
            if (player) {
                balance = balance + player.point;
            }
        });
        setBalanceScore(balance);
    }

    useEffect(() => {
        checkBalance();
    }, [list, currentPool]);


    const addPoint = (value: number) => {
        if (selecetedId == null) {
            Alert.alert('Thông báo', 'vui lòng chọn người chơi để cộng điểm!');
            return;
        };
        if (selecetedId == selectedHost) {
            Alert.alert('Thông báo', 'Vui lòng UnHost nhà cái để có thể điều chỉnh thủ công điểm của nhà cái');
            return;
        }

        const newList = [...(list || [])];
        if (newList == null) return;
        const index = newList.findIndex(player => player.id == selecetedId);
        if (index === -1) return;
        newList[index].point += value;
        if (selectedHost !== null) updateHost(value, newList);
        checkBalance();
        setList(newList);
    };

    function updateHost(value: number, newList: playerListItem[]) {
        if ((selectedHost == null) || (selecetedId == null)) return;
        if (selectedHost !== selecetedId) {
            if (newList == null) return;
            const index = newList.findIndex(player => player.id == selectedHost);
            if (index === -1) return;
            newList[index].point += -value;
        }
    }

    const [singlePointValue, setSinglePointValue] = useState<number[] | null>([-1, 1]);
    const [multiplePointValue, setMultiplePointValue] = useState<number[] | null>([-4, -2, 2, 4]);

    function addPointButtonText(point: number) {
        return (
            <Text style={styles.pointButtonText}>
                {(point > 0) ? `+${point}` : `${point}`}
            </Text>
        );
    }

    function renderAddSingPointBtn(point: number) {
        return (
            <TouchableOpacity
                style={styles.pointButton}
                onPress={() => addPoint(point)}
                activeOpacity={0.7}
            >
                {addPointButtonText(point)}
            </TouchableOpacity>
        );
    }

    function renderAddMultiplePointBtn() {
        if (!multiplePointValue) return null;

        return multiplePointValue.map((item) => {
            const itemId = item > 0 ? `plus-point-${item}` : `minus-point-${Math.abs(item)}`;
            return (
                <TouchableOpacity
                    key={`multiple-point-${itemId}`}
                    style={styles.pointButton}
                    onPress={() => addPoint(item)}
                    activeOpacity={0.7}
                >
                    {addPointButtonText(item)}
                </TouchableOpacity>
            );
        });
    }

    function showMenu() {
        setIsMenuOpen(true);
    }

    async function saveDataToLocalStorage(newList: playerListItem[], currentPool: number[]) {
        await AsyncStorage.setItem('gameData', JSON.stringify({ newList, currentPool }));
    }

    async function summary() {
        if (!list || !currentPool) return;

        if (balanceScore !== 0) {
            Alert.alert(
                'Cảnh báo',
                'Điểm đang không cân bằng bạn có muốn tiếp tục?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Tiếp tục', onPress: async () => {
                            await proceedWithSummary();
                        }
                    },
                ]
            );
            return;
        }

        await proceedWithSummary();
    }

    async function proceedWithSummary() {
        if (!list || !currentPool) return;

        const newList = [...list];
        const playerArr: any[] = [];
        currentPool.forEach(playerId => {
            const playerIndex = newList.findIndex(item => item.id == playerId);
            const player = newList.find(player => player.id == playerId);
            if (player) playerArr.push(player);
            if (playerIndex == -1) return;
            newList[playerIndex].total += newList[playerIndex].point;
            newList[playerIndex].point = 0;
        });

        await saveDataToLocalStorage(newList, currentPool);
        setList(newList);
        // Note: addRowToTable functionality should be handled by PopupSummary component
        // The table state should be managed there, not via DOM manipulation
    }



    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
                <View style={[styles.singlePointContainer, isLandscape && styles.singlePointContainerLandscape]}>
                    {singlePointValue && renderAddSingPointBtn(singlePointValue[0])}
                    {singlePointValue && renderAddSingPointBtn(singlePointValue[1])}
                </View>
                <View style={[styles.multiplePointContainer, isLandscape && styles.multiplePointContainerLandscape]}>
                    {renderAddMultiplePointBtn()}
                </View>
            </View>

            <BalanceContainer balanceScore={balanceScore} list={list} showMenu={showMenu} summary={summary} />
            <PopupSummary list={list} currentPool={currentPool} isSummaryOpen={isSummaryOpen} setIsSummaryOpen={setIsSummaryOpen} />
            <GameMenu selectedMode={selectedMode} setSelectedMode={setSelectedMode} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} setIsModifyBtn={setIsModifyBtn} setIsSummaryOpen={setIsSummaryOpen} setIsAddPlayerOpen={setIsAddPlayerOpen} />
            <PopupAddPlayer list={list} setList={setList} isOpen={isAddPlayerOpen} setIsOpen={setIsAddPlayerOpen} currentPool={currentPool} setCurrentPool={setCurrentPool} />
            <PopupSwapPlayer isOpen={isSwapPlayerOpen} setIsOpen={setIsSwapPlayerOpen} currentPool={currentPool} setCurrentPool={setCurrentPool} selecetedId={selecetedId} setSelectedID={setSelectedID} />
            <PopupModifyButton isOpen={isModifyBtn} setIsOpen={setIsModifyBtn} setMultiplePointValue={setMultiplePointValue} setSinglePointValue={setSinglePointValue} />
            <ConfirmPopup
                visible={isDialogOpen}
                confirmText={'Tiếp tục'}
                onConfirm={() => {
                    initialzedExistGame();
                    setIsDialog(false);
                }}
                onCancel={() => {
                    setIsDialog(false);
                }}
                title="Bạn có muốn tiếp tục ván đấu trước"
                message={'Lưu ý bạn sẽ không thể thay đổi quyết định sau khi nhấn nút!'}
            />
        </View>
    );
}

// Note: addRowToTable and summaryTotalPoint functions have been removed
// These functions used DOM manipulation which doesn't work in React Native
// The table functionality should be handled by the PopupSummary component
// using React state instead of DOM manipulation

const styles = StyleSheet.create({
    container: {
        minWidth: '20%',
        flex: 1,
        flexDirection: 'column-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors['dark-grey'][700],
    },
    containerLandscape: {
        minWidth: '10%',
        flexDirection: 'column',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingVertical: 8,
        minHeight: 180,
    },
    buttonContainerLandscape: {
        flexDirection: 'row-reverse',
        minHeight: '66%',
    },
    singlePointContainer: {
        padding: 8,
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    singlePointContainerLandscape: {
        flexDirection: 'column',
        width: '50%',
    },
    multiplePointContainer: {
        padding: 8,
        gap: 8,
        flexDirection: 'row',
        width: '100%',
        // height: '100%',
        justifyContent: 'space-between',
    },
    multiplePointContainerLandscape: {
        flexDirection: 'column',
        width: '50%',
    },
    pointButton: {
        backgroundColor: colors.white,
        flex: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
        zIndex: 10,
        overflow: 'hidden',
    },
    pointButtonText: {
        fontSize: ResponsiveFontSize(50),
        fontWeight: 'bold',
        color: colors.black,
    },
});