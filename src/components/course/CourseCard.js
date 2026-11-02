import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

function resolveCourseProgress(course) {
  const totalLessons =
    Number(course.totalLessons) > 0
      ? Number(course.totalLessons)
      : (Number(course.credits) || 3) * 5;

  if (typeof course.progress === 'number' && !Number.isNaN(course.progress)) {
    const rawProgress =
      course.progress > 0 && course.progress <= 1
        ? course.progress * 100
        : course.progress;
    const clamped = Math.max(0, Math.min(100, Math.round(rawProgress)));
    const completedLessons =
      Number(course.completedLessons) >= 0
        ? Number(course.completedLessons)
        : Math.round((clamped / 100) * totalLessons);
    return { progress: clamped, completedLessons, totalLessons };
  }

  if (
    typeof course.completedLessons === 'number' &&
    !Number.isNaN(course.completedLessons)
  ) {
    const completed = Math.max(
      0,
      Math.min(totalLessons, course.completedLessons),
    );
    const progress = Math.round((completed / totalLessons) * 100);
    return { progress, completedLessons: completed, totalLessons };
  }

  const numericId = Number(course.id) || 1;
  const defaultProgress = 55 + ((numericId * 11) % 35);
  const completedLessons = Math.round((defaultProgress / 100) * totalLessons);
  const progress = Math.round((completedLessons / totalLessons) * 100);
  return { progress, completedLessons, totalLessons };
}

/**
 * Props bắt buộc:
 * - course: {id, code, name, credits, lecturer, semester, room?, scheduleSummary?, progress?, completedLessons?, totalLessons?}.
 * - onPress: callback khi chọn môn.
 * Props tùy chọn:
 * - style: style bổ sung cho thẻ.
 */
function CourseCard({ course, onPress, style }) {
  const { progress, completedLessons, totalLessons } =
    resolveCourseProgress(course);
  const roomInfo = course.room || course.scheduleSummary || null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Môn ${course.name}, mã ${course.code}, ${course.credits} tín chỉ`}
      style={({ pressed }) => [
        styles.card,
        style,
        pressed ? styles.pressed : null,
      ]}>
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{course.code}</Text>
            </View>
            {course.semester ? (
              <View style={styles.semesterBadge}>
                <Text style={styles.semesterBadgeText}>{course.semester}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.rightHeader}>
            <View style={styles.creditsBadge}>
              <Text style={styles.creditsText}>{course.credits} tín chỉ</Text>
            </View>
            <Icon name="chevron-right" color={colors.textMuted} size={18} />
          </View>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {course.name}
        </Text>

        <View style={styles.metaList}>
          <View style={styles.metaRow}>
            <Icon name="person" color={colors.primary} size={15} />
            <Text style={styles.metaText} numberOfLines={1}>
              {course.lecturer || 'Đang cập nhật giảng viên'}
            </Text>
          </View>
          {roomInfo ? (
            <View style={styles.metaRow}>
              <Icon name="map-pin" color={colors.textSecondary} size={15} />
              <Text style={styles.metaText} numberOfLines={1}>
                {roomInfo}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Đã học {completedLessons}/{totalLessons} buổi
            </Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
                progress >= 80 ? styles.progressFillSuccess : null,
              ]}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    minHeight: spacing.touch,
  },
  pressed: {
    opacity: 0.88,
  },
  body: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  codeText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  semesterBadge: {
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  semesterBadgeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  creditsBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  creditsText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  name: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.md,
    marginBottom: spacing.sm,
  },
  metaList: {
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  progressSection: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  progressPercent: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  progressTrack: {
    height: spacing.xs + spacing.xxs,
    backgroundColor: colors.chip,
    borderRadius: spacing.radiusSm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusSm,
  },
  progressFillSuccess: {
    backgroundColor: colors.success,
  },
});

export default React.memo(CourseCard);
