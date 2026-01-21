import { colors } from '@/constant/colors';
import React from 'react';
import { View, StyleSheet } from 'react-native';

type LineProps = {
  color?: string;
  thickness?: number;
  length?: number | string;
  style?: object;
};

export const HorizontalLine: React.FC<LineProps> = ({
  color = colors['dark-grey'][300],
  thickness = 1,
  length = '100%',
  style = {},
}) => (
  <View
    style={[
      {
        height: thickness,
        width: length,
        backgroundColor: color,
      },
      style,
    ]}
  />
);

export const VerticalLine: React.FC<LineProps> = ({
  color = colors['dark-grey'][300],
  thickness = 1,
  length = '100%',
  style = {},
}) => (
  <View
    style={[
      {
        width: thickness,
        height: length,
        backgroundColor: color,
      },
      style,
    ]}
  />
);
