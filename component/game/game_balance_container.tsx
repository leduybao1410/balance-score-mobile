import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { playerListItem } from "./game_data";
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';

function BalanceContainer({ list, showMenu, summary, balanceScore }: { balanceScore: number, list: playerListItem[] | null, showMenu: () => void, summary: () => void }) {
    const [isBalanced, setIsBalanced] = useState<boolean>(true);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

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
                { backgroundColor: isBalanced ? colors.green[500] : colors.red[500] }
            ]}>
                <MaterialIcons
                    name={isBalanced ? "check" : "close"}
                    size={ResponsiveFontSize(24)}
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
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <View style={styles.balanceContainer}>
                <View style={styles.balanceContent}>
                    <Text style={styles.balanceScore}>{balanceScore}</Text>
                    {isBalanced ? renderBalanceBtn(true) : renderBalanceBtn(false)}
                </View>
            </View>
            <View style={[styles.menuContainer, isLandscape ? styles.menuContainerLandscape : styles.menuContainerPortrait]}>
                <MenuBtn
                    bgColor="bg-green-500"
                    func={summary}
                    icon={<Ionicons name="arrow-forward" size={ResponsiveFontSize(24)} color={colors.white} />}
                />
                <MenuBtn
                    bgColor="bg-gray-500"
                    func={showMenu}
                    icon={<MaterialIcons name="menu" size={ResponsiveFontSize(24)} color={colors.white} />}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors['light-grey'][50],
        paddingVertical: 8,
    },
    containerLandscape: {
        flexDirection: 'column',
        height: '100%',
    },
    balanceContainer: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: '50%',
        minHeight: 59,
        // backgroundColor: colors['dark-grey'][500],
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
        fontSize: ResponsiveFontSize(60),
        lineHeight: ResponsiveFontSize(60),
    },
    balanceIcon: {
        width: ResponsiveFontSize(40),
        height: ResponsiveFontSize(40),
        borderRadius: ResponsiveFontSize(40) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: 64,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    menuContainerLandscape: {
        flexDirection: 'column',
        height: '100%',
    },
    menuContainerPortrait: {
        minHeight: 60,
        maxWidth: '50%',
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