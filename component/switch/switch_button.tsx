import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';

interface MySwitchButtonProps {
    firstLable?: string;
    secondLabel?: string;
    fisrtLabelIcon?: React.ReactNode;
    secondLabelIcon?: React.ReactNode;
    isOn: boolean;
    setIsOn: (value: boolean) => void;
    swPaddingHorizontal?: string | number;
    swPaddingVertical?: string | number;
    backgroundColor?: string;
    activeTextColor?: string;
    activeBackgroundColor?: string;
}

const MySwitchButton: React.FC<MySwitchButtonProps> = ({
    firstLable = '',
    secondLabel = '',
    fisrtLabelIcon,
    secondLabelIcon,
    isOn,
    setIsOn,
    swPaddingHorizontal = 4,
    swPaddingVertical = 2,
    backgroundColor = colors['dark-grey'][200],
    activeTextColor = colors.white,
    activeBackgroundColor = colors.primary[700],
}) => {
    const paddingH = typeof swPaddingHorizontal === 'string' ? parseInt(swPaddingHorizontal, 10) : swPaddingHorizontal;
    const paddingV = typeof swPaddingVertical === 'string' ? parseInt(swPaddingVertical, 10) : swPaddingVertical;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    !isOn && styles.activeButton,
                    { backgroundColor: !isOn ? activeBackgroundColor : 'transparent', paddingHorizontal: paddingH, paddingVertical: paddingV },
                ]}
                onPress={() => setIsOn(false)}
                activeOpacity={0.7}
            >
                {fisrtLabelIcon && <View style={styles.iconContainer}>{fisrtLabelIcon}</View>}
                {firstLable && (
                    <Text style={[styles.label, !isOn && { color: activeTextColor }]}>{firstLable}</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.button,
                    isOn && styles.activeButton,
                    { backgroundColor: isOn ? activeBackgroundColor : 'transparent', paddingHorizontal: paddingH, paddingVertical: paddingV },
                ]}
                onPress={() => setIsOn(true)}
                activeOpacity={0.7}
            >
                {secondLabelIcon && <View style={styles.iconContainer}>{secondLabelIcon}</View>}
                {secondLabel && (
                    <Text style={[styles.label, isOn && { color: activeTextColor }]}>{secondLabel}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 2,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    activeButton: {
        // Active state styling handled by backgroundColor
    },
    label: {
        fontSize: ResponsiveFontSize(14),
        fontWeight: '600',
        color: colors['dark-grey'][700],
    },
    iconContainer: {
        marginRight: 4,
    },
});

export default MySwitchButton;
