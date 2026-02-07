import { StyleSheet } from 'react-native';
import { colors } from '@/constant/colors';
import { ResponsiveFontSize } from '../responsive-text';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'flex-start',
        paddingBottom: 16,
    },
    playerCard: {
        minHeight: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        position: 'relative',
    },
    crownIcon: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    playerName: {
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 8,
    },
    playerScore: {
        color: colors.white,
        fontSize: ResponsiveFontSize(100),
        lineHeight: ResponsiveFontSize(100),
        fontWeight: 'bold',
    },
    hideButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: colors['light-grey'][100],
        borderRadius: ResponsiveFontSize(20),
        width: ResponsiveFontSize(20),
        height: ResponsiveFontSize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    swapButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: colors.white,
        borderRadius: ResponsiveFontSize(25),
        width: ResponsiveFontSize(20),
        height: ResponsiveFontSize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: ResponsiveFontSize(20),
        height: ResponsiveFontSize(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    editLabel: {
        position: 'absolute',
        left: 10,
        bottom: 10,
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editLabelText: {
        fontWeight: 'bold',
    },
    hostButton: {
        position: 'absolute',
        bottom: '25%',
        left: '10%',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    nameInputOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameInputContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 20,
        maxWidth: 400,
        gap: 16,
    },
    nameInputTitle: {
        fontSize: ResponsiveFontSize(18),
        fontWeight: '600',
        color: colors['dark-grey'][900],
        textAlign: 'center',
    },
    nameInput: {
        borderWidth: 1,
        borderColor: colors['dark-grey'][300],
        borderRadius: 8,
        padding: 12,
        fontSize: ResponsiveFontSize(16),
        backgroundColor: colors.white,
    },
    nameInputButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    nameInputCancelButton: {
        flex: 1,
    },
    nameInputSaveButton: {
        flex: 1,
        backgroundColor: colors.primary[700],
    },
});

