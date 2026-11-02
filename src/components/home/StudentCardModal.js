import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

const BARCODE_BARS = [
  3, 1.5, 4, 2, 3, 1.5, 5, 2, 1.5, 4, 3, 2, 4, 1.5, 3, 2, 5, 1.5, 3, 2, 4, 1.5,
  3, 2,
];

/**
 * Props bắt buộc:
 * - visible: boolean hiển thị modal.
 * - student: thông tin sinh viên.
 * - onClose: callback đóng modal.
 */
function StudentCardModal({ visible, student, onClose }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, 24);
  const fullName = (student && student.fullName) || 'Nguyễn Văn An';
  const studentCode = (student && student.studentCode) || 'B21DCCN088';
  const className = (student && student.className) || 'D21CQCN01-B';
  const major = (student && student.major) || 'Công nghệ thông tin';
  const email = (student && student.email) || 'an.nv@stu.ptit.edu.vn';
  const initial =
    fullName.trim().charAt(fullName.trim().lastIndexOf(' ') + 1) || 'A';

  return (
    <Modal
      visible={Boolean(visible)}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      <View style={styles.container}>
        <View style={[styles.modalHeader, { paddingTop: topInset + spacing.xs }]}>
          <View style={styles.modalHeaderTitleCol}>
            <Text style={styles.modalTitle}>Thẻ sinh viên số PTIT</Text>
            <Text style={styles.modalSub}>
              Sử dụng khi ra vào cổng Học viện, thư viện và phòng thi
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Đóng thẻ sinh viên điện tử"
            style={({ pressed }) => [
              styles.closeButton,
              pressed ? styles.pressed : null,
            ]}>
            <Icon name="close" color={colors.text} size={22} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.idCard}>
            <View style={styles.idCardTop}>
              <Text style={styles.schoolName}>
                BỘ THÔNG TIN VÀ TRUYỀN THÔNG
              </Text>
              <Text style={styles.academyName}>
                HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
              </Text>
              <View style={styles.cardTypeBadge}>
                <Text style={styles.cardTypeText}>
                  THẺ SINH VIÊN ĐIỆN TỬ • S-LINK ID
                </Text>
              </View>
            </View>

            <View style={styles.idCardBody}>
              <View style={styles.photoColumn}>
                <View style={styles.photoFrame}>
                  {student && student.avatarUrl ? (
                    <Image
                      source={{ uri: student.avatarUrl }}
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require('../../assets/ptit_logo.png')}
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <View style={styles.qrFrame}>
                  <Icon name="qr" color={colors.primaryDark} size={46} />
                  <Text style={styles.qrCaption}>PTIT VERIFIED</Text>
                </View>
              </View>

              <View style={styles.detailsColumn}>
                <Text style={styles.fieldLabel}>HỌ VÀ TÊN SINH VIÊN</Text>
                <Text style={styles.studentName}>{fullName.toUpperCase()}</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Mã SV:</Text>
                  <Text style={styles.detailValueHighlight}>{studentCode}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Lớp:</Text>
                  <Text style={styles.detailValue}>{className}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Ngành:</Text>
                  <Text style={styles.detailValue}>{major}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Khoa:</Text>
                  <Text style={styles.detailValue}>Công nghệ thông tin 1</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Khóa học:</Text>
                  <Text style={styles.detailValue}>2021 - 2026 (Chính quy)</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Email:</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {email}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.barcodeContainer}>
              <View style={styles.barcodeGraphic}>
                {BARCODE_BARS.map((barWidth, index) => (
                  <View
                    key={`modal-bar-${index}`}
                    style={[styles.barcodeBar, { width: barWidth }]}
                  />
                ))}
              </View>
              <Text style={styles.barcodeCode}>*{studentCode}*</Text>
            </View>

            <View style={styles.idCardFooter}>
              <Icon
                name="check-circle"
                color={colors.success}
                size={18}
                filled
              />
              <Text style={styles.footerStatusText}>
                Trạng thái thẻ: Hợp lệ • Đang theo học chính khóa
              </Text>
            </View>
          </View>

          <View style={styles.guideBox}>
            <Text style={styles.guideTitle}>Hướng dẫn sử dụng thẻ điện tử</Text>
            <Text style={styles.guideItem}>
              • Xuất trình mã QR/Barcode tại cổng kiểm soát ra vào cơ sở Hà Đông
              và cơ sở Ngọc Trục.
            </Text>
            <Text style={styles.guideItem}>
              • Dùng để mượn giáo trình tại Trung tâm Thông tin Thư viện PTIT.
            </Text>
            <Text style={styles.guideItem}>
              • Thẻ có giá trị tương đương thẻ nhựa khi dự thi kết thúc học phần.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.card,
  },
  modalHeaderTitleCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  modalSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.chip,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  idCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusXl,
    borderWidth: 2,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  idCardTop: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  schoolName: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.6,
  },
  academyName: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    textAlign: 'center',
    marginTop: 2,
  },
  cardTypeBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: spacing.radiusSm,
    marginTop: spacing.sm,
  },
  cardTypeText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.5,
  },
  idCardBody: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  photoColumn: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoFrame: {
    width: 84,
    height: 104,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: spacing.radiusMd,
  },
  photoInitial: {
    color: colors.primary,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.extrabold,
  },
  qrFrame: {
    width: 84,
    paddingVertical: spacing.xs,
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
  },
  qrCaption: {
    fontSize: 8,
    fontWeight: typography.weights.extrabold,
    color: colors.primaryDark,
    marginTop: 2,
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: typography.sizes.xxs,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
  },
  studentName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailKey: {
    width: 68,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  detailValue: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: colors.text,
    fontWeight: typography.weights.bold,
  },
  detailValueHighlight: {
    fontSize: typography.sizes.sm,
    color: colors.primaryDark,
    fontWeight: typography.weights.extrabold,
  },
  barcodeContainer: {
    backgroundColor: colors.cardAlt,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
  },
  barcodeGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    gap: 3,
  },
  barcodeBar: {
    height: 34,
    backgroundColor: colors.text,
  },
  barcodeCode: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    letterSpacing: 3,
    marginTop: spacing.xs,
  },
  idCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successLight,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  footerStatusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  guideBox: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  guideTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  guideItem: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.md,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default StudentCardModal;
