import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Props tùy chọn:
 * - message: nội dung hiển thị (mặc định "Đang tải...").
 */
function LoadingView({ message = 'Đang tải...' }) {
  return (
    <View style={styles.container} accessibilityLabel={message}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
});

export default LoadingView;
