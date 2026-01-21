import HistorySheet from "@/component/game/summary-popup/history-sheet";
import { VerticalView } from "@/component/view";
import { colors } from "@/constant/colors";
import { History, useGameHistory } from "@/hooks/useGameHistory";
import { folderHelpers } from "@/libs/helpers/folder-helpers";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerAd } from "../index";

export default function HistoryDetailScreen() {

    const { folderName } = useLocalSearchParams();

    const [history, setHistory] = useState<History | null>(null);

    useEffect(() => {
        folderHelpers.readFileContent(folderName as string, 'history.json').then((content) => {
            if (content) {
                const decode = folderHelpers.parseHistoryContent(content);
                setHistory(decode);
            }
        });
    }, []);

    return (
        <>
            <VerticalView
                gap={20}
                alignItems='stretch'
                justifyContent='center'
                styles={styles.container} >
                <HistorySheet
                    history={history || { playerData: [], history: [] } as History}
                />
            </VerticalView>
            <BannerAd
                unitId={bannerAd}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
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
})