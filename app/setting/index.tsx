import { playerList, playerListItem } from "@/component/game/game_data";
import CustomModal from "@/component/modal/modal";
import { myFontStyle } from "@/component/responsive-text";
import { VerticalView } from "@/component/view";
import { colors } from "@/constant/colors";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNFS from 'react-native-fs';

const filePath = RNFS.DocumentDirectoryPath + '/config.json';

export default function SettingScreen() {
    const sampleData = playerList;
    const [data, setData] = useState<playerListItem[]>([])
    const [selectedItem, setSelectedItem] = useState<playerListItem | null>(null)

    useEffect(() => {
        RNFS.exists(filePath).then((exists) => {
            if (exists) {
                RNFS.readFile(filePath).then((data) => {
                    if (data) {
                        setData(JSON.parse(data));
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                setData(sampleData);
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    const renderItem = useCallback(({ item }: { item: playerListItem }) => {
        return (<PlayerItemCard item={item} onPress={() => setSelectedItem(item)} />)
    }, [data])

    return (
        <>
            <VerticalView alignItems="stretch" styles={styles.container}>
                <Text style={styles.title}>Config</Text>
                <FlatList
                    contentContainerStyle={{ gap: 8, }}
                    columnWrapperStyle={{ gap: 8, justifyContent: 'space-between' }}
                    numColumns={3}
                    data={data}
                    renderItem={renderItem}
                />

            </VerticalView>
            {/* <EditPlayerModal open={selectedItem !== null} setOpen={() => setSelectedItem(null)} /> */}
        </>
    )
}

type EditPlayerModalProps = {
    open: boolean,
    setOpen: (open: boolean) => void;
    item: playerListItem | null
}

const { width, height } = Dimensions.get('window');

const EditPlayerModal = ({
    item,
    open,
    setOpen,
}: EditPlayerModalProps) => {
    return (
        <CustomModal
            open={open}
            setOpen={setOpen}
            title="Edit Player"
            showCloseButton
            modalStyle={{
                width: width * 0.8,
                height: height * 0.8,
            }}
        >
            <VerticalView
                alignItems="stretch" gap={16}>
                <Text>{item?.name}</Text>
            </VerticalView>
        </CustomModal>
    )
}

const PlayerItemCard = ({ item, onPress }: { item: playerListItem, onPress: (item: playerListItem) => void }) => {
    return (<TouchableOpacity style={[styles.playerItemContainer]} className={`${item.bgColor}`}
        onPress={() => onPress(item)}>
        <Text style={[styles.playerItemTitle]}
        // className={`${item.textColor}`}
        >{item.name}</Text>
    </TouchableOpacity>)
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    title: {
        ...myFontStyle.large,
        fontWeight: 'bold',
        color: colors['dark-grey'][800],
    },
    playerItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '30%',
        padding: 8,
        borderRadius: 8
    },
    playerItemTitle: {
        ...myFontStyle.large
    }
})
