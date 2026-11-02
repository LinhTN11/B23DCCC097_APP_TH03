import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Props bắt buộc:
 * - pending: true thì hiện nhãn "Chưa đồng bộ".
 */
function SyncBadge({ pending }) {
  if (!pending) {
    return null;
  }

  return (
    <View style={styles.container} accessibilityLabel="Chưa đồng bộ">
      <View style={styles.dot} />
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.warningLight,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    gap: spacing.xs,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.xs,
    backgroundColor: colors.warning,
  },
  text: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.warning,
  },
});

export default SyncBadge;
