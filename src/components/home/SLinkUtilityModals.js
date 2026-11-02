import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDateTime, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

export const DEFAULT_PORTAL_DATA = {
  exams: [
    {
      id: 'EX001',
      subjectCode: 'INT3120',
      subjectName: 'Phát triển ứng dụng di động',
      examDate: '25/12/2026',
      examTime: 'Ca 2 (09:30 - 11:00)',
      room: 'P.301-A2',
      format: 'Vấn đáp & Báo cáo đồ án',
      seatNumber: 'SBD: 014',
    },
    {
      id: 'EX002',
      subjectCode: 'INT3209',
      subjectName: 'Cơ sở dữ liệu',
      examDate: '28/12/2026',
      examTime: 'Ca 1 (07:30 - 09:00)',
      room: 'Hội trường B2',
      format: 'Tự luận 90 phút',
      seatNumber: 'SBD: 014',
    },
    {
      id: 'EX003',
      subjectCode: 'INT3306',
      subjectName: 'Lập trình web',
      examDate: '02/01/2027',
      examTime: 'Ca 3 (13:30 - 15:00)',
      room: 'Phòng máy 402-A3',
      format: 'Thực hành trên máy',
      seatNumber: 'SBD: 014',
    },
    {
      id: 'EX004',
      subjectCode: 'INT3401',
      subjectName: 'Trí tuệ nhân tạo',
      examDate: '05/01/2027',
      examTime: 'Ca 1 (07:30 - 09:00)',
      room: 'P.201-B2',
      format: 'Trắc nghiệm + Tự luận',
      seatNumber: 'SBD: 014',
    },
  ],
  training: {
    semester: 'Học kỳ 1 năm học 2026 - 2027',
    totalScore: 88,
    rank: 'TỐT',
    note: 'Đạt điều kiện xét học bổng Khuyến khích học tập của Học viện PTIT',
    criteria: [
      { id: 'c1', name: '1. Ý thức và thái độ trong học tập', score: 28, max: 30 },
      { id: 'c2', name: '2. Ý thức chấp hành nội quy, quy chế Học viện', score: 25, max: 25 },
      { id: 'c3', name: '3. Tham gia hoạt động chính trị, xã hội, văn hóa', score: 18, max: 20 },
      { id: 'c4', name: '4. Ý thức công dân và quan hệ cộng đồng', score: 12, max: 15 },
      { id: 'c5', name: '5. Tham gia công tác cán bộ lớp, đoàn thể', score: 5, max: 10 },
    ],
  },
  tuition: {
    semester: 'Học kỳ 1 năm học 2026 - 2027',
    totalCredits: 17,
    feePerCredit: '740.000 đ',
    totalAmount: '12.580.000 đ',
    paidAmount: '12.580.000 đ',
    remainingAmount: '0 đ',
    paymentDate: '15/09/2026 (VNPAY-QR PTIT)',
    status: 'Đã hoàn thành nghĩa vụ học phí',
  },
  oneStopServices: [
    {
      id: 'os1',
      title: 'Giấy chứng nhận sinh viên chính quy',
      desc: 'Bản cấp điện tử có chữ ký số hoặc bản giấy đóng dấu nổi tại Bộ phận 1 cửa',
      eta: 'Nhận kết quả sau 1 ngày làm việc',
    },
    {
      id: 'os2',
      title: 'Giấy xác nhận tạm hoãn nghĩa vụ quân sự',
      desc: 'Cấp giấy xác nhận sinh viên đang theo học gửi Ban Chỉ huy Quân sự địa phương',
      eta: 'Nhận kết quả sau 1 ngày làm việc',
    },
    {
      id: 'os3',
      title: 'Giấy xác nhận vay vốn Ngân hàng Chính sách',
      desc: 'Mẫu xác nhận sinh viên thuộc diện ưu đãi tín dụng học tập theo quy định',
      eta: 'Nhận kết quả sau 2 ngày làm việc',
    },
    {
      id: 'os4',
      title: 'Trích lục bảng điểm quá trình học tập',
      desc: 'Phục vụ xét học bổng doanh nghiệp, thực tập hoặc hồ sơ trao đổi sinh viên',
      eta: 'Nhận kết quả sau 2 ngày làm việc',
    },
  ],
  announcements: [
    {
      id: 'TB001',
      category: 'Đào tạo',
      date: '28/10/2026',
      sender: 'Phòng Giáo vụ PTIT',
      title: 'Kế hoạch đăng ký học phần giai đoạn 2 trên hệ thống qldt.ptit.edu.vn',
      summary:
        'Sinh viên các khóa thực hiện rà soát và đăng ký bổ sung các học phần tự chọn trên cổng Quản lý Đào tạo.',
      content:
        'Phòng Giáo vụ thông báo tới toàn thể sinh viên hệ Đại học chính quy kế hoạch đăng ký học phần bổ sung:\n\n1. Cổng đăng ký: Hệ thống Quản lý Đào tạo (qldt.ptit.edu.vn) hoặc ứng dụng PTIT S-Link.\n2. Sinh viên kiểm tra kỹ điều kiện tiên quyết và không đăng ký trùng ca học.\n3. Mọi vướng mắc vui lòng liên hệ Bộ phận Một cửa để được hỗ trợ kịp thời.',
    },
    {
      id: 'TB002',
      category: 'Công tác SV',
      date: '22/10/2026',
      sender: 'Phòng Chính trị & CTSV',
      title: 'Thông báo xét cấp học bổng Khuyến khích học tập Học kỳ 1',
      summary:
        'Công bố tiêu chuẩn xét học bổng kết hợp GPA thang điểm 4 (>= 3.20) và Điểm rèn luyện (>= 80 điểm).',
      content:
        'Hội đồng xét cấp học bổng Học viện Công nghệ Bưu chính Viễn thông thông báo tiêu chuẩn xét học bổng Khuyến khích học tập:\n\n• Loại Xuất sắc: GPA >= 3.60 và Điểm rèn luyện >= 90.\n• Loại Giỏi: GPA >= 3.20 và Điểm rèn luyện >= 80.\n• Sinh viên kiểm tra điểm thành phần và điểm rèn luyện trực tiếp trên ứng dụng S-Link.',
    },
    {
      id: 'TB003',
      category: 'Khảo thí',
      date: '15/10/2026',
      sender: 'Phòng Khảo thí & ĐBCLGD',
      title: 'Lịch thi kết thúc học phần và quy định sử dụng Thẻ sinh viên điện tử',
      summary:
        'Sinh viên được phép xuất trình Thẻ sinh viên số trên PTIT S-Link khi vào phòng thi kết thúc học phần.',
      content:
        'Để tạo thuận lợi cho sinh viên trong kỳ thi kết thúc học phần, Phòng Khảo thí & Đảm bảo chất lượng giáo dục chấp nhận Thẻ sinh viên điện tử trên ứng dụng PTIT S-Link có mã QR/Barcode hợp lệ thay thế thẻ cứng.',
    },
  ],
};

/**
 * Props bắt buộc:
 * - activeModal: 'exam' | 'training' | 'tuition' | 'survey' | 'onestop' | 'news' | null.
 * - onClose: callback đóng modal.
 * Props tùy chọn:
 * - portalData: dữ liệu portal.
 * - courses: danh sách môn học để khảo sát giảng viên.
 * - dueWithin24h: danh sách bài tập nhắc hạn 24h.
 * - selectedAnnouncement: thông báo đang được chọn xem chi tiết.
 * - onSelectAnnouncement: callback chọn thông báo.
 * - onPressAssignment: callback mở chi tiết bài tập từ danh sách nhắc hạn.
 */
function SLinkUtilityModals({
  activeModal,
  onClose,
  portalData = DEFAULT_PORTAL_DATA,
  courses = [],
  dueWithin24h = [],
  selectedAnnouncement = null,
  onSelectAnnouncement,
  onPressAssignment,
}) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, 24);
  const [surveyRatings, setSurveyRatings] = useState({});
  const [submittedSurveys, setSubmittedSurveys] = useState({});
  const [requestedServices, setRequestedServices] = useState({});

  const data = {
    ...DEFAULT_PORTAL_DATA,
    ...(portalData || {}),
  };

  const isVisible = Boolean(activeModal) || Boolean(selectedAnnouncement);
  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    if (selectedAnnouncement && onSelectAnnouncement) {
      onSelectAnnouncement(null);
      if (!activeModal) {
        onClose && onClose();
      }
      return;
    }
    onClose && onClose();
  };

  const renderExamContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.subHeader}>
        Học kỳ 1 • Học viện Công nghệ Bưu chính Viễn thông (Cơ sở Hà Đông)
      </Text>
      {data.exams.map((exam) => (
        <View key={exam.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.codePill}>
              <Text style={styles.codePillText}>{exam.subjectCode}</Text>
            </View>
            <View style={styles.sbdPill}>
              <Text style={styles.sbdPillText}>{exam.seatNumber}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>{exam.subjectName}</Text>
          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Ngày thi</Text>
              <Text style={styles.metaValuePrimary}>{exam.examDate}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Ca thi</Text>
              <Text style={styles.metaValue}>{exam.examTime}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Phòng thi</Text>
              <Text style={styles.metaValuePrimary}>{exam.room}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Hình thức</Text>
              <Text style={styles.metaValue}>{exam.format}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderTrainingContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.highlightBox}>
        <Text style={styles.highlightLabel}>{data.training.semester}</Text>
        <Text style={styles.bigScore}>{data.training.totalScore}</Text>
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>
            Xếp loại rèn luyện: {data.training.rank}
          </Text>
        </View>
        <Text style={styles.highlightNote}>{data.training.note}</Text>
      </View>

      <Text style={styles.sectionTitle}>CHI TIẾT 5 TIÊU CHÍ ĐÁNH GIÁ</Text>
      <View style={styles.card}>
        {data.training.criteria.map((item) => (
          <View key={item.id} style={styles.criteriaRow}>
            <Text style={styles.criteriaName}>{item.name}</Text>
            <Text style={styles.criteriaScore}>
              {item.score} / {item.max} đ
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderTuitionContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.tuitionBanner}>
        <Icon name="check-circle" color={colors.success} size={32} filled />
        <Text style={styles.tuitionStatusTitle}>{data.tuition.status}</Text>
        <Text style={styles.tuitionStatusSub}>
          Bạn không còn khoản công nợ học phí nào trong {data.tuition.semester}.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.tuitionRow}>
          <Text style={styles.tuitionKey}>Tổng số tín chỉ đăng ký:</Text>
          <Text style={styles.tuitionVal}>
            {data.tuition.totalCredits} tín chỉ
          </Text>
        </View>
        <View style={styles.tuitionRow}>
          <Text style={styles.tuitionKey}>Đơn giá tín chỉ chính quy:</Text>
          <Text style={styles.tuitionVal}>{data.tuition.feePerCredit}</Text>
        </View>
        <View style={styles.tuitionRow}>
          <Text style={styles.tuitionKey}>Tổng học phí phải nộp:</Text>
          <Text style={styles.tuitionValBold}>{data.tuition.totalAmount}</Text>
        </View>
        <View style={styles.tuitionRow}>
          <Text style={styles.tuitionKey}>Đã thanh toán:</Text>
          <Text style={[styles.tuitionValBold, { color: colors.success }]}>
            {data.tuition.paidAmount}
          </Text>
        </View>
        <View style={styles.tuitionRow}>
          <Text style={styles.tuitionKey}>Công nợ còn lại:</Text>
          <Text style={styles.tuitionValBold}>
            {data.tuition.remainingAmount}
          </Text>
        </View>
        <View style={styles.tuitionRow}>
          <Text style={styles.tuitionKey}>Phương thức & Ngày nộp:</Text>
          <Text style={styles.tuitionVal}>{data.tuition.paymentDate}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderSurveyContent = () => {
    const surveyCourses =
      courses && courses.length > 0
        ? courses
        : [
            {
              id: 'c1',
              code: 'INT3120',
              name: 'Phát triển ứng dụng di động',
              lecturer: 'TS. Trần Minh',
            },
            {
              id: 'c2',
              code: 'INT3209',
              name: 'Cơ sở dữ liệu',
              lecturer: 'ThS. Nguyễn Hà',
            },
          ];

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subHeader}>
          Đánh giá hoạt động giảng dạy của giảng viên học phần (chọn mức sao và
          bấm Gửi phiếu)
        </Text>
        {surveyCourses.map((course) => {
          const courseId = String(course.id);
          const rating = surveyRatings[courseId] || 5;
          const isSubmitted = Boolean(submittedSurveys[courseId]);

          return (
            <View key={courseId} style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.codePill}>
                  <Text style={styles.codePillText}>{course.code}</Text>
                </View>
                {isSubmitted ? (
                  <View style={styles.doneBadge}>
                    <Icon
                      name="check-circle"
                      color={colors.success}
                      size={14}
                      filled
                    />
                    <Text style={styles.doneBadgeText}>Đã gửi khảo sát</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cardTitle}>{course.name}</Text>
              <Text style={styles.lecturerLabel}>
                Giảng viên: {course.lecturer}
              </Text>

              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={`star-${courseId}-${star}`}
                    onPress={() =>
                      setSurveyRatings((prev) => ({
                        ...prev,
                        [courseId]: star,
                      }))
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`Đánh giá ${star} sao cho môn ${course.name}`}
                    style={styles.starButton}>
                    <Icon
                      name="star"
                      color={star <= rating ? colors.accent : colors.textMuted}
                      size={24}
                      filled={star <= rating}
                    />
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() =>
                  setSubmittedSurveys((prev) => ({
                    ...prev,
                    [courseId]: true,
                  }))
                }
                accessibilityRole="button"
                accessibilityLabel={`Gửi khảo sát môn ${course.name}`}
                style={({ pressed }) => [
                  styles.submitButton,
                  isSubmitted ? styles.submitButtonDone : null,
                  pressed ? styles.pressed : null,
                ]}>
                <Icon
                  name={isSubmitted ? 'check' : 'send'}
                  color={isSubmitted ? colors.success : colors.white}
                  size={16}
                />
                <Text
                  style={[
                    styles.submitButtonText,
                    isSubmitted ? styles.submitButtonTextDone : null,
                  ]}>
                  {isSubmitted
                    ? `Đã đánh giá (${rating}/5 sao)`
                    : `Gửi phiếu khảo sát (${rating}/5 sao)`}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderOneStopContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.subHeader}>
        Đăng ký cấp giấy tờ hành chính sinh viên trực tuyến qua Cổng Một cửa
      </Text>
      {data.oneStopServices.map((service) => {
        const isRequested = Boolean(requestedServices[service.id]);
        return (
          <View key={service.id} style={styles.card}>
            <Text style={styles.cardTitle}>{service.title}</Text>
            <Text style={styles.serviceDesc}>{service.desc}</Text>
            <Text style={styles.serviceEta}>⏱ {service.eta}</Text>

            <Pressable
              onPress={() =>
                setRequestedServices((prev) => ({
                  ...prev,
                  [service.id]: !prev[service.id],
                }))
              }
              accessibilityRole="button"
              accessibilityLabel={`Đăng ký thủ tục ${service.title}`}
              style={({ pressed }) => [
                styles.submitButton,
                isRequested ? styles.submitButtonDone : null,
                pressed ? styles.pressed : null,
              ]}>
              <Icon
                name={isRequested ? 'check-circle' : 'send'}
                color={isRequested ? colors.success : colors.white}
                size={16}
              />
              <Text
                style={[
                  styles.submitButtonText,
                  isRequested ? styles.submitButtonTextDone : null,
                ]}>
                {isRequested
                  ? 'Đã tiếp nhận yêu cầu (Mã hồ sơ #MC-2026)'
                  : 'Tạo yêu cầu cấp giấy xác nhận'}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderNewsContent = () => {
    if (selectedAnnouncement) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.codePill}>
            <Text style={styles.codePillText}>
              {selectedAnnouncement.category}
            </Text>
          </View>
          <Text style={styles.detailTitle}>{selectedAnnouncement.title}</Text>
          <Text style={styles.detailMeta}>
            Đơn vị ban hành: {selectedAnnouncement.sender} • Ngày:{' '}
            {selectedAnnouncement.date}
          </Text>
          <View style={styles.card}>
            <Text style={styles.detailBody}>{selectedAnnouncement.content}</Text>
          </View>
          <Pressable
            onPress={() => onSelectAnnouncement && onSelectAnnouncement(null)}
            accessibilityRole="button"
            accessibilityLabel="Quay lại danh sách thông báo"
            style={styles.backButton}>
            <Text style={styles.backButtonText}>← Quay lại danh sách</Text>
          </Pressable>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {dueWithin24h.length > 0 ? (
          <View style={styles.reminderSection}>
            <Text style={styles.sectionTitle}>
              NHẮC HẠN BÀI TẬP 24 GIỜ TỚI ({dueWithin24h.length})
            </Text>
            {dueWithin24h.map((item) => (
              <Pressable
                key={`modal-rem-${item.id}`}
                onPress={() => {
                  onClose && onClose();
                  onPressAssignment && onPressAssignment(item.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Mở bài tập sắp đến hạn ${item.title}`}
                style={styles.reminderCard}>
                <Icon
                  name="alert"
                  color={isOverdue(item.dueDate) ? colors.danger : colors.warning}
                  size={18}
                />
                <View style={styles.reminderInfo}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderDue}>
                    Hạn nộp: {formatDateTime(item.dueDate)}
                  </Text>
                </View>
                <Icon name="chevron-right" color={colors.textMuted} size={18} />
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>THÔNG BÁO TỪ HỌC VIỆN PTIT</Text>
        {data.announcements.map((ann) => (
          <Pressable
            key={ann.id}
            onPress={() => onSelectAnnouncement && onSelectAnnouncement(ann)}
            accessibilityRole="button"
            accessibilityLabel={`Xem chi tiết thông báo ${ann.title}`}
            style={({ pressed }) => [
              styles.card,
              pressed ? styles.pressed : null,
            ]}>
            <View style={styles.rowBetween}>
              <View style={styles.codePill}>
                <Text style={styles.codePillText}>{ann.category}</Text>
              </View>
              <Text style={styles.dateText}>{ann.date}</Text>
            </View>
            <Text style={styles.cardTitle}>{ann.title}</Text>
            <Text style={styles.serviceDesc} numberOfLines={2}>
              {ann.summary}
            </Text>
            <Text style={styles.senderText}>Ban hành: {ann.sender}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const getModalTitle = () => {
    if (selectedAnnouncement) {
      return 'Chi tiết thông báo Học viện';
    }
    switch (activeModal) {
      case 'exam':
        return 'Lịch thi kết thúc học phần';
      case 'training':
        return 'Kết quả điểm rèn luyện';
      case 'tuition':
        return 'Tra cứu học phí & Công nợ';
      case 'survey':
        return 'Khảo sát giảng viên S-Link';
      case 'onestop':
        return 'Dịch vụ Một cửa Sinh viên';
      case 'news':
      default:
        return 'Thông báo & Nhắc hạn 24h';
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      <View style={styles.container}>
        <View style={[styles.modalHeader, { paddingTop: topInset + spacing.xs }]}>
          <Text style={styles.modalTitle} numberOfLines={1}>
            {getModalTitle()}
          </Text>
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Đóng cửa sổ tiện ích"
            style={({ pressed }) => [
              styles.closeButton,
              pressed ? styles.pressed : null,
            ]}>
            <Icon name="close" color={colors.text} size={22} />
          </Pressable>
        </View>

        {selectedAnnouncement
          ? renderNewsContent()
          : activeModal === 'exam'
          ? renderExamContent()
          : activeModal === 'training'
          ? renderTrainingContent()
          : activeModal === 'tuition'
          ? renderTuitionContent()
          : activeModal === 'survey'
          ? renderSurveyContent()
          : activeModal === 'onestop'
          ? renderOneStopContent()
          : renderNewsContent()}
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
  modalTitle: {
    flex: 1,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  closeButton: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  subHeader: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radiusSm,
  },
  codePillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  sbdPill: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.radiusSm,
  },
  sbdPillText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.primaryDark,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.cardAlt,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    rowGap: spacing.sm,
  },
  metaCell: {
    width: '50%',
  },
  metaLabel: {
    fontSize: typography.sizes.xxs,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginTop: 2,
  },
  metaValuePrimary: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: 2,
  },
  highlightBox: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusLg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  highlightLabel: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  bigScore: {
    color: colors.white,
    fontSize: 44,
    fontWeight: typography.weights.extrabold,
    marginVertical: spacing.xs,
  },
  rankBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: spacing.radiusSm,
  },
  rankBadgeText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  highlightNote: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  criteriaName: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  criteriaScore: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  tuitionBanner: {
    backgroundColor: colors.successLight,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  tuitionStatusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.success,
  },
  tuitionStatusSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tuitionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tuitionKey: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  tuitionVal: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  tuitionValBold: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  lecturerLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  starButton: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    minHeight: spacing.touch,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  submitButtonDone: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  submitButtonTextDone: {
    color: colors.success,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
    gap: 4,
  },
  doneBadgeText: {
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.bold,
    color: colors.success,
  },
  serviceDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.md,
  },
  serviceEta: {
    fontSize: typography.sizes.xs,
    color: colors.info,
    fontWeight: typography.weights.semibold,
  },
  reminderSection: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: spacing.touch,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  reminderDue: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
    marginTop: 2,
  },
  dateText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  senderText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  detailTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  detailMeta: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  detailBody: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: typography.lineHeights.lg,
  },
  backButton: {
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chip,
    borderRadius: spacing.radiusMd,
  },
  backButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default SLinkUtilityModals;
