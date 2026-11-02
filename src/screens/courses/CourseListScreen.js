import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { SEMESTER_OPTIONS } from '../../config';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import Icon from '../../components/common/Icon';
import CourseCard from '../../components/course/CourseCard';

export default function CourseListScreen({ navigation }) {
  const {
    courses,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshAll,
  } = useAppData();
  const [keyword, setKeyword] = useState('');
  const [semester, setSemester] = useState('Tất cả');

  const filteredCourses = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesKeyword =
        !normalized ||
        String(course.name || '').toLowerCase().includes(normalized) ||
        String(course.code || '').toLowerCase().includes(normalized) ||
        String(course.lecturer || '').toLowerCase().includes(normalized);
      const matchesSemester =
        semester === 'Tất cả' || course.semester === semester;
      return matchesKeyword && matchesSemester;
    });
  }, [courses, keyword, semester]);

  const totalCredits = useMemo(() => {
    return filteredCourses.reduce(
      (sum, item) => sum + (Number(item.credits) || 0),
      0,
    );
  }, [filteredCourses]);

  const renderCourse = useCallback(
    ({ item }) => (
      <CourseCard
        course={item}
        onPress={() =>
          navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
        }
      />
    ),
    [navigation],
  );

  const resetFilters = () => {
    setKeyword('');
    setSemester('Tất cả');
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryHeaderLeft}>
            <View style={styles.summaryIconBox}>
              <Icon name="book" color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={styles.summarySubtitle}>CHƯƠNG TRÌNH ĐÀO TẠO PTIT</Text>
              <Text style={styles.summaryTitle}>Học phần đăng ký</Text>
            </View>
          </View>
          <View style={styles.semesterTag}>
            <Text style={styles.semesterTagText}>{semester}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{filteredCourses.length}</Text>
            <Text style={styles.statLabel}>Môn học hiển thị</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalCredits}</Text>
            <Text style={styles.statLabel}>Tổng số tín chỉ</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{courses.length}</Text>
            <Text style={styles.statLabel}>Tổng toàn khóa</Text>
          </View>
        </View>
      </View>

      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm theo tên môn, mã môn hoặc giảng viên..."
      />

      <FilterChips
        options={SEMESTER_OPTIONS}
        selected={semester}
        onSelect={setSemester}
      />

      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          Hiển thị {filteredCourses.length} môn ({totalCredits} tín chỉ)
        </Text>
        <LastUpdatedText timestamp={lastUpdated} />
      </View>
    </View>
  );

  if (loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refreshAll()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCourse}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description="Không có học phần nào khớp với từ khóa hoặc học kỳ đang chọn."
            actionLabel="Xóa bộ lọc"
            onAction={resetFilters}
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
    gap: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  summaryIconBox: {
    width: spacing.huge,
    height: spacing.huge,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summarySubtitle: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.4,
  },
  summaryTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  semesterTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  semesterTagText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: spacing.xxl,
    backgroundColor: colors.borderStrong,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  resultText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
});
