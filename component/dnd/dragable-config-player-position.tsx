import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    Draggable,
    Droppable,
    DroppedItemsMap,
    DropProvider,
    DropProviderRef,
} from "react-native-reanimated-dnd";
import { HorizontalView, VerticalView } from "../view";
import { colors } from "@/constant/colors";
import { t } from "i18next";
import CustomModal from "../modal/modal";
import { Button } from "../button/button";
import { myFontStyle } from "../responsive-text";
import { useFocusEffect } from "expo-router";

export type ConfigPlayerPositionProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    players: {
        id: number;
        title: string;
    }[];
    onConfigChange: (saveConfig: number[]) => void;
}

type PlayerPosition = {
    id: number;
    position: number;
}


export default function DragableConfigPlayerPosition({ open, setOpen, players, onConfigChange }: ConfigPlayerPositionProps) {
    const [playerPostion, setPlayerPostion] = useState<PlayerPosition[]>([])

    const dropProviderRef = useRef<DropProviderRef | null>(null);

    const onDroppedItemsUpdate = useCallback((droppedItems: DroppedItemsMap<unknown>) => {
        // Convert the object into an array of PlayerPosition
        const positions: PlayerPosition[] = Object.values(droppedItems).map((item: any) => {
            // Extract the position number from droppableId (e.g., "droppable-2" -> 2)
            const droppableId = item.droppableId || '';
            const positionMatch = droppableId.match(/droppable-(\d+)/);
            const position = positionMatch ? parseInt(positionMatch[1], 10) : 0;

            return {
                id: item.data?.id || 0,
                position: position
            };
        });

        setPlayerPostion(positions);
    }, [])

    const onPressPlayer = useCallback((player: {
        id: number;
        title: string;
    }) => {
        let emptyPosition: number | null = null;
        let index = 0;
        players.forEach((player) => {
            if (!playerPostion.some(item => item.position === index + 1)) {
                emptyPosition = index + 1;
                return;
            }
            index++;
        });
        if (emptyPosition !== null) {
            console.log(emptyPosition)
            setPlayerPostion(prev => ([...prev, { id: player.id, position: emptyPosition as number }]))
            console.log(dropProviderRef.current?.getDroppedItems())
        }
    }, [playerPostion])

    useFocusEffect(useCallback(() => {
        // const initPosition: PlayerPosition[] = players.map((player, index) => ({ id: player.id, position: index + 1 }));
        // setPlayerPostion(initPosition)
        return () => {
            setPlayerPostion([])
        }
    }, []))

    const showSaveButton = useMemo(() => {
        return playerPostion.length === players.length
    }, [playerPostion])

    const onSaveConfig = useCallback(() => {
        const saveConfig: number[] = playerPostion.sort((a, b) => a.position - b.position).map(item => item.id);
        onConfigChange(saveConfig)
    }, [playerPostion])

    return (
        <CustomModal
            open={open}
            setOpen={setOpen}
            title={t('configPlayerPositionTitle')}
            showCloseButton={false}
            modalStyle={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                maxWidth: '95%',
                maxHeight: '90%',
                flex: 1,
                padding: 8,
            }}
        >
            <GestureHandlerRootView style={styles.container}>
                <DropProvider
                    ref={dropProviderRef}
                    onDroppedItemsUpdate={onDroppedItemsUpdate}
                >
                    <VerticalView alignItems="center" justifyContent="space-between" styles={styles.content}>
                        {/* Drop Zones */}
                        <HorizontalView justifyContent="space-between" alignItems="stretch" styles={styles.dropAreas} gap={12}>
                            {Array.from({ length: players.length }).map((_, index) => (
                                <Droppable
                                    key={`droppable-${index + 1}`}
                                    onDrop={() => { }}
                                    droppableId={`droppable-${index + 1}`}

                                    activeStyle={styles.dropZoneActive}
                                    style={styles.droppable}
                                >
                                    <View style={[styles.dropZoneBlue, styles.dropZone]}>
                                        <Text style={styles.dropZoneText}>{`${t('zone')} ${index + 1}`}</Text>
                                        <Text style={styles.dropZoneSubtext}>{t('dropHere')}</Text>
                                    </View>
                                </Droppable>
                            ))}
                        </HorizontalView>

                        {/* Draggable Item */}
                        <VerticalView alignItems="stretch" styles={styles.draggableSection} gap={12}>
                            <Text style={styles.sectionTitle}>{t('players')}</Text>
                            <HorizontalView styles={styles.draggableAreas}>
                                {players.map((player) => (
                                    <Draggable

                                        draggableId={`draggable-${player.id}`}
                                        // onStateChange={(state) => handleStateChange(player.id, state)}
                                        key={`draggable-${player.id}`}
                                        data={player}>
                                        <TouchableOpacity
                                            onPress={() => onPressPlayer(player)}
                                            style={styles.draggableItem}>
                                            <Text style={styles.itemText}>{player.title}</Text>
                                        </TouchableOpacity>
                                    </Draggable>
                                ))}
                            </HorizontalView>
                            <HorizontalView gap={12}>
                                <Button
                                    variant="outline"
                                    fullWidth={false}
                                    title={t('cancel')}
                                    onClick={() => setOpen(false)}
                                    style={styles.saveButton}
                                />
                                <Button
                                    fullWidth={false}
                                    disabled={!showSaveButton}
                                    title={t('save')}
                                    onClick={onSaveConfig}
                                    style={styles.saveButton}
                                />
                            </HorizontalView>
                        </VerticalView>
                    </VerticalView>

                </DropProvider>
            </GestureHandlerRootView>
        </CustomModal >
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        // display: 'flex',
        padding: 8,
        minHeight: '95%',
        width: '100%',
        position: 'relative',
        backgroundColor: colors.white,
        borderRadius: 16,
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        color: colors['dark-grey'][800],
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
    },
    draggableSection: {
        flexShrink: 1,
        gap: 8,
        padding: 8,
        backgroundColor: colors['dark-grey'][300],
        borderRadius: 20,
    },
    draggableAreas: {
        flexGrow: 0,
        flexWrap: 'wrap',
        gap: 8,
    },
    draggableItem: {
        flexGrow: 0,
        padding: 10,
        backgroundColor: "#1C1C1E",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#3A3A3C",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    itemText: {
        color: "#FFFFFF",
        ...myFontStyle.small,
        fontWeight: "600",
        textAlign: "center",
    },
    droppable: {
        overflow: "hidden",
        borderRadius: 16,
        flexBasis: '30%',
    },
    dropZone: {
        aspectRatio: 1,
        borderWidth: 2,
        borderStyle: "dashed",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    dropZoneBlue: {
        borderColor: "#58a6ff",
        backgroundColor: "rgba(88, 166, 255, 0.08)",
    },
    dropZoneActive: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderStyle: "solid",
        transform: [{ scale: 1.02 }],
    },
    dropZoneText: {
        color: colors['dark-grey'][800],
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
    },
    dropZoneSubtext: {
        color: colors['dark-grey'][600],
        fontSize: 14,
        textAlign: "center",
    },
    dropAreas: {
        flex: 1,
        flexWrap: 'wrap',
    },
    saveButton: {
        flex: 1,
        // position: 'absolute',
        // bottom: 8,
        // right: 8,
    },
});