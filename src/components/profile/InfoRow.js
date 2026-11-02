import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

/**
 * Props bắt buộc:
 * - label: nhãn thông tin.
 * - value: giá trị thông tin.
 * Props tùy chọn:
 * - icon: tên icon hiển thị bên trái (tùy chọn).
 */
function InfoRow({ label, value, icon }) {
  return (
    <View style={styles.row}>
      <View style={styles.labelGroup}>
        {icon ? (
          <View style={styles.iconBox}>
            <Icon name={icon} color={colors.primary} size={15} />
          </View>
        ) : null}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value || '--'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  iconBox: {
    width: spacing.xxl + spacing.xs,
    height: spacing.xxl + spacing.xs,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  value: {
    flex: 1.3,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'right',
  },
});

export default React.memo(InfoRow);
