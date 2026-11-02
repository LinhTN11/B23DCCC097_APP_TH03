import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import gradeService from '../../api/gradeService';
import useCachedQuery from '../../hooks/useCachedQuery';
import { toLetter, toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import InfoRow from '../../components/profile/InfoRow';
import Icon from '../../components/common/Icon';

function ComponentBar({ label, weightText, score }) {
  const safeScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  const percent = Math.min(100, Math.max(0, Math.round((safeScore / 10) * 100)));

  return (
    <View style={styles.compItem}>
      <View style={styles.compHeader}>
        <View style={styles.compLabelGroup}>
          <Text style={styles.compLabel}>{label}</Text>
          <View style={styles.weightBadge}>
            <Text style={styles.weightText}>{weightText}</Text>
          </View>
        </View>
        <Text style={styles.compScore}>{safeScore.toFixed(1)} / 10</Text>
      </View>
      <View style={styles.compTrack}>
        <View style={[styles.compFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

export default function GradeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { data, loading, error, refresh } = useCachedQuery(
    `grade:${id}`,
    () => gradeService.getById(id),
  );

  useEffect(() => {
    if (data && data.course && data.course.name) {
      navigation.setOptions({ title: data.course.name });
    }
  }, [data, navigation]);

  if (loading && !data) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !data) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={refresh} />
      </ScreenContainer>
    );
  }

  if (!data) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Không tìm thấy điểm"
          description="Điểm môn học không tồn tại hoặc đã bị xóa."
        />
      </ScreenContainer>
    );
  }

  const course = data.course || {};
  const totalScore = Number(data.total) || 0;
  const letter = data.letter || toLetter(totalScore);
  const scale4 = toScale4(totalScore);
  const passed = totalScore >= 4;

  return (
    <ScreenContainer scroll>
      {/* Card Điểm tổng kết lớn */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.codePill}>
            <Text style={styles.codeText}>{course.code || 'HP'}</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              passed ? styles.statusPassed : styles.statusFailed,
            ]}>
            <Icon
              name={passed ? 'check-circle' : 'alert'}
              color={colors.white}
              size={14}
            />
            <Text style={styles.statusPillText}>
              {passed ? 'Đạt học phần' : 'Học lại'}
            </Text>
          </View>
        </View>

        <Text style={styles.courseTitle}>{course.name || 'Môn học'}</Text>
        <Text style={styles.semesterSub}>
          Học kỳ: {data.semester || '--'} • {course.credits || 0} tín chỉ
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ĐIỂM HỆ 10</Text>
            <Text style={styles.metricMainValue}>{totalScore.toFixed(2)}</Text>
            <Text style={styles.metricUnit}>/ 10.0</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ĐIỂM HỆ 4</Text>
            <Text style={styles.metricMainValue}>{scale4.toFixed(1)}</Text>
            <Text style={styles.metricUnit}>/ 4.0</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>ĐIỂM CHỮ</Text>
            <Text style={styles.metricMainValue}>{letter}</Text>
            <Text style={styles.metricUnit}>
              {passed ? ' Tích lũy' : ' Không đạt'}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Điểm thành phần với thanh trực quan và trọng số */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="clipboard" color={colors.primary} size={18} />
          <Text style={styles.cardTitle}>Chi tiết điểm thành phần</Text>
        </View>

        <ComponentBar
          label="Điểm chuyên cần (CC)"
          weightText="Trọng số 10%"
          score={data.attendance}
        />
        <ComponentBar
          label="Điểm kiểm tra giữa kỳ (GK)"
          weightText="Trọng số 30%"
          score={data.midterm}
        />
        <ComponentBar
          label="Điểm thi cuối kỳ (CK)"
          weightText="Trọng số 60%"
          score={data.final}
        />

        <View style={styles.formulaBox}>
          <Text style={styles.formulaTitle}>Công thức tính điểm học phần:</Text>
          <Text style={styles.formulaValue}>
            Tổng kết = 10% × CC + 30% × GK + 60% × CK
          </Text>
          <Text style={styles.formulaCalc}>
            = 0.1 × {Number(data.attendance || 0).toFixed(1)} + 0.3 ×{' '}
            {Number(data.midterm || 0).toFixed(1)} + 0.6 ×{' '}
            {Number(data.final || 0).toFixed(1)} = {totalScore.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Card Thông tin học phần */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="book" color={colors.primary} size={18} />
          <Text style={styles.cardTitle}>Thông tin học phần</Text>
        </View>
        <InfoRow label="Mã học phần" value={course.code || '--'} />
        <InfoRow label="Tên môn học" value={course.name || '--'} />
        <InfoRow
          label="Số tín chỉ"
          value={`${course.credits || 0} tín chỉ`}
        />
        <InfoRow label="Học kỳ" value={data.semester || '--'} />
        <InfoRow
          label="Giảng viên phụ trách"
          value={course.lecturer || 'Đang cập nhật'}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  codePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  codeText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    gap: spacing.xs,
  },
  statusPassed: {
    backgroundColor: colors.success,
  },
  statusFailed: {
    backgroundColor: colors.danger,
  },
  statusPillText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  courseTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  semesterSub: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: spacing.xxxl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  metricLabel: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xxs,
  },
  metricMainValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  metricUnit: {
    fontSize: typography.sizes.xxs,
    color: colors.accentLight,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xxs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  compItem: {
    marginBottom: spacing.md,
  },
  compHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  compLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  compLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  weightBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  weightText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  compScore: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  compTrack: {
    height: spacing.sm,
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  compFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: spacing.xs,
  },
  formulaBox: {
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginTop: spacing.xs,
    gap: spacing.xxs,
  },
  formulaTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  formulaValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  formulaCalc: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
});
