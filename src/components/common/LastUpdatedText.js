import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { formatDateTime } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Props bắt buộc:
 * - timestamp: thời điểm cache được cập nhật.
 * Timestamp rỗng thì component ẩn.
 */
function LastUpdatedText({ timestamp }) {
  if (!timestamp) {
    return null;
  }

  return (
    <Text style={styles.text}>
      Cập nhật lần cuối: {formatDateTime(timestamp)}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default LastUpdatedText;
