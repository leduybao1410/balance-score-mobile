import { LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';
type CustomViewProps = {
  children: React.ReactNode;
  onLayout?: (event: LayoutChangeEvent) => void;
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  gap?: number;
  styles?: StyleProp<ViewStyle>;
};

const GAP_DEFAULT = 4;

export function HorizontalView({
  onLayout,
  children,
  gap = GAP_DEFAULT,
  alignItems = 'center',
  justifyContent = 'space-between',
  styles = '',
}: CustomViewProps): React.ReactNode {
  return (
    <View
      className={'flex flex-row'}
      style={[styles ?? {}, { gap, justifyContent, alignItems }]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}

export function VerticalView({
  onLayout,
  children,
  gap = GAP_DEFAULT,
  alignItems = 'center',
  justifyContent = 'space-between',
  styles = '',
}: CustomViewProps): React.ReactNode {
  return (
    <View
      className={'flex flex-col'}
      style={[styles, { gap, justifyContent, alignItems }]}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}
