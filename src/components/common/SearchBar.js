import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from './Icon';

/**
 * Props bắt buộc:
 * - value: từ khóa hiện tại.
 * - onChangeText: callback đổi từ khóa.
 * Props tùy chọn:
 * - placeholder: gợi ý tìm kiếm.
 */
function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
}) {
  return (
    <View style={styles.container}>
      <Icon name="search" color={colors.textMuted} size={20} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
        autoCapitalize="none"
      />
      {value ? (
        <Pressable
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Xóa nội dung tìm kiếm"
          hitSlop={spacing.sm}>
          <Icon name="close" color={colors.textSecondary} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.touch,
    backgroundColor: colors.card,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    width: spacing.touch,
    height: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchBar;
