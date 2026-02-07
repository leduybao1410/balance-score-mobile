import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, TextInput, ViewStyle } from 'react-native';
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';
import { Button } from '../button/button';
import { t } from "i18next";
import CustomModal from "../modal/modal";
import { VerticalView } from "../view";

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

    function renderButton({
        value, style, editable = false, onChange
    }: {
        value: string, style?: ViewStyle, editable?: boolean, onChange?: (value: number) => void
    }) {
        const inputRef = useRef<TextInput>(null);

        useEffect(() => {
            if (editable && inputRef.current) {
                inputRef.current.focus();
            }
        }, [editable]);

        // Only allow numeric input (including optional minus sign at the start)
        function handleChangeText(text: string) {
            if (!onChange) return;
            const numberValue = Number(text) || 0;
            onChange(numberValue);
        }

        return (
            <TouchableOpacity
                disabled={!editable}
                style={[styles.buttonDisplay, style]}
                onPress={() => {
                    if (editable && inputRef.current) {
                        inputRef.current.focus();
                    }
                }}
                activeOpacity={1}
            >
                {editable ? (
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        keyboardType="number-pad"
                        placeholder="?"
                        value={value}
                        onChangeText={handleChangeText}
                        selectTextOnFocus
                    />
                ) : (
                    <Text style={styles.buttonDisplayText}>{value}</Text>
                )}
            </TouchableOpacity>
        );
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
                onPress={() => changeBtnTemplate(singleValue, multipleValue)}
                style={styles.templateButton}
            >
                <View style={styles.templateButtonContent}>
                    <View style={styles.buttonColumn}>
                        {renderButton({
                            value: `${item[1]}`, onChange: (value) => {
                                setEditMultiBtn1(value);
                            }
                        })}
                        {renderButton({
                            value: `${item[0]}`, onChange: (value) => {
                                setEditMultiBtn2(value);
                            }
                        })}
                        {renderButton({
                            value: `${item[0]}`
                        })}
                        {renderButton({
                            value: `${item[1]}`
                        })}
                    </View>
                    <View style={styles.buttonColumn}>
                        {renderButton({
                            value: `${DEFAULT_SINGLE_BTN_TEMPLATE[index][0]}`, style: styles.singleButton, onChange: (value) => {
                                setEditMultiBtn3(value);
                            }
                        })}
                        {renderButton({
                            value: `${DEFAULT_SINGLE_BTN_TEMPLATE[index][1]}`, style: styles.singleButton, onChange: (value) => {
                                setEditMultiBtn3(value);
                            }
                        })}
                    </View>
                </View>
                {/* <Text style={styles.templateLabel}>{item[0]} - {item[1]}</Text> */}
                <Button
                    fullWidth={false}
                    title={`${item[0]} - ${item[1]}`}
                    onClick={() => changeBtnTemplate(singleValue, multipleValue)}
                />
            </TouchableOpacity>
        )
    }

    const [editMultiBtn1, setEditMultiBtn1] = useState<number>(0);
    const [editMultiBtn2, setEditMultiBtn2] = useState<number>(0);
    const [editMultiBtn3, setEditMultiBtn3] = useState<number>(0);


    return (
        <CustomModal
            open={isOpen}
            setOpen={setIsOpen}
            title={t('modifyButton')}
            modalStyle={{
                backgroundColor: colors.white,
                maxHeight: '90%',
                maxWidth: '95%',
                width: '95%',
                padding: 0,
            }}
            showTitle={false}
            showDivider={false}
            showCloseButton={false}
        // keyboardAvoiding={true}
        >
            <VerticalView alignItems="stretch" styles={styles.popupContainer}>
                <Text style={styles.title}>{t('modifyButton')}</Text>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollContent}
                    showsHorizontalScrollIndicator={true}
                >
                    {DEFAULT_MULTIPLE_BTN_TEMPLATE.map((item, index) => (
                        <RenderModifyBtn key={index} item={item} index={index} />
                    ))}
                    <View
                        style={styles.templateButton}>
                        <View style={styles.templateButtonContent}>
                            <View style={styles.buttonColumn}>
                                {renderButton({
                                    value: `-${editMultiBtn1}`, style: styles.customButtonDisabled
                                })}
                                {renderButton({
                                    value: `-${editMultiBtn2}`, style: styles.customButtonDisabled
                                })}
                                {renderButton({
                                    value: `${editMultiBtn2}`, editable: true, onChange: (value) => {
                                        setEditMultiBtn2(value);
                                    }
                                })}
                                {renderButton({
                                    value: `${editMultiBtn1}`, editable: true, onChange: (value) => {
                                        setEditMultiBtn1(value);
                                    }
                                })}
                            </View>
                            <View style={styles.buttonColumn}>
                                {renderButton({
                                    value: `-${editMultiBtn3}`, style: { ...styles.singleButton, ...styles.customButtonDisabled }
                                })}
                                {renderButton({
                                    value: `${editMultiBtn3}`, editable: true, style: styles.singleButton, onChange: (value) => {
                                        setEditMultiBtn3(value);
                                    }
                                })}
                            </View>
                        </View>
                        {/* <Text style={styles.templateLabel}></Text> */}
                        <Button
                            fullWidth={false}
                            title={t('apply')}
                            // title={`${editMultiBtn2} - ${editMultiBtn1}`}
                            disabled={editMultiBtn1 === 0 || editMultiBtn2 === 0 || editMultiBtn3 === 0}
                            onClick={() => {
                                changeBtnTemplate([-editMultiBtn3, editMultiBtn3], [
                                    -editMultiBtn1,
                                    -editMultiBtn2,
                                    editMultiBtn2,
                                    editMultiBtn1
                                ]);
                            }}
                        />
                    </View>
                </ScrollView>
                <Text style={styles.hintText}>{t('scrollRightToSeeMore')}</Text>
            </VerticalView>
        </CustomModal>
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
        backgroundColor: colors.white,
        gap: 8,
        padding: 0,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: ResponsiveFontSize(18),
        color: colors['dark-grey'][900],
    },
    scrollContent: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 8,
        padding: 8,
    },
    templateButton: {
        backgroundColor: colors['light-grey'][200],
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minWidth: 150,
    },
    templateButtonContent: {
        flexDirection: 'row',
        borderRadius: 8,
        gap: 8,
        padding: 12,
        backgroundColor: colors['dark-grey'][500],
    },
    singleButton: {
        flex: 2,
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
        maxHeight: 200,
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
    customButtonDisabled: {
        backgroundColor: colors['dark-grey'][400],
    },
});

export default PopupModifyButton;


