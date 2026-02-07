import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
  ScrollView,
  Keyboard,
} from 'react-native';
import { HorizontalLine } from '@/component/line/line';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '@/constant/colors';
import { myFontStyle, } from '../responsive-text';

type CustomModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  showTitle?: boolean;
  showCloseButton?: boolean;
  modalStyle?: StyleProp<ViewStyle>;
  overlayStyle?: any;
  showDivider?: boolean;
  dividerColor?: string;
  dividerThickness?: number;
  keyboardAvoiding?: boolean;
};

const CustomModal = ({
  open,
  setOpen,
  children,
  title,
  titleStyle = {},
  showTitle = true,
  showCloseButton = true,
  modalStyle = {},
  overlayStyle = {},
  showDivider = true,
  dividerColor = colors['dark-grey'][300],
  dividerThickness = 1,
  keyboardAvoiding = false,
}: CustomModalProps) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [orientation, setOrientation] = useState(isLandscape ? 'landscape' : 'portrait');

  // Update orientation state when dimensions change
  useEffect(() => {
    setOrientation(isLandscape ? 'landscape' : 'portrait');
  }, [isLandscape]);

  // Subscribe to keyboard visible change
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);



  return (
    <Modal
      key={orientation}
      visible={open}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={() => setOpen(false)}
      statusBarTranslucent={true}
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right', 'portrait-upside-down']}>
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={[styles.overlay, overlayStyle]} />
      </TouchableWithoutFeedback>
      <View style={[styles.centeredView, { justifyContent: (keyboardVisible && keyboardAvoiding) ? 'flex-start' : 'center' }]} pointerEvents="box-none">

        <View style={[styles.modalView, modalStyle]}>
          {showTitle && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {showDivider && <HorizontalLine thickness={dividerThickness} color={dividerColor} />}
          {showCloseButton && (
            <TouchableWithoutFeedback onPress={() => setOpen(false)}>
              <View style={styles.closeButton}>
                <Icon name="times" size={24} color={colors.white} />
              </View>
            </TouchableWithoutFeedback>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    padding: '5%',
    alignItems: 'center',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.18)', // lớp kính
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)', // viền trong suốt
  },
  modalView: {
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.18)', // lớp kính
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.35)', // viền trong suốt
    minWidth: '30%',
    maxWidth: '95%',
    overflow: 'hidden', // cần để BlurView/overlay bo tròn
    padding: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    ...myFontStyle.large,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 12,
    right: 12,
    zIndex: 20,
    width: 32,
    height: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    ...myFontStyle.extraLarge,
    fontWeight: '700',
    color: '#888',
    lineHeight: 28,
  },
  content: {
    width: '100%',
    marginTop: 8,
  },
});

export default CustomModal;
