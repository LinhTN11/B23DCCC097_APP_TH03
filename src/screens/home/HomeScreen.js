import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import portalService from '../../api/portalService';
import sessionService from '../../api/sessionService';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import EmptyState from '../../components/common/EmptyState';
import ErrorView from '../../components/common/ErrorView';
import Icon from '../../components/common/Icon';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import LoadingView from '../../components/common/LoadingView';
import ScreenContainer from '../../components/common/ScreenContainer';
import CourseCard from '../../components/course/CourseCard';
import DigitalStudentCard from '../../components/home/DigitalStudentCard';
import DueReminderBanner from '../../components/home/DueReminderBanner';
import PtitHeader from '../../components/home/PtitHeader';
import SLinkServiceGrid from '../../components/home/SLinkServiceGrid';
import SLinkUtilityModals, { DEFAULT_PORTAL_DATA } from '../../components/home/SLinkUtilityModals';
import StudentCardModal from '../../components/home/StudentCardModal';
import TodayScheduleSection from '../../components/home/TodayScheduleSection';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import useAssignmentReminders from '../../hooks/useAssignmentReminders';
import useCachedQuery from '../../hooks/useCachedQuery';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { daysLeft } from '../../utils/date';
import { calcGpa } from '../../utils/gpa';

export default function HomeScreen({ navigation }) {
  const { student, courses, assignments, grades, loading, error, refreshing, lastUpdated, refreshAll, toggleAssignment } = useAppData();
  const { pendingCount, pendingActionIds, pendingActions, isOnline, syncing, syncNow } = useSync();
  const { data: sessionList, refreshing: refreshingSessions, refresh: refreshSessions } = useCachedQuery('sessions', () => sessionService.getAll());
  const { data: portalBundle, refresh: refreshPortal } = useCachedQuery('portal', () => portalService.getPortalBundle());
  const { urgentReminders } = useAssignmentReminders(assignments);

  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const sessions = useMemo(() => sessionList || [], [sessionList]);
  const portalData = useMemo(() => {
    if (!portalBundle) return DEFAULT_PORTAL_DATA;
    return {
      announcements: portalBundle.announcements?.length ? portalBundle.announcements : DEFAULT_PORTAL_DATA.announcements,
      exams: portalBundle.exams?.length ? portalBundle.exams : DEFAULT_PORTAL_DATA.exams,
      trainingScores: portalBundle.trainingScores?.length ? portalBundle.trainingScores : DEFAULT_PORTAL_DATA.trainingScores,
      tuitions: portalBundle.tuitions?.length ? portalBundle.tuitions : DEFAULT_PORTAL_DATA.tuitions,
      surveys: portalBundle.surveys?.length ? portalBundle.surveys : DEFAULT_PORTAL_DATA.surveys,
      serviceRequests: portalBundle.serviceRequests?.length ? portalBundle.serviceRequests : DEFAULT_PORTAL_DATA.serviceRequests,
    };
  }, [portalBundle]);
  const announcements = useMemo(() => (portalData.announcements || DEFAULT_PORTAL_DATA.announcements).slice(0, 3), [portalData]);
  const gpaInfo = useMemo(() => calcGpa(grades, courses), [grades, courses]);
  const todoCount = useMemo(() => assignments.filter((i) => i.status !== 'done').length, [assignments]);
  const pendingProfile = useMemo(() => pendingActions.some((a) => String(a.url).includes('/students/')), [pendingActions]);
  const upcomingAssignments = useMemo(() => assignments.filter((i) => i.status !== 'done' && daysLeft(i.dueDate) <= 7).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()), [assignments]);
  const dueWithin24h = useMemo(() => (urgentReminders.length > 0 ? urgentReminders : assignments.filter((i) => i.status !== 'done' && daysLeft(i.dueDate) <= 1)), [urgentReminders, assignments]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refreshAll(), refreshSessions(), refreshPortal()]);
  }, [refreshAll, refreshSessions, refreshPortal]);

  const handleToggle = useCallback(async (item) => {
    try {
      await toggleAssignment(item.id);
    } catch (err) {
      Alert.alert('Không thể cập nhật', err.message || 'Vui lòng thử lại sau.');
    }
  }, [toggleAssignment]);

  const openSessionDetail = useCallback((id) => {
    navigation.navigate(ROUTES.SESSION_DETAIL, { id });
  }, [navigation]);

  const openGradeList = useCallback(() => {
    navigation.navigate(ROUTES.GRADE_LIST);
  }, [navigation]);

  const hasData = Boolean(student) || courses.length > 0 || assignments.length > 0;
  if (loading && !hasData) return <ScreenContainer><LoadingView /></ScreenContainer>;
  if (error && !hasData) return <ScreenContainer><ErrorView message={error.message} onRetry={handleRefresh} /></ScreenContainer>;

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={Boolean(refreshing || refreshingSessions)} onRefresh={handleRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }>
        <PtitHeader
          student={student}
          pendingProfile={pendingProfile}
          pendingCount={pendingCount}
          isOnline={isOnline}
          syncing={syncing}
          onSyncNow={syncNow}
          notificationCount={dueWithin24h.length + announcements.length}
          onOpenNotifications={() => setActiveModal('news')}
          onPressAvatar={() => navigation.navigate(ROUTES.PROFILE_TAB)}
        />
        <View style={styles.updatedRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
        <DueReminderBanner
          reminders={dueWithin24h}
          onPressAssignment={(id) => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id })}
          onCompleteAssignment={handleToggle}
        />
        <DigitalStudentCard
          student={student}
          gpaInfo={gpaInfo}
          todoCount={todoCount}
          onOpenCardModal={() => setCardModalVisible(true)}
          onOpenGrades={openGradeList}
        />
        <SLinkServiceGrid
          gpa={gpaInfo.gpa}
          examCount={(portalData.exams || []).length || 4}
          notificationCount={dueWithin24h.length + announcements.length}
          onOpenSchedule={() => navigation.navigate(ROUTES.SCHEDULE_TAB)}
          onOpenGrades={openGradeList}
          onOpenModal={setActiveModal}
        />
        <TodayScheduleSection
          sessions={sessions}
          onPressSession={openSessionDetail}
          onOpenSchedule={() => navigation.navigate(ROUTES.SCHEDULE_TAB)}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Môn đang học ({courses.length})</Text>
          <Pressable onPress={() => navigation.navigate(ROUTES.COURSES_TAB)} accessibilityLabel="Xem tất cả môn đang học">
            <Text style={styles.sectionLink}>Tất cả →</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courseScroll}>
          {courses.map((course) => (
            <CourseCard key={String(course.id)} course={course} style={styles.courseCard} onPress={() => navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })} />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bài tập đến hạn ≤ 7 ngày ({upcomingAssignments.length})</Text>
          <Pressable onPress={() => navigation.navigate(ROUTES.ASSIGNMENTS_TAB)} accessibilityLabel="Xem tất cả bài tập">
            <Text style={styles.sectionLink}>Xem tất cả →</Text>
          </Pressable>
        </View>
        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map((item) => (
            <AssignmentItem
              key={String(item.id)}
              assignment={item}
              pending={Boolean(item._pending) || pendingActionIds.includes(String(item.id))}
              onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })}
              onToggleStatus={() => handleToggle(item)}
            />
          ))
        ) : (
          <EmptyState title="Không có bài tập sắp đến hạn" description="Bạn đã hoàn thành hết các bài tập trong 7 ngày tới." />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Thông báo & Tin tức Học viện</Text>
          <Pressable onPress={() => setActiveModal('news')} accessibilityLabel="Xem tất cả thông báo Học viện">
            <Text style={styles.sectionLink}>Xem tất cả →</Text>
          </Pressable>
        </View>
        {announcements.map((ann) => (
          <Pressable key={ann.id} onPress={() => setSelectedAnnouncement(ann)} accessibilityLabel={`Thông báo ${ann.title}`} style={styles.newsCard}>
            <View style={styles.newsTopRow}>
              <Text style={styles.newsBadge}>{ann.category}</Text>
              <Text style={styles.newsDate}>{ann.date}</Text>
            </View>
            <Text style={styles.newsTitle} numberOfLines={2}>{ann.title}</Text>
            <View style={styles.newsBottomRow}>
              <Text style={styles.newsSender}>{ann.sender}</Text>
              <Icon name="chevron-right" color={colors.textMuted} size={16} />
            </View>
          </Pressable>
        ))}

        <StudentCardModal visible={cardModalVisible} student={student} onClose={() => setCardModalVisible(false)} />
        <SLinkUtilityModals
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          portalData={portalData}
          courses={courses}
          dueWithin24h={dueWithin24h}
          selectedAnnouncement={selectedAnnouncement}
          onSelectAnnouncement={setSelectedAnnouncement}
          onPressAssignment={(id) => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id })}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  updatedRow: { marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm, marginTop: spacing.xs },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text },
  sectionLink: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.primary },
  courseScroll: { gap: spacing.md, paddingBottom: spacing.lg },
  courseCard: { width: 248, marginBottom: 0 },
  newsCard: { backgroundColor: colors.card, borderRadius: spacing.radiusLg, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.xs },
  newsTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  newsBadge: { fontSize: typography.sizes.xxs, fontWeight: typography.weights.extrabold, color: colors.primary, backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: spacing.radiusSm },
  newsDate: { fontSize: typography.sizes.xs, color: colors.textMuted },
  newsTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text },
  newsBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  newsSender: { fontSize: typography.sizes.xs, color: colors.textSecondary },
});
