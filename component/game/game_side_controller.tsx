import { useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import BalanceContainer from "./game_balance_container";
import PopupSummary from "./game_popup_summary";
import GameMenu from "./game_menu";
import PopupAddPlayer from "./game_popup_add_player";
import PopupSwapPlayer from "./game_popup_swap_player";
import PopupModifyButton from "./game_popup_modify_button";
import ConfirmPopup from "../popup/confirm-popup";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { GameState } from "@/hooks/useGameState";
import { useSideController } from "@/hooks/useSideController";
import { t } from "i18next";

export const gameMode: { id: GameState['selectedMode'], name: string }[] = [
    { id: 'free', name: 'free' },
    { id: 'with-host', name: 'withHost' },
]

export default function SideController({ gameState }
    :
    {
        gameState: GameState,
    }) {
    const { list, currentPool, selectedId, isSwapPlayerOpen, selectedMode } = gameState;
    const { setCurrentPool, setSelectedId, setIsSwapPlayerOpen, setSelectedMode, setList } = gameState;

    const { width, height } = useWindowDimensions();
    const isLandscape = useMemo(() => width > height, [width, height]);

    // Use the custom hook for business logic
    const {
        balanceScore,
        isSummaryOpen,
        isMenuOpen,
        isAddPlayerOpen,
        isModifyBtn,
        isDialogOpen,
        singlePointValue,
        multiplePointValue,
        setIsSummaryOpen,
        setIsMenuOpen,
        setIsAddPlayerOpen,
        setIsModifyBtn,
        setSinglePointValue,
        setMultiplePointValue,
        addPoint,
        summary,
        showMenu,
        handleDialogConfirm,
        handleDialogCancel,
    } = useSideController(gameState);

    // Memoize font sizes to avoid recalculating on every render
    const buttonFontSize = useMemo(
        () => isLandscape ? ResponsiveFontSize(14) : ResponsiveFontSize(36),
        [isLandscape]
    );

    // UI rendering functions
    const addPointButtonText = useCallback((point: number) => {
        return (
            <Text style={[styles.pointButtonText, { fontSize: buttonFontSize }]}>
                {point > 0 ? `+${point}` : `${point}`}
            </Text>
        );
    }, [buttonFontSize]);

    const renderAddSingPointBtn = useCallback((point: number) => {
        return (
            <TouchableOpacity
                style={styles.pointButton}
                onPress={() => addPoint(point)}
                activeOpacity={0.7}
            >
                {addPointButtonText(point)}
            </TouchableOpacity>
        );
    }, [addPoint, addPointButtonText]);

    const renderAddMultiplePointBtn = useCallback(() => {
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
    }, [multiplePointValue, addPoint, addPointButtonText]);

    // Memoize single point buttons to avoid recreating on every render
    const singlePointButtons = useMemo(() => {
        if (!singlePointValue) return null;
        return (
            <>
                {renderAddSingPointBtn(singlePointValue[0])}
                {renderAddSingPointBtn(singlePointValue[1])}
            </>
        );
    }, [singlePointValue, renderAddSingPointBtn]);

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
                <View style={[styles.singlePointContainer, isLandscape && styles.singlePointContainerLandscape]}>
                    {singlePointButtons}
                </View>
                <View style={[styles.multiplePointContainer, isLandscape && styles.multiplePointContainerLandscape]}>
                    {renderAddMultiplePointBtn()}
                </View>
            </View>

            <BalanceContainer balanceScore={balanceScore} showMenu={showMenu} summary={summary} />
            <PopupSummary gameState={gameState}
                isSummaryOpen={isSummaryOpen}
                setIsSummaryOpen={setIsSummaryOpen} />
            <GameMenu
                selectedMode={selectedMode}
                setSelectedMode={setSelectedMode}
                isOpen={isMenuOpen}
                setIsOpen={setIsMenuOpen}
                setIsModifyBtn={setIsModifyBtn}
                setIsSummaryOpen={setIsSummaryOpen}
                setIsAddPlayerOpen={setIsAddPlayerOpen}
            />
            <PopupAddPlayer
                list={list}
                setList={setList}
                isOpen={isAddPlayerOpen}
                setIsOpen={setIsAddPlayerOpen}
                currentPool={currentPool}
                setCurrentPool={setCurrentPool}
            />
            <PopupSwapPlayer
                isOpen={isSwapPlayerOpen}
                setIsOpen={setIsSwapPlayerOpen}
                currentPool={currentPool}
                setCurrentPool={setCurrentPool}
                selecetedId={selectedId}
                setSelectedID={setSelectedId}
            />
            <PopupModifyButton
                isOpen={isModifyBtn}
                setIsOpen={setIsModifyBtn}
                setMultiplePointValue={setMultiplePointValue}
                setSinglePointValue={setSinglePointValue}
            />
            <ConfirmPopup
                visible={isDialogOpen}
                confirmText="Tiếp tục"
                onConfirm={handleDialogConfirm}
                onCancel={handleDialogCancel}
                title="Bạn có muốn tiếp tục ván đấu trước"
                message="Lưu ý bạn sẽ không thể thay đổi quyết định sau khi nhấn nút!"
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
        flexShrink: 1,
        flexDirection: 'column-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors['dark-grey'][700],
    },
    containerLandscape: {
        maxWidth: '25%',
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
        paddingVertical: 8,
        paddingHorizontal: 8,
        zIndex: 10,
        overflow: 'hidden',
    },
    pointButtonText: {
        fontWeight: 'bold',
        color: colors.black,
    },
});