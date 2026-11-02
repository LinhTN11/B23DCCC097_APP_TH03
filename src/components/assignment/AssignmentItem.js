import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  daysLeft,
  formatDate,
  formatDateTime,
  isOverdue,
} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';
import SyncBadge from '../common/SyncBadge';
import StatusToggle from './StatusToggle';

function getCountdownInfo(dueDate, done) {
  if (done) {
    return {
      label: 'Đã hoàn thành',
      urgent: false,
      overdue: false,
      within24h: false,
    };
  }
  const overdue = isOverdue(dueDate);
  const remainingDays = daysLeft(dueDate);
  if (overdue) {
    return {
      label: 'Quá hạn',
      urgent: true,
      overdue: true,
      within24h: false,
    };
  }
  if (remainingDays <= 1) {
    return {
      label: remainingDays <= 0 ? 'Hôm nay' : 'Còn 1 ngày',
      urgent: true,
      overdue: false,
      within24h: true,
    };
  }
  return {
    label: `Còn ${remainingDays} ngày`,
    urgent: remainingDays <= 2,
    overdue: false,
    within24h: false,
  };
}

/**
 * Props bắt buộc:
 * - assignment: {title, status, dueDate, course}.
 * - onToggleStatus: callback đổi trạng thái.
 * Props tùy chọn:
 * - pending: hiện nhãn "Chưa đồng bộ".
 * - onPress: callback mở chi tiết.
 */
function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}) {
  const done = assignment.status === 'done';
  const courseName =
    (assignment.course && assignment.course.name) || 'Môn học';
  const courseCode =
    (assignment.course && assignment.course.code) || '';
  const countdown = getCountdownInfo(assignment.dueDate, done);

  const body = (
    <View style={styles.mainRow}>
      <View style={styles.content}>
        <View style={styles.topBadges}>
          {courseCode ? (
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{courseCode}</Text>
            </View>
          ) : null}

          <View
            style={[
              styles.countdownBadge,
              done
                ? styles.countdownDone
                : countdown.overdue
                ? styles.countdownOverdue
                : countdown.within24h
                ? styles.countdownWarning
                : styles.countdownNormal,
            ]}>
            <Text
              style={[
                styles.countdownText,
                done
                  ? styles.countdownTextDone
                  : countdown.overdue
                  ? styles.countdownTextOverdue
                  : countdown.within24h
                  ? styles.countdownTextWarning
                  : styles.countdownTextNormal,
              ]}>
              {countdown.label}
            </Text>
          </View>

          {!done && countdown.urgent ? (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentBadgeText}>Gấp</Text>
            </View>
          ) : null}

          {pending ? <SyncBadge pending={pending} /> : null}
        </View>

        <Text
          style={[styles.title, done ? styles.titleDone : null]}
          numberOfLines={2}>
          {assignment.title}
        </Text>

        <Text style={styles.course} numberOfLines={1}>
          {courseName}
        </Text>

        <View style={styles.dueRow}>
          <Icon
            name={countdown.overdue ? 'alert' : 'clock'}
            color={
              done
                ? colors.textMuted
                : countdown.overdue
                ? colors.danger
                : countdown.within24h
                ? colors.warning
                : colors.textSecondary
            }
            size={14}
          />
          <Text
            style={[
              styles.due,
              !done && countdown.overdue ? styles.dueOverdue : null,
              !done && countdown.within24h ? styles.dueWarning : null,
            ]}>
            Hạn nộp: {formatDate(assignment.dueDate)} (
            {formatDateTime(assignment.dueDate)})
          </Text>
        </View>
      </View>

      {onPress ? (
        <Icon name="chevron-right" color={colors.textMuted} size={20} />
      ) : null}
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        done ? styles.cardDone : null,
        !done && countdown.overdue ? styles.cardOverdue : null,
        !done && countdown.within24h ? styles.cardWarning : null,
      ]}>
      <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Bài tập ${assignment.title}, ${countdown.label}`}
          style={({ pressed }) => [
            styles.pressArea,
            pressed ? styles.pressed : null,
          ]}>
          {body}
        </Pressable>
      ) : (
        <View style={styles.pressArea}>{body}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    marginBottom: spacing.md,
  },
  cardDone: {
    backgroundColor: colors.cardAlt,
  },
  cardOverdue: {
    backgroundColor: colors.card,
  },
  cardWarning: {},
  pressArea: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  content: {
    flex: 1,
  },
  topBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  codeBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  countdownBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  countdownDone: {
    backgroundColor: colors.successLight,
  },
  countdownOverdue: {
    backgroundColor: colors.dangerLight,
  },
  countdownWarning: {
    backgroundColor: colors.warningLight,
  },
  countdownNormal: {
    backgroundColor: colors.infoLight,
  },
  countdownText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
  },
  countdownTextDone: {
    color: colors.success,
  },
  countdownTextOverdue: {
    color: colors.danger,
  },
  countdownTextWarning: {
    color: colors.warning,
  },
  countdownTextNormal: {
    color: colors.info,
  },
  urgentBadge: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.xs + spacing.xxs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  urgentBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  titleDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  course: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  due: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    flex: 1,
  },
  dueOverdue: {
    color: colors.danger,
    fontWeight: typography.weights.bold,
  },
  dueWarning: {
    color: colors.warning,
    fontWeight: typography.weights.semibold,
  },
});

export default React.memo(AssignmentItem);
