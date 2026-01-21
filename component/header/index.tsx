import { ResponsiveFontSize } from '@/component/responsive-text';
import { HorizontalView } from '@/component/view';
import { colors } from '@/constant/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

export const Header = ({ href, title }: { href?: Href, title?: string }) => {
    const goBack = () => {
        console.log('goBack');
        if (href) {
            router.navigate(href);
            return;
        }
        router.canGoBack() ? router.back() : router.replace('/');
    }
    return (
        <HorizontalView styles={styles.headerContainer} justifyContent='flex-start' alignItems='center' gap={10}>
            <TouchableOpacity style={styles.backButton} onPress={goBack} hitSlop={HIT_SLOP}>
                <MaterialIcons name="arrow-back" size={24} color={colors['dark-grey'][800]} />
            </TouchableOpacity>
            <Text style={styles.title}>{title || ''}</Text>
        </HorizontalView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 999,
        paddingHorizontal: 12,
    },
    backButton: {
        zIndex: 999,
        padding: 10,
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: ResponsiveFontSize(24),
        fontWeight: 'bold',
        color: colors['dark-grey'][800],
    },
})