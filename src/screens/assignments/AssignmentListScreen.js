import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { isOverdue } from '../../utils/date';
import { ROUTES } from '../../navigation/routes';
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
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import Icon from '../../components/common/Icon';
import AssignmentItem from '../../components/assignment/AssignmentItem';

const FILTERS = ['Tất cả', 'Chưa xong', 'Đã xong', 'Quá hạn'];

export default function AssignmentListScreen({ navigation }) {
  const {
    assignments,
    courses,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshAll,
    toggleAssignment,
  } = useAppData();
  const { pendingCount, pendingActionIds, isOnline, syncing, syncNow } =
    useSync();
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('Tất cả');

  const enrichedAssignments = useMemo(() => {
    const courseMap = new Map(
      (courses || []).map((course) => [String(course.id), course]),
    );
    return assignments.map((item) => ({
      ...item,
      course: item.course || courseMap.get(String(item.courseId)) || null,
    }));
  }, [assignments, courses]);

  const stats = useMemo(() => {
    const total = enrichedAssignments.length;
    let doneCount = 0;
    let todoCount = 0;
    let overdueCount = 0;

    enrichedAssignments.forEach((item) => {
      if (item.status === 'done') {
        doneCount += 1;
      } else {
        todoCount += 1;
        if (isOverdue(item.dueDate)) {
          overdueCount += 1;
        }
      }
    });

    const progressPercent =
      total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return {
      total,
      doneCount,
      todoCount,
      overdueCount,
      progressPercent,
    };
  }, [enrichedAssignments]);

  const filteredAssignments = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    const sorted = [...enrichedAssignments].sort(
      (first, second) =>
        new Date(first.dueDate).getTime() - new Date(second.dueDate).getTime(),
    );

    return sorted.filter((item) => {
      const courseName = (item.course && item.course.name) || '';
      const courseCode = (item.course && item.course.code) || '';
      const matchesKeyword =
        !normalized ||
        String(item.title || '').toLowerCase().includes(normalized) ||
        String(courseName).toLowerCase().includes(normalized) ||
        String(courseCode).toLowerCase().includes(normalized);

      if (!matchesKeyword) {
        return false;
      }

      if (filter === 'Chưa xong') {
        return item.status !== 'done';
      }
      if (filter === 'Đã xong') {
        return item.status === 'done';
      }
      if (filter === 'Quá hạn') {
        return item.status !== 'done' && isOverdue(item.dueDate);
      }
      return true;
    });
  }, [enrichedAssignments, keyword, filter]);

  const handleToggle = useCallback(
    async (item) => {
      try {
        await toggleAssignment(item.id);
      } catch (toggleError) {
        Alert.alert(
          'Không thể cập nhật',
          toggleError.message || 'Vui lòng thử lại sau.',
        );
      }
    },
    [toggleAssignment],
  );

  const renderAssignment = useCallback(
    ({ item }) => (
      <AssignmentItem
        assignment={item}
        pending={
          Boolean(item._pending) ||
          pendingActionIds.includes(String(item.id))
        }
        onPress={() =>
          navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
        }
        onToggleStatus={() => handleToggle(item)}
      />
    ),
    [handleToggle, navigation, pendingActionIds],
  );

  const resetFilters = () => {
    setKeyword('');
    setFilter('Tất cả');
  };

  const header = (
    <View style={styles.header}>
      {/* Card Tiến độ hoàn thành bài tập */}
      <View style={styles.progressCard}>
        <View style={styles.progressTopRow}>
          <View style={styles.progressTitleGroup}>
            <View style={styles.progressIconWrap}>
              <Icon name="clipboard" color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={styles.progressSub}>TIẾN ĐỘ HỌC TẬP</Text>
              <Text style={styles.progressMainTitle}>
                Hoàn thành {stats.doneCount}/{stats.total} bài tập
              </Text>
            </View>
          </View>
          <View style={styles.percentBadge}>
            <Text style={styles.percentBadgeText}>
              {stats.progressPercent}%
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${stats.progressPercent}%` },
            ]}
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.statTodo]}>
              {stats.todoCount}
            </Text>
            <Text style={styles.statLabel}>Chưa xong</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.statDone]}>
              {stats.doneCount}
            </Text>
            <Text style={styles.statLabel}>Đã xong</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.statOverdue]}>
              {stats.overdueCount}
            </Text>
            <Text style={styles.statLabel}>Quá hạn</Text>
          </View>
        </View>
      </View>

      <AppButton
        title="+ Thêm bài tập"
        onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
        accessibilityLabel="Thêm bài tập mới"
      />

      <View style={styles.syncRow}>
        <SyncBadge pending={pendingCount > 0} />
        <LastUpdatedText timestamp={lastUpdated} />
      </View>

      {pendingCount > 0 && isOnline ? (
        <View style={styles.syncAction}>
          <AppButton
            title="Đồng bộ ngay"
            onPress={syncNow}
            variant="outline"
            loading={syncing}
            disabled={syncing}
            accessibilityLabel="Đồng bộ thay đổi đang chờ"
          />
        </View>
      ) : null}

      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        placeholder="Tìm bài tập theo tiêu đề hoặc môn học..."
      />

      <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />

      <Text style={styles.resultText}>
        Hiển thị {filteredAssignments.length} bài tập
      </Text>
    </View>
  );

  if (loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refreshAll()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAssignment}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy bài tập"
            description={
              keyword || filter !== 'Tất cả'
                ? 'Chưa có bài tập nào khớp với từ khóa hoặc bộ lọc đang chọn.'
                : 'Danh sách bài tập đang trống. Hãy thêm bài tập mới!'
            }
            actionLabel={
              keyword || filter !== 'Tất cả' ? 'Xóa bộ lọc' : 'Thêm bài tập'
            }
            onAction={
              keyword || filter !== 'Tất cả'
                ? resetFilters
                : () => navigation.navigate(ROUTES.ASSIGNMENT_FORM)
            }
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
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.xs,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  progressTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  progressIconWrap: {
    width: spacing.huge,
    height: spacing.huge,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSub: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    letterSpacing: 0.4,
  },
  progressMainTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  percentBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusMd,
  },
  percentBadgeText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  progressTrack: {
    height: spacing.sm,
    backgroundColor: colors.chip,
    borderRadius: spacing.radiusSm,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: spacing.radiusSm,
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
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  },
  statTodo: {
    color: colors.warning,
  },
  statDone: {
    color: colors.success,
  },
  statOverdue: {
    color: colors.danger,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncAction: {
    alignSelf: 'flex-start',
    minWidth: spacing.huge * 4,
  },
  resultText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
});
