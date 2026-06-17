declare module 'react-native-safe-area-context' {
  import { ViewStyle, StyleProp, ViewProps } from 'react-native';
  import React from 'react';

  export interface EdgeInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  export function useSafeAreaInsets(): EdgeInsets;

  export interface SafeAreaViewProps extends ViewProps {
    style?: StyleProp<ViewStyle>;
    edges?: readonly ('top' | 'right' | 'bottom' | 'left')[];
  }

  export const SafeAreaView: React.ComponentType<SafeAreaViewProps>;
  export const SafeAreaProvider: React.ComponentType<ViewProps>;
}
