import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import AppButton from './AppButton';
import Icon from './Icon';

/**
 * Props bắt buộc:
 * - title: tiêu đề trạng thái rỗng.
 * Props tùy chọn:
 * - description: mô tả thêm.
 * - actionLabel: nhãn nút hành động.
 * - onAction: callback; nút chỉ hiện khi có callback.
 */
function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="clipboard" color={colors.textMuted} size={32} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onAction && actionLabel ? (
        <View style={styles.action}>
          <AppButton
            title={actionLabel}
            onPress={onAction}
            variant="outline"
            accessibilityLabel={actionLabel}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: spacing.huge + spacing.md,
    height: spacing.huge + spacing.md,
    borderRadius: (spacing.huge + spacing.md) / 2,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.lg,
    marginTop: spacing.sm,
  },
  action: {
    marginTop: spacing.lg,
    minWidth: spacing.huge * 3,
  },
});

export default EmptyState;
