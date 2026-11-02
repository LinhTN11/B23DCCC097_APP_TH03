import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getDayName } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

function resolveSessionType(session) {
  if (session.type) {
    return session.type;
  }
  const noteText = String(session.lessonTopic || session.note || '').toLowerCase();
  if (noteText.includes('thực hành') || noteText.includes('lab')) {
    return 'Thực hành';
  }
  return 'Lý thuyết';
}

/**
 * Props bắt buộc:
 * - session: {course, startTime, endTime, room, dayOfWeek, note, lessonTopic?, type?}.
 * Props tùy chọn:
 * - onPress: callback mở chi tiết buổi học.
 */
function SessionCard({ session, onPress }) {
  const courseName =
    (session.course && session.course.name) || session.subjectName || 'Môn học';
  const courseCode =
    (session.course && session.course.code) || session.subjectCode || '';
  const lecturer =
    (session.course && session.course.lecturer) || session.lecturer || '';
  const sessionType = resolveSessionType(session);
  const isPractice = sessionType === 'Thực hành';
  const topicText = session.lessonTopic || session.note || '';

  const content = (
    <>
      <View style={styles.timeColumn}>
        <Text style={styles.dayLabel}>{getDayName(session.dayOfWeek)}</Text>
        <Text style={styles.startTime}>{session.startTime}</Text>
        <View style={styles.timeDivider} />
        <Text style={styles.endTime}>{session.endTime}</Text>
        <View
          style={[
            styles.typeBadge,
            isPractice ? styles.typeBadgePractice : styles.typeBadgeTheory,
          ]}>
          <Text
            style={[
              styles.typeBadgeText,
              isPractice ? styles.typeTextPractice : styles.typeTextTheory,
            ]}>
            {sessionType}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          {courseCode ? (
            <View style={styles.codeBadge}>
              <Text style={styles.courseCode}>{courseCode}</Text>
            </View>
          ) : (
            <View />
          )}
          {onPress ? (
            <Icon name="chevron-right" color={colors.textMuted} size={18} />
          ) : null}
        </View>

        <Text style={styles.courseName} numberOfLines={2}>
          {courseName}
        </Text>

        <View style={styles.metaRow}>
          <Icon name="map-pin" color={colors.primary} size={15} />
          <Text style={styles.room}>{session.room || 'Chưa xếp phòng'}</Text>
        </View>

        {lecturer ? (
          <View style={styles.metaRow}>
            <Icon name="person" color={colors.textSecondary} size={15} />
            <Text style={styles.lecturer} numberOfLines={1}>
              {lecturer}
            </Text>
          </View>
        ) : null}

        {topicText ? (
          <View style={styles.topicBox}>
            <Text style={styles.topicText} numberOfLines={2}>
              {topicText}
            </Text>
          </View>
        ) : null}
      </View>
    </>
  );

  if (!onPress) {
    return <View style={styles.card}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Buổi học ${courseName} tại ${session.room} lúc ${session.startTime}`}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
    minHeight: spacing.touch,
  },
  pressed: {
    opacity: 0.86,
  },
  timeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: spacing.huge * 2 + spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dayLabel: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
    marginBottom: spacing.xxs,
  },
  startTime: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  timeDivider: {
    width: spacing.lg,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
    marginVertical: spacing.xxs,
  },
  endTime: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: spacing.xs + spacing.xxs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  typeBadgePractice: {
    backgroundColor: colors.infoLight,
  },
  typeBadgeTheory: {
    backgroundColor: colors.card,
  },
  typeBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
  },
  typeTextPractice: {
    color: colors.info,
  },
  typeTextTheory: {
    color: colors.primaryDark,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  courseCode: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  courseName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xxs,
  },
  room: {
    fontSize: typography.sizes.sm,
    color: colors.primaryDark,
    fontWeight: typography.weights.bold,
  },
  lecturer: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  topicBox: {
    marginTop: spacing.xs,
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  topicText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});

export default React.memo(SessionCard);
