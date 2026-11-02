import React, { useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { calcGpa } from '../../utils/gpa';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';

function calcWeightedGpa10(grades = [], courses = []) {
  const courseMap = new Map(
    courses.map((course) => [String(course.id), course]),
  );
  let weightedSum = 0;
  let totalWeight = 0;
  grades.forEach((grade) => {
    const course = courseMap.get(String(grade.courseId)) || grade.course;
    const credits =
      Number(course && course.credits ? course.credits : grade.credits) || 0;
    const score10 = Number(grade.total);
    if (credits > 0 && Number.isFinite(score10)) {
      weightedSum += score10 * credits;
      totalWeight += credits;
    }
  });
  return totalWeight === 0 ? 0 : Math.round((weightedSum / totalWeight) * 100) / 100;
}

export default function ProfileScreen({ navigation }) {
  const {
    student,
    grades,
    courses,
    loading,
    error,
    refreshing,
    lastUpdated,
    refreshAll,
  } = useAppData();
  const { pendingActions } = useSync();
  const pendingProfile = pendingActions.some((action) =>
    String(action.url).includes('/students/'),
  );

  const enrichedGrades = useMemo(() => {
    const courseMap = new Map(
      courses.map((course) => [String(course.id), course]),
    );
    return grades.map((grade) => ({
      ...grade,
      course: grade.course || courseMap.get(String(grade.courseId)) || {},
    }));
  }, [grades, courses]);

  const gpaResult = useMemo(
    () => calcGpa(enrichedGrades, courses),
    [enrichedGrades, courses],
  );
  const gpa10 = useMemo(
    () => calcWeightedGpa10(enrichedGrades, courses),
    [enrichedGrades, courses],
  );
  const recentGrades = useMemo(
    () => enrichedGrades.slice(0, 3),
    [enrichedGrades],
  );

  const avatarInitial = useMemo(() => {
    if (!student || !student.fullName) {
      return 'S';
    }
    const trimmed = student.fullName.trim();
    const lastSpace = trimmed.lastIndexOf(' ');
    return (
      trimmed.charAt(lastSpace >= 0 ? lastSpace + 1 : 0).toUpperCase() || 'S'
    );
  }, [student]);

  const renderGrade = useCallback(
    ({ item }) => (
      <GradeRow
        grade={item}
        onPress={() =>
          navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
        }
      />
    ),
    [navigation],
  );

  const header = (
    <View>
      {/* Thẻ sinh viên điện tử PTIT S-Link */}
      <View style={styles.studentCard}>
        <View style={styles.studentCardHeader}>
          <View style={styles.schoolTitleCol}>
            <Text style={styles.schoolName}>
              HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
            </Text>
            <Text style={styles.cardSubTitle}>THẺ SINH VIÊN ĐIỆN TỬ S-LINK</Text>
          </View>
          <View style={styles.activeStatusBadge}>
            <Icon name="check-circle" color={colors.white} size={13} />
            <Text style={styles.activeStatusText}>
              Đang theo học chính khóa
            </Text>
          </View>
        </View>

        <View style={styles.studentCardBody}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              {student && student.avatarUrl ? (
                <Image
                  source={{ uri: student.avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require('../../assets/ptit_logo.png')}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.verifiedDot}>
              <Icon name="check" color={colors.white} size={11} />
            </View>
          </View>

          <View style={styles.studentCardInfo}>
            <Text style={styles.studentName}>
              {student ? student.fullName : 'Sinh viên PTIT'}
            </Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeLabel}>MSSV:</Text>
              <Text style={styles.codeValue}>
                {student ? student.studentCode : '--'}
              </Text>
            </View>
            <Text style={styles.metaLine}>
              Lớp: {student ? student.className : '--'}
            </Text>
            <Text style={styles.metaLine} numberOfLines={1}>
              Ngành: {student ? student.major : '--'}
            </Text>
            {pendingProfile ? (
              <View style={styles.syncWrap}>
                <SyncBadge pending={pendingProfile} />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.studentCardFooter}>
          <View style={styles.barcodeRow}>
            <View style={[styles.bar, styles.barThin]} />
            <View style={[styles.bar, styles.barMedium]} />
            <View style={[styles.bar, styles.barThin]} />
            <View style={[styles.bar, styles.barWide]} />
            <View style={[styles.bar, styles.barMedium]} />
            <View style={[styles.bar, styles.barWide]} />
            <View style={[styles.bar, styles.barThin]} />
            <View style={[styles.bar, styles.barMedium]} />
            <View style={[styles.bar, styles.barThin]} />
            <View style={[styles.bar, styles.barWide]} />
            <View style={[styles.bar, styles.barMedium]} />
          </View>
          <Text style={styles.footerCodeText}>
            PTIT • {student ? student.studentCode : 'S-LINK'}
          </Text>
        </View>
      </View>

      {/* Khối tổng kết học tập GPA */}
      <GpaSummary
        gpa={gpaResult.gpa}
        totalCredits={gpaResult.totalCredits}
        gpa10={gpa10}
        totalCourses={enrichedGrades.length}
      />

      <Pressable
        onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
        accessibilityRole="button"
        accessibilityLabel="Xem bảng điểm chi tiết"
        style={({ pressed }) => [
          styles.quickTranscriptBtn,
          pressed ? styles.pressed : null,
        ]}>
        <View style={styles.quickTranscriptLeft}>
          <Icon name="book" color={colors.primary} size={18} />
          <Text style={styles.quickTranscriptText}>
            Xem bảng điểm chi tiết ({enrichedGrades.length} học phần)
          </Text>
        </View>
        <Icon name="chevron-right" color={colors.primary} size={18} />
      </Pressable>

      {/* Thông tin hành chính & Đào tạo */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleGroup}>
            <Icon name="graduation" color={colors.primary} size={18} />
            <Text style={styles.cardTitle}>Thông tin hành chính & Đào tạo</Text>
          </View>
        </View>
        <InfoRow
          label="Mã sinh viên"
          value={student ? student.studentCode : '--'}
        />
        <InfoRow
          label="Họ và tên"
          value={student ? student.fullName : '--'}
        />
        <InfoRow
          label="Lớp hành chính"
          value={student ? student.className : '--'}
        />
        <InfoRow
          label="Chuyên ngành"
          value={student ? student.major : '--'}
        />
        <InfoRow
          label="Khoa đào tạo"
          value={
            student && student.faculty
              ? student.faculty
              : 'Khoa Công nghệ thông tin 1'
          }
        />
        <InfoRow
          label="Hệ đào tạo"
          value={
            student && student.trainingSystem
              ? student.trainingSystem
              : 'Đại học chính quy'
          }
        />
        <InfoRow
          label="Niên khóa"
          value={
            student && student.academicYear
              ? student.academicYear
              : '2021 - 2026'
          }
        />
        <InfoRow
          label="Cố vấn học tập"
          value={student && student.advisor ? student.advisor : 'TS. Trần Minh'}
        />
      </View>

      {/* Thông tin liên hệ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleGroup}>
            <Icon name="person" color={colors.primary} size={18} />
            <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            accessibilityRole="button"
            accessibilityLabel="Mở màn hình chỉnh sửa thông tin"
            style={({ pressed }) => [
              styles.inlineEditBtn,
              pressed ? styles.pressed : null,
            ]}>
            <Icon name="edit" color={colors.primary} size={14} />
            <Text style={styles.inlineEditText}>Chỉnh sửa</Text>
          </Pressable>
        </View>
        <InfoRow
          label="Email sinh viên"
          value={student ? student.email : '--'}
        />
        <InfoRow
          label="Số điện thoại"
          value={student ? student.phone : '--'}
        />
        <InfoRow
          label="Quê quán / Địa chỉ"
          value={student && student.hometown ? student.hometown : 'Hà Nội'}
        />
      </View>

      {/* 2 nút hành động chính */}
      <View style={styles.actionsColumn}>
        <AppButton
          title="Xem kết quả học tập (Bảng điểm)"
          onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
          accessibilityLabel="Xem kết quả học tập (Bảng điểm)"
        />
        <AppButton
          title="Chỉnh sửa thông tin cá nhân"
          onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
          variant="outline"
          accessibilityLabel="Chỉnh sửa thông tin cá nhân"
        />
      </View>

      {/* Kết quả học tập gần đây */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Học phần vừa cập nhật điểm</Text>
        <Text style={styles.sectionCount}>{enrichedGrades.length} môn</Text>
      </View>
      <LastUpdatedText timestamp={lastUpdated} />
    </View>
  );

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={() => refreshAll()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={recentGrades}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderGrade}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có kết quả học tập"
            description="Kết quả sẽ xuất hiện khi nhà trường cập nhật điểm."
          />
        }
        refreshing={refreshing}
        onRefresh={() => refreshAll()}
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
  studentCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  studentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
    gap: spacing.sm,
  },
  schoolTitleCol: {
    flex: 1,
  },
  schoolName: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.accentLight,
    letterSpacing: 0.4,
  },
  cardSubTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
    marginTop: spacing.xxs,
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    gap: spacing.xxs,
  },
  activeStatusText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  studentCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: spacing.huge + spacing.xxl,
    height: spacing.huge + spacing.xxl,
    borderRadius: (spacing.huge + spacing.xxl) / 2,
    backgroundColor: colors.white,
    borderWidth: 2.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: (spacing.huge + spacing.xxl) / 2,
  },
  avatarText: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  verifiedDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: spacing.xl / 2,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentCardInfo: {
    flex: 1,
    gap: spacing.xxs,
  },
  studentName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.white,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  codeLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  codeValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.accentLight,
  },
  metaLine: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.88)',
    fontWeight: typography.weights.medium,
  },
  syncWrap: {
    marginTop: spacing.xs,
  },
  studentCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.lg,
    gap: spacing.xxs,
  },
  bar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
  },
  barThin: {
    width: 2,
  },
  barMedium: {
    width: 3,
  },
  barWide: {
    width: 5,
  },
  footerCodeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  quickTranscriptBtn: {
    minHeight: spacing.touch,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickTranscriptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickTranscriptText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  inlineEditBtn: {
    minHeight: spacing.touch,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primaryLight,
    gap: spacing.xs,
  },
  inlineEditText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  actionsColumn: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  sectionCount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
  },
});
