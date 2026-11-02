import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

/**
 * Props bắt buộc:
 * - label: nhãn trường nhập.
 * - value: giá trị hiện tại.
 * - onChangeText: callback đổi giá trị.
 * Props tùy chọn:
 * - error: thông báo lỗi màu đỏ.
 * - keyboardType, placeholder, multiline, autoCapitalize: chuyển tiếp cho TextInput.
 */
function FormInput({
  label,
  value,
  onChangeText,
  error,
  keyboardType,
  placeholder,
  multiline = false,
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline ? styles.multiline : null,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    minHeight: spacing.touch,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  multiline: {
    minHeight: spacing.huge * 2,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
    color: colors.danger,
  },
});

export default FormInput;
