// components/Input.js
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TextInputProps,
    StyleProp,
    TextStyle,
    ViewStyle,
    Pressable,
    Image,
    TouchableWithoutFeedback,
} from 'react-native';
import { useMemo, useRef, useState } from 'react';
import { myFontStyle } from '../responsive-text';
import { colors } from '@/constant/colors';
import { renderHitSlop } from '@/utils/utils';
import { icons } from '@/constant/images';

export function InputLabel({
    children,
    className,
    weight,
    isRequired,
    style,
}: {
    children: any;
    className?: string;
    weight?: TextStyle['fontWeight'];
    isRequired?: boolean;
    style?: StyleProp<TextStyle>;
}) {
    return (
        <Text
            style={[{ ...myFontStyle.normal }, weight ? { fontWeight: weight } : null, style]}
            className={`${!weight ? 'font-semibold' : ''} mb-1 ${className ?? ''}`}>
            {children}
            {isRequired ? <Text style={{ color: colors.red[600], marginLeft: 4 }}> *</Text> : null}
        </Text>
    );
}

export function InputSubLabel({ children, className }: any) {
    return (
        <Text
            style={{ ...myFontStyle.extraSmall }}
            className={`mb-1 italic text-dark-grey-700 ${className}`}>
            {children}
        </Text>
    );
}

// Helper to format number as currency (thousand separator)
function formatCurrency(value: string) {
    // Remove all non-digit characters
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return '';
    // Format with thousand separator
    return parseInt(numeric, 10).toLocaleString('en-US');
}

export const Input = ({
    inputRef,
    icon,
    label,
    subLabel,
    labelClassName = '',
    subLabelClassName = '',
    placeholder,
    secureTextEntry = false,
    type = 'default',
    keyboardType = 'default',
    value,
    maxNumber,
    minNumber,
    onChangeText,
    autoComplete,
    autoCapitalize = 'none',
    inputStyle,
    containerStyle,
    onBlur,
    isFocused,
    scrollViewRef,
    onFocus,
    placeholderDark = false,
    placeholderColor,
    labelWeight,
    labelStyle,
    isRequired = false,
    rightElement,
    rightIcon,
    editable = true,
}: {
    inputRef?: React.RefObject<TextInput>;
    icon?: React.ReactNode;
    label?: string;
    subLabel?: string;
    type?: 'default' | 'search' | 'textarea' | 'number' | 'currency';
    labelClassName?: string;
    subLabelClassName?: string;
    maxNumber?: number;
    minNumber?: number;
    placeholder?: TextInputProps['placeholder'];
    secureTextEntry?: TextInputProps['secureTextEntry'];
    keyboardType?: TextInputProps['keyboardType'];
    value: TextInputProps['value'];
    onChangeText: TextInputProps['onChangeText'];
    autoComplete?: TextInputProps['autoComplete'];
    autoCapitalize?: TextInputProps['autoCapitalize'];
    onBlur?: TextInputProps['onBlur'];
    onFocus?: TextInputProps['onFocus'];
    inputStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    isFocused?: boolean;
    scrollViewRef?: React.RefObject<import('react-native').ScrollView | null>;
    placeholderDark?: boolean;
    labelWeight?: TextStyle['fontWeight'];
    labelStyle?: StyleProp<TextStyle>;
    isRequired?: boolean;
    placeholderColor?: string;
    rightElement?: React.ReactNode;
    rightIcon?: React.ReactNode;
    editable?: boolean;
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<View>(null);

    function forceFocus() {
        if (inputRef?.current) {
            inputRef.current?.focus();
        }
    }

    function forceBlur() {
        if (inputRef?.current) {
            inputRef.current?.blur();
        }
    }

    function clearValue() {
        onChangeText && onChangeText('');
    }

    function handleOutsidePress() {
        forceBlur();
    }

    const placeholderDefaultColor = colors['dark-grey'][placeholderDark ? 600 : 300];

    const isTextarea = type === 'textarea';
    const hasValue = typeof value === 'string' ? value.length > 0 : !!value;

    // For currency type, always show formatted value in input
    const displayValue =
        type === 'currency' && typeof value === 'string' && value !== ''
            ? formatCurrency(value)
            : value;

    useMemo(() => {
        if (isFocused) {
            forceFocus();
        }
    }, [isFocused]);

    return (
        <View ref={containerRef} className="flex flex-grow" style={containerStyle}>
            {label && (
                <InputLabel
                    weight={labelWeight}
                    className={labelClassName}
                    isRequired={isRequired}
                    style={labelStyle}>
                    {label}
                </InputLabel>
            )}
            {subLabel && <InputSubLabel className={subLabelClassName}>{subLabel}</InputSubLabel>}
            <View className="relative flex w-full flex-row items-center">
                {type === 'search' && (
                    <Image source={icons.search} className="absolute left-4 z-50 h-5 w-5" />
                )}
                {icon && type !== 'search' && <View className="absolute left-4 z-50">{icon}</View>}

                {hasValue && !secureTextEntry && editable && (
                    <Pressable
                        hitSlop={renderHitSlop()}
                        onPress={clearValue}
                        className="absolute right-2 z-50 p-3 "
                        style={[isTextarea ? { top: 12 } : undefined]}>
                        <Image source={icons.xmark} className="h-3.5 w-3.5" />
                    </Pressable>
                )}
                <View style={{ flex: 1 }}>
                    <TextInput
                        ref={inputRef as React.RefObject<TextInput>}
                        onFocus={onFocus}
                        autoComplete={autoComplete}
                        onBlur={onBlur}
                        editable={editable}
                        autoFocus={false}
                        placeholderTextColor={placeholderColor ?? placeholderDefaultColor}
                        className={`w-full ${isTextarea ? '' : 'h-12'} rounded-lg border border-dark-grey-300 bg-white px-4 text-dark-grey-800 ${icon || type === 'search' ? 'pl-12' : ''}`}
                        style={[
                            isTextarea ? { paddingTop: 12, paddingBottom: 12 } : null,
                            isTextarea && hasValue ? { paddingRight: 36 } : null,
                            rightIcon && rightElement
                                ? { paddingRight: 96 }
                                : rightIcon || rightElement
                                    ? { paddingRight: 56 }
                                    : null,
                            inputStyle,
                        ]}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry && !isVisible}
                        keyboardType={type === 'currency' || type === 'number' ? 'numeric' : keyboardType}
                        value={displayValue}
                        onChangeText={(text) => {
                            if (!onChangeText) return;
                            if (type === 'number') {
                                if (text === '' || /^\d*$/.test(text)) {
                                    onChangeText(text);
                                }
                            } else if (type === 'currency') {
                                // Remove all non-digit characters
                                const numeric = text.replace(/\D/g, '');
                                // Optionally, handle maxNumber/minNumber here
                                onChangeText(numeric);
                            } else {
                                onChangeText(text);
                            }
                        }}
                        autoCapitalize={autoCapitalize}
                        multiline={isTextarea}
                        numberOfLines={isTextarea ? 4 : 1}
                        textAlignVertical={isTextarea ? 'top' : 'center'}
                    />
                    {/* Right overlay inside input border */}
                    {(rightElement || rightIcon) && (
                        <View
                            style={{
                                position: 'absolute',
                                right: 12,
                                top: 0,
                                bottom: 0,
                                justifyContent: 'center',
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                                {rightElement ? (
                                    <View style={rightIcon ? { left: 0 } : undefined}>{rightElement}</View>
                                ) : null}
                                {rightIcon ? <View style={{}}>{rightIcon}</View> : null}
                            </View>
                        </View>
                    )}
                </View>
                {secureTextEntry && (
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 10,
                        }}
                        onPress={() => setIsVisible(!isVisible)}>
                        <Image
                            source={isVisible ? icons.eye : icons.eyeOff}
                            style={{ width: 24, height: 24, tintColor: colors['dark-grey'][700] }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default Input;
