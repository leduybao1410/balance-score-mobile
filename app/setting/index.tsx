import { Button } from "@/component/button/button";
import { bgColorList, playerList, playerListItem } from "@/component/game/game_data";
import Input from "@/component/input/input";
import CustomModal from "@/component/modal/modal";
import { myFontStyle } from "@/component/responsive-text";
import { HorizontalView, VerticalView } from "@/component/view";
import { colors } from "@/constant/colors";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RNFS from 'react-native-fs';
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { bannerAd } from "../index";
import ConfirmPopup from "@/component/popup/confirm-popup";
import { Toast } from "toastify-react-native";
import { useFocusEffect } from "expo-router";

export const configFilePath = RNFS.DocumentDirectoryPath + '/config.json';

export const getConfigData = async (): Promise<playerListItem[]> => {
    try {
        const exists = await RNFS.exists(configFilePath);
        if (exists) {
            try {
                const data = await RNFS.readFile(configFilePath);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                }
                return playerList;
            } catch (err) {
                return playerList;
            }
        } else {
            return playerList;
        }
    } catch (err) {
        return playerList;
    }
}

export default function SettingScreen() {
    const [data, setData] = useState<playerListItem[]>([])
    const [selectedItem, setSelectedItem] = useState<playerListItem | null>(null)

    useFocusEffect(useCallback(() => {
        getConfigData().then((data) => {
            setData(data || []);
        });
    }, []))


    const renderItem = useCallback(({ item }: { item: playerListItem }) => {
        return (<PlayerItemCard item={item} onPress={() => setSelectedItem(item)} />)
    }, [data])

    const onDeletePlayer = useCallback((item: number) => {
        const newData = data.filter(player => player.id !== item);
        setData(newData);
    }, [data])

    const onSaveConfig = useCallback(() => {
        const formatedData = data.map((item, index) => ({ ...item, id: index + 1 }))
        RNFS.writeFile(configFilePath, JSON.stringify(formatedData)).then(() => {
            console.log('Config saved');
        }).catch((err) => {
            console.log(err);
        });
        Toast.success(t('configSaved'));
    }, [data])

    const [showConfirmResetConfig, setShowConfirmResetConfig] = useState(false);

    const onResetConfig = useCallback(() => {
        RNFS.writeFile(configFilePath, JSON.stringify(playerList)).then(() => {
            console.log('Config reset');
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setShowConfirmResetConfig(false);
            setData(playerList);
        })
    }, [])

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
                <HorizontalView gap={8}>
                    <Button
                        title={t('reset')}
                        onClick={() => setShowConfirmResetConfig(true)}
                        style={{ borderColor: colors.red[700] }}
                        textColor={colors.red[700]}
                        variant="outline"
                        fullWidth={false}
                    />
                    <Button
                        title={t('save')}
                        onClick={onSaveConfig}
                        fullWidth={false}
                    />
                </HorizontalView>
            </VerticalView>
            <ConfirmPopup
                visible={showConfirmResetConfig}
                title={t('confirmResetConfigTitle')}
                message={t('confirmResetConfigMessage')}
                onConfirm={onResetConfig}
                onCancel={() => setShowConfirmResetConfig(false)}
            />
            <BannerAd
                unitId={bannerAd}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
            <EditPlayerModal
                item={selectedItem}
                open={selectedItem !== null}
                setOpen={() => setSelectedItem(null)}
                onDeletePlayer={onDeletePlayer}
                onSave={(value) => {
                    if (selectedItem) {
                        const newData = [...data];
                        const updatePlayer = newData.find(player => player.id === selectedItem.id);
                        if (updatePlayer) {
                            updatePlayer.name = value.name;
                            updatePlayer.bgColor = value.bgColor;
                            updatePlayer.textColor = value.textColor;
                        }
                        setData(newData);
                        setSelectedItem(null);
                    }
                }}
            />
        </>
    )
}

type EditPlayerModalProps = {
    open: boolean,
    setOpen: (open: boolean) => void;
    item: playerListItem | null
    onSave: (item: playerListItem) => void
    onDeletePlayer: (id: number) => void
}

const { width, height } = Dimensions.get('window');

const EditPlayerModal = ({
    item,
    open,
    setOpen,
    onSave,
    onDeletePlayer,
}: EditPlayerModalProps) => {
    const [newName, setNewName] = useState<string>(item?.name ?? '');
    const [selectedBgColor, setSelectedBgColor] = useState<string>(item?.bgColor ?? '');

    useEffect(() => {
        setNewName(item?.name ?? '');
        setSelectedBgColor(item?.bgColor ?? '');
    }, [item])

    const renderItem = useCallback(({ item }: { item: string }) => {
        return (<TouchableOpacity style={[styles.bgColorItemContainer]} className={`${item}`} onPress={() => setSelectedBgColor(item)}>
        </TouchableOpacity>)
    }, [])

    return (
        <CustomModal
            open={open}
            setOpen={setOpen}
            title={t('editPlayerModalTitle')}
            showCloseButton
            modalStyle={{
                backgroundColor: colors.white,
                width: width * 0.8,
                maxWidth: width * 0.8,
                // height: height * 0.8,
            }}
        >
            <VerticalView
                alignItems="stretch" gap={16}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 100 }}
                    className={`${selectedBgColor}`}>
                    <Text style={[styles.playerItemTitle, { color: colors.white }]}>{newName}</Text>
                </View>
                <Input
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Enter new name"
                    label={t('playerName')}
                    labelClassName="text-dark-grey-800"
                    containerStyle={{ backgroundColor: colors.white }}
                />
                <FlatList
                    numColumns={4}
                    data={bgColorList}
                    contentContainerStyle={{ gap: 8, }}
                    columnWrapperStyle={{ gap: 8, justifyContent: 'space-between' }}
                    renderItem={renderItem}
                />
                <VerticalView gap={8}>
                    <Button
                        title={t('save')}
                        onClick={() => onSave({
                            name: newName,
                            bgColor: selectedBgColor,
                            textColor: 'text-dark-grey-800', id: item?.id ?? 0, point: 0, total: 0
                        })}
                    />
                    <Button
                        title={t('delete')}
                        onClick={() => {
                            onDeletePlayer(item?.id ?? 0)
                            setOpen(false)
                        }}
                        style={{ borderColor: colors.red[700] }}
                        textColor={colors.red[700]}
                        variant="outline"
                    />
                </VerticalView>
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
        flex: 1,
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
    },
    bgColorItemContainer: {
        flex: 1,
        aspectRatio: 1,
        maxWidth: '24%',
    }
})
