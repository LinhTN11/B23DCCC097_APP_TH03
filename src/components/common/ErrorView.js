import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppButton from './AppButton';
import Icon from './Icon';

/**
 * Props bắt buộc:
 * - message: thông báo lỗi dễ hiểu.
 * - onRetry: callback khi bấm "Thử lại".
 */
function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="alert" color={colors.danger} size={36} />
      </View>
      <Text style={styles.title}>Không tải được dữ liệu</Text>
      <Text style={styles.message}>{message || 'Đã xảy ra lỗi. Vui lòng thử lại.'}</Text>
      <View style={styles.action}>
        <AppButton title="Thử lại" onPress={onRetry} accessibilityLabel="Thử lại tải dữ liệu" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconWrap: {
    width: spacing.huge + spacing.md,
    height: spacing.huge + spacing.md,
    borderRadius: (spacing.huge + spacing.md) / 2,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.xl,
  },
  action: {
    minWidth: spacing.huge * 3,
  },
});

export default ErrorView;
