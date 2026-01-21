import { Button } from "@/component/button/button";
import ConfirmPopup from "@/component/popup/confirm-popup";
import { ResponsiveFontSize } from "@/component/responsive-text";
import { HorizontalView, VerticalView } from "@/component/view";
import { colors } from "@/constant/colors";
import { folderHelpers } from "@/libs/helpers/folder-helpers";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerAd } from "../index";
import { t } from "i18next";
import { icons } from "@/constant/images";
import { renderHitSlop } from "@/utils/utils";

export default function HistoryScreen() {
    const [history, setHistory] = useState<string[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showClearAllConfirmPopup, setShowClearAllConfirmPopup] = useState(false);

    const getHistory = async () => {
        setRefreshing(true);
        const folders = await folderHelpers.getFolderList();
        const gameHistory = folders.filter((folder) => folder.name.startsWith('Game_'));
        gameHistory.sort((a, b) => Number(b.name.split('_').pop()) - Number(a.name.split('_').pop()));
        setHistory(gameHistory.map((folder) => folder.name));
        setRefreshing(false);
    }
    useEffect(() => {
        getHistory();
    }, []);


    const [selectedFolderName, setSelectedFolderName] = useState<string | null>(null);
    const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false);
    const deleteGame = async (folderName: string) => {
        await folderHelpers.deleteFolder(folderName);
        getHistory();
    }

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
                <HorizontalView>
                    <Text style={styles.historyItemTitle}>{index + 1}. {time.toLocaleTimeString()} - {time.toLocaleDateString()}</Text>
                    <Pressable
                        style={{ padding: 6, backgroundColor: colors.red[700], borderRadius: 10 }}
                        hitSlop={renderHitSlop()}
                        onPress={() => {
                            setSelectedFolderName(item);
                            setShowConfirmDeletePopup(true);
                        }}>
                        <Image source={icons.trash} style={{ width: 20, height: 20 }} tintColor={colors.white} />
                    </Pressable>
                </HorizontalView>
            </TouchableOpacity>
        )
    }

    const HistoryHeader = () => {
        return <HorizontalView alignItems="center" justifyContent="flex-end" gap={10}>
            <Button
                title={t('clearAll')}
                fullWidth={false}
                variant="default"
                style={{ backgroundColor: colors.red[700] }}
                onClick={() => {
                    setShowClearAllConfirmPopup(true);
                }}
            />
        </HorizontalView>

    }

    return (
        <>
            <ConfirmPopup
                onCancel={() => setShowConfirmDeletePopup(false)}
                visible={showConfirmDeletePopup}
                title={t('confirmDeleteGameTitle')}
                message={t('confirmDeleteGameMessage')}
                onConfirm={() => {
                    deleteGame(selectedFolderName || '');
                    setShowConfirmDeletePopup(false);
                }}
            />
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
            <BannerAd
                unitId={bannerAd}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
            <ConfirmPopup
                visible={showClearAllConfirmPopup}
                title={t('clearAll')}
                message={t('confirmClearHistory')}
                onConfirm={() => {
                    folderHelpers.deleteAllGameFolder();
                    setShowClearAllConfirmPopup(false);
                    setTimeout(() => {
                        getHistory();
                    }, 1000)
                }}
                onCancel={() => {
                    setShowClearAllConfirmPopup(false);
                }}
                confirmText={t('clearAll')}
                cancelText={t('cancel')}
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