import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { HorizontalView } from "../view"
import { colors } from "@/constant/colors"
import { myFontStyle } from "../responsive-text"

export default function CustomSwitch({
    firstLable,
    secondLabel,
    isOn,
    setIsOn,
}: {
    firstLable: string,
    secondLabel: string,
    isOn: boolean,
    setIsOn: (value: boolean) => void,
}) {
    return (
        <HorizontalView styles={styles.switchContainer}>
            <TouchableOpacity
                style={[styles.switchButton, isOn && styles.activeSwitchButton]}
                onPress={() => { setIsOn(true) }}
            >
                <Text style={[styles.switchTitle, isOn && styles.activeSwitchButtonText]}>{firstLable}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.switchButton, !isOn && styles.activeSwitchButton]}
                onPress={() => { setIsOn(false) }}
            >
                <Text style={[styles.switchTitle, !isOn && styles.activeSwitchButtonText]}>{secondLabel}</Text>
            </TouchableOpacity>
        </HorizontalView>
    )
}

const styles = StyleSheet.create({
    switchContainer:
    {
        padding: 8,
        borderRadius: 100,
        backgroundColor: colors['dark-grey'][300]
    },
    switchTitle: {
        ...myFontStyle.normal,
        fontWeight: 'semibold',
        color: colors['dark-grey'][700],
    },
    switchButton: {
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        color: colors['dark-grey'][700],
    },
    activeSwitchButton: {
        backgroundColor: colors['dark-grey'][700],
    },
    activeSwitchButtonText: {
        color: colors.white,
    },
})
