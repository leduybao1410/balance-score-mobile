import React, { memo, useMemo } from 'react';
import {
    ActivityIndicator,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { myFontStyle } from '../responsive-text';
import { colors } from '@/constant/colors';

export type OntoButtonType = {
    variant: 'default' | 'outline' | 'transparent' | 'blue-outline';
};

export const Button = memo(function Button({
    variant = 'default',
    onClick,
    title,
    className,
    style,
    textStyle,
    textColor,
    borderColor,
    icon,
    disabled,
    fontSize = 16,
    paddingVertical = 8,
    paddingHorizontal = 12,
    fullWidth = true,
    gap = 8,
    loading = false,
    iconPosition = 'left',
    numberOfLines = 1,
}: {
    title: string;
    variant?: OntoButtonType['variant'];
    className?: any;
    textStyle?: TextStyle;
    textColor?: string;
    borderColor?: string;
    fontSize?: number;
    iconPosition?: 'left' | 'right';
    onClick: any;
    icon?: React.ReactNode;
    disabled?: boolean;
    paddingVertical?: number;
    paddingHorizontal?: number;
    fullWidth?: boolean;
    gap?: number;
    style?: StyleProp<ViewStyle>;
    loading?: boolean;
    numberOfLines?: number;
}) {
    const textColorValue = useMemo(() => {
        if (textColor) return textColor;
        switch (variant) {
            case 'transparent':
                return colors.primary[700];
            case 'outline':
                return colors['dark-grey'][600];
            case 'default':
                return '#fff';
            case 'blue-outline':
                return colors.primary[700];
        }
    }, [variant, textColor]);

    const borderColorValue = useMemo(() => {
        if (borderColor) return borderColor;
        switch (variant) {
            case 'transparent':
                return colors.primary[700];
            case 'outline':
                return colors['dark-grey'][600];
            case 'default':
                return colors.primary[700];
            case 'blue-outline':
                return colors.primary[700];
        }
    }, [variant, borderColor]);

    const buttonStyle = useMemo(
        () => [
            {
                zIndex: 10,
                paddingVertical,
                paddingHorizontal,
                borderColor: borderColorValue,
                gap,
            },
            style,
        ],
        [paddingVertical, paddingHorizontal, borderColorValue, gap, style],
    );

    const classNameString = useMemo(
        () =>
            `${fullWidth ? 'w-full' : ''} rounded-full flex flex-row justify-center items-center ${variant === 'default' ? 'bg-primary-700' : ''}
    ${variant === 'outline' ? 'bg-transparent border' : ''}
    ${variant === 'transparent' ? 'bg-transparent border-none' : ''}
    ${variant === 'blue-outline' ? 'bg-transparent border' : ''}
    ${disabled || loading ? 'opacity-50' : ''}
    ${className ? className : ''}`,
        [fullWidth, variant, disabled, loading, className],
    );

    return (
        <TouchableOpacity
            disabled={disabled || loading}
            style={buttonStyle}
            className={classNameString}
            onPress={onClick}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={textColorValue}
                    style={{ marginRight: icon ? gap : 0 }}
                />
            ) : (
                <>
                    {iconPosition === 'left' && icon}
                    <Text
                        numberOfLines={numberOfLines}
                        className="font-medium leading-normal"
                        style={{
                            color: textColorValue,
                            fontSize: fontSize ?? myFontStyle.normal,
                            flexWrap: 'nowrap',
                            ...textStyle,
                        }}
                    >
                        {title}
                    </Text>
                    {iconPosition === 'right' && icon}
                </>
            )}
        </TouchableOpacity>
    );
});
