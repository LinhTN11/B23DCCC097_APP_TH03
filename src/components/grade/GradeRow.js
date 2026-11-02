import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { toLetter, toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

function getLetterBadgeColors(letter) {
  const normalized = String(letter || '').toUpperCase();
  if (normalized.startsWith('A')) {
    return { bg: colors.successLight, text: colors.success };
  }
  if (normalized.startsWith('B')) {
    return { bg: colors.infoLight, text: colors.info };
  }
  if (normalized.startsWith('C')) {
    return { bg: colors.warningLight, text: colors.warning };
  }
  if (normalized.startsWith('D')) {
    return { bg: colors.accentLight, text: colors.accent };
  }
  return { bg: colors.dangerLight, text: colors.danger };
}

/**
 * Props bắt buộc:
 * - grade: {id, total, attendance, midterm, final, letter, course, semester}.
 * - onPress: callback mở chi tiết điểm.
 */
function GradeRow({ grade, onPress }) {
  const course = grade.course || {};
  const totalScore = Number(grade.total) || 0;
  const attendanceScore =
    grade.attendance !== undefined && grade.attendance !== null
      ? Number(grade.attendance).toFixed(1)
      : '--';
  const midtermScore =
    grade.midterm !== undefined && grade.midterm !== null
      ? Number(grade.midterm).toFixed(1)
      : '--';
  const finalScore =
    grade.final !== undefined && grade.final !== null
      ? Number(grade.final).toFixed(1)
      : '--';
  const letter = grade.letter || toLetter(totalScore);
  const scale4 = toScale4(totalScore);
  const passed = totalScore >= 4;
  const credits = course.credits || grade.credits || 0;
  const badgeColors = getLetterBadgeColors(letter);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Điểm môn ${course.name || 'môn học'}, tổng kết ${totalScore.toFixed(2)}, điểm chữ ${letter}`}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}>
      <View style={styles.headerRow}>
        <View style={styles.codeGroup}>
          <View style={styles.codePill}>
            <Text style={styles.codeText}>{course.code || 'HP'}</Text>
          </View>
          <Text style={styles.creditsText}>{credits} tín chỉ</Text>
          {grade.semester ? (
            <View style={styles.semesterPill}>
              <Text style={styles.semesterText}>{grade.semester}</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.letterBadge, { backgroundColor: badgeColors.bg }]}>
          <Text style={[styles.letterText, { color: badgeColors.text }]}>
            Điểm {letter}
          </Text>
          <Text style={[styles.scale4Text, { color: badgeColors.text }]}>
            • {scale4.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.courseName} numberOfLines={2}>
          {course.name || 'Môn học'}
        </Text>
        <Icon name="chevron-right" color={colors.textMuted} size={18} />
      </View>

      <View style={styles.scoreGrid}>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>Chuyên cần</Text>
          <Text style={styles.scoreWeight}>10%</Text>
          <Text style={styles.scoreVal}>{attendanceScore}</Text>
        </View>

        <View style={styles.scoreDivider} />

        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>Giữa kỳ</Text>
          <Text style={styles.scoreWeight}>30%</Text>
          <Text style={styles.scoreVal}>{midtermScore}</Text>
        </View>

        <View style={styles.scoreDivider} />

        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>Cuối kỳ</Text>
          <Text style={styles.scoreWeight}>60%</Text>
          <Text style={styles.scoreVal}>{finalScore}</Text>
        </View>

        <View style={styles.scoreDivider} />

        <View
          style={[
            styles.scoreCol,
            styles.totalCol,
            passed ? styles.totalPassed : styles.totalFailed,
          ]}>
          <Text
            style={[
              styles.totalLabel,
              passed ? styles.totalLabelPassed : styles.totalLabelFailed,
            ]}>
            Tổng kết 10
          </Text>
          <Text
            style={[
              styles.totalVal,
              passed ? styles.totalValPassed : styles.totalValFailed,
            ]}>
            {totalScore.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: spacing.touch,
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.88,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  codeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  codePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  codeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  creditsText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  semesterPill: {
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  semesterText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  letterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    gap: spacing.xxs,
  },
  letterText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  scale4Text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  courseName: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  scoreGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreDivider: {
    width: 1,
    height: spacing.xxl + spacing.xs,
    backgroundColor: colors.border,
  },
  scoreLabel: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  scoreWeight: {
    fontSize: typography.sizes.xxs,
    color: colors.textMuted,
  },
  scoreVal: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.xxs,
  },
  totalCol: {
    borderRadius: spacing.radiusSm,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  totalPassed: {
    backgroundColor: colors.primaryLight,
  },
  totalFailed: {
    backgroundColor: colors.dangerLight,
  },
  totalLabel: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
  },
  totalLabelPassed: {
    color: colors.primary,
  },
  totalLabelFailed: {
    color: colors.danger,
  },
  totalVal: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    marginTop: spacing.xxs,
  },
  totalValPassed: {
    color: colors.primary,
  },
  totalValFailed: {
    color: colors.danger,
  },
});

export default React.memo(GradeRow);
