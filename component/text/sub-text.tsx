import { myFontStyle } from '@/component/responsive-text';
import { colors } from '@/constant/colors';
import { Text, TextStyle } from 'react-native';

type SubTextProps = {
    children: React.ReactNode;
    style?: TextStyle;
    variant?: 'default' | 'error';
};

export const SubText = ({ children, style, variant = 'default' }: SubTextProps) => {
    const color = variant === 'error' ? colors.red[700] : colors['dark-grey'][600];
    return (
        <Text
            style={[myFontStyle.extraSmall, { color, marginTop: 0, fontStyle: 'italic' }, style ?? {}]}
        >
            {children}
        </Text>
    );
};
