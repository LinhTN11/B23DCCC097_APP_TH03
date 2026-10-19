import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { AppTabScreenProps } from '../navigation/types';
import type { Assignment } from '../types';
import { THEME } from '../constants/theme';
import { SearchBar } from '../components/SearchBar';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import {
  TaskIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon,
} from '../components/AppIcons';

export const AssignmentScreen: React.FC<AppTabScreenProps<'AssignmentsTab'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { assignments, toggleAssignmentStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const pendingCount = useMemo(() => assignments.filter((a) => !a.isCompleted).length, [assignments]);
  const completedCount = useMemo(() => assignments.filter((a) => a.isCompleted).length, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.subjectName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.subjectCode.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !item.isCompleted) ||
        (statusFilter === 'completed' && item.isCompleted);

      return matchSearch && matchStatus;
    });
  }, [assignments, searchQuery, statusFilter]);

  const renderAssignmentItem = ({ item }: { item: Assignment }) => (
    <View style={[styles.card, item.isCompleted && styles.cardCompleted]}>
      {/* Checkbox Button */}
      <Pressable
        style={styles.checkboxBtn}
        onPress={() => toggleAssignmentStatus(item.id)}
        hitSlop={8}
      >
        <CheckCircleIcon
          color={item.isCompleted ? THEME.success : THEME.textMuted}
          filled={item.isCompleted}
          size={24}
        />
      </Pressable>

      {/* Main Info */}
      <Pressable
        style={styles.cardContent}
        onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}
      >
        <View style={styles.topBadgeRow}>
          <Badge label={item.subjectCode} variant="primary" size="sm" style={{ marginRight: 6 }} />
          <Badge
            label={item.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            variant={item.isCompleted ? 'success' : 'danger'}
            size="sm"
          />
        </View>

        <Text
          style={[styles.assignmentTitle, item.isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <Text style={styles.subjectSubtitle} numberOfLines={1}>
          {item.subjectName}
        </Text>

        <View style={styles.dueRow}>
          <ClockIcon
            color={item.isCompleted ? THEME.textMuted : THEME.danger}
            size={13}
          />
          <Text
            style={[
              styles.dueText,
              item.isCompleted && styles.dueTextCompleted,
            ]}
          >
            Hạn nộp: {item.dueDate}
          </Text>
        </View>
      </Pressable>

      {/* Arrow button */}
      <Pressable
        style={styles.arrowBtn}
        onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}
      >
        <ChevronRightIcon color={THEME.textMuted} size={18} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* S-Link Red Header */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.headerSub}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</Text>
        <Text style={styles.headerTitle}>Nhiệm vụ & Bài tập</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm bài tập theo tên hoặc môn học..."
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <Pressable
          style={[styles.filterTab, statusFilter === 'all' && styles.filterTabActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === 'all' && styles.filterTabTextActive,
            ]}
          >
            Tất cả ({assignments.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterTab, statusFilter === 'pending' && styles.filterTabActive]}
          onPress={() => setStatusFilter('pending')}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === 'pending' && styles.filterTabTextActive,
            ]}
          >
            Chưa hoàn thành ({pendingCount})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterTab, statusFilter === 'completed' && styles.filterTabActive]}
          onPress={() => setStatusFilter('completed')}
        >
          <Text
            style={[
              styles.filterTabText,
              statusFilter === 'completed' && styles.filterTabTextActive,
            ]}
          >
            Đã xong ({completedCount})
          </Text>
        </Pressable>
      </View>

      {/* Assignments List */}
      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignmentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<TaskIcon color={THEME.primary} size={32} />}
            title="Không tìm thấy bài tập nào"
            message={
              searchQuery
                ? `Không có bài tập phù hợp với "${searchQuery}".`
                : statusFilter === 'pending'
                ? 'Tuyệt vời! Bạn không còn bài tập nào chưa làm.'
                : 'Chưa có bài tập nào đã hoàn thành.'
            }
            actionText="Xem tất cả bài tập"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  headerContainer: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingBottom: 14,
    marginBottom: 12,
    ...THEME.shadowLg,
  },
  headerSub: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.ptit.goldLight,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  filterTabActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
  },
  cardCompleted: {
    backgroundColor: '#FAFDFB',
  },
  checkboxBtn: {
    paddingRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.textMuted,
  },
  subjectSubtitle: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginBottom: 6,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueText: {
    fontSize: 12,
    color: THEME.danger,
    fontWeight: '600',
    marginLeft: 4,
  },
  dueTextCompleted: {
    color: THEME.textMuted,
    fontWeight: '500',
  },
  arrowBtn: {
    paddingLeft: 8,
  },
});
