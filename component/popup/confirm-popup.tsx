import React, { Fragment, memo, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { myFontStyle } from '@/component/responsive-text';
import { colors } from '@/constant/colors';
import { HorizontalView, VerticalView } from '@/component/view';
import { Button } from '@/component/button/button';

export interface ConfirmPopupProps {
    visible: boolean;
    title: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    disabled?: boolean;
    onClose?: () => void;
    customContent?: React.ReactNode;
    loadingConfirm?: boolean;
}

const ConfirmPopup = memo(function ConfirmPopup({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Xác nhận',
    disabled = false,
    cancelText = 'Hủy',
    onClose,
    customContent,
    loadingConfirm = false,
}: ConfirmPopupProps) {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [orientation, setOrientation] = useState(isLandscape ? 'landscape' : 'portrait');

    // Update orientation state when dimensions change
    useEffect(() => {
        setOrientation(isLandscape ? 'landscape' : 'portrait');
    }, [isLandscape]);

    const handleClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    const handleConfirm = useCallback(() => {
        onConfirm();
    }, [onConfirm]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return (
        <Fragment>
            <Modal
                key={orientation}
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={handleClose}
                statusBarTranslucent
                supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right', 'portrait-upside-down']}
            >
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View style={StyleSheet.absoluteFill} />
                    </TouchableWithoutFeedback>
                    <View style={styles.popup}>
                        <VerticalView alignItems="stretch" gap={16}>
                            {/* Header */}
                            <VerticalView alignItems="stretch" gap={8}>
                                <Text style={styles.title}>{title}</Text>
                                {customContent ?? <Text style={styles.message}>{message ?? ''}</Text>}
                            </VerticalView>

                            {/* Buttons */}
                            <HorizontalView gap={12} alignItems="stretch">
                                <Button
                                    title={cancelText}
                                    variant="outline"
                                    style={styles.cancelButton}
                                    textColor={colors['dark-grey'][700]}
                                    onClick={handleCancel}
                                />
                                <Button
                                    loading={loadingConfirm}
                                    title={confirmText}
                                    style={styles.confirmButton}
                                    disabled={disabled}
                                    onClick={handleConfirm}
                                />
                            </HorizontalView>
                        </VerticalView>
                    </View>
                </View>
            </Modal>
        </Fragment>
    );
});

export default ConfirmPopup;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    popup: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        // Simplified shadow for better performance
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    title: {
        ...myFontStyle.normal,
        fontWeight: '600',
        color: colors['dark-grey'][900],
        textAlign: 'center',
    },
    message: {
        ...myFontStyle.small,
        color: colors['dark-grey'][700],
        textAlign: 'center',
        lineHeight: 20,
    },
    cancelButton: {
        flex: 1,
        borderColor: colors['dark-grey'][300],
    },
    confirmButton: {
        flex: 1,
    },
});
