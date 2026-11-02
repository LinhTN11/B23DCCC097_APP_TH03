import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { SEMESTER_OPTIONS } from '../../config';
import { calcGpa } from '../../utils/gpa';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import Icon from '../../components/common/Icon';

function calcWeightedGpa10(grades = [], courses = []) {
  const courseMap = new Map(
    courses.map((course) => [String(course.id), course]),
  );
  let weightedSum = 0;
  let totalWeight = 0;
  grades.forEach((grade) => {
    const course = courseMap.get(String(grade.courseId)) || grade.course;
    const credits =
      Number(course && course.credits ? course.credits : grade.credits) || 0;
    const score10 = Number(grade.total);
    if (credits > 0 && Number.isFinite(score10)) {
      weightedSum += score10 * credits;
      totalWeight += credits;
    }
  });
  return totalWeight === 0 ? 0 : Math.round((weightedSum / totalWeight) * 100) / 100;
}

export default function GradeListScreen({ navigation }) {
  const {
    grades,
    courses,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshAll,
  } = useAppData();
  const [semester, setSemester] = useState('Tất cả');

  const enrichedGrades = useMemo(() => {
    const courseMap = new Map(
      courses.map((course) => [String(course.id), course]),
    );
    return grades.map((grade) => ({
      ...grade,
      course: grade.course || courseMap.get(String(grade.courseId)) || {},
    }));
  }, [grades, courses]);

  const filteredGrades = useMemo(() => {
    if (semester === 'Tất cả') {
      return enrichedGrades;
    }
    return enrichedGrades.filter((grade) => grade.semester === semester);
  }, [enrichedGrades, semester]);

  const gpaResult = useMemo(
    () => calcGpa(filteredGrades, courses),
    [filteredGrades, courses],
  );
  const gpa10 = useMemo(
    () => calcWeightedGpa10(filteredGrades, courses),
    [filteredGrades, courses],
  );
  const passedCount = useMemo(
    () => filteredGrades.filter((item) => Number(item.total) >= 4).length,
    [filteredGrades],
  );

  const renderGrade = useCallback(
    ({ item }) => (
      <GradeRow
        grade={item}
        onPress={() =>
          navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
        }
      />
    ),
    [navigation],
  );

  const header = (
    <View style={styles.header}>
      <GpaSummary
        gpa={gpaResult.gpa}
        totalCredits={gpaResult.totalCredits}
        gpa10={gpa10}
        totalCourses={filteredGrades.length}
      />

      <Text style={styles.filterTitle}>Lọc theo học kỳ tra cứu</Text>
      <FilterChips
        options={SEMESTER_OPTIONS}
        selected={semester}
        onSelect={setSemester}
      />

      {/* Thống kê nhanh kỳ học */}
      <View style={styles.semesterCard}>
        <View style={styles.semesterHeader}>
          <Icon name="book" color={colors.primary} size={18} />
          <Text style={styles.semesterTitle}>
            {semester === 'Tất cả' ? 'Toàn bộ các học kỳ' : `Học kỳ ${semester}`}
          </Text>
          <View style={styles.passedBadge}>
            <Icon name="check-circle" color={colors.success} size={13} filled />
            <Text style={styles.passedBadgeText}>
              Đạt {passedCount}/{filteredGrades.length} môn
            </Text>
          </View>
        </View>

        <View style={styles.semesterStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>GPA (Hệ 4)</Text>
            <Text style={styles.statHighlight}>{gpaResult.gpa.toFixed(2)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>GPA (Hệ 10)</Text>
            <Text style={styles.statValue}>{gpa10.toFixed(2)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Tín chỉ đạt</Text>
            <Text style={styles.statValue}>{gpaResult.totalCredits} TC</Text>
          </View>
        </View>
      </View>

      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          Bảng điểm chi tiết ({filteredGrades.length} học phần)
        </Text>
        <LastUpdatedText timestamp={lastUpdated} />
      </View>
    </View>
  );

  const footer = (
    <View style={styles.guideCard}>
      <Text style={styles.guideTitle}>
        Thang điểm quy đổi PTIT (Học viện CNBCVT)
      </Text>
      <Text style={styles.guideText}>
        • A (8.5 - 10 → 4.0) • B+ (8.0 - 8.4 → 3.5) • B (7.0 - 7.9 → 3.0)
      </Text>
      <Text style={styles.guideText}>
        • C+ (6.5 - 6.9 → 2.5) • C (5.5 - 6.4 → 2.0) • D+ (5.0 - 5.4 → 1.5) • D (4.0 - 4.9 → 1.0)
      </Text>
      <Text style={[styles.guideText, styles.guideDanger]}>
        • F (Dưới 4.0 → 0.0): Chưa đạt học phần (Học lại)
      </Text>
    </View>
  );

  if (loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && grades.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refreshAll()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredGrades}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderGrade}
        ListHeaderComponent={header}
        ListFooterComponent={filteredGrades.length > 0 ? footer : null}
        ListEmptyComponent={
          <EmptyState
            title="Không có điểm trong học kỳ này"
            description="Chọn học kỳ khác để xem kết quả học tập."
            actionLabel="Xem tất cả"
            onAction={() => setSemester('Tất cả')}
          />
        }
        refreshing={refreshing}
        onRefresh={() => refreshAll()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.sm,
  },
  filterTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  semesterCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  semesterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  semesterTitle: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  passedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
    gap: spacing.xxs,
  },
  passedBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  semesterStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: spacing.xxl,
    backgroundColor: colors.border,
  },
  statLabel: {
    fontSize: typography.sizes.xxs,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  statHighlight: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resultText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  guideCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginTop: spacing.xs,
    gap: spacing.xxs,
  },
  guideTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  guideText: {
    fontSize: typography.sizes.xxs,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  guideDanger: {
    color: colors.danger,
    fontWeight: typography.weights.semibold,
  },
});
