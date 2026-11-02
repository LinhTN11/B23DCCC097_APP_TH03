import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../common/Icon';

/**
 * Props bắt buộc:
 * - status: "todo" hoặc "done".
 * - onToggle: callback đổi trạng thái.
 */
function StatusToggle({ status, onToggle }) {
  const done = status === 'done';

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
      accessibilityState={{ checked: done }}
      hitSlop={spacing.xs}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
      <Icon
        name={done ? 'check-circle' : 'circle'}
        color={done ? colors.success : colors.textMuted}
        size={26}
        filled={done}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: spacing.touch,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default React.memo(StatusToggle);
