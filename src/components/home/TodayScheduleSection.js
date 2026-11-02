import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getDayName, getTodayDayOfWeek } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

/**
 * Props bắt buộc:
 * - sessions: danh sách các ca học.
 * - onPressSession: callback(sessionId) khi bấm vào ca học.
 * - onOpenSchedule: callback chuyển sang tab Thời khóa biểu.
 */
function TodayScheduleSection({
  sessions = [],
  onPressSession,
  onOpenSchedule,
}) {
  const todayDay = getTodayDayOfWeek();
  const todaySessions = sessions
    .filter((item) => Number(item.dayOfWeek) === todayDay)
    .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));

  const displaySessions =
    todaySessions.length > 0
      ? todaySessions
      : [...sessions]
          .sort((a, b) => Number(a.dayOfWeek) - Number(b.dayOfWeek))
          .slice(0, 2);

  const isToday = todaySessions.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Icon name="calendar" color={colors.primary} size={18} />
          <Text style={styles.title}>
            {isToday
              ? `Lịch học hôm nay (${getDayName(todayDay)})`
              : 'Lịch học sắp tới trong tuần'}
          </Text>
        </View>
        {onOpenSchedule ? (
          <Pressable
            onPress={onOpenSchedule}
            accessibilityRole="button"
            accessibilityLabel="Xem toàn bộ lịch học tuần"
            style={({ pressed }) => [
              styles.linkButton,
              pressed ? styles.pressed : null,
            ]}>
            <Text style={styles.linkText}>Xem lịch tuần →</Text>
          </Pressable>
        ) : null}
      </View>

      {displaySessions.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Chưa có lịch học được phân công trong tuần này.
          </Text>
        </View>
      ) : (
        displaySessions.map((session) => {
          const courseName =
            (session.course && session.course.name) ||
            session.subjectName ||
            'Học phần chuyên ngành';
          const courseCode =
            (session.course && session.course.code) ||
            session.subjectCode ||
            'PTIT';
          const lecturer =
            (session.course && session.course.lecturer) ||
            session.lecturer ||
            'Giảng viên PTIT';

          return (
            <Pressable
              key={String(session.id)}
              onPress={() => onPressSession && onPressSession(session.id)}
              accessibilityRole="button"
              accessibilityLabel={`Ca học ${courseName} lúc ${session.startTime} tại phòng ${session.room}`}
              style={({ pressed }) => [
                styles.sessionCard,
                pressed ? styles.pressed : null,
              ]}>
              <View style={styles.timeBox}>
                <Text style={styles.dayBadgeText}>
                  {getDayName(session.dayOfWeek)}
                </Text>
                <Text style={styles.startTime}>{session.startTime}</Text>
                <Text style={styles.endTime}>đến {session.endTime}</Text>
              </View>

              <View style={styles.sessionBody}>
                <View style={styles.codeRow}>
                  <View style={styles.codePill}>
                    <Text style={styles.codeText}>{courseCode}</Text>
                  </View>
                  <View style={styles.shiftPill}>
                    <Text style={styles.shiftText}>Chính khóa</Text>
                  </View>
                </View>

                <Text style={styles.courseName} numberOfLines={1}>
                  {courseName}
                </Text>

                <View style={styles.metaRow}>
                  <Icon name="map-pin" color={colors.primary} size={14} />
                  <Text style={styles.roomText}>{session.room}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.lecturerText} numberOfLines={1}>
                    {lecturer}
                  </Text>
                </View>

                {session.note ? (
                  <Text style={styles.noteText} numberOfLines={1}>
                    Ghi chú: {session.note}
                  </Text>
                ) : null}
              </View>

              <Icon name="chevron-right" color={colors.textMuted} size={18} />
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  linkButton: {
    minHeight: spacing.touch,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  linkText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  timeBox: {
    minWidth: 82,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  startTime: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginVertical: 2,
  },
  endTime: {
    fontSize: typography.sizes.xxs,
    color: colors.primaryDark,
  },
  sessionBody: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  codePill: {
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
  },
  codeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
    color: colors.textSecondary,
  },
  shiftPill: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
  },
  shiftText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.info,
  },
  courseName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  roomText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  dot: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  lecturerText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  noteText: {
    fontSize: typography.sizes.xxs,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default TodayScheduleSection;
