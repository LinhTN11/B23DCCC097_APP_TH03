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
import type { Subject } from '../types';
import { THEME } from '../constants/theme';
import { SearchBar } from '../components/SearchBar';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import {
  BookIcon,
  ChevronRightIcon,
  MapPinIcon,
  UserIcon,
} from '../components/AppIcons';

export const SubjectListScreen: React.FC<AppTabScreenProps<'SubjectsTab'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { subjects } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | '2' | '3' | '4'>('all');

  // Filtered and searched subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchSearch =
        subject.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        subject.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        subject.lecturer.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchCredits =
        selectedFilter === 'all' || subject.credits.toString() === selectedFilter;

      return matchSearch && matchCredits;
    });
  }, [subjects, searchQuery, selectedFilter]);

  const renderSubjectItem = ({ item }: { item: Subject }) => (
    <Pressable
      style={({ pressed }) => [styles.subjectItem, pressed && styles.itemPressed]}
      onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
    >
      <View style={styles.itemContent}>
        {/* Top line: Code, Credits & Semester */}
        <View style={styles.topRow}>
          <Badge label={item.code} variant="primary" size="sm" />
          <View style={styles.rightBadgeRow}>
            <Badge
              label={`${item.credits} tín chỉ`}
              variant="neutral"
              size="sm"
              style={{ marginRight: 6 }}
            />
            <ChevronRightIcon color={THEME.textMuted} size={18} />
          </View>
        </View>

        {/* Subject Name */}
        <Text style={styles.subjectName}>{item.name}</Text>

        {/* Lecturer & Room */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <UserIcon color={THEME.textSecondary} size={14} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.lecturer}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPinIcon color={THEME.textSecondary} size={14} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.scheduleSummary}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${item.progress}%`, backgroundColor: item.color },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            Đã học {item.completedLessons}/{item.totalLessons} buổi ({item.progress}%)
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* S-Link Red Header */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.headerSub}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</Text>
        <Text style={styles.headerTitle}>Môn học & Học phần</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm môn học theo tên hoặc mã môn..."
        />
      </View>

      {/* Credit Filter Pills */}
      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            Tất cả ({subjects.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, selectedFilter === '3' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('3')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === '3' && styles.filterChipTextActive,
            ]}
          >
            3 tín chỉ
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, selectedFilter === '4' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('4')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === '4' && styles.filterChipTextActive,
            ]}
          >
            4 tín chỉ
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, selectedFilter === '2' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('2')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedFilter === '2' && styles.filterChipTextActive,
            ]}
          >
            2 tín chỉ
          </Text>
        </Pressable>
      </View>

      {/* FlatList for subjects */}
      <FlatList
        data={filteredSubjects}
        keyExtractor={(item) => item.id}
        renderItem={renderSubjectItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<BookIcon color={THEME.primary} size={32} />}
            title="Không tìm thấy môn học nào"
            message={`Không có kết quả phù hợp cho "${searchQuery}". Vui lòng thử từ khóa khác hoặc bỏ lọc.`}
            actionText="Xem tất cả môn học"
            onAction={() => {
              setSearchQuery('');
              setSelectedFilter('all');
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
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  filterChipActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  subjectItem: {
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  sideStripe: {
    width: 6,
  },
  itemContent: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rightBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 8,
  },
  metaRow: {
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  progressContainer: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.borderLight,
  },
  progressTrack: {
    height: 5,
    backgroundColor: THEME.cardAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    textAlign: 'right',
  },
});
