import { Button } from "@/component/button/button";
import ConfirmPopup from "@/component/popup/confirm-popup";
import { ResponsiveFontSize } from "@/component/responsive-text";
import { HorizontalView, VerticalView } from "@/component/view";
import { colors } from "@/constant/colors";
import { folderHelpers } from "@/libs/helpers/folder-helpers";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function HistoryScreen() {
    const [history, setHistory] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    const getHistory = async () => {
        setRefreshing(true);
        const folders = await folderHelpers.getFolderList();
        folders.sort((a, b) => Number(b.name.split('_').pop()) - Number(a.name.split('_').pop()));
        setHistory(folders.map((folder) => folder.name));
        setRefreshing(false);
    }
    useEffect(() => {
        getHistory();
    }, []);


    const HistoryItem = ({ item, index }: { item: string, index: number }) => {
        const timeValue = item.split('_').pop();
        const time = new Date(Number(timeValue) || '');
        return (
            <TouchableOpacity
                style={styles.historyItemContainer}
                onPress={() => router.push({
                    pathname: '/history/detail',
                    params: {
                        folderName: item,
                    },
                })}>
                <Text style={styles.historyItemTitle}>{index + 1}. {time.toLocaleTimeString()} - {time.toLocaleDateString()}</Text>
            </TouchableOpacity>
        )
    }

    const HistoryHeader = () => {
        return <HorizontalView alignItems="center" justifyContent="flex-end" gap={10}>
            <Button
                title="Clear All"
                fullWidth={false}
                variant="default"
                style={{ backgroundColor: colors.red[700] }}
                onClick={() => {
                    setShowConfirmPopup(true);
                }}
            />
        </HorizontalView>

    }

    return (
        <>
            <VerticalView
                gap={20}
                alignItems='center'
                justifyContent='center'
                styles={styles.container} >
                <FlatList
                    style={{ flex: 1, width: '100%' }}
                    contentContainerStyle={{ gap: 8 }}
                    data={history}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getHistory} />}
                    ListHeaderComponent={<HistoryHeader />}
                    renderItem={({ item, index }) => <HistoryItem item={item} index={index} />}
                />

            </VerticalView>
            <ConfirmPopup
                visible={showConfirmPopup}
                title="Clear All"
                message="Do you want to clear all history?"
                onConfirm={() => {
                    folderHelpers.deleteAllFolder();
                    setShowConfirmPopup(false);
                    setTimeout(() => {
                        getHistory();
                    }, 1000)
                }}
                onCancel={() => {
                    setShowConfirmPopup(false);
                }}
                confirmText="Clear All"
                cancelText="Cancel"
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors['dark-grey'][100],
        padding: 20,
    },
    title: {
        fontSize: ResponsiveFontSize(24),
        fontWeight: 'bold',
        color: colors['dark-grey'][800],
    },
    historyItemContainer: {
        padding: 12,
        borderRadius: 10,
        width: '100%',
        backgroundColor: colors['dark-grey'][200],
    },
    historyItemTitle: {
        fontSize: ResponsiveFontSize(16),
        fontWeight: 'bold',
        color: colors['dark-grey'][800],
    },
})