import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { AppTabScreenProps } from '../navigation/types';
import type { Subject, Assignment, AnnouncementItem, ExamScheduleItem } from '../types';
import { THEME } from '../constants/theme';
import { Badge } from '../components/Badge';
import {
  BookIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  ChevronRightIcon,
  GraduationCapIcon,
  QrCodeIcon,
  TrophyIcon,
  TaskIcon,
  ShieldCheckIcon,
  BellIcon,
  ExamIcon,
  StarIcon,
  WalletIcon,
  SurveyIcon,
  BuildingLibraryIcon,
  CourseRegIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '../components/AppIcons';
import { PTIT_ANNOUNCEMENTS, PTIT_EXAM_SCHEDULE } from '../data/mockData';

type ActiveModal =
  | 'none'
  | 'exams'
  | 'training'
  | 'tuition'
  | 'survey'
  | 'oneStop'
  | 'notifications'
  | 'idCard';

export const HomeScreen: React.FC<AppTabScreenProps<'HomeTab'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { studentProfile, subjects, schedule, assignments, toggleAssignmentStatus } = useApp();

  // Active modal state
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  // Upcoming incomplete assignments
  const upcomingAssignments = useMemo(() => {
    return assignments
      .filter((a) => !a.isCompleted)
      .sort((a, b) => a.dueTimestamp - b.dueTimestamp)
      .slice(0, 3);
  }, [assignments]);

  // Next class from schedule
  const nextClass = useMemo(() => {
    return schedule[0];
  }, [schedule]);

  const renderSubjectCard = ({ item }: { item: Subject }) => (
    <Pressable
      style={({ pressed }) => [styles.subjectCard, pressed && styles.cardPressed]}
      onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
    >
      <View style={styles.subjectContent}>
        <View style={styles.subjectTopRow}>
          <View style={styles.subjectCodePill}>
            <Text style={styles.subjectCodePillText}>{item.code}</Text>
          </View>
          <Text style={styles.subjectCredits}>{item.credits} TC</Text>
        </View>

        <Text style={styles.subjectName} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.subjectMetaRow}>
          <MapPinIcon color={THEME.textSecondary} size={13} />
          <Text style={styles.subjectMetaText} numberOfLines={1}>
            {item.room}
          </Text>
        </View>

        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${item.progress}%`, backgroundColor: item.color || THEME.primary },
            ]}
          />
        </View>
        <Text style={styles.progressText}>Đã học {item.progress}%</Text>
      </View>
    </Pressable>
  );

  const renderAssignmentItem = (item: Assignment) => (
    <View key={item.id} style={styles.assignmentCard}>
      <Pressable
        style={styles.checkBtn}
        hitSlop={8}
        onPress={() => toggleAssignmentStatus(item.id)}
      >
        <CheckCircleIcon
          color={item.isCompleted ? THEME.success : THEME.textMuted}
          filled={item.isCompleted}
          size={22}
        />
      </Pressable>

      <Pressable
        style={styles.assignmentInfo}
        onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}
      >
        <View style={styles.assignmentHeaderRow}>
          <View style={styles.asmCodePill}>
            <Text style={styles.asmCodePillText}>{item.subjectCode}</Text>
          </View>
          <Badge
            label={item.priority === 'high' ? 'Gấp' : 'Bình thường'}
            variant={item.priority === 'high' ? 'danger' : 'warning'}
            size="sm"
            style={{ marginLeft: 6 }}
          />
        </View>
        <Text style={styles.assignmentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.assignmentDueRow}>
          <ClockIcon color={THEME.danger} size={13} />
          <Text style={styles.assignmentDueText}>Hạn nộp: {item.dueDate}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('AssignmentDetail', { assignmentId: item.id })}
        style={styles.assignmentArrow}
      >
        <ChevronRightIcon color={THEME.textMuted} size={18} />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* PTIT S-Link Signature Crimson Header */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerTopLine}>
          <View style={styles.schoolBadge}>
            <Text style={styles.schoolBadgeText}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</Text>
          </View>
          <Pressable
            style={styles.bellButton}
            onPress={() => setActiveModal('notifications')}
            hitSlop={8}
          >
            <BellIcon color="#FFFFFF" size={22} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>4</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.headerMainRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>Xin chào sinh viên,</Text>
            <Text style={styles.studentNameText}>{studentProfile.fullName}</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>Mã SV: {studentProfile.studentCode}</Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.classText}>{studentProfile.className}</Text>
            </View>
          </View>

          <Pressable
            onPress={() => navigation.navigate('ProfileTab')}
            style={styles.avatarWrap}
          >
            {studentProfile.avatarUrl ? (
              <Image source={{ uri: studentProfile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {studentProfile.fullName.charAt(studentProfile.fullName.lastIndexOf(' ') + 1) || 'A'}
                </Text>
              </View>
            )}
            <View style={styles.avatarOnlineDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* S-Link Digital Student Card Banner */}
        <Pressable
          style={({ pressed }) => [styles.studentIdCard, pressed && styles.cardPressed]}
          onPress={() => setActiveModal('idCard')}
        >
          <View style={styles.studentIdCardHeader}>
            <Text style={styles.studentCardBrandText}>THẺ SINH VIÊN</Text>
          </View>

          <View style={styles.studentCardBody}>
            <View style={styles.studentCardInfoCol}>
              <Text style={styles.cardName}>{studentProfile.fullName.toUpperCase()}</Text>
              <Text style={styles.cardCode}>MSSV: {studentProfile.studentCode}</Text>
              <Text style={styles.cardMajor} numberOfLines={1}>
                {studentProfile.major} • {studentProfile.className}
              </Text>
              <View style={styles.barcodeLinesRow}>
                <View style={[styles.barcodeLine, { width: 3 }]} />
                <View style={[styles.barcodeLine, { width: 1 }]} />
                <View style={[styles.barcodeLine, { width: 4 }]} />
                <View style={[styles.barcodeLine, { width: 2 }]} />
                <View style={[styles.barcodeLine, { width: 5 }]} />
                <View style={[styles.barcodeLine, { width: 1 }]} />
                <View style={[styles.barcodeLine, { width: 3 }]} />
                <View style={[styles.barcodeLine, { width: 6 }]} />
                <View style={[styles.barcodeLine, { width: 2 }]} />
                <View style={[styles.barcodeLine, { width: 4 }]} />
                <View style={[styles.barcodeLine, { width: 1 }]} />
                <View style={[styles.barcodeLine, { width: 5 }]} />
                <View style={[styles.barcodeLine, { width: 2 }]} />
              </View>
            </View>
            <View style={styles.qrButtonBox}>
              <QrCodeIcon color="#FFFFFF" size={26} />
              <Text style={styles.qrButtonText}>Mã QR</Text>
            </View>
          </View>
        </Pressable>

        {/* S-Link Official 8-Service Feature Grid */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionHeaderLabel}>TIỆN ÍCH S-LINK</Text>
          <View style={styles.servicesGrid}>
            {/* 1. Lịch học */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('ScheduleTab')}
            >
              <View style={styles.serviceIconCircle}>
                <CalendarIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Lịch học</Text>
              <Text style={styles.serviceItemSub}>Kỳ 1</Text>
            </Pressable>

            {/* 2. Lịch thi */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => setActiveModal('exams')}
            >
              <View style={styles.serviceIconCircle}>
                <ExamIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Lịch thi</Text>
              <Text style={styles.serviceItemSub}>5 môn</Text>
            </Pressable>

            {/* 3. Bảng điểm */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('GradeDetail')}
            >
              <View style={styles.serviceIconCircle}>
                <TrophyIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Bảng điểm</Text>
              <Text style={styles.serviceItemSub}>GPA {studentProfile.gpaScale4.toFixed(2)}</Text>
            </Pressable>

            {/* 4. Điểm rèn luyện */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => setActiveModal('training')}
            >
              <View style={styles.serviceIconCircle}>
                <StarIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Rèn luyện</Text>
              <Text style={styles.serviceItemSub}>88 - Tốt</Text>
            </Pressable>

            {/* 5. Học phí */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => setActiveModal('tuition')}
            >
              <View style={styles.serviceIconCircle}>
                <WalletIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Học phí</Text>
              <Text style={styles.serviceItemSub}>Đã nộp đủ</Text>
            </Pressable>

            {/* 6. Khảo sát */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => setActiveModal('survey')}
            >
              <View style={styles.serviceIconCircle}>
                <SurveyIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Khảo sát</Text>
              <Text style={styles.serviceItemSub}>Hoàn tất</Text>
            </Pressable>

            {/* 7. Dịch vụ 1 cửa */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => setActiveModal('oneStop')}
            >
              <View style={styles.serviceIconCircle}>
                <BuildingLibraryIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>Một cửa</Text>
              <Text style={styles.serviceItemSub}>Thủ tục SV</Text>
            </Pressable>

            {/* 8. ĐK học phần */}
            <Pressable
              style={({ pressed }) => [styles.serviceGridItem, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('SubjectsTab')}
            >
              <View style={styles.serviceIconCircle}>
                <CourseRegIcon color={THEME.primary} size={22} />
              </View>
              <Text style={styles.serviceItemTitle}>ĐK học phần</Text>
              <Text style={styles.serviceItemSub}>Học kỳ 2</Text>
            </Pressable>
          </View>
        </View>

        {/* Academic Stats Summary Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>GPA Tích lũy</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValueHighlight}>
                {studentProfile.gpaScale4.toFixed(2)}
              </Text>
              <Text style={styles.statValueSub}>/4.0</Text>
            </View>
            <View style={styles.statHonorTag}>
              <Text style={styles.statHonorText}>{studentProfile.academicRank}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Tín chỉ đạt</Text>
            <Text style={styles.statValue}>{studentProfile.totalCredits}</Text>
            <Text style={styles.statSubText}>
              / {studentProfile.requiredCredits} TC ({Math.round((studentProfile.totalCredits / studentProfile.requiredCredits) * 100)}%)
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Bài tập chờ</Text>
            <Text style={[styles.statValue, { color: THEME.danger }]}>
              {assignments.filter((a) => !a.isCompleted).length}
            </Text>
            <Text style={styles.statSubText}>Chưa nộp</Text>
          </View>
        </View>

        {/* Next Class Highlight (S-Link Style) */}
        {nextClass && (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <CalendarIcon color={THEME.primary} size={18} />
                <Text style={styles.sectionTitle}>Lịch học hôm nay</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('ScheduleTab')}>
                <Text style={styles.sectionLink}>Xem lịch tuần →</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.nextClassCard, pressed && styles.cardPressed]}
              onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: nextClass.id })}
            >
              <View style={styles.nextClassTimeBox}>
                <Text style={styles.nextClassDay}>{nextClass.dayName}</Text>
                <Text style={styles.nextClassTime}>{nextClass.startTime}</Text>
                <Text style={styles.nextClassShift}>Tiết 1-3</Text>
              </View>

              <View style={styles.nextClassContent}>
                <View style={styles.badgeRow}>
                  <View style={styles.subjectCodePill}>
                    <Text style={styles.subjectCodePillText}>{nextClass.subjectCode}</Text>
                  </View>
                  <Badge label={nextClass.type} variant="info" size="sm" style={{ marginLeft: 6 }} />
                </View>

                <Text style={styles.nextClassName} numberOfLines={1}>
                  {nextClass.subjectName}
                </Text>

                <View style={styles.nextClassMeta}>
                  <MapPinIcon color={THEME.primary} size={13} />
                  <Text style={styles.nextClassMetaHighlight}>{nextClass.room}</Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.nextClassMetaText} numberOfLines={1}>
                    {nextClass.lecturer}
                  </Text>
                </View>
              </View>

              <ChevronRightIcon color={THEME.textMuted} size={18} />
            </Pressable>
          </View>
        )}

        {/* Active Subjects Horizontal List */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <BookIcon color={THEME.primary} size={18} />
              <Text style={styles.sectionTitle}>Môn học kỳ này ({subjects.length})</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('SubjectsTab')}>
              <Text style={styles.sectionLink}>Tất cả →</Text>
            </Pressable>
          </View>

          <FlatList
            data={subjects}
            keyExtractor={(item) => item.id}
            renderItem={renderSubjectCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <CheckCircleIcon color={THEME.danger} size={18} />
              <Text style={styles.sectionTitle}>Nhiệm vụ & Bài tập sắp tới</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('AssignmentsTab')}>
              <Text style={styles.sectionLink}>Xem tất cả →</Text>
            </Pressable>
          </View>

          {upcomingAssignments.length > 0 ? (
            upcomingAssignments.map(renderAssignmentItem)
          ) : (
            <View style={styles.allDoneBox}>
              <CheckCircleIcon color={THEME.success} size={28} filled />
              <Text style={styles.allDoneText}>
                Bạn đã hoàn thành tất cả nhiệm vụ học tập.
              </Text>
            </View>
          )}
        </View>

        {/* S-Link Institutional Announcements Feed */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <DocumentTextIcon color={THEME.primary} size={18} />
              <Text style={styles.sectionTitle}>Thông báo & Tin tức Học viện</Text>
            </View>
            <Pressable onPress={() => setActiveModal('notifications')}>
              <Text style={styles.sectionLink}>Xem tất cả →</Text>
            </Pressable>
          </View>

          {PTIT_ANNOUNCEMENTS.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.announcementCard, pressed && styles.cardPressed]}
              onPress={() => setSelectedAnnouncement(item)}
            >
              <View style={styles.announcementTopRow}>
                <View style={styles.announcementCategoryBadge}>
                  <Text style={styles.announcementCategoryText}>{item.category}</Text>
                </View>
                <Text style={styles.announcementDateText}>{item.date}</Text>
              </View>

              <Text style={styles.announcementTitleText} numberOfLines={2}>
                {item.title}
              </Text>

              <Text style={styles.announcementSummaryText} numberOfLines={2}>
                {item.summary}
              </Text>

              <View style={styles.announcementFooterRow}>
                <Text style={styles.announcementSenderText}>Ban hành: {item.sender}</Text>
                <ChevronRightIcon color={THEME.textMuted} size={16} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Quick Shortcut: Academic Results Banner */}
        <Pressable
          style={({ pressed }) => [styles.gradeBanner, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('GradeDetail')}
        >
          <View style={styles.gradeBannerIcon}>
            <GraduationCapIcon color="#FFFFFF" size={24} />
          </View>
          <View style={styles.gradeBannerContent}>
            <Text style={styles.gradeBannerTitle}>Tra cứu bảng điểm toàn khóa</Text>
            <Text style={styles.gradeBannerSub}>
              Xem điểm thành phần (CC, GK, CK) và GPA từng học kỳ
            </Text>
          </View>
          <ChevronRightIcon color="#FFFFFF" size={20} />
        </Pressable>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* MODAL 1: EXAM SCHEDULE (Lịch thi) */}
      <Modal
        visible={activeModal === 'exams'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Lịch thi kết thúc học phần</Text>
            <Pressable onPress={() => setActiveModal('none')} hitSlop={10}>
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>
          <Text style={styles.modalSub}>Học kỳ 1 năm học 2024 - 2025 • PTIT Hà Đông</Text>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {PTIT_EXAM_SCHEDULE.map((exam) => (
              <View key={exam.id} style={styles.examCard}>
                <View style={styles.examCardTop}>
                  <View style={styles.examCodePill}>
                    <Text style={styles.examCodeText}>{exam.subjectCode}</Text>
                  </View>
                  <View style={styles.examSbdPill}>
                    <Text style={styles.examSbdText}>{exam.seatNumber}</Text>
                  </View>
                </View>
                <Text style={styles.examName}>{exam.subjectName}</Text>
                <View style={styles.examMetaGrid}>
                  <View style={styles.examMetaItem}>
                    <Text style={styles.examMetaLabel}>Ngày thi</Text>
                    <Text style={styles.examMetaValueHighlight}>{exam.examDate}</Text>
                  </View>
                  <View style={styles.examMetaItem}>
                    <Text style={styles.examMetaLabel}>Ca thi</Text>
                    <Text style={styles.examMetaValue}>{exam.examTime}</Text>
                  </View>
                  <View style={styles.examMetaItem}>
                    <Text style={styles.examMetaLabel}>Phòng thi</Text>
                    <Text style={styles.examMetaValueHighlight}>{exam.room}</Text>
                  </View>
                  <View style={styles.examMetaItem}>
                    <Text style={styles.examMetaLabel}>Hình thức</Text>
                    <Text style={styles.examMetaValue}>{exam.format}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL 2: TRAINING POINTS (Điểm rèn luyện) */}
      <Modal
        visible={activeModal === 'training'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Kết quả rèn luyện sinh viên</Text>
            <Pressable onPress={() => setActiveModal('none')} hitSlop={10}>
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>
          <Text style={styles.modalSub}>Học kỳ 1 năm học 2024 - 2025</Text>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.trainingSummaryCard}>
              <Text style={styles.trainingScoreTitle}>Điểm rèn luyện</Text>
              <Text style={styles.trainingScoreValue}>88</Text>
              <View style={styles.trainingRankPill}>
                <Text style={styles.trainingRankText}>Xếp loại: TỐT</Text>
              </View>
              <Text style={styles.trainingNote}>
                Đạt điều kiện xét học bổng khuyến khích học tập của Học viện
              </Text>
            </View>

            <Text style={styles.sectionHeaderLabel}>CHI TIẾT 5 TIÊU CHÍ ĐÁNH GIÁ</Text>
            <View style={styles.criteriaCard}>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaName}>1. Ý thức học tập</Text>
                <Text style={styles.criteriaScore}>28 / 30 đ</Text>
              </View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaName}>2. Chấp hành quy chế, nội quy</Text>
                <Text style={styles.criteriaScore}>25 / 25 đ</Text>
              </View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaName}>3. Tham gia hoạt động chính trị - xã hội</Text>
                <Text style={styles.criteriaScore}>18 / 20 đ</Text>
              </View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaName}>4. Phẩm chất công dân & quan hệ cộng đồng</Text>
                <Text style={styles.criteriaScore}>12 / 15 đ</Text>
              </View>
              <View style={styles.criteriaRow}>
                <Text style={styles.criteriaName}>5. Ý thức tham gia công tác lớp, đoàn thể</Text>
                <Text style={styles.criteriaScore}>5 / 10 đ</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL 3: TUITION (Học phí) */}
      <Modal
        visible={activeModal === 'tuition'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tra cứu học phí</Text>
            <Pressable onPress={() => setActiveModal('none')} hitSlop={10}>
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>
          <Text style={styles.modalSub}>Hệ thống tài chính - kế toán PTIT</Text>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.tuitionStatusCard}>
              <View style={styles.tuitionCheckIcon}>
                <CheckCircleIcon color={THEME.success} size={32} filled />
              </View>
              <Text style={styles.tuitionStatusTitle}>Đã hoàn thành học phí</Text>
              <Text style={styles.tuitionStatusSub}>
                Bạn không còn khoản nợ học phí nào cho Học kỳ 1 năm học 2024 - 2025.
              </Text>
            </View>

            <View style={styles.tuitionDetailBox}>
              <View style={styles.tuitionRow}>
                <Text style={styles.tuitionLabel}>Tổng số tín chỉ đăng ký:</Text>
                <Text style={styles.tuitionValue}>16 tín chỉ</Text>
              </View>
              <View style={styles.tuitionRow}>
                <Text style={styles.tuitionLabel}>Mức học phí / tín chỉ:</Text>
                <Text style={styles.tuitionValue}>740.000 đ</Text>
              </View>
              <View style={styles.tuitionRow}>
                <Text style={styles.tuitionLabel}>Tổng tiền học phí:</Text>
                <Text style={styles.tuitionValueHighlight}>11.850.000 đ</Text>
              </View>
              <View style={styles.tuitionRow}>
                <Text style={styles.tuitionLabel}>Đã thanh toán:</Text>
                <Text style={[styles.tuitionValue, { color: THEME.success }]}>11.850.000 đ</Text>
              </View>
              <View style={styles.tuitionRow}>
                <Text style={styles.tuitionLabel}>Số tiền còn nợ:</Text>
                <Text style={styles.tuitionValueHighlight}>0 đ</Text>
              </View>
              <View style={styles.tuitionRow}>
                <Text style={styles.tuitionLabel}>Ngày thanh toán:</Text>
                <Text style={styles.tuitionValue}>15/09/2024 (VNPAY-QR)</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL 4: SURVEY (Khảo sát) */}
      <Modal
        visible={activeModal === 'survey'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Khảo sát & Đánh giá</Text>
            <Pressable onPress={() => setActiveModal('none')} hitSlop={10}>
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>
          <Text style={styles.modalSub}>Lấy ý kiến phản hồi của người học về chất lượng đào tạo</Text>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.surveyStatusBox}>
              <Text style={styles.surveyStatusText}>
                Trạng thái: Đã hoàn thành 5/5 phiếu khảo sát giảng viên Học kỳ 1
              </Text>
            </View>

            {subjects.map((sub) => (
              <View key={sub.id} style={styles.surveyItemCard}>
                <View style={styles.surveyItemLeft}>
                  <Text style={styles.surveySubCode}>{sub.code}</Text>
                  <Text style={styles.surveySubName}>{sub.name}</Text>
                  <Text style={styles.surveyLecturer}>GV: {sub.lecturer}</Text>
                </View>
                <View style={styles.surveyDoneBadge}>
                  <CheckCircleIcon color={THEME.success} size={16} filled />
                  <Text style={styles.surveyDoneText}>Đã gửi</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL 5: ONE-STOP SERVICES (Dịch vụ một cửa) */}
      <Modal
        visible={activeModal === 'oneStop'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bộ phận Một cửa Sinh viên</Text>
            <Pressable onPress={() => setActiveModal('none')} hitSlop={10}>
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>
          <Text style={styles.modalSub}>Đăng ký giấy tờ và thủ tục hành chính trực tuyến</Text>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {[
              { title: 'Giấy chứng nhận sinh viên', desc: 'Bản cấp điện tử có chữ ký số hoặc bản giấy đóng dấu nổi' },
              { title: 'Đăng ký tạm hoãn nghĩa vụ quân sự', desc: 'Cấp giấy xác nhận gửi về Ban Chỉ huy Quân sự địa phương' },
              { title: 'Cấp lại thẻ sinh viên liên kết ngân hàng', desc: 'Thẻ chip thông minh dùng tại cổng trường và thư viện' },
              { title: 'Giấy xác nhận vay vốn ngân hàng chính sách', desc: 'Mẫu theo quy định của Ngân hàng Chính sách Xã hội' },
              { title: 'Trích lục bảng điểm quá trình', desc: 'Phục vụ học bổng, du học hoặc thực tập doanh nghiệp' },
            ].map((serv, index) => (
              <View key={index} style={styles.oneStopCard}>
                <View style={styles.oneStopInfo}>
                  <Text style={styles.oneStopTitle}>{serv.title}</Text>
                  <Text style={styles.oneStopDesc}>{serv.desc}</Text>
                </View>
                <View style={styles.oneStopActionBtn}>
                  <Text style={styles.oneStopActionText}>Đăng ký</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL 6: DIGITAL STUDENT ID CARD (Thẻ SV điện tử) */}
      <Modal
        visible={activeModal === 'idCard'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal('none')}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thẻ sinh viên số PTIT</Text>
            <Pressable onPress={() => setActiveModal('none')} hitSlop={10}>
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>
          <Text style={styles.modalSub}>Sử dụng khi ra vào cổng Học viện, thư viện và phòng thi</Text>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.bigIdCard}>
              <View style={styles.bigCardHeader}>
                <Text style={styles.bigCardSchool}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</Text>
                <Text style={styles.bigCardTitle}>THẺ SINH VIÊN</Text>
              </View>

              <View style={styles.bigCardBody}>
                <Image
                  source={{ uri: studentProfile.avatarUrl }}
                  style={styles.bigCardAvatar}
                />
                <View style={styles.bigCardDetails}>
                  <Text style={styles.bigCardName}>{studentProfile.fullName.toUpperCase()}</Text>
                  <Text style={styles.bigCardField}>MSSV: <Text style={styles.bigCardBold}>{studentProfile.studentCode}</Text></Text>
                  <Text style={styles.bigCardField}>Lớp: <Text style={styles.bigCardBold}>{studentProfile.className}</Text></Text>
                  <Text style={styles.bigCardField}>Khoa: <Text style={styles.bigCardBold}>Công nghệ thông tin 1</Text></Text>
                  <Text style={styles.bigCardField}>Khóa: <Text style={styles.bigCardBold}>2021 - 2026</Text></Text>
                  <Text style={styles.bigCardField}>Hệ: <Text style={styles.bigCardBold}>Đại học chính quy</Text></Text>
                </View>
              </View>

              {/* Digital Barcode representation */}
              <View style={styles.barcodeBox}>
                <View style={styles.barcodeGraphic}>
                  {Array.from({ length: 32 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.barcodeBar,
                        { width: (i % 3 === 0 ? 3 : i % 2 === 0 ? 1.5 : 2.5), marginRight: (i % 4 === 0 ? 3 : 1.5) },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.barcodeNumber}>*{studentProfile.studentCode}*</Text>
              </View>

              <View style={styles.bigCardFooter}>
                <View style={styles.activeCheckRow}>
                  <CheckCircleIcon color="#34D399" size={16} filled />
                  <Text style={styles.activeCheckText}>Trạng thái: Đang theo học chính khóa</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL 7: NOTIFICATIONS / ANNOUNCEMENT DETAIL */}
      <Modal
        visible={activeModal === 'notifications' || selectedAnnouncement !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setActiveModal('none');
          setSelectedAnnouncement(null);
        }}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top + 16, 56) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedAnnouncement ? 'Chi tiết thông báo' : 'Thông báo từ Học viện'}
            </Text>
            <Pressable
              onPress={() => {
                setActiveModal('none');
                setSelectedAnnouncement(null);
              }}
              hitSlop={10}
            >
              <XMarkIcon color={THEME.textPrimary} size={24} />
            </Pressable>
          </View>

          {selectedAnnouncement ? (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.announcementCategoryBadge}>
                <Text style={styles.announcementCategoryText}>
                  {selectedAnnouncement.category}
                </Text>
              </View>
              <Text style={styles.detailAnnouncementTitle}>{selectedAnnouncement.title}</Text>
              <View style={styles.detailAnnouncementMeta}>
                <Text style={styles.detailMetaSender}>Đơn vị: {selectedAnnouncement.sender}</Text>
                <Text style={styles.detailMetaDate}>Ngày: {selectedAnnouncement.date}</Text>
              </View>
              <View style={styles.detailContentBox}>
                <Text style={styles.detailContentText}>{selectedAnnouncement.content}</Text>
              </View>
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {PTIT_ANNOUNCEMENTS.map((ann) => (
                <Pressable
                  key={ann.id}
                  style={styles.announcementCard}
                  onPress={() => setSelectedAnnouncement(ann)}
                >
                  <View style={styles.announcementTopRow}>
                    <View style={styles.announcementCategoryBadge}>
                      <Text style={styles.announcementCategoryText}>{ann.category}</Text>
                    </View>
                    <Text style={styles.announcementDateText}>{ann.date}</Text>
                  </View>
                  <Text style={styles.announcementTitleText}>{ann.title}</Text>
                  <Text style={styles.announcementSummaryText} numberOfLines={2}>
                    {ann.summary}
                  </Text>
                  <Text style={styles.announcementSenderText}>Ban hành: {ann.sender}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  headerContainer: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    ...THEME.shadowLg,
  },
  headerTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  schoolBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  schoolBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  bellBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: THEME.accent,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.primary,
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  headerMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  studentNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.ptit.goldLight,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  classText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  avatarWrap: {
    position: 'relative',
    marginLeft: 12,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: THEME.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: THEME.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
  },
  studentIdCard: {
    backgroundColor: '#BA1B1D',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  studentIdCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  studentCardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.accent,
    marginRight: 6,
  },
  studentCardBrandText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  statusVerifiedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentCardInfoCol: {
    flex: 1,
  },
  cardName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FDE68A',
    marginBottom: 2,
  },
  cardMajor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 6,
  },
  barcodeLinesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 14,
    gap: 2,
  },
  barcodeLine: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 1,
  },
  qrButtonBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  qrButtonText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  servicesSection: {
    marginBottom: 16,
  },
  sectionHeaderLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: THEME.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  serviceGridItem: {
    width: '23%',
    backgroundColor: THEME.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  serviceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceItemTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textPrimary,
    textAlign: 'center',
  },
  serviceItemSub: {
    fontSize: 9,
    color: THEME.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: THEME.border,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  statValueHighlight: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primary,
  },
  statValueSub: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  statHonorTag: {
    backgroundColor: THEME.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statHonorText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.ptit.gold,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  statSubText: {
    fontSize: 10.5,
    color: THEME.textMuted,
    marginTop: 4,
  },
  sectionWrap: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginLeft: 6,
  },
  sectionLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: THEME.primary,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  nextClassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
  },
  nextClassTimeBox: {
    backgroundColor: THEME.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 70,
  },
  nextClassDay: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.primary,
  },
  nextClassTime: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.primary,
    marginTop: 2,
  },
  nextClassShift: {
    fontSize: 10,
    color: THEME.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  nextClassContent: {
    flex: 1,
    marginRight: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subjectCodePill: {
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectCodePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.primary,
  },
  nextClassName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  nextClassMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextClassMetaHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
    marginLeft: 4,
  },
  nextClassMetaText: {
    fontSize: 12,
    color: THEME.textSecondary,
  },
  horizontalListContent: {
    paddingRight: 16,
    gap: 12,
  },
  subjectCard: {
    width: 200,
    backgroundColor: THEME.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  subjectColorBar: {
    height: 5,
    width: '100%',
  },
  subjectContent: {
    padding: 12,
  },
  subjectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectCredits: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '600',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
    minHeight: 38,
    marginBottom: 6,
  },
  subjectMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectMetaText: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginLeft: 4,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: THEME.cardAlt,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: THEME.textMuted,
    textAlign: 'right',
  },
  assignmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  checkBtn: {
    paddingRight: 10,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  asmCodePill: {
    backgroundColor: THEME.cardAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  asmCodePillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  assignmentTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginBottom: 4,
  },
  assignmentDueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentDueText: {
    fontSize: 11.5,
    color: THEME.danger,
    fontWeight: '500',
    marginLeft: 4,
  },
  assignmentArrow: {
    paddingLeft: 6,
  },
  allDoneBox: {
    backgroundColor: THEME.successLight,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allDoneText: {
    fontSize: 13,
    color: THEME.success,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  announcementCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  announcementTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  announcementCategoryBadge: {
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  announcementCategoryText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: THEME.primary,
  },
  announcementDateText: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  announcementTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  announcementSummaryText: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  announcementFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: THEME.borderLight,
    paddingTop: 8,
  },
  announcementSenderText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.textMuted,
  },
  gradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary,
    borderRadius: 16,
    padding: 16,
    ...THEME.shadowLg,
  },
  gradeBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gradeBannerContent: {
    flex: 1,
  },
  gradeBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gradeBannerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: THEME.background,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 56,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  modalSub: {
    fontSize: 12.5,
    color: THEME.textSecondary,
    marginBottom: 16,
  },
  modalScrollContent: {
    paddingBottom: 30,
  },
  examCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  examCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  examCodePill: {
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  examCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.primary,
  },
  examSbdPill: {
    backgroundColor: THEME.cardAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  examSbdText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  examName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 10,
  },
  examMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  examMetaItem: {
    width: '48%',
    backgroundColor: THEME.cardAlt,
    padding: 8,
    borderRadius: 8,
  },
  examMetaLabel: {
    fontSize: 10,
    color: THEME.textMuted,
  },
  examMetaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  examMetaValueHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
    marginTop: 2,
  },

  // Training modal
  trainingSummaryCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  trainingScoreTitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  trainingScoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#9333EA',
    marginVertical: 4,
  },
  trainingRankPill: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  trainingRankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9333EA',
  },
  trainingNote: {
    fontSize: 11.5,
    color: THEME.textMuted,
    textAlign: 'center',
  },
  criteriaCard: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 14,
  },
  criteriaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderLight,
  },
  criteriaName: {
    fontSize: 12.5,
    color: THEME.textPrimary,
    flex: 1,
  },
  criteriaScore: {
    fontSize: 12.5,
    fontWeight: '700',
    color: THEME.primary,
    marginLeft: 8,
  },

  // Tuition modal
  tuitionStatusCard: {
    backgroundColor: THEME.successLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  tuitionCheckIcon: {
    marginBottom: 8,
  },
  tuitionStatusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.success,
    marginBottom: 4,
  },
  tuitionStatusSub: {
    fontSize: 12,
    color: THEME.textSecondary,
    textAlign: 'center',
  },
  tuitionDetailBox: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 16,
  },
  tuitionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderLight,
  },
  tuitionLabel: {
    fontSize: 12.5,
    color: THEME.textSecondary,
  },
  tuitionValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: THEME.textPrimary,
  },
  tuitionValueHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.primary,
  },

  // Survey modal
  surveyStatusBox: {
    backgroundColor: THEME.cardAlt,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  surveyStatusText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  surveyItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  surveyItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  surveySubCode: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.primary,
  },
  surveySubName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  surveyLecturer: {
    fontSize: 11.5,
    color: THEME.textMuted,
    marginTop: 2,
  },
  surveyDoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  surveyDoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.success,
  },

  // One stop modal
  oneStopCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  oneStopInfo: {
    flex: 1,
    marginRight: 12,
  },
  oneStopTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  oneStopDesc: {
    fontSize: 11.5,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  oneStopActionBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  oneStopActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Big ID Card Modal
  bigIdCard: {
    backgroundColor: '#BA1B1D',
    borderRadius: 18,
    padding: 18,
  },
  bigCardHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
    marginBottom: 14,
  },
  bigCardSchool: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bigCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.ptit.goldLight,
    letterSpacing: 1,
    marginTop: 2,
  },
  bigCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bigCardAvatar: {
    width: 80,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 14,
  },
  bigCardDetails: {
    flex: 1,
  },
  bigCardName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bigCardField: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
  },
  bigCardBold: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  barcodeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  barcodeGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  barcodeBar: {
    height: 38,
    backgroundColor: '#000000',
  },
  barcodeNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    marginTop: 4,
    letterSpacing: 2,
  },
  bigCardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 10,
  },
  activeCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Detail Announcement Modal
  detailAnnouncementTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textPrimary,
    lineHeight: 24,
    marginVertical: 10,
  },
  detailAnnouncementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    marginBottom: 12,
  },
  detailMetaSender: {
    fontSize: 11.5,
    fontWeight: '600',
    color: THEME.primary,
  },
  detailMetaDate: {
    fontSize: 11.5,
    color: THEME.textMuted,
  },
  detailContentBox: {
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 14,
  },
  detailContentText: {
    fontSize: 13.5,
    color: THEME.textPrimary,
    lineHeight: 22,
  },
});
