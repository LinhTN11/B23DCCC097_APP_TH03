import React, { useEffect, useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import courseService from '../../api/courseService';
import sessionService from '../../api/sessionService';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import { ROUTES } from '../../navigation/routes';
import { getDayName } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import InfoRow from '../../components/profile/InfoRow';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';

function resolveProgress(course) {
  const totalLessons =
    Number(course.totalLessons) > 0
      ? Number(course.totalLessons)
      : (Number(course.credits) || 3) * 5;
  if (typeof course.progress === 'number' && !Number.isNaN(course.progress)) {
    const rawProgress =
      course.progress > 0 && course.progress <= 1
        ? course.progress * 100
        : course.progress;
    const progress = Math.max(0, Math.min(100, Math.round(rawProgress)));
    const completedLessons =
      Number(course.completedLessons) >= 0
        ? Number(course.completedLessons)
        : Math.round((progress / 100) * totalLessons);
    return { progress, completedLessons, totalLessons };
  }
  const numericId = Number(course.id) || 1;
  const defaultProgress = 55 + ((numericId * 11) % 35);
  const completedLessons = Math.round((defaultProgress / 100) * totalLessons);
  const progress = Math.round((completedLessons / totalLessons) * 100);
  return { progress, completedLessons, totalLessons };
}

function buildLecturerEmail(course) {
  if (course.lecturerEmail) {
    return course.lecturerEmail;
  }
  const code = String(course.code || 'gv').toLowerCase();
  return `${code}.lecturer@ptit.edu.vn`;
}

export default function CourseDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const {
    courses,
    assignments,
    grades,
    toggleAssignment,
  } = useAppData();
  const { pendingActionIds } = useSync();

  const courseQuery = useCachedQuery(`course:${id}`, () =>
    courseService.getById(id),
  );
  const sessionsQuery = useCachedQuery('sessions', () =>
    sessionService.getAll(),
  );

  const fallbackCourse = useMemo(
    () => courses.find((item) => String(item.id) === String(id)),
    [courses, id],
  );
  const course = courseQuery.data || fallbackCourse;

  useEffect(() => {
    if (course && course.name) {
      navigation.setOptions({ title: course.name });
    }
  }, [course, navigation]);

  const courseSessions = useMemo(() => {
    const sessions = sessionsQuery.data || [];
    return sessions
      .filter((session) => String(session.courseId) === String(id))
      .map((session) => ({
        ...session,
        course: session.course || course,
      }))
      .sort((first, second) => {
        if (first.dayOfWeek !== second.dayOfWeek) {
          return first.dayOfWeek - second.dayOfWeek;
        }
        return String(first.startTime).localeCompare(String(second.startTime));
      });
  }, [sessionsQuery.data, id, course]);

  const courseAssignments = useMemo(() => {
    return assignments
      .filter((item) => String(item.courseId) === String(id))
      .map((item) => ({
        ...item,
        course: item.course || course,
      }))
      .sort((first, second) => {
        return (
          new Date(first.dueDate).getTime() -
          new Date(second.dueDate).getTime()
        );
      });
  }, [assignments, id, course]);

  const courseGrade = useMemo(() => {
    return (grades || []).find((item) => String(item.courseId) === String(id));
  }, [grades, id]);

  const evaluationRows = useMemo(() => {
    return [
      {
        key: 'attendance',
        name: 'Chuyên cần & Tham gia lớp',
        weight: 10,
        score:
          courseGrade && courseGrade.attendance != null
            ? courseGrade.attendance
            : null,
      },
      {
        key: 'midterm',
        name: 'Kiểm tra giữa kỳ / Thực hành',
        weight: 30,
        score:
          courseGrade && courseGrade.midterm != null
            ? courseGrade.midterm
            : null,
      },
      {
        key: 'final',
        name: 'Thi kết thúc học phần',
        weight: 60,
        score:
          courseGrade && courseGrade.final != null ? courseGrade.final : null,
      },
    ];
  }, [courseGrade]);

  const handleToggle = async (item) => {
    try {
      await toggleAssignment(item.id);
    } catch (toggleError) {
      Alert.alert(
        'Không thể cập nhật',
        toggleError.message || 'Vui lòng thử lại sau.',
      );
    }
  };

  if (courseQuery.loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (courseQuery.error && !course) {
    return (
      <ScreenContainer>
        <ErrorView
          message={courseQuery.error.message}
          onRetry={courseQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  if (!course) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Không tìm thấy môn học"
          description="Môn học không tồn tại hoặc đã bị xóa."
        />
      </ScreenContainer>
    );
  }

  const { progress, completedLessons, totalLessons } = resolveProgress(course);
  const primaryRoom =
    course.room ||
    (courseSessions.length > 0 ? courseSessions[0].room : 'Theo lịch tuần');
  const scheduleSummary =
    course.scheduleSummary ||
    (courseSessions.length > 0
      ? courseSessions
          .map(
            (s) => `${getDayName(s.dayOfWeek)} (${s.startTime}-${s.endTime})`,
          )
          .join(' • ')
      : 'Đang cập nhật lịch học');
  const syllabusList = Array.isArray(course.syllabus)
    ? course.syllabus
    : courseSessions
        .map((s) => s.lessonTopic || s.note)
        .filter(Boolean);

  return (
    <ScreenContainer scroll>
      {/* 1. Banner thông tin môn học */}
      <View style={styles.heroCard}>
        <View style={styles.heroInner}>
          <View style={styles.codeRow}>
            <View style={styles.badgeGroup}>
              <View style={styles.codeBadge}>
                <Text style={styles.code}>{course.code}</Text>
              </View>
              {course.semester ? (
                <View style={styles.semesterBadge}>
                  <Text style={styles.semesterText}>{course.semester}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.creditsBadge}>
              <Text style={styles.credits}>{course.credits} tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.name}>{course.name}</Text>

          <View style={styles.progressBox}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressTitle}>Tiến độ học phần</Text>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressSub}>
              Đã hoàn thành {completedLessons} trên tổng số {totalLessons} buổi
              học
            </Text>
          </View>

          <Text style={styles.subSectionTitle}>
            Thông tin giảng dạy & Lớp học
          </Text>
          <InfoRow label="Giảng viên" value={course.lecturer} />
          <InfoRow label="Email liên hệ" value={buildLecturerEmail(course)} />
          <InfoRow label="Phòng học" value={primaryRoom} />
          <InfoRow label="Học kỳ" value={course.semester} />
          <InfoRow label="Số tín chỉ" value={`${course.credits} tín chỉ`} />
          <InfoRow label="Lịch tuần" value={scheduleSummary} />
        </View>
      </View>

      {/* 2. Bảng tỷ lệ đánh giá học phần chuẩn PTIT */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Icon name="graduation" color={colors.primary} size={20} />
            <Text style={styles.cardSectionTitle}>
              Tỷ lệ đánh giá học phần (Chuẩn PTIT)
            </Text>
          </View>
          {courseGrade && courseGrade.letter ? (
            <View style={styles.gradeLetterBadge}>
              <Text style={styles.gradeLetterText}>
                Điểm chữ: {courseGrade.letter}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.componentsList}>
          {evaluationRows.map((row) => (
            <View key={row.key} style={styles.componentItem}>
              <View style={styles.componentLeft}>
                <View style={styles.bulletDot} />
                <Text style={styles.componentName}>{row.name}</Text>
              </View>
              <View style={styles.componentRight}>
                {row.score !== null ? (
                  <View style={styles.scorePill}>
                    <Text style={styles.scoreText}>Điểm: {row.score}</Text>
                  </View>
                ) : (
                  <Text style={styles.scorePendingText}>Chưa có điểm</Text>
                )}
                <View style={styles.weightBadge}>
                  <Text style={styles.weightText}>{row.weight}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {courseGrade && courseGrade.total != null ? (
          <View style={styles.totalGradeSummary}>
            <Text style={styles.totalGradeLabel}>
              Điểm tổng kết học phần (Hệ 10):
            </Text>
            <Text style={styles.totalGradeValue}>
              {courseGrade.total} ({courseGrade.letter || '--'})
            </Text>
          </View>
        ) : null}
      </View>

      {/* 3. Đề cương / Nội dung tóm tắt học phần */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleWrap}>
          <Icon name="book" color={colors.primary} size={20} />
          <Text style={styles.cardSectionTitle}>
            Đề cương & Nội dung tóm tắt học phần
          </Text>
        </View>
        <Text style={styles.description}>
          {course.description ||
            'Học phần trang bị kiến thức nền tảng và kỹ năng thực hành theo chuẩn đầu ra chương trình đào tạo Học viện Công nghệ Bưu chính Viễn thông.'}
        </Text>
        {syllabusList.length > 0 ? (
          <View style={styles.syllabusBox}>
            <Text style={styles.syllabusHeading}>
              Chủ đề thực hành / trọng tâm:
            </Text>
            {syllabusList.map((topic, idx) => (
              <View key={`${idx}-${topic}`} style={styles.syllabusRow}>
                <View style={styles.syllabusDot} />
                <Text style={styles.syllabusText}>{topic}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {/* 4. Danh sách Lịch học trong tuần của môn */}
      <View style={styles.listSectionHeader}>
        <Text style={styles.sectionTitle}>
          Lịch học trong tuần ({courseSessions.length})
        </Text>
      </View>
      {courseSessions.length > 0 ? (
        courseSessions.map((session) => (
          <SessionCard
            key={String(session.id)}
            session={session}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: session.id })
            }
          />
        ))
      ) : (
        <View style={styles.emptyBlock}>
          <Text style={styles.mutedText}>Chưa có lịch học cho môn này.</Text>
        </View>
      )}

      {/* 5. Danh sách Bài tập của môn */}
      <View style={styles.listSectionHeader}>
        <Text style={styles.sectionTitle}>
          Bài tập của môn ({courseAssignments.length})
        </Text>
      </View>
      {courseAssignments.length > 0 ? (
        courseAssignments.map((item) => (
          <AssignmentItem
            key={String(item.id)}
            assignment={item}
            pending={
              Boolean(item._pending) ||
              pendingActionIds.includes(String(item.id))
            }
            onToggleStatus={() => handleToggle(item)}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
          />
        ))
      ) : (
        <View style={styles.emptyBlock}>
          <Text style={styles.mutedText}>
            Không có bài tập nào được giao cho môn này.
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroInner: {
    padding: spacing.lg,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
    flex: 1,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  code: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  semesterBadge: {
    backgroundColor: colors.chip,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  semesterText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  creditsBadge: {
    backgroundColor: colors.accentLight,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  credits: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  name: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.md,
  },
  progressBox: {
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  progressPercent: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  progressTrack: {
    height: spacing.xs + spacing.xxs,
    backgroundColor: colors.borderStrong,
    borderRadius: spacing.radiusSm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusSm,
  },
  progressSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  subSectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  cardSectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  gradeLetterBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  gradeLetterText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  componentsList: {
    gap: spacing.xs,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  componentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bulletDot: {
    width: spacing.xs + spacing.xxs,
    height: spacing.xs + spacing.xxs,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  componentName: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  componentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scorePill: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
  },
  scoreText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  scorePendingText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  weightBadge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radiusSm,
    minWidth: spacing.huge,
    alignItems: 'center',
  },
  weightText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.info,
  },
  totalGradeSummary: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalGradeLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primaryDark,
  },
  totalGradeValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.md,
  },
  syllabusBox: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.xs,
  },
  syllabusHeading: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xxs,
  },
  syllabusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  syllabusDot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.accent,
  },
  syllabusText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    flex: 1,
  },
  listSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  emptyBlock: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusMd,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  mutedText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
});
