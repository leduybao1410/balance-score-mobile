import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import { Toast } from 'toastify-react-native';
import { renderHitSlop } from '@/utils/utils';
import { HorizontalView } from '../view';
import { myFontStyle } from '../responsive-text';
import { colors } from '@/constant/colors';


// Define the type for the toast config function props
export interface ToastConfigProps {
  text1?: string;
  text2?: string;
  position?: 'top' | 'bottom';
  topOffset?: number;
  bottomOffset?: number;
  useModal?: boolean;
  props?: {
    image?: any;
    [key: string]: any;
  };
  [key: string]: any;
}

// Define the type for the toastConfig object
type ToastConfig = {
  [key: string]: (props: ToastConfigProps) => React.ReactNode;
};

interface CustomToastProps extends ToastConfigProps {
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  icon: string;
}

const CustomToast: React.FC<CustomToastProps> = ({
  text1,
  text2,
  position,
  topOffset,
  bottomOffset,
  props,
  bgColor,
  borderColor,
  iconBgColor,
  icon,
}) => (
  <Pressable
    style={[
      style.container,
      {
        backgroundColor: bgColor,
        borderColor: borderColor,
      },
      position === 'top' ? { top: topOffset } : { bottom: bottomOffset },
    ]}
    onPress={() => {
      Toast.hide();
    }}
    hitSlop={renderHitSlop()}>
    <HorizontalView gap={8} alignItems="center">
      {props?.image ? (
        <View style={[style.iconContainer, { backgroundColor: iconBgColor }]}>
          <Image source={props.image} style={style.iconImage} />
        </View>
      ) : (
        <View style={[style.iconContainer, { backgroundColor: iconBgColor }]}>
          <Text style={style.icon}>{icon}</Text>
        </View>
      )}
      <View style={style.textContainer}>
        <Text style={[style.message, { color: colors['dark-grey'][900] }]}>{text1}</Text>
        {text2 && (
          <Text style={[style.subMessage, { color: colors['dark-grey'][700] }]}>{text2}</Text>
        )}
      </View>
    </HorizontalView>
  </Pressable>
);

export const toastConfig: ToastConfig = {
  success: (props) => (
    <CustomToast
      {...props}
      useModal={false}
      position={props.position}
      topOffset={props.topOffset}
      bottomOffset={props.bottomOffset}
      bgColor={colors.green[200]}
      borderColor={colors.green[500]}
      iconBgColor={colors.green[700]}
      icon="✓"
    />
  ),
  error: (props) => (
    <CustomToast
      {...props}
      useModal={props.useModal}
      position={props.position}
      topOffset={props.topOffset}
      bottomOffset={props.bottomOffset}
      bgColor={colors.red[200]}
      borderColor={colors.red[500]}
      iconBgColor={colors.red[700]}
      icon="✕"
    />
  ),
  info: (props) => (
    <CustomToast
      {...props}
      useModal={props.useModal}
      position={props.position}
      topOffset={props.topOffset}
      bottomOffset={props.bottomOffset}
      bgColor={colors.primary[200]}
      borderColor={colors.primary[500]}
      iconBgColor={colors.primary[700]}
      icon="i"
    />
  ),
  warning: (props) => (
    <CustomToast
      {...props}
      useModal={props.useModal}
      position={props.position}
      topOffset={props.topOffset}
      bottomOffset={props.bottomOffset}
      bgColor={colors.yellow[200]}
      borderColor={colors.yellow[500]}
      iconBgColor={colors.yellow[700]}
      icon="!"
    />
  ),
  // Add more types as needed
};

const style = StyleSheet.create({
  container: {
    zIndex: 999,
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  iconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconImage: {
    width: 14,
    height: 14,
    tintColor: 'white',
  },
  textContainer: {
    flexShrink: 1,
  },
  message: {
    ...myFontStyle.small,
    fontWeight: '600',
  },
  subMessage: {
    ...myFontStyle.small,
    fontWeight: '400',
    marginTop: 2,
  },
});
