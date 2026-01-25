import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import CustomModal from "../modal/modal";
import { ResponsiveFontSize } from "../responsive-text";
import { colors } from "@/constant/colors";
import { Button } from "../button/button";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { HorizontalView, VerticalView } from "../view";



const ChangeNamePopup = ({
    open, setOpen,
    playerName,
    setEditingPlayerId,
    handleSaveName
}: {
    open: boolean, setOpen: (open: boolean) => void,
    playerName: string,
    setEditingPlayerId: (editingPlayerId: number | null) => void,
    handleSaveName: (newPlayerName: string) => void
}) => {

    const [newPlayerName, setNewPlayerName] = useState(playerName);

    useEffect(() => {
        setNewPlayerName(playerName);
    }, [playerName])

    return (
        <CustomModal
            open={open}
            setOpen={setOpen}
            title={t('enterNewNameFor', { name: playerName })}
            modalStyle={{
                backgroundColor: colors.white,
                maxHeight: '85%',
            }}
            showCloseButton={false}
        >
            <VerticalView
                alignItems="stretch"
                styles={[styles.nameInputContainer, { minWidth: '50%', }]}>
                <TextInput
                    style={styles.nameInput}
                    value={newPlayerName}
                    onChangeText={setNewPlayerName}
                    placeholder={t('playerName')}
                />
                <HorizontalView alignItems="stretch">
                    <Button
                        title={t('cancel')}
                        onClick={() => {
                            setOpen(false);
                            setEditingPlayerId(null);
                            setNewPlayerName('');
                        }}
                        variant="outline"
                        style={styles.nameInputCancelButton}
                    />
                    <Button
                        title={t('save')}
                        onClick={() => handleSaveName(newPlayerName)}
                        style={styles.nameInputSaveButton}
                        textColor={colors.white}
                    />
                </HorizontalView>
            </VerticalView>
        </CustomModal>
    )
}

export default ChangeNamePopup

const styles = StyleSheet.create({

    nameInputContainer: {
        borderRadius: 12,
    },
    nameInputTitle: {
        fontSize: ResponsiveFontSize(18),
        fontWeight: '600',
        color: colors['dark-grey'][900],
        textAlign: 'center',
    },
    nameInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors['dark-grey'][300],
        borderRadius: 8,
        padding: 12,
        fontSize: ResponsiveFontSize(16),
        backgroundColor: colors.white,
    },
    nameInputButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    nameInputCancelButton: {
        flex: 1,
    },
    nameInputSaveButton: {
        flex: 1,
        backgroundColor: colors.primary[700],
    },
});
