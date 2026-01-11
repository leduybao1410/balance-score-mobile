import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, TextInput } from 'react-native';
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';

const DEFAULT_MULTIPLE_BTN_TEMPLATE = [
    [2, 4],
    [5, 10],
    [10, 20],
    [50, 100],
];
const DEFAULT_SINGLE_BTN_TEMPLATE = [
    [-1, 1],
    [-1, 1],
    [-5, 5],
    [-10, 10],
];

const { width } = Dimensions.get('window');

const PopupModifyButton = ({ isOpen, setIsOpen, setMultiplePointValue, setSinglePointValue }:
    {
        isOpen: boolean, setIsOpen: (bool: boolean) => void,
        setMultiplePointValue: (array: number[] | null) => void,
        setSinglePointValue: (array: number[] | null) => void
    }) => {

    function changeBtnTemplate(singleArray: number[], multipleArray: number[]) {
        setSinglePointValue(null);
        setMultiplePointValue(null);
        setTimeout(() => {
            setSinglePointValue(singleArray);
            setMultiplePointValue(multipleArray);
            setIsOpen(false)
        }, 200)
    }

    function renderButton(value: string) {
        return (
            <View style={styles.buttonDisplay}>
                <Text style={styles.buttonDisplayText}>{value}</Text>
            </View>
        )
    }

    function RenderModifyBtn({ item, index }: { item: number[], index: number }) {
        const singleValue = [
            DEFAULT_SINGLE_BTN_TEMPLATE[index][0],
            DEFAULT_SINGLE_BTN_TEMPLATE[index][1]
        ]
        const multipleValue = [
            -item[1],
            -item[0],
            item[0],
            item[1]
        ]
        return (
            <TouchableOpacity
                style={styles.templateButton}
                onPress={() => changeBtnTemplate(singleValue, multipleValue)}
                activeOpacity={0.7}
            >
                <View style={styles.templateButtonContent}>
                    <View style={styles.buttonColumn}>
                        {renderButton(`-${item[1]}`)}
                        {renderButton(`-${item[0]}`)}
                        {renderButton(`${item[0]}`)}
                        {renderButton(`${item[1]}`)}
                    </View>
                    <View style={styles.buttonColumn}>
                        {renderButton(`${DEFAULT_SINGLE_BTN_TEMPLATE[index][0]}`)}
                        {renderButton(`${DEFAULT_SINGLE_BTN_TEMPLATE[index][1]}`)}
                    </View>
                </View>
                <Text style={styles.templateLabel}>{item[0]} - {item[1]}</Text>
            </TouchableOpacity>
        )
    }

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editMultiBtn1, setEditMultiBtn1] = useState<number>(0);
    const [editMultiBtn2, setEditMultiBtn2] = useState<number>(0);
    const [editMultiBtn3, setEditMultiBtn3] = useState<number>(0);

    function customBtnTemplate() {
        const singleArray = [-editMultiBtn3, editMultiBtn3];
        const multipleArray = [
            -editMultiBtn1,
            -editMultiBtn2,
            editMultiBtn2,
            editMultiBtn1
        ];

        changeBtnTemplate(singleArray, multipleArray);
    }

    useEffect(() => {
        if (editMultiBtn1 !== 0 && editMultiBtn2 !== 0 && editMultiBtn3 !== 0) {
            setIsEditing(true);
        }
    }, [editMultiBtn1, editMultiBtn2, editMultiBtn3])

    function renderEditingButton(position: number) {
        return (
            <View style={styles.buttonDisplay}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="?"
                    value={position === 1 ? (editMultiBtn1 ? editMultiBtn1.toString() : '') :
                        position === 2 ? (editMultiBtn2 ? editMultiBtn2.toString() : '') :
                            (editMultiBtn3 ? editMultiBtn3.toString() : '')}
                    onChangeText={(text) => {
                        const value = parseInt(text, 10) || 0;
                        if (position === 1) {
                            setEditMultiBtn1(value)
                        } else if (position === 2) {
                            setEditMultiBtn2(value)
                        } else if (position === 3) {
                            setEditMultiBtn3(value)
                        }
                    }}
                    maxLength={5}
                />
            </View>
        )
    }

    return (
        <Modal
            visible={isOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsOpen(false)}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setIsOpen(false)}
            >
                <View style={styles.popupContainer}>
                    <View style={styles.popup}>
                        <Text style={styles.title}>Tùy chỉnh nút</Text>
                        <ScrollView
                            horizontal
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsHorizontalScrollIndicator={true}
                        >
                            {DEFAULT_MULTIPLE_BTN_TEMPLATE.map((item, index) => (
                                <RenderModifyBtn key={index} item={item} index={index} />
                            ))}
                            <View style={styles.customTemplate}>
                                <View style={styles.templateButtonContent}>
                                    <View style={styles.buttonColumn}>
                                        {editMultiBtn1 ? renderButton(`-${editMultiBtn1}`) : renderButton(`?`)}
                                        {editMultiBtn2 ? renderButton(`-${editMultiBtn2}`) : renderButton(`?`)}
                                        {renderEditingButton(2)}
                                        {renderEditingButton(1)}
                                    </View>
                                    <View style={styles.buttonColumn}>
                                        {editMultiBtn3 ? renderButton(`-${editMultiBtn3}`) : renderButton(`?`)}
                                        {renderEditingButton(3)}
                                    </View>
                                </View>
                                {!isEditing ? (
                                    <Text style={styles.templateLabel}>Tùy chỉnh</Text>
                                ) : (
                                    <Button
                                        title="Áp dụng"
                                        onClick={customBtnTemplate}
                                        style={styles.applyButton}
                                        textColor={colors.white}
                                    />
                                )}
                            </View>
                        </ScrollView>
                        <Text style={styles.hintText}>Lướt sang phải để xem thêm</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        width: width * 0.9,
        maxWidth: 600,
    },
    popup: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: ResponsiveFontSize(18),
        color: colors['dark-grey'][900],
    },
    scrollView: {
        width: '100%',
    },
    scrollContent: {
        flexDirection: 'row',
        gap: 8,
        padding: 8,
    },
    templateButton: {
        maxWidth: '50%',
        flex: 1,
        backgroundColor: colors['light-grey'][200],
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 150,
    },
    templateButtonContent: {
        flexDirection: 'row',
        borderRadius: 8,
        gap: 8,
        padding: 8,
        backgroundColor: colors['dark-grey'][500],
    },
    buttonColumn: {
        flexDirection: 'column',
        gap: 8,
    },
    buttonDisplay: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 8,
        borderRadius: 8,
        minWidth: 50,
        minHeight: 40,
    },
    buttonDisplayText: {
        fontWeight: '600',
        fontSize: ResponsiveFontSize(18),
        color: colors['dark-grey'][900],
    },
    input: {
        maxWidth: 50,
        width: '100%',
        height: '100%',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: ResponsiveFontSize(16),
        color: colors['dark-grey'][900],
    },
    templateLabel: {
        fontWeight: '600',
        fontSize: ResponsiveFontSize(14),
        color: colors['dark-grey'][900],
    },
    customTemplate: {
        maxWidth: '50%',
        flex: 1,
        backgroundColor: colors['light-grey'][200],
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 150,
    },
    applyButton: {
        backgroundColor: colors.green[500],
        borderRadius: 8,
        padding: 8,
    },
    hintText: {
        textAlign: 'center',
        fontSize: ResponsiveFontSize(12),
        color: colors['dark-grey'][600],
        marginTop: 8,
    },
});

export default PopupModifyButton;


