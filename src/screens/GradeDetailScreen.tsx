import React, { useState } from 'react';
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
import type { GradeItem } from '../types';
import { THEME } from '../constants/theme';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import {
  GraduationCapIcon,
  BookIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '../components/AppIcons';

export const GradeDetailScreen: React.FC<RootStackScreenProps<'GradeDetail'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { studentProfile, semesterGrades } = useApp();

  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState<number>(0);
  const currentSemester = semesterGrades[selectedSemesterIndex] || semesterGrades[0];

  const getGradeBadgeVariant = (gradeLetter: string): 'success' | 'primary' | 'warning' | 'danger' => {
    if (gradeLetter.startsWith('A')) return 'success';
    if (gradeLetter.startsWith('B')) return 'primary';
    if (gradeLetter.startsWith('C')) return 'warning';
    return 'danger';
  };

  const creditCompletionPercent = Math.min(
    100,
    Math.round((studentProfile.totalCredits / studentProfile.requiredCredits) * 100)
  );

  const renderSubjectGradeCard = (grade: GradeItem, index: number) => {
    const badgeVariant = getGradeBadgeVariant(grade.gradeLetter);

    return (
      <View key={grade.id || index} style={styles.gradeCard}>
        {/* Card Header: Subject Code, Credits & Letter Grade */}
        <View style={styles.gradeCardHeader}>
          <View style={styles.gradeCodeGroup}>
            <View style={styles.subjectCodePill}>
              <Text style={styles.subjectCodeText}>{grade.subjectCode}</Text>
            </View>
            <Text style={styles.creditText}>{grade.credits} tín chỉ</Text>
          </View>

          <View style={styles.gradeBadgeWrap}>
            <View
              style={[
                styles.gradeLetterBadge,
                badgeVariant === 'success' && styles.gradeLetterSuccess,
                badgeVariant === 'primary' && styles.gradeLetterPrimary,
                badgeVariant === 'warning' && styles.gradeLetterWarning,
                badgeVariant === 'danger' && styles.gradeLetterDanger,
              ]}
            >
              <Text style={styles.gradeLetterText}>Điểm {grade.gradeLetter}</Text>
              <Text style={styles.gradeScale4Text}>• {grade.totalScore4.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Subject Name */}
        <Text style={styles.subjectNameText}>{grade.subjectName}</Text>

        {/* Score Component Grid (CC, GK, CK, Tổng 10) */}
        <View style={styles.scoreGrid}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreColLabel}>Chuyên cần</Text>
            <Text style={styles.scoreColWeight}>10%</Text>
            <Text style={styles.scoreColVal}>{grade.attendanceScore.toFixed(1)}</Text>
          </View>

          <View style={styles.scoreDivider} />

          <View style={styles.scoreCol}>
            <Text style={styles.scoreColLabel}>Giữa kỳ</Text>
            <Text style={styles.scoreColWeight}>20%</Text>
            <Text style={styles.scoreColVal}>{grade.midtermScore.toFixed(1)}</Text>
          </View>

          <View style={styles.scoreDivider} />

          <View style={styles.scoreCol}>
            <Text style={styles.scoreColLabel}>Cuối kỳ</Text>
            <Text style={styles.scoreColWeight}>70%</Text>
            <Text style={styles.scoreColVal}>{grade.finalScore.toFixed(1)}</Text>
          </View>

          <View style={styles.scoreDivider} />

          <View style={[styles.scoreCol, styles.scoreColHighlight]}>
            <Text style={styles.scoreColHighlightLabel}>Tổng kết 10</Text>
            <Text style={styles.scoreColHighlightVal}>{grade.totalScore10.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header
        title="Bảng điểm học tập"
        subtitle={`PTIT S-Link • ${studentProfile.studentCode}`}
        showBack
        onBack={() => navigation.goBack()}
        variant="ptitRed"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cumulative Stats Hero Card (PTIT S-Link Style) */}
        <View style={styles.heroCard}>
          {/* Header Row */}
          <View style={styles.heroHeader}>
            <View style={styles.heroIconWrap}>
              <GraduationCapIcon color="#FFFFFF" size={22} />
            </View>
            <View style={styles.heroHeaderTextCol}>
              <Text style={styles.heroSubTitle} numberOfLines={1}>
                HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG
              </Text>
              <View style={styles.heroMainTitleRow}>
                <Text style={styles.heroMainTitle}>Kết quả học tập toàn khóa</Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheckIcon color="#FFFFFF" size={13} />
                  <Text style={styles.verifiedText}>Chính thức</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Primary Score & Academic Rank Row - Fixed Alignment */}
          <View style={styles.primaryScoreRow}>
            <View style={styles.primaryGpaBox}>
              <Text style={styles.primaryGpaLabel}>GPA TÍCH LŨY (HỆ 4)</Text>
              <View style={styles.primaryGpaValueRow}>
                <Text style={styles.primaryGpaValue}>{studentProfile.gpaScale4.toFixed(2)}</Text>
                <Text style={styles.primaryGpaMax}>/ 4.00</Text>
              </View>
            </View>

            {/* Academic Rank Honor Pill - Perfectly Aligned and Styled */}
            <View style={styles.rankPill}>
              <View style={styles.rankPillContent}>
                <Text style={styles.rankPillSub}>Xếp loại học lực</Text>
                <Text style={styles.rankPillTitle}>{studentProfile.academicRank}</Text>
              </View>
            </View>
          </View>

          {/* Credits Progress Track */}
          <View style={styles.creditProgressContainer}>
            <View style={styles.creditProgressHeader}>
              <Text style={styles.creditProgressText}>
                Tín chỉ tích lũy: {studentProfile.totalCredits}/{studentProfile.requiredCredits} TC
              </Text>
              <Text style={styles.creditProgressPercent}>{creditCompletionPercent}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${creditCompletionPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Bottom Secondary Stats Row (3 Columns) */}
          <View style={styles.statsSecondaryRow}>
            <View style={styles.secondaryStatItem}>
              <Text style={styles.secondaryStatLabel}>GPA Thang 10</Text>
              <Text style={styles.secondaryStatVal}>{studentProfile.gpaScale10.toFixed(2)}</Text>
            </View>

            <View style={styles.secondaryStatDivider} />

            <View style={styles.secondaryStatItem}>
              <Text style={styles.secondaryStatLabel}>Tín chỉ đạt</Text>
              <Text style={styles.secondaryStatVal}>{studentProfile.totalCredits} TC</Text>
            </View>

            <View style={styles.secondaryStatDivider} />

            <View style={styles.secondaryStatItem}>
              <Text style={styles.secondaryStatLabel}>Điểm rèn luyện</Text>
              <Text style={styles.secondaryStatVal}>88 (Tốt)</Text>
            </View>
          </View>
        </View>

        {/* Semester Selector Tabs */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Chọn học kỳ tra cứu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {semesterGrades.map((sem, idx) => {
              const isActive = selectedSemesterIndex === idx;
              return (
                <Pressable
                  key={idx}
                  style={[styles.semesterTab, isActive && styles.semesterTabActive]}
                  onPress={() => setSelectedSemesterIndex(idx)}
                >
                  <Text style={[styles.semesterTabText, isActive && styles.semesterTabTextActive]}>
                    {sem.semesterName}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Current Semester Highlight Card */}
        <View style={styles.semesterSummaryCard}>
          <View style={styles.semesterSummaryHeader}>
            <BookIcon color={THEME.primary} size={18} />
            <Text style={styles.semesterSummaryTitle}>{currentSemester.semesterName}</Text>
          </View>
          <View style={styles.semesterStatsRow}>
            <View style={styles.semesterStatBox}>
              <Text style={styles.semStatLabel}>GPA Học kỳ (4.0)</Text>
              <Text style={styles.semStatHighlight}>{currentSemester.gpaSemester4.toFixed(2)}</Text>
            </View>

            <View style={styles.semStatDivider} />

            <View style={styles.semesterStatBox}>
              <Text style={styles.semStatLabel}>GPA Học kỳ (10.0)</Text>
              <Text style={styles.semStatValue}>{currentSemester.gpaSemester10.toFixed(2)}</Text>
            </View>

            <View style={styles.semStatDivider} />

            <View style={styles.semesterStatBox}>
              <Text style={styles.semStatLabel}>Số TC đạt</Text>
              <Text style={styles.semStatValue}>{currentSemester.creditsEarned} TC</Text>
            </View>
          </View>
        </View>

        {/* Subject Grades List */}
        <View style={styles.sectionWrap}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionTitle}>
              Bảng điểm chi tiết ({currentSemester.subjects.length} môn học)
            </Text>
            <View style={styles.passedPill}>
              <CheckCircleIcon color={THEME.success} size={14} filled />
              <Text style={styles.passedPillText}>Đạt 100%</Text>
            </View>
          </View>

          {currentSemester.subjects.map(renderSubjectGradeCard)}
        </View>

        {/* Grading Scale Conversion Guide */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>Thang điểm quy đổi PTIT (Học viện CNBCVT)</Text>
          <View style={styles.guideRow}>
            <Text style={styles.guideItem}>• A / A+: 8.5 - 10 (4.0) - Giỏi / Xuất sắc</Text>
            <Text style={styles.guideItem}>• B / B+: 7.0 - 8.4 (3.0 - 3.5) - Khá</Text>
          </View>
          <View style={styles.guideRow}>
            <Text style={styles.guideItem}>• C / C+: 5.5 - 6.9 (2.0 - 2.5) - Trung bình</Text>
            <Text style={styles.guideItem}>• D / D+: 4.0 - 5.4 (1.0 - 1.5) - Đạt</Text>
          </View>
          <View style={styles.guideRow}>
            <Text style={[styles.guideItem, { color: THEME.danger }]}>
              • F: Dưới 4.0 (0.0) - Không đạt (Học lại)
            </Text>
          </View>
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
    backgroundColor: THEME.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  heroHeaderTextCol: {
    flex: 1,
  },
  heroSubTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.ptit.goldLight,
    letterSpacing: 0.3,
  },
  heroMainTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  heroMainTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    marginLeft: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  primaryScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryGpaBox: {
    flex: 1,
  },
  primaryGpaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.3,
  },
  primaryGpaValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  primaryGpaValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  primaryGpaMax: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    marginLeft: 4,
  },
  rankPill: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  rankPillContent: {
    alignItems: 'center',
  },
  rankPillSub: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  rankPillTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.primary,
  },
  creditProgressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  creditProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  creditProgressText: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  creditProgressPercent: {
    fontSize: 11.5,
    color: THEME.accent,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24', // Gold progress fill
    borderRadius: 3,
  },
  statsSecondaryRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  secondaryStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryStatLabel: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
  },
  secondaryStatVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionWrap: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 10,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  passedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  passedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.success,
  },
  tabsRow: {
    gap: 8,
  },
  semesterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  semesterTabActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  semesterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSecondary,
  },
  semesterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  semesterSummaryCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  semesterSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  semesterSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  semesterStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.cardAlt,
    borderRadius: 12,
    paddingVertical: 10,
  },
  semesterStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  semStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: THEME.border,
  },
  semStatLabel: {
    fontSize: 10.5,
    color: THEME.textMuted,
    marginBottom: 2,
  },
  semStatHighlight: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.primary,
  },
  semStatValue: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  gradeCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  gradeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  gradeCodeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectCodePill: {
    backgroundColor: THEME.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectCodeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.primary,
  },
  creditText: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  gradeBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeLetterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  gradeLetterSuccess: {
    backgroundColor: THEME.successLight,
  },
  gradeLetterPrimary: {
    backgroundColor: THEME.primaryLight,
  },
  gradeLetterWarning: {
    backgroundColor: THEME.warningLight,
  },
  gradeLetterDanger: {
    backgroundColor: THEME.dangerLight,
  },
  gradeLetterText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: THEME.textPrimary,
  },
  gradeScale4Text: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.textSecondary,
  },
  subjectNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 10,
  },
  scoreGrid: {
    flexDirection: 'row',
    backgroundColor: THEME.cardAlt,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreDivider: {
    width: 1,
    height: 28,
    backgroundColor: THEME.border,
  },
  scoreColLabel: {
    fontSize: 9.5,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  scoreColWeight: {
    fontSize: 8.5,
    color: THEME.textMuted,
  },
  scoreColVal: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  scoreColHighlight: {
    backgroundColor: THEME.primaryLight,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  scoreColHighlightLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.primary,
  },
  scoreColHighlightVal: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.primary,
    marginTop: 1,
  },
  guideCard: {
    backgroundColor: THEME.cardAlt,
    borderRadius: 14,
    padding: 14,
    marginTop: 4,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textSecondary,
    marginBottom: 6,
  },
  guideRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  guideItem: {
    fontSize: 11,
    color: THEME.textSecondary,
    flex: 1,
  },
});
