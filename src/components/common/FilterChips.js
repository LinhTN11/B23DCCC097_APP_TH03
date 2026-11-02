import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function normalizeOption(option) {
  if (typeof option === 'object' && option !== null) {
    return { label: option.label, value: option.value };
  }
  return { label: String(option), value: option };
}

/**
 * Props bắt buộc:
 * - options: mảng chuỗi hoặc {label, value}.
 * - selected: giá trị đang chọn.
 * - onSelect: callback nhận value.
 */
function FilterChips({ options, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {options.map((option) => {
        const item = normalizeOption(option);
        const active = item.value === selected;
        return (
          <Pressable
            key={String(item.value)}
            onPress={() => onSelect(item.value)}
            accessibilityRole="button"
            accessibilityLabel={`Lọc ${item.label}`}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.chip,
              active ? styles.chipActive : null,
              pressed ? styles.chipPressed : null,
            ]}>
            <Text style={[styles.label, active ? styles.labelActive : null]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    minHeight: spacing.touch,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusXl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.white,
  },
});

export default FilterChips;
