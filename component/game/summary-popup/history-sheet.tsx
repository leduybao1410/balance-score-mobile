import { myFontStyle } from "@/component/responsive-text";
import { HorizontalView, VerticalView } from "@/component/view";
import { colors } from "@/constant/colors";
import { History, HistoryItem } from "@/hooks/useGameHistory";
import { GameState } from "@/hooks/useGameState";
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CELL_WIDTH = screenWidth > 1080 ? 100 : 60;
const CELL_HEIGHT = screenWidth > 1080 ? 40 : 30;

export default function HistorySheet({ history }: { history: History }) {
    const renderItem = ({ item }: { item: HistoryItem }) => {
        const sortedData = [...item.data].sort((a, b) => a.id - b.id);

        const hasContinuousIds = sortedData.every(
            (dataItem, index) => dataItem.id === index + 1
        );

        const modeLabel = (item.mode === 'free') ? 'Tự do' : 'Quản trò';
        if (hasContinuousIds) {
            return <Row {...item} mode={modeLabel} />;
        }

        const startId = sortedData[0].id;
        const endId = sortedData[sortedData.length - 1].id;

        const filledData = Array.from(
            { length: endId - startId + 1 },
            (_, index) => {
                const id = startId + index;
                const found = sortedData.find(d => d.id === id);

                return {
                    id,
                    point: found?.point ?? 0,
                };
            }
        );

        return <Row row={item.row} mode={modeLabel} data={filledData} />;
    };

    const totalData = history?.playerData?.map(item => ({ id: item.id, point: item.total })) ?? [];


    return <VerticalView styles={{ flex: 1 }} justifyContent="flex-start" alignItems="flex-start">
        <Text style={styles.title}>Bảng tổng kết</Text>
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <FlatList
                scrollEnabled={false}
                data={history.history}
                style={{ flexGrow: 1 }}
                ListHeaderComponent={
                    <>
                        <Row
                            mode={'Mode'}
                            row={'STT'}
                            data={history?.playerData?.map(item => ({ id: item.id, point: item.name })) ?? []} />
                        <Row
                            mode={''}
                            rowStyle={{ backgroundColor: colors.yellow[300], flexGrow: 0 }}
                            slotTextStyle={{ fontWeight: '700' }}
                            row={'Tổng'}
                            data={totalData}
                        />
                    </>}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: CELL_HEIGHT }}
            />
            <Row
                mode={''}
                rowStyle={{ backgroundColor: colors.yellow[300], flexGrow: 0 }}
                slotTextStyle={{ fontWeight: '700' }}
                row={'Tổng'}
                data={totalData}
            />
        </ScrollView>
    </VerticalView>
}

function Row({
    row,
    mode,
    data,
    rowStyle,
    slotTextStyle,
}: {
    row: number | string,
    mode: string,
    data: { id: number, point: number | string }[],
    rowStyle?: ViewStyle,
    slotTextStyle?: TextStyle,
}) {
    return <HorizontalView
        gap={0}
        justifyContent="flex-start"
        alignItems="center"
        key={`r${row}`} styles={[{ flex: 1, backgroundColor: (row as number) % 2 === 0 ? colors["dark-grey"][200] : 'white' }, rowStyle]}>
        <View style={styles.slot} >
            <Text style={[styles.slotText, slotTextStyle]}>{row}</Text>
        </View>
        <View style={styles.slot} >
            <Text style={[styles.slotText, slotTextStyle]}>{mode}</Text>
        </View>
        {data.map((item) => <View style={styles.slot} key={`id${item.id}-p${item.point}`}>
            <Text style={[styles.slotText, slotTextStyle]}>{item.point}</Text>
        </View>)}
    </HorizontalView>
}



const styles = StyleSheet.create({
    slot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        borderWidth: 1,
        borderColor: colors['dark-grey'][700],
    },
    slotText: {
        textAlign: 'center',
        ...myFontStyle.small,
        color: colors['dark-grey'][700],
    },
    title: {
        ...myFontStyle.large,
        color: colors['dark-grey'][700],
        fontWeight: '600'
    },
});