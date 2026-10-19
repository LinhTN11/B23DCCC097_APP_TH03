import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { RootStackScreenProps } from '../navigation/types';
import { THEME } from '../constants/theme';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  BookIcon,
  ChevronRightIcon,
} from '../components/AppIcons';

export const ScheduleDetailScreen: React.FC<RootStackScreenProps<'ScheduleDetail'>> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { scheduleId } = route.params;
  const { schedule } = useApp();

  const item = useMemo(() => {
    return schedule.find((s) => s.id === scheduleId) || schedule[0];
  }, [schedule, scheduleId]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header
        title="Chi tiết buổi học"
        subtitle={`PTIT S-Link • ${item.dayName}`}
        showBack
        onBack={() => navigation.goBack()}
        variant="ptitRed"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBody}>
            <View style={styles.badgeRow}>
              <Badge label={item.subjectCode} variant="primary" size="md" />
              <Badge label={item.type} variant="info" size="md" />
            </View>

            <Text style={styles.subjectTitle}>{item.subjectName}</Text>

            <View style={styles.heroTimeRow}>
              <CalendarIcon color={THEME.primaryDark} size={18} />
              <Text style={styles.heroDayText}>{item.dayName}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <ClockIcon color={THEME.primaryDark} size={16} />
              <Text style={styles.heroTimeText}>{item.timeRange}</Text>
            </View>
          </View>
        </View>

        {/* Location & Room */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Địa điểm & Phòng học</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <MapPinIcon color={THEME.primary} size={20} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Phòng học</Text>
              <Text style={styles.roomHighlight}>{item.room}</Text>
              <Text style={styles.buildingSub}>{item.building}</Text>
            </View>
          </View>
        </View>

        {/* Lecturer Info */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Giảng viên phụ trách</Text>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <UserIcon color={THEME.primary} size={20} />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Giảng viên</Text>
              <Text style={styles.lecturerName}>{item.lecturer}</Text>
            </View>
          </View>
        </View>

        {/* Topic & Syllabus */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Chủ đề & Nội dung bài học</Text>
          <View style={styles.topicContainer}>
            <Text style={styles.topicTitle}>{item.lessonTopic}</Text>
          </View>
          {item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Lưu ý sinh viên:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}
        </View>

        {/* Link to Subject Detail */}
        <Pressable
          style={({ pressed }) => [styles.linkCard, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.subjectId })}
        >
          <View style={styles.linkIconWrap}>
            <BookIcon color={THEME.primary} size={22} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Xem toàn bộ thông tin môn học</Text>
            <Text style={styles.linkSub}>Đề cương, tỷ lệ điểm và danh sách bài tập</Text>
          </View>
          <ChevronRightIcon color={THEME.textMuted} size={20} />
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  stripe: {
    height: 8,
    width: '100%',
  },
  heroBody: {
    padding: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    lineHeight: 28,
    marginBottom: 14,
  },
  heroTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  heroDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primaryDark,
    marginLeft: 6,
  },
  dotSeparator: {
    marginHorizontal: 8,
    color: THEME.primaryDark,
  },
  heroTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primaryDark,
    marginLeft: 6,
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '500',
  },
  roomHighlight: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.primaryDark,
    marginTop: 2,
  },
  buildingSub: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  lecturerName: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  topicContainer: {
    backgroundColor: THEME.cardAlt,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textPrimary,
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: THEME.warningLight,
    padding: 12,
    borderRadius: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.warning,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: THEME.textPrimary,
    lineHeight: 18,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  linkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  linkSub: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
  },
});
