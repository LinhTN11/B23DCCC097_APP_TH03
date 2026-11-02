import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import sessionService from '../../api/sessionService';
import { useAppData } from '../../context/AppDataContext';
import useCachedQuery from '../../hooks/useCachedQuery';
import { getDayName } from '../../utils/date';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import InfoRow from '../../components/profile/InfoRow';

function inferBuilding(room = '') {
  const parts = String(room).split('-');
  if (parts.length > 1) {
    return `Tòa nhà ${parts[1].trim()} - Học viện Công nghệ Bưu chính Viễn thông`;
  }
  return 'Cơ sở đào tạo Hà Đông - PTIT';
}

function resolveSessionType(session) {
  if (session.type) {
    return session.type;
  }
  const text = String(session.lessonTopic || session.note || '').toLowerCase();
  if (text.includes('thực hành') || text.includes('lab')) {
    return 'Thực hành';
  }
  return 'Lý thuyết';
}

export default function SessionDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { courses } = useAppData();
  const { data, loading, error, refresh } = useCachedQuery(
    `session:${id}`,
    () => sessionService.getById(id),
  );
  const allSessionsQuery = useCachedQuery('sessions', () =>
    sessionService.getAll(),
  );

  const session = useMemo(() => {
    const raw =
      data ||
      (allSessionsQuery.data || []).find(
        (item) => String(item.id) === String(id),
      );
    if (!raw) {
      return null;
    }
    const matchedCourse =
      raw.course ||
      (courses || []).find((c) => String(c.id) === String(raw.courseId)) ||
      null;
    return {
      ...raw,
      course: matchedCourse,
    };
  }, [data, allSessionsQuery.data, courses, id]);

  useEffect(() => {
    if (session && session.course && session.course.name) {
      navigation.setOptions({ title: session.course.name });
    }
  }, [session, navigation]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={refresh} />
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Không tìm thấy buổi học"
          description="Buổi học không tồn tại hoặc đã bị xóa."
        />
      </ScreenContainer>
    );
  }

  const course = session.course;
  const courseCode = (course && course.code) || '--';
  const courseName = (course && course.name) || 'Buổi học';
  const courseCredits =
    course && course.credits != null ? `${course.credits} tín chỉ` : '--';
  const lecturer = (course && course.lecturer) || 'Đang cập nhật';
  const sessionType = resolveSessionType(session);
  const isPractice = sessionType === 'Thực hành';
  const building = session.building || inferBuilding(session.room);
  const lessonTopic =
    session.lessonTopic ||
    session.note ||
    `Nội dung học tập học phần ${courseName}`;
  const targetCourseId = session.courseId || (course && course.id);

  return (
    <ScreenContainer scroll>
      {/* 1. Thẻ Thời gian & Ca học */}
      <View style={styles.heroCard}>
        <View style={styles.heroBody}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.code}>{courseCode}</Text>
            </View>
            <View
              style={[
                styles.typeBadge,
                isPractice ? styles.typeBadgePractice : styles.typeBadgeTheory,
              ]}>
              <Text
                style={[
                  styles.typeText,
                  isPractice ? styles.typeTextPractice : styles.typeTextTheory,
                ]}>
                {sessionType}
              </Text>
            </View>
          </View>

          <Text style={styles.courseName}>{courseName}</Text>

          <View style={styles.heroTimeBanner}>
            <View style={styles.timeItem}>
              <Icon name="calendar" color={colors.primary} size={18} />
              <Text style={styles.heroTimeText}>
                {getDayName(session.dayOfWeek)}
              </Text>
            </View>
            <Text style={styles.dotSeparator}>•</Text>
            <View style={styles.timeItem}>
              <Icon name="clock" color={colors.primary} size={18} />
              <Text style={styles.heroTimeText}>
                {session.startTime} - {session.endTime}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Thẻ Địa điểm & Phòng học */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Địa điểm & Phòng học</Text>
        <View style={styles.featureRow}>
          <View style={styles.iconCircle}>
            <Icon name="map-pin" color={colors.primary} size={22} />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureLabel}>Phòng học trực tiếp</Text>
            <Text style={styles.roomHighlight}>
              {session.room || 'Chưa xếp phòng'}
            </Text>
            <Text style={styles.buildingSub}>{building}</Text>
          </View>
        </View>
      </View>

      {/* 3. Thẻ Giảng viên & Học phần */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Giảng viên & Học phần</Text>
        <View style={styles.featureRow}>
          <View style={styles.iconCircle}>
            <Icon name="person" color={colors.primary} size={22} />
          </View>
          <View style={styles.featureTextCol}>
            <Text style={styles.featureLabel}>Giảng viên phụ trách</Text>
            <Text style={styles.lecturerName}>{lecturer}</Text>
          </View>
        </View>
        <View style={{ height: spacing.sm }} />
        <InfoRow label="Tên môn học" value={courseName} />
        <InfoRow label="Mã học phần" value={courseCode} />
        <InfoRow label="Số tín chỉ" value={courseCredits} />
        <InfoRow label="Loại hình" value={sessionType} />
      </View>

      {/* 4. Thẻ Nội dung & Ghi chú buổi học */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Chủ đề & Ghi chú buổi học</Text>
        <View style={styles.topicContainer}>
          <Text style={styles.topicLabel}>Chủ đề / Nội dung chính:</Text>
          <Text style={styles.topicTitle}>{lessonTopic}</Text>
        </View>
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Lưu ý cho sinh viên:</Text>
          <Text style={styles.notesText}>
            {session.note ||
              'Đi học đúng giờ, mang theo thẻ sinh viên và chuẩn bị tài liệu trước khi lên lớp.'}
          </Text>
        </View>
      </View>

      {/* 5. Nút điều hướng sang Chi tiết môn học */}
      {targetCourseId ? (
        <Pressable
          onPress={() =>
            navigation.navigate(ROUTES.COURSE_DETAIL, { id: targetCourseId })
          }
          accessibilityRole="button"
          accessibilityLabel={`Xem thông tin môn học ${courseName}`}
          style={({ pressed }) => [
            styles.linkCard,
            pressed ? styles.pressed : null,
          ]}>
          <View style={styles.linkIconWrap}>
            <Icon name="book" color={colors.primary} size={22} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Xem thông tin môn học</Text>
            <Text style={styles.linkSub}>
              Đề cương, tỷ lệ điểm PTIT và danh sách bài tập của {courseCode}
            </Text>
          </View>
          <Icon name="chevron-right" color={colors.textMuted} size={20} />
        </Pressable>
      ) : (
        <AppButton
          title="Quay lại thời khóa biểu"
          variant="outline"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Quay lại thời khóa biểu"
        />
      )}
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
  typeBadge: {
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  typeBadgePractice: {
    backgroundColor: colors.infoLight,
  },
  typeBadgeTheory: {
    backgroundColor: colors.accentLight,
  },
  typeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  typeTextPractice: {
    color: colors.info,
  },
  typeTextTheory: {
    color: colors.primaryDark,
  },
  courseName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing.md,
  },
  heroTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    flexWrap: 'wrap',
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroTimeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  dotSeparator: {
    marginHorizontal: spacing.sm,
    color: colors.primaryDark,
    fontWeight: typography.weights.bold,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: spacing.touch,
    height: spacing.touch,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureTextCol: {
    flex: 1,
  },
  featureLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  roomHighlight: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: spacing.xxs,
  },
  buildingSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  lecturerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: spacing.xxs,
  },
  topicContainer: {
    backgroundColor: colors.cardAlt,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
  },
  topicLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  topicTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    lineHeight: typography.lineHeights.md,
  },
  notesContainer: {
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  notesLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.warning,
    marginBottom: spacing.xxs,
  },
  notesText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    lineHeight: typography.lineHeights.md,
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
