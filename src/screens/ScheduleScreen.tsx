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
import type { ScheduleItem } from '../types';
import { THEME } from '../constants/theme';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  ChevronRightIcon,
} from '../components/AppIcons';

const DAYS_OF_WEEK = [
  { day: 0, label: 'Tất cả' },
  { day: 2, label: 'Thứ 2' },
  { day: 3, label: 'Thứ 3' },
  { day: 4, label: 'Thứ 4' },
  { day: 5, label: 'Thứ 5' },
  { day: 6, label: 'Thứ 6' },
  { day: 7, label: 'Thứ 7' },
];

export const ScheduleScreen: React.FC<AppTabScreenProps<'ScheduleTab'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { schedule } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(0); // 0 means All days

  const filteredSchedule = useMemo(() => {
    if (selectedDay === 0) return schedule;
    return schedule.filter((item) => item.dayOfWeek === selectedDay);
  }, [schedule, selectedDay]);

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <Pressable
      style={({ pressed }) => [styles.scheduleCard, pressed && styles.cardPressed]}
      onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: item.id })}
    >
      {/* Left Time Column */}
      <View style={styles.timeColumn}>
        <View style={styles.timeBox}>
          <Text style={styles.dayLabel}>{item.dayName}</Text>
          <Text style={styles.startTimeText}>{item.startTime}</Text>
          <Text style={styles.endTimeText}>{item.endTime}</Text>
        </View>
        <Badge
          label={item.type}
          variant={item.type === 'Thực hành' ? 'info' : 'neutral'}
          size="sm"
          style={styles.typeBadge}
        />
      </View>

      {/* Right Details Column */}
      <View style={styles.infoColumn}>
        <View style={styles.codeRow}>
          <Badge label={item.subjectCode} variant="primary" size="sm" />
          <ChevronRightIcon color={THEME.textMuted} size={18} />
        </View>

        <Text style={styles.subjectName}>{item.subjectName}</Text>

        <View style={styles.metaRow}>
          <MapPinIcon color={THEME.primary} size={14} />
          <Text style={styles.roomText}>{item.room}</Text>
          <Text style={styles.buildingSub} numberOfLines={1}>
            ({item.building.split('-')[0].trim()})
          </Text>
        </View>

        <View style={styles.metaRow}>
          <UserIcon color={THEME.textSecondary} size={14} />
          <Text style={styles.lecturerText} numberOfLines={1}>
            {item.lecturer}
          </Text>
        </View>

        <View style={styles.topicBox}>
          <Text style={styles.topicText} numberOfLines={1}>
            {item.lessonTopic}
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
        <Text style={styles.headerTitle}>Thời khóa biểu tuần</Text>
      </View>

      {/* Day Selector Pills */}
      <View style={styles.daySelectorWrapper}>
        <FlatList
          data={DAYS_OF_WEEK}
          keyExtractor={(item) => item.day.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorContent}
          renderItem={({ item }) => {
            const isSelected = selectedDay === item.day;
            const count =
              item.day === 0
                ? schedule.length
                : schedule.filter((s) => s.dayOfWeek === item.day).length;

            return (
              <Pressable
                style={[styles.dayTab, isSelected && styles.dayTabSelected]}
                onPress={() => setSelectedDay(item.day)}
              >
                <Text style={[styles.dayTabLabel, isSelected && styles.dayTabLabelSelected]}>
                  {item.label}
                </Text>
                {count > 0 && (
                  <View style={[styles.dayCountBadge, isSelected && styles.dayCountBadgeSelected]}>
                    <Text
                      style={[
                        styles.dayCountText,
                        isSelected && styles.dayCountTextSelected,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </View>

      {/* Schedule Items List */}
      <FlatList
        data={filteredSchedule}
        keyExtractor={(item) => item.id}
        renderItem={renderScheduleItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<CalendarIcon color={THEME.primary} size={32} />}
            title="Không có lịch học"
            message={`Không có buổi học nào vào ${DAYS_OF_WEEK.find((d) => d.day === selectedDay)?.label}. Hãy dành thời gian tự học hoặc nghỉ ngơi nhé!`}
            actionText="Xem toàn bộ tuần"
            onAction={() => setSelectedDay(0)}
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
  daySelectorWrapper: {
    marginBottom: 12,
  },
  daySelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dayTabSelected: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  dayTabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  dayTabLabelSelected: {
    color: '#FFFFFF',
  },
  dayCountBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: THEME.cardAlt,
  },
  dayCountBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dayCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  dayCountTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  timeColumn: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBox: {
    alignItems: 'center',
    marginBottom: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.primaryDark,
    marginBottom: 2,
  },
  startTimeText: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  endTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  typeBadge: {
    alignSelf: 'center',
  },
  timelineDivider: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roomText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primaryDark,
    marginLeft: 6,
  },
  buildingSub: {
    fontSize: 11,
    color: THEME.textMuted,
    marginLeft: 4,
    flex: 1,
  },
  lecturerText: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  topicBox: {
    marginTop: 4,
    backgroundColor: THEME.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 11,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
});
