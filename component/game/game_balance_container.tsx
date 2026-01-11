import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { playerListItem } from "./game_data";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';

function BalanceContainer({ showMenu, summary, balanceScore }: { balanceScore: number, showMenu: () => void, summary: () => void }) {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [isBalanced, setIsBalanced] = useState<boolean>(true);


    useEffect(() => {
        if (balanceScore !== 0) {
            setIsBalanced(false);
        } else {
            setIsBalanced(true)
        }
    }, [balanceScore])

    function renderBalanceBtn(isBalanced: boolean) {
        return (
            <View style={[
                styles.balanceIcon,
                {
                    backgroundColor: isBalanced ? colors.green[500] : colors.red[500],
                    width: isLandscape ? ResponsiveFontSize(16) : ResponsiveFontSize(40),
                    height: isLandscape ? ResponsiveFontSize(16) : ResponsiveFontSize(40),
                    borderRadius: isLandscape ? ResponsiveFontSize(20) : ResponsiveFontSize(40) / 2,
                }
            ]}>
                <MaterialIcons
                    name={isBalanced ? "check" : "close"}
                    size={isLandscape ? ResponsiveFontSize(12) : ResponsiveFontSize(24)}
                    color={colors.white}
                />
            </View>
        );
    }

    function MenuBtn({ bgColor, icon, func }: { bgColor: string, icon: React.ReactNode, func: () => void }) {
        const backgroundColor = bgColor === 'bg-green-500' ? colors.green[500] : colors['dark-grey'][500];
        return (
            <TouchableOpacity
                style={[styles.menuButton, { backgroundColor }, isLandscape && styles.menuButtonLandscape]}
                onPress={func}
                activeOpacity={0.7}
            >
                {icon}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.container, { minHeight: isLandscape ? '35%' : 75 }]}>
            <View style={styles.balanceContainer}>
                <View style={styles.balanceContent}>
                    <Text style={[
                        styles.balanceScore,
                        {
                            fontSize: isLandscape ? ResponsiveFontSize(24) : ResponsiveFontSize(60),
                            lineHeight: isLandscape ? ResponsiveFontSize(24) : ResponsiveFontSize(60),
                        }
                    ]}>{balanceScore}</Text>
                    {isBalanced ? renderBalanceBtn(true) : renderBalanceBtn(false)}
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: isLandscape ? 'column' : 'row', gap: 6, paddingHorizontal: 8 }}>
                <MenuBtn
                    bgColor="bg-green-500"
                    func={summary}
                    icon={<MaterialIcons name="check" size={isLandscape ? ResponsiveFontSize(14) : ResponsiveFontSize(24)} color={colors.white} />}
                />
                <MenuBtn
                    bgColor="bg-gray-500"
                    func={showMenu}
                    icon={<MaterialIcons name="menu" size={isLandscape ? ResponsiveFontSize(14) : ResponsiveFontSize(24)} color={colors.white} />}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors['light-grey'][50],
        paddingVertical: 8,
        flexDirection: 'row',
    },
    balanceContainer: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: '100%',
        minHeight: 59,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    balanceContent: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceScore: {
        color: colors.white,
        fontWeight: '600',
    },
    balanceIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    menuButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
    },
    menuButtonLandscape: {
        minWidth: '50%',
    },
});

export default BalanceContainer;