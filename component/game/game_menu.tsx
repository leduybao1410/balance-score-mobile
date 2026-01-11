import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, useWindowDimensions } from 'react-native';
import { gameMode } from "./game_side_controller";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';
import { router } from 'expo-router';

const GameMenu = (
    { isOpen, setIsOpen, setIsSummaryOpen, setIsAddPlayerOpen, setIsModifyBtn, selectedMode, setSelectedMode }
        :
        {
            isOpen: boolean,
            setIsOpen: (bool: boolean) => void,
            setIsSummaryOpen: (bool: boolean) => void,
            setIsAddPlayerOpen: (bool: boolean) => void,
            setIsModifyBtn: (bool: boolean) => void,
            selectedMode: string,
            setSelectedMode: (value: string) => void
        }
) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const list = [
        { name: "Thêm người", action: () => { setIsAddPlayerOpen(true); setIsOpen(false) } },
        { name: "Xem tổng kết", action: () => { setIsSummaryOpen(true); setIsOpen(false) } },
        { name: "Tùy chỉnh nút", action: () => { setIsModifyBtn(true); setIsOpen(false) } },
        { name: "Thoát", action: () => { setIsOpen(false), router.back() } },
    ];


    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsOpen(false)}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setIsOpen(false)}
            >
                <View style={[
                    styles.menuContainer,
                    {
                        width: isLandscape ? width * 0.3 : 208,
                        maxWidth: isLandscape ? width * 0.4 : 300,
                    }
                ]}>
                    <View style={styles.content}>
                        <View style={styles.modeContainer}>
                            <Text style={styles.modeTitle}>Chế độ hiện tại</Text>
                            <View style={styles.pickerContainer}>
                                {gameMode.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.pickerOption,
                                            selectedMode === item.name && styles.pickerOptionSelected
                                        ]}
                                        onPress={() => setSelectedMode(item.name)}
                                    >
                                        <Text style={[
                                            styles.pickerOptionText,
                                            selectedMode === item.name && styles.pickerOptionTextSelected
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.listContainer}>
                            {list.map((item) => (
                                <Button
                                    key={item.name}
                                    title={item.name}
                                    onClick={item.action}
                                    style={styles.menuButton}
                                    textColor={colors.white}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        backgroundColor: colors.white,
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        gap: 8,
    },
    modeContainer: {
        flexDirection: 'column',
        padding: 8,
        paddingVertical: 16,
        gap: 8,
        backgroundColor: colors['light-grey'][200],
        borderRadius: 8,
    },
    modeTitle: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: ResponsiveFontSize(14),
        color: colors['dark-grey'][900],
    },
    pickerContainer: {
        flexDirection: 'column',
        gap: 4,
    },
    pickerOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    pickerOptionSelected: {
        backgroundColor: colors.primary[500],
    },
    pickerOptionText: {
        fontSize: ResponsiveFontSize(14),
        color: colors.black,
        textAlign: 'center',
    },
    pickerOptionTextSelected: {
        color: colors.white,
    },
    listContainer: {
        flexDirection: 'column',
        gap: 8,
    },
    menuButton: {
        backgroundColor: colors.primary[800],
        borderRadius: 8,
    },
});

export default GameMenu;