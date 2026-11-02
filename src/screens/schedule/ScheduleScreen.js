import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import sessionService from '../../api/sessionService';
import { useAppData } from '../../context/AppDataContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import { getDayName, getTodayDayOfWeek } from '../../utils/date';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import Icon from '../../components/common/Icon';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';

export default function ScheduleScreen({ navigation }) {
  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek());
  const { courses } = useAppData();
  const { data, loading, error, refreshing, lastUpdated, refresh } =
    useCachedQuery('sessions', () => sessionService.getAll());

  const enrichedAllSessions = useMemo(() => {
    const list = data || [];
    const courseMap = new Map(
      (courses || []).map((course) => [String(course.id), course]),
    );
    return list.map((session) => ({
      ...session,
      course:
        session.course || courseMap.get(String(session.courseId)) || null,
    }));
  }, [data, courses]);

  const sessionCounts = useMemo(() => {
    const counts = {};
    enrichedAllSessions.forEach((session) => {
      const day = Number(session.dayOfWeek);
      counts[day] = (counts[day] || 0) + 1;
    });
    return counts;
  }, [enrichedAllSessions]);

  const activeDaysCount = useMemo(
    () => Object.keys(sessionCounts).filter((k) => sessionCounts[k] > 0).length,
    [sessionCounts],
  );

  const sessions = useMemo(() => {
    return enrichedAllSessions
      .filter((session) => Number(session.dayOfWeek) === selectedDay)
      .sort((first, second) =>
        String(first.startTime).localeCompare(String(second.startTime)),
      );
  }, [enrichedAllSessions, selectedDay]);

  const firstDayWithSessions = useMemo(() => {
    for (let day = 2; day <= 8; day += 1) {
      if (sessionCounts[day] > 0) {
        return day;
      }
    }
    return 2;
  }, [sessionCounts]);

  const renderSession = useCallback(
    ({ item }) => (
      <SessionCard
        session={item}
        onPress={() =>
          navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
        }
      />
    ),
    [navigation],
  );

  const header = (
    <View style={styles.header}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <View style={styles.summaryIconBox}>
            <Icon name="calendar" color={colors.primary} size={20} />
          </View>
          <View style={styles.summaryTextWrap}>
            <Text style={styles.summarySubtitle}>THỜI KHÓA BIỂU TUẦN</Text>
            <Text style={styles.summaryTitle}>{getDayName(selectedDay)}</Text>
          </View>
          <View style={styles.todayChip}>
            <Text style={styles.todayChipText}>
              {selectedDay === getTodayDayOfWeek() ? 'Hôm nay' : 'Trong tuần'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Ca học trong ngày</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{enrichedAllSessions.length}</Text>
            <Text style={styles.statLabel}>Tổng ca / tuần</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activeDaysCount}</Text>
            <Text style={styles.statLabel}>Ngày có lịch</Text>
          </View>
        </View>
      </View>

      <DaySelector
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        sessionCounts={sessionCounts}
      />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {getDayName(selectedDay)} • {sessions.length} buổi học
        </Text>
        <LastUpdatedText timestamp={lastUpdated} />
      </View>
    </View>
  );

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

  return (
    <ScreenContainer>
      <FlatList
        data={sessions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSession}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học"
            description={`Bạn được nghỉ hoặc tự học vào ${getDayName(
              selectedDay,
            ).toLowerCase()}. Hãy chọn ngày khác có hiển thị số ca học trên thanh thứ.`}
            actionLabel={
              enrichedAllSessions.length > 0
                ? `Xem ${getDayName(firstDayWithSessions)}`
                : undefined
            }
            onAction={
              enrichedAllSessions.length > 0
                ? () => setSelectedDay(firstDayWithSessions)
                : undefined
            }
          />
        }
        refreshing={refreshing}
        onRefresh={refresh}
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
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  summaryIconBox: {
    width: spacing.huge,
    height: spacing.huge,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextWrap: {
    flex: 1,
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
  todayChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  todayChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statItem: {
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
});
