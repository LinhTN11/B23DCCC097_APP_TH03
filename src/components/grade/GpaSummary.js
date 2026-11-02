import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

function getAcademicClassification(gpa4) {
  if (gpa4 >= 3.6) {
    return 'Xuất sắc';
  }
  if (gpa4 >= 3.2) {
    return 'Giỏi';
  }
  if (gpa4 >= 2.5) {
    return 'Khá';
  }
  if (gpa4 >= 2.0) {
    return 'Trung bình';
  }
  return 'Yếu';
}

/**
 * Props bắt buộc / tùy chọn:
 * - gpa: điểm GPA hệ 4 (mặc định 0).
 * - totalCredits: tổng tín chỉ tích lũy (mặc định 0).
 * - gpa10: điểm trung bình hệ 10 (tùy chọn).
 * - totalCourses: tổng số môn học (tùy chọn).
 * - classification: xếp loại học lực (tùy chọn, tự suy ra từ gpa nếu không truyền).
 * - requiredCredits: tổng tín chỉ toàn khóa để tính thanh tiến độ (mặc định 135).
 */
function GpaSummary({
  gpa = 0,
  totalCredits = 0,
  gpa10,
  totalCourses,
  classification,
  requiredCredits = 135,
}) {
  const safeGpa = Number.isFinite(Number(gpa)) ? Number(gpa) : 0;
  const safeCredits = Number.isFinite(Number(totalCredits))
    ? Number(totalCredits)
    : 0;
  const safeGpa10 =
    gpa10 !== undefined && gpa10 !== null && Number.isFinite(Number(gpa10))
      ? Number(gpa10)
      : null;
  const rankLabel = classification || getAcademicClassification(safeGpa);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((safeCredits / (requiredCredits || 135)) * 100)),
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <Icon name="graduation" color={colors.white} size={20} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.schoolSub} numberOfLines={1}>
              HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
            </Text>
            <Text style={styles.headerTitle}>Tổng kết kết quả học tập</Text>
          </View>
        </View>
        <View style={styles.verifiedBadge}>
          <Icon name="check-circle" color={colors.white} size={13} />
          <Text style={styles.verifiedText}>Chính thức</Text>
        </View>
      </View>

      <View style={styles.primaryRow}>
        <View style={styles.primaryGpaCol}>
          <Text style={styles.primaryLabel}>GPA TÍCH LŨY (HỆ 4.0)</Text>
          <View style={styles.valueBaseline}>
            <Text style={styles.primaryValue}>{safeGpa.toFixed(2)}</Text>
            <Text style={styles.primaryUnit}>/ 4.00</Text>
          </View>
        </View>

        <View style={styles.rankBadge}>
          <Text style={styles.rankSub}>Xếp loại học lực</Text>
          <Text style={styles.rankValue}>{rankLabel}</Text>
        </View>
      </View>

      <View style={styles.progressBox}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            Tín chỉ tích lũy: {safeCredits}/{requiredCredits} TC
          </Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>GPA Hệ 4</Text>
          <Text style={styles.statValue}>{safeGpa.toFixed(2)}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Tín chỉ đạt</Text>
          <Text style={styles.statValue}>{safeCredits} TC</Text>
        </View>

        {safeGpa10 !== null ? (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>GPA Hệ 10</Text>
              <Text style={styles.statValue}>{safeGpa10.toFixed(2)}</Text>
            </View>
          </>
        ) : null}

        {totalCourses !== undefined && totalCourses !== null ? (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Số học phần</Text>
              <Text style={styles.statValue}>{totalCourses} môn</Text>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  iconWrap: {
    width: spacing.xxxl + spacing.xs,
    height: spacing.xxxl + spacing.xs,
    borderRadius: spacing.radiusSm,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTextCol: {
    flex: 1,
  },
  schoolSub: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.accentLight,
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginTop: spacing.xxs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    gap: spacing.xs,
  },
  verifiedText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  primaryGpaCol: {
    flex: 1,
  },
  primaryLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  valueBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xxs,
  },
  primaryValue: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  primaryUnit: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: spacing.xs,
  },
  rankBadge: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankSub: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  rankValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
  progressBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  progressPercent: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.accentLight,
  },
  progressTrack: {
    height: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: spacing.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statLabel: {
    fontSize: typography.sizes.xxs,
    color: 'rgba(255, 255, 255, 0.82)',
    marginBottom: spacing.xxs,
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
});

export default React.memo(GpaSummary);
