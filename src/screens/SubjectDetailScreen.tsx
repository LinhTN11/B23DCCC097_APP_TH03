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
  UserIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  TaskIcon,
} from '../components/AppIcons';

export const SubjectDetailScreen: React.FC<RootStackScreenProps<'SubjectDetail'>> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { subjectId } = route.params;
  const { subjects, assignments, toggleAssignmentStatus } = useApp();

  const subject = useMemo(() => {
    return subjects.find((s) => s.id === subjectId) || subjects[0];
  }, [subjects, subjectId]);

  // Assignments belonging to this subject
  const subjectAssignments = useMemo(() => {
    return assignments.filter((a) => a.subjectId === subject.id);
  }, [assignments, subject.id]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header
        title="Chi tiết môn học"
        subtitle={`PTIT S-Link • ${subject.code}`}
        showBack
        onBack={() => navigation.goBack()}
        variant="ptitRed"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Card Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroInner}>
            <View style={styles.codeRow}>
              <Badge label={subject.code} variant="primary" size="md" />
              <Badge label={`${subject.credits} tín chỉ`} variant="neutral" size="md" />
            </View>
            <Text style={styles.subjectTitle}>{subject.name}</Text>
            <Text style={styles.semesterText}>{subject.semester}</Text>

            {/* Progress */}
            <View style={styles.progressBox}>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressTitle}>Tiến độ học tập</Text>
                <Text style={styles.progressPercent}>{subject.progress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${subject.progress}%`, backgroundColor: subject.color },
                  ]}
                />
              </View>
              <Text style={styles.progressSub}>
                Đã hoàn thành {subject.completedLessons} trên tổng số {subject.totalLessons} buổi học
              </Text>
            </View>
          </View>
        </View>

        {/* Lecturer & Schedule Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Thông tin giảng dạy & Lớp học</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <UserIcon color={THEME.primary} size={18} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Giảng viên phụ trách</Text>
              <Text style={styles.infoValue}>{subject.lecturer}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <MailIcon color={THEME.primary} size={18} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email liên hệ</Text>
              <Text style={styles.infoValue}>{subject.lecturerEmail}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <MapPinIcon color={THEME.primary} size={18} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phòng học</Text>
              <Text style={styles.infoValue}>{subject.room}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <ClockIcon color={THEME.primary} size={18} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Lịch học hàng tuần</Text>
              <Text style={styles.infoValue}>{subject.scheduleSummary}</Text>
            </View>
          </View>
        </View>

        {/* Evaluation Components */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Tỷ lệ đánh giá học phần</Text>
          <View style={styles.componentsList}>
            {subject.components.map((c, index) => (
              <View key={index} style={styles.componentItem}>
                <View style={styles.componentLeft}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.componentName}>{c.name}</Text>
                </View>
                <View style={styles.componentRight}>
                  {c.score !== undefined && (
                    <Text style={styles.scoreText}>Điểm: {c.score}</Text>
                  )}
                  <Badge label={`${c.weight}%`} variant="info" size="sm" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Subject Description */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Đề cương & Giới thiệu học phần</Text>
          <Text style={styles.descText}>{subject.description}</Text>
        </View>

        {/* Assignments for this subject */}
        <View style={styles.infoCard}>
          <View style={styles.assignHeader}>
            <Text style={styles.cardSectionTitle}>Bài tập môn học ({subjectAssignments.length})</Text>
          </View>

          {subjectAssignments.length > 0 ? (
            subjectAssignments.map((a) => (
              <View key={a.id} style={styles.assignmentItem}>
                <Pressable
                  style={styles.checkBtn}
                  onPress={() => toggleAssignmentStatus(a.id)}
                  hitSlop={8}
                >
                  <CheckCircleIcon
                    color={a.isCompleted ? THEME.success : THEME.textMuted}
                    filled={a.isCompleted}
                    size={22}
                  />
                </Pressable>

                <Pressable
                  style={styles.assignmentDetails}
                  onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: a.id })}
                >
                  <Text
                    style={[
                      styles.assignmentTitle,
                      a.isCompleted && styles.assignmentDoneTitle,
                    ]}
                    numberOfLines={2}
                  >
                    {a.title}
                  </Text>
                  <View style={styles.assignMetaRow}>
                    <Text style={styles.assignDueDate}>Hạn: {a.dueDate}</Text>
                    <Badge
                      label={a.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                      variant={a.isCompleted ? 'success' : 'danger'}
                      size="sm"
                      style={{ marginLeft: 6 }}
                    />
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: a.id })}
                >
                  <ChevronRightIcon color={THEME.textMuted} size={18} />
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.emptyAssignWrap}>
              <TaskIcon color={THEME.textMuted} size={24} />
              <Text style={styles.emptyAssignText}>Không có bài tập nào được giao cho môn này.</Text>
            </View>
          )}
        </View>

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
  colorBar: {
    height: 8,
    width: '100%',
  },
  heroInner: {
    padding: 18,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    lineHeight: 28,
    marginBottom: 6,
  },
  semesterText: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginBottom: 16,
  },
  progressBox: {
    backgroundColor: THEME.cardAlt,
    borderRadius: 12,
    padding: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primaryDark,
  },
  progressTrack: {
    height: 6,
    backgroundColor: THEME.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressSub: {
    fontSize: 11,
    color: THEME.textSecondary,
  },
  infoCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  componentsList: {
    gap: 8,
  },
  componentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderLight,
  },
  componentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.primary,
    marginRight: 8,
  },
  componentName: {
    fontSize: 13,
    color: THEME.textPrimary,
    fontWeight: '500',
  },
  componentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.success,
  },
  descText: {
    fontSize: 13,
    lineHeight: 20,
    color: THEME.textSecondary,
  },
  assignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderLight,
  },
  checkBtn: {
    paddingRight: 10,
  },
  assignmentDetails: {
    flex: 1,
    marginRight: 8,
  },
  assignmentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  assignmentDoneTitle: {
    textDecorationLine: 'line-through',
    color: THEME.textMuted,
  },
  assignMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignDueDate: {
    fontSize: 11,
    color: THEME.danger,
    fontWeight: '500',
  },
  emptyAssignWrap: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAssignText: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 6,
  },
});
