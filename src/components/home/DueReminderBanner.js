import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { daysLeft, formatDateTime, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

/**
 * Props bắt buộc:
 * - reminders: danh sách bài tập sắp đến hạn trong 24h hoặc đã quá hạn chưa làm.
 * - onPressAssignment: callback(assignmentId) mở chi tiết bài tập.
 * - onCompleteAssignment: callback(assignment) đánh dấu hoàn thành ngay.
 */
function DueReminderBanner({
  reminders = [],
  onPressAssignment,
  onCompleteAssignment,
}) {
  if (!reminders || reminders.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Icon name="alert" color={colors.danger} size={18} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>
            Nhắc hạn bài tập khẩn cấp ({reminders.length})
          </Text>
          <Text style={styles.subtitle}>
            Bài tập đến hạn trong vòng 24 giờ tới hoặc đã quá hạn cần xử lý ngay
          </Text>
        </View>
      </View>

      {reminders.map((item) => {
        const overdue = isOverdue(item.dueDate);
        const remaining = daysLeft(item.dueDate);
        const courseName =
          (item.course && item.course.name) ||
          (item.course && item.course.code) ||
          'Môn học';

        return (
          <View key={String(item.id)} style={styles.itemCard}>
            <Pressable
              onPress={() => onPressAssignment && onPressAssignment(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Xem bài tập khẩn cấp ${item.title}`}
              style={({ pressed }) => [
                styles.itemMain,
                pressed ? styles.pressed : null,
              ]}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.statusTag,
                    overdue ? styles.tagOverdue : styles.tagDue24h,
                  ]}>
                  <Text
                    style={[
                      styles.statusTagText,
                      overdue ? styles.tagOverdueText : styles.tagDue24hText,
                    ]}>
                    {overdue
                      ? 'Đã quá hạn'
                      : remaining <= 0
                      ? 'Hạn hôm nay'
                      : 'Còn ≤ 24 giờ'}
                  </Text>
                </View>
                <Text style={styles.courseText} numberOfLines={1}>
                  {courseName}
                </Text>
              </View>

              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.dueText}>
                Hạn chót: {formatDateTime(item.dueDate)}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onCompleteAssignment && onCompleteAssignment(item)}
              accessibilityRole="button"
              accessibilityLabel={`Đánh dấu hoàn thành bài tập ${item.title}`}
              style={({ pressed }) => [
                styles.completeButton,
                pressed ? styles.pressed : null,
              ]}>
              <Icon name="check-circle" color={colors.success} size={18} />
              <Text style={styles.completeButtonText}>Xong</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dangerLight,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
  },
  subtitle: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  itemMain: {
    flex: 1,
    minHeight: spacing.touch,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  statusTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
  },
  tagOverdue: {
    backgroundColor: colors.dangerLight,
  },
  tagDue24h: {
    backgroundColor: colors.warningLight,
  },
  statusTagText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
  },
  tagOverdueText: {
    color: colors.danger,
  },
  tagDue24hText: {
    color: colors.warning,
  },
  courseText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  itemTitle: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  dueText: {
    color: colors.danger,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  completeButton: {
    minWidth: 64,
    minHeight: spacing.touch,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  completeButtonText: {
    color: colors.success,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default DueReminderBanner;
