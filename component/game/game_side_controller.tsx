import { useMemo, useCallback, useState, useEffect } from "react";
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
import CustomModal from "../modal/modal";
import Input from "../input/input";
import { HorizontalView, VerticalView } from "../view";
import { Button } from "../button/button";

export const gameMode: { id: GameState['selectedMode'], name: string }[] = [
    { id: 'free', name: 'free' },
    { id: 'with-host', name: 'withHost' },
    { id: 'winner-takes-all', name: 'winnerTakesAll' }
]

export default function SideController({ gameState }
    :
    {
        gameState: GameState,
    }) {
    const { list, currentPool, selectedId, isSwapPlayerOpen, selectedMode, openChooseStartingScore, startingScore } = gameState;
    const { setCurrentPool, setSelectedId, setIsSwapPlayerOpen, setSelectedMode, setList, setOpenChooseStartingScore, setStartingScore } = gameState;

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
        resetGame,
        onSelectStartingScore,
    } = useSideController(gameState);

    // Memoize font sizes to avoid recalculating on every render
    const buttonFontSize = useMemo(
        () => {
            return isLandscape ? ResponsiveFontSize(24) : ResponsiveFontSize(32);
        },
        [isLandscape]
    );

    // UI rendering functions
    const addPointButtonText = useCallback((point: number) => {
        return (
            <Text style={[styles.pointButtonText, { fontSize: Math.abs(point) > 99 ? ResponsiveFontSize(20) : buttonFontSize }]}>
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
                resetGame={resetGame}
                setOpenChooseStartingScore={setOpenChooseStartingScore}
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
            <ChooseStartingScoreModal
                startingScore={startingScore}
                onSelectStartingScore={onSelectStartingScore}
                isOpen={openChooseStartingScore}
                setIsOpen={setOpenChooseStartingScore}
            />
        </View>
    );
}

const ChooseStartingScoreModal = ({
    isOpen, setIsOpen, startingScore, onSelectStartingScore
}: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, startingScore: number, onSelectStartingScore: (startingScore: number) => void }) => {
    const [inputValue, setInputValue] = useState(startingScore ?? 0);

    useEffect(() => {
        setInputValue(startingScore ?? 0);
    }, [isOpen])

    return (
        <CustomModal
            open={isOpen} setOpen={setIsOpen}
            showCloseButton={false}
            title={t('chooseStartingScore')}
            showDivider={false}
            modalStyle={{
                backgroundColor: colors.white,
                maxHeight: '85%',
                width: '100%',
                maxWidth: '90%',
            }}
        >
            <VerticalView alignItems="stretch" gap={16} styles={{ width: '100%' }}>
                <Input
                    autoFocus={true}
                    value={`${inputValue}`}
                    type="number"
                    keyboardType="number-pad"
                    placeholder={t('enterStartingScore')}
                    onChangeText={(text) => setInputValue(Number(text))}
                />
                <HorizontalView alignItems="stretch" gap={8}>
                    <Button
                        fullWidth={false}
                        variant="outline"
                        style={[styles.modalButton]}
                        title={t('cancel')}
                        onClick={() => {
                            setInputValue(0);
                            setIsOpen(false);
                        }}
                    />
                    <Button
                        fullWidth={false}
                        style={[styles.modalButton]}
                        title={t('save')}
                        onClick={() => {
                            onSelectStartingScore(inputValue);
                            setIsOpen(false);
                        }}
                    />
                </HorizontalView>
            </VerticalView>
        </CustomModal>
    )
}

// Note: addRowToTable and summaryTotalPoint functions have been removed
// These functions used DOM manipulation which doesn't work in React Native
// The table functionality should be handled by the PopupSummary component
// using React state instead of DOM manipulation

const styles = StyleSheet.create({
    modalButton: {
        flex: 1,
    },
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