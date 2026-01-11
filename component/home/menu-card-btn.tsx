import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { ResponsiveFontSize } from "../responsive-text";
import { colors } from "@/constant/colors";
import { ReactNode } from "react";

interface MenuCardBtnProps {
    backgroundColor?: string;
    title: string;
    textColor?: string;
    onPress: () => void;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    icon?: ReactNode;
    iconPosition?: 'left' | 'top' | 'right';
}

export const MenuCardBtn = ({
    backgroundColor = colors.yellow[700],
    textColor = colors['dark-grey'][800],
    title,
    onPress,
    containerStyle,
    icon,
    iconPosition = 'left',
    textStyle,
}: MenuCardBtnProps) => {
    const isHorizontal = iconPosition === 'left' || iconPosition === 'right';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.container,
                { backgroundColor },
                { flexDirection: isHorizontal ? 'row' : 'column' },
                containerStyle
            ]}>
            {iconPosition === 'left' && icon && (
                <View style={styles.iconLeft}>{icon}</View>
            )}
            {iconPosition === 'top' && icon && (
                <View style={styles.iconTop}>{icon}</View>
            )}
            <Text style={[styles.text, { color: textColor }, textStyle]}>
                {title}
            </Text>
            {iconPosition === 'right' && icon && (
                <View style={styles.iconRight}>{icon}</View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors['dark-grey'][100],
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    text: {
        fontWeight: '600',
        fontSize: ResponsiveFontSize(24),
        lineHeight: ResponsiveFontSize(24) * 1.5,
    },
    iconLeft: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 10,
    },
    iconTop: {
        marginBottom: 10,
    },
});