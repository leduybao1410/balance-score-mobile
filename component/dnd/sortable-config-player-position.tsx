import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    Sortable,
    SortableItem,
    SortableRenderItemProps,
} from "react-native-reanimated-dnd";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

export default function SortableExample() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: "1", title: "Learn React Native", completed: false },
        { id: "2", title: "Build an app", completed: false },
        { id: "3", title: "Deploy to store", completed: true },
        { id: "4", title: "Celebrate success", completed: false },
    ]);

    const renderTask = useCallback(
        (props: SortableRenderItemProps<Task>) => {
            const {
                item,
                id,
                positions,
                lowerBound,
                autoScrollDirection,
                itemsCount,
                itemHeight,
            } = props;
            return (
                <SortableItem
                    key={id}
                    data={item}
                    id={id}
                    positions={positions}
                    lowerBound={lowerBound}
                    autoScrollDirection={autoScrollDirection}
                    itemsCount={itemsCount}
                    itemHeight={itemHeight}
                    onMove={(itemId, from, to) => {
                        const newTasks = [...tasks];
                        const [movedTask] = newTasks.splice(from, 1);
                        newTasks.splice(to, 0, movedTask);
                        setTasks(newTasks);
                    }}
                    style={styles.taskItem}
                >
                    <View style={styles.taskContent}>
                        <View style={styles.taskInfo}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            <Text style={styles.taskStatus}>
                                {item.completed ? "✅ Completed" : "⏳ Pending"}
                            </Text>
                        </View>

                        {/* Drag Handle */}
                        <SortableItem.Handle style={styles.dragHandle}>
                            <View style={styles.dragIconContainer}>
                                <View style={styles.dragColumn}>
                                    <View style={styles.dragDot} />
                                    <View style={styles.dragDot} />
                                    <View style={styles.dragDot} />
                                </View>
                                <View style={styles.dragColumn}>
                                    <View style={styles.dragDot} />
                                    <View style={styles.dragDot} />
                                    <View style={styles.dragDot} />
                                </View>
                            </View>
                        </SortableItem.Handle>
                    </View>
                </SortableItem>
            );
        },
        [tasks]
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📋 My Tasks</Text>
                <Text style={styles.headerSubtitle}>Drag to reorder</Text>
            </View>

            <Sortable
                data={tasks}
                renderItem={renderTask}
                itemHeight={80}
                style={styles.list}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    header: {
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
    },
    headerSubtitle: {
        color: "#8E8E93",
        fontSize: 14,
    },
    list: {
        flex: 1,
        backgroundColor: "#000000",
        marginTop: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        overflow: "hidden",
    },
    taskItem: {
        height: 80,

        backgroundColor: "transparent",
    },
    taskContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#1C1C1E",

        borderWidth: 1,
        borderColor: "#3A3A3C",
    },
    taskInfo: {
        flex: 1,
        paddingRight: 16,
    },
    taskTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    taskStatus: {
        color: "#8E8E93",
        fontSize: 14,
    },
    dragHandle: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    dragIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    dragColumn: {
        flexDirection: "column",
        gap: 2,
    },
    dragDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "#6D6D70",
    },
});
