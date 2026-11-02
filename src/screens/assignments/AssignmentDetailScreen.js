import React, { useEffect, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import assignmentService from '../../api/assignmentService';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import {
  daysLeft,
  formatDate,
  formatDateTime,
  isOverdue,
} from '../../utils/date';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import Icon from '../../components/common/Icon';
import InfoRow from '../../components/profile/InfoRow';

function getRemainingLabel(dueDate, done) {
  if (done) {
    return 'Đã nộp / Hoàn thành';
  }
  if (isOverdue(dueDate)) {
    return 'Đã quá hạn nộp';
  }
  const remaining = daysLeft(dueDate);
  if (remaining <= 0) {
    return 'Hạn nộp trong hôm nay';
  }
  if (remaining === 1) {
    return 'Còn 1 ngày (Sắp đến hạn)';
  }
  return `Còn ${remaining} ngày`;
}

export default function AssignmentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { assignments, courses, toggleAssignment } = useAppData();
  const { pendingActionIds } = useSync();
  const isLocal = String(id).startsWith('local-');
  const query = useCachedQuery(
    `assignment:${id}`,
    () => assignmentService.getById(id),
    { enabled: !isLocal },
  );

  const contextAssignment = useMemo(
    () => assignments.find((item) => String(item.id) === String(id)),
    [assignments, id],
  );
  const rawAssignment = contextAssignment || query.data;

  const assignment = useMemo(() => {
    if (!rawAssignment) {
      return null;
    }
    const matchedCourse =
      rawAssignment.course ||
      (courses || []).find(
        (c) => String(c.id) === String(rawAssignment.courseId),
      ) ||
      null;
    return {
      ...rawAssignment,
      course: matchedCourse,
    };
  }, [rawAssignment, courses]);

  const pending =
    Boolean(assignment && assignment._pending) ||
    pendingActionIds.includes(String(id));

  useEffect(() => {
    if (assignment && assignment.title) {
      navigation.setOptions({ title: assignment.title });
    }
  }, [assignment, navigation]);

  const handleToggle = async () => {
    try {
      await toggleAssignment(id);
    } catch (toggleError) {
      Alert.alert(
        'Không thể cập nhật',
        toggleError.message || 'Vui lòng thử lại sau.',
      );
    }
  };

  if (!isLocal && query.loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!isLocal && query.error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={query.error.message} onRetry={query.refresh} />
      </ScreenContainer>
    );
  }

  if (!assignment) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Không tìm thấy bài tập"
          description="Bài tập không tồn tại hoặc đã bị xóa."
        />
      </ScreenContainer>
    );
  }

  const done = assignment.status === 'done';
  const overdue = !done && isOverdue(assignment.dueDate);
  const remainingDays = daysLeft(assignment.dueDate);
  const isUrgent = !done && (overdue || remainingDays <= 2);
  const course = assignment.course;
  const courseName = (course && course.name) || 'Môn học';
  const courseCode = (course && course.code) || 'HP';
  const targetCourseId = assignment.courseId || (course && course.id);
  const submissionFormat =
    assignment.submissionFormat ||
    'Nộp mã nguồn qua GitHub repository và báo cáo PDF trên hệ thống LMS PTIT trước thời hạn.';

  return (
    <ScreenContainer scroll>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroBody}>
          <View style={styles.statusRow}>
            <View style={styles.badgeGroup}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeBadgeText}>{courseCode}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  done
                    ? styles.doneBadge
                    : overdue
                    ? styles.overdueBadge
                    : styles.todoBadge,
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    done
                      ? styles.doneText
                      : overdue
                      ? styles.overdueBadgeText
                      : styles.todoText,
                  ]}>
                  {done ? 'Đã hoàn thành' : overdue ? 'Quá hạn' : 'Chưa xong'}
                </Text>
              </View>
              <View
                style={[
                  styles.priorityBadge,
                  isUrgent ? styles.priorityHigh : styles.priorityNormal,
                ]}>
                <Text
                  style={[
                    styles.priorityText,
                    isUrgent
                      ? styles.priorityHighText
                      : styles.priorityNormalText,
                  ]}>
                  {isUrgent ? 'Ưu tiên cao' : 'Bình thường'}
                </Text>
              </View>
            </View>
            <SyncBadge pending={pending} />
          </View>

          <Text style={styles.title}>{assignment.title}</Text>
          <Text style={styles.courseName}>{courseName}</Text>

          <View
            style={[
              styles.dueBanner,
              done
                ? styles.dueBannerDone
                : overdue
                ? styles.dueBannerOverdue
                : null,
            ]}>
            <Icon
              name={overdue ? 'alert' : done ? 'check-circle' : 'clock'}
              color={
                done
                  ? colors.success
                  : overdue
                  ? colors.danger
                  : colors.primary
              }
              size={18}
              filled={done}
            />
            <View style={styles.dueTextWrap}>
              <Text
                style={[
                  styles.dueMainText,
                  done ? styles.dueMainDone : null,
                  overdue ? styles.dueMainOverdue : null,
                ]}>
                Hạn nộp: {formatDateTime(assignment.dueDate)}
              </Text>
              <Text style={styles.dueSubText}>
                {getRemainingLabel(assignment.dueDate, done)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Nút đổi trạng thái ngay tại màn chi tiết */}
      <View style={styles.toggleBtnWrap}>
        <AppButton
          title={
            done
              ? 'Đã hoàn thành • Đánh dấu chưa xong'
              : 'Đánh dấu đã hoàn thành'
          }
          onPress={handleToggle}
          variant={done ? 'outline' : 'primary'}
          accessibilityLabel={
            done ? 'Đánh dấu bài tập chưa xong' : 'Đánh dấu bài tập đã xong'
          }
        />
      </View>

      {/* Thông tin thời hạn & môn học */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
        <InfoRow
          label="Trạng thái"
          value={done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        />
        <InfoRow label="Môn học" value={`${courseCode} - ${courseName}`} />
        <InfoRow label="Ngày đến hạn" value={formatDate(assignment.dueDate)} />
        <InfoRow
          label="Thời gian còn lại"
          value={getRemainingLabel(assignment.dueDate, done)}
        />
        <InfoRow
          label="Cập nhật gần nhất"
          value={formatDateTime(assignment.updatedAt) || '--'}
        />
      </View>

      {/* Mô tả & Yêu cầu chi tiết */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mô tả & Yêu cầu bài tập</Text>
        <Text style={styles.description}>
          {assignment.description ||
            'Hoàn thành đầy đủ các yêu cầu của bài tập theo hướng dẫn của giảng viên phụ trách.'}
        </Text>
      </View>

      {/* Hình thức nộp bài */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hình thức nộp bài</Text>
        <View style={styles.formatBox}>
          <Text style={styles.formatText}>{submissionFormat}</Text>
        </View>
      </View>

      {/* Liên kết sang môn học */}
      {targetCourseId ? (
        <Pressable
          onPress={() =>
            navigation.navigate(ROUTES.COURSE_DETAIL, { id: targetCourseId })
          }
          accessibilityRole="button"
          accessibilityLabel={`Xem môn học ${courseName}`}
          style={({ pressed }) => [
            styles.linkCard,
            pressed ? styles.pressed : null,
          ]}>
          <View style={styles.linkIconWrap}>
            <Icon name="book" color={colors.primary} size={20} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Xem môn học {courseCode}</Text>
            <Text style={styles.linkSub}>{courseName}</Text>
          </View>
          <Icon name="chevron-right" color={colors.textMuted} size={20} />
        </Pressable>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  heroBody: {
    padding: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    flex: 1,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  codeBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  statusBadge: {
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  doneBadge: {
    backgroundColor: colors.successLight,
  },
  todoBadge: {
    backgroundColor: colors.warningLight,
  },
  overdueBadge: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  doneText: {
    color: colors.success,
  },
  todoText: {
    color: colors.warning,
  },
  overdueBadgeText: {
    color: colors.danger,
  },
  priorityBadge: {
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  priorityHigh: {
    backgroundColor: colors.danger,
  },
  priorityNormal: {
    backgroundColor: colors.chip,
  },
  priorityText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  priorityHighText: {
    color: colors.white,
  },
  priorityNormalText: {
    color: colors.textSecondary,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.xs,
  },
  courseName: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  dueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    gap: spacing.sm,
  },
  dueBannerDone: {
    backgroundColor: colors.successLight,
  },
  dueBannerOverdue: {
    backgroundColor: colors.dangerLight,
  },
  dueTextWrap: {
    flex: 1,
  },
  dueMainText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  dueMainDone: {
    color: colors.success,
  },
  dueMainOverdue: {
    color: colors.danger,
  },
  dueSubText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  toggleBtnWrap: {
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.lg,
  },
  formatBox: {
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  formatText: {
    fontSize: typography.sizes.sm,
    color: colors.primaryDark,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.medium,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    minHeight: spacing.touch,
    marginBottom: spacing.md,
  },
  pressed: {
    opacity: 0.86,
  },
  linkIconWrap: {
    width: spacing.touch,
    height: spacing.touch,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  linkSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
});
