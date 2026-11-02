import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getDayName, getTodayDayOfWeek } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { value: 2, label: 'T2' },
  { value: 3, label: 'T3' },
  { value: 4, label: 'T4' },
  { value: 5, label: 'T5' },
  { value: 6, label: 'T6' },
  { value: 7, label: 'T7' },
  { value: 8, label: 'CN' },
];

/**
 * Props bắt buộc:
 * - selectedDay: giá trị 2..8.
 * - onSelectDay: callback nhận ngày được chọn.
 * Props tùy chọn:
 * - sessionCounts: object { [dayOfWeek]: number } hiển thị số ca học hoặc dấu chấm.
 * Nếu selectedDay chưa có, component mặc định chọn hôm nay.
 */
function DaySelector({ selectedDay, onSelectDay, sessionCounts = {} }) {
  const today = getTodayDayOfWeek();
  const activeDay = selectedDay || today;

  return (
    <View style={styles.container}>
      {DAYS.map((day) => {
        const active = day.value === activeDay;
        const isToday = day.value === today;
        const count = Number(sessionCounts[day.value]) || 0;

        return (
          <Pressable
            key={day.value}
            onPress={() => onSelectDay(day.value)}
            accessibilityRole="button"
            accessibilityLabel={`Chọn ${getDayName(day.value)}${
              count > 0 ? `, có ${count} ca học` : ''
            }`}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.dayButton,
              isToday && !active ? styles.dayButtonToday : null,
              active ? styles.dayButtonActive : null,
              pressed ? styles.pressed : null,
            ]}>
            <Text
              style={[
                styles.dayText,
                isToday && !active ? styles.dayTextToday : null,
                active ? styles.dayTextActive : null,
              ]}>
              {day.label}
            </Text>
            {count > 0 ? (
              <View
                style={[
                  styles.countBadge,
                  active ? styles.countBadgeActive : null,
                ]}>
                <Text
                  style={[
                    styles.countText,
                    active ? styles.countTextActive : null,
                  ]}>
                  {count}
                </Text>
              </View>
            ) : (
              <View style={styles.emptyDotPlaceholder} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  dayButton: {
    flex: 1,
    minHeight: spacing.touch + spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  dayButtonToday: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  dayText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  dayTextToday: {
    color: colors.primary,
  },
  dayTextActive: {
    color: colors.white,
  },
  countBadge: {
    minWidth: spacing.lg,
    height: spacing.lg,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeActive: {
    backgroundColor: colors.white,
  },
  countText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  countTextActive: {
    color: colors.primary,
  },
  emptyDotPlaceholder: {
    height: spacing.xs,
  },
});

export default React.memo(DaySelector);
