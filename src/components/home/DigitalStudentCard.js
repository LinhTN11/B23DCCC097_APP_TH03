import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

const BARCODE_WIDTHS = [3, 1.5, 4, 2, 5, 1.5, 3, 2, 4, 1.5, 3, 5, 2, 3, 1.5, 4];

/**
 * Props bắt buộc:
 * - student: thông tin sinh viên {fullName, studentCode, className, major, faculty, academicYear}.
 * - onOpenCardModal: callback mở Modal Thẻ sinh viên điện tử toàn màn hình.
 * - onOpenGrades: callback mở màn Bảng điểm GPA.
 * Props tùy chọn:
 * - gpaInfo: {gpa, totalCredits, gpaCredits} từ calcGpa.
 * - todoCount: số bài tập chưa hoàn thành.
 */
function DigitalStudentCard({
  student,
  gpaInfo = { gpa: 0, totalCredits: 0 },
  todoCount = 0,
  onOpenCardModal,
  onOpenGrades,
}) {
  const fullName = (student && student.fullName) || 'Nguyễn Văn An';
  const studentCode = (student && student.studentCode) || 'B21DCCN088';
  const className = (student && student.className) || 'D21CQCN01-B';
  const major = (student && student.major) || 'Công nghệ thông tin';
  const faculty = (student && student.faculty) || 'Khoa Công nghệ thông tin 1';
  const gpaValue = Number(gpaInfo && gpaInfo.gpa ? gpaInfo.gpa : 0).toFixed(2);
  const creditsEarned = Number(
    (gpaInfo && gpaInfo.totalCredits) || (student && student.totalCredits) || 0,
  );
  const academicRank =
    Number(gpaValue) >= 3.6
      ? 'Xuất sắc'
      : Number(gpaValue) >= 3.2
      ? 'Giỏi'
      : Number(gpaValue) >= 2.5
      ? 'Khá'
      : 'Trung bình';

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.brandRow}>
            <View style={styles.accentDot} />
            <Text style={styles.brandTitle}>THẺ SINH VIÊN ĐIỆN TỬ • PTIT</Text>
          </View>
          <View style={styles.verifiedPill}>
            <Icon name="verified" color={colors.white} size={13} />
            <Text style={styles.verifiedText}>Đang theo học chính khóa</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoColumn}>
            <Text style={styles.studentName}>{fullName.toUpperCase()}</Text>
            <Text style={styles.studentCode}>MSSV: {studentCode}</Text>
            <Text style={styles.studentMeta} numberOfLines={1}>
              Lớp: {className} • {major}
            </Text>
            <Text style={styles.studentFaculty} numberOfLines={1}>
              {faculty}
            </Text>

            <View style={styles.barcodeRow}>
              {BARCODE_WIDTHS.map((width, index) => (
                <View
                  key={`bar-${index}`}
                  style={[styles.barcodeLine, { width }]}
                />
              ))}
              <Text style={styles.barcodeLabel}>{studentCode}</Text>
            </View>
          </View>

          <Pressable
            onPress={onOpenCardModal}
            accessibilityRole="button"
            accessibilityLabel="Mở thẻ sinh viên điện tử toàn màn hình và mã QR"
            style={({ pressed }) => [
              styles.qrBox,
              pressed ? styles.pressed : null,
            ]}>
            <Icon name="qr" color={colors.primaryDark} size={28} />
            <Text style={styles.qrText}>Mã QR</Text>
          </Pressable>
        </View>

        <View style={styles.cardActions}>
          <Pressable
            onPress={onOpenCardModal}
            accessibilityRole="button"
            accessibilityLabel="Xem thẻ sinh viên toàn màn hình"
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionPrimary,
              pressed ? styles.pressed : null,
            ]}>
            <Icon name="barcode" color={colors.primaryDark} size={16} />
            <Text style={styles.actionPrimaryText}>Mở thẻ SV điện tử</Text>
          </Pressable>

          <Pressable
            onPress={onOpenGrades}
            accessibilityRole="button"
            accessibilityLabel={`Xem bảng điểm GPA hiện tại ${gpaValue}`}
            style={({ pressed }) => [
              styles.actionButton,
              styles.actionSecondary,
              pressed ? styles.pressed : null,
            ]}>
            <Icon name="graduation" color={colors.white} size={16} />
            <Text style={styles.actionSecondaryText}>
              Bảng điểm (GPA {gpaValue})
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsBar}>
        <Pressable
          onPress={onOpenGrades}
          accessibilityRole="button"
          accessibilityLabel={`GPA tích lũy ${gpaValue} trên 4.0, xếp loại ${academicRank}`}
          style={styles.statCol}>
          <Text style={styles.statLabel}>GPA Tích lũy</Text>
          <View style={styles.statValueRow}>
            <Text style={styles.statValuePrimary}>{gpaValue}</Text>
            <Text style={styles.statUnit}>/4.0</Text>
          </View>
          <View style={styles.rankChip}>
            <Text style={styles.rankChipText}>Học lực: {academicRank}</Text>
          </View>
        </Pressable>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Tín chỉ tích lũy</Text>
          <Text style={styles.statValue}>{creditsEarned}</Text>
          <Text style={styles.statSub}>Đã tính điểm</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Bài tập chờ</Text>
          <Text
            style={[
              styles.statValue,
              todoCount > 0 ? styles.statValueDanger : null,
            ]}>
            {todoCount}
          </Text>
          <Text style={styles.statSub}>Chưa hoàn thành</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.primaryDark,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.16)',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  brandTitle: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.4,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radiusSm,
    gap: 4,
  },
  verifiedText: {
    color: colors.white,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoColumn: {
    flex: 1,
  },
  studentName: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.3,
  },
  studentCode: {
    color: colors.accentLight,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xxs,
  },
  studentMeta: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  studentFaculty: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 2,
  },
  barcodeLine: {
    height: 16,
    backgroundColor: colors.white,
    opacity: 0.85,
  },
  barcodeLabel: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.xs,
  },
  qrBox: {
    minWidth: 74,
    minHeight: 74,
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: spacing.xxs,
  },
  qrText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  actionButton: {
    flex: 1,
    minHeight: spacing.touch,
    borderRadius: spacing.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  actionPrimary: {
    backgroundColor: colors.accentLight,
  },
  actionPrimaryText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  actionSecondary: {
    backgroundColor: colors.primary,
  },
  actionSecondaryText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing.touch,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.semibold,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  statValuePrimary: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  },
  statUnit: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginLeft: 2,
  },
  statValue: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    marginTop: 2,
  },
  statValueDanger: {
    color: colors.danger,
  },
  statSub: {
    color: colors.textMuted,
    fontSize: typography.sizes.xxs,
    marginTop: 2,
  },
  rankChip: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
    marginTop: 4,
  },
  rankChipText: {
    color: colors.success,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default DigitalStudentCard;
