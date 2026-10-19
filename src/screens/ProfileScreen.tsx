import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { AppTabScreenProps } from '../navigation/types';
import { THEME } from '../constants/theme';
import { Badge } from '../components/Badge';
import {
  MailIcon,
  PhoneIcon,
  EditIcon,
  GraduationCapIcon,
  ChevronRightIcon,
  BookIcon,
  QrCodeIcon,
} from '../components/AppIcons';

export const ProfileScreen: React.FC<AppTabScreenProps<'ProfileTab'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { studentProfile, resetToDefault } = useApp();

  const handleResetData = () => {
    Alert.alert(
      'Khôi phục dữ liệu mẫu',
      'Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu mẫu ban đầu của PTIT S-Link không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: async () => {
            await resetToDefault();
            Alert.alert('Thành công', 'Dữ liệu đã được khôi phục về trạng thái ban đầu.');
          },
        },
      ]
    );
  };

  const creditPercentage = Math.round(
    (studentProfile.totalCredits / studentProfile.requiredCredits) * 100
  );

  return (
    <View style={styles.container}>
      {/* S-Link Red Header */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 14) }]}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerSub}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</Text>
          <Text style={styles.headerTitle}>Hồ sơ sinh viên S-Link</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Digital Student Card (Thẻ sinh viên PTIT) */}
        <View style={styles.studentCardWrapper}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardSchoolName}>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</Text>
              <Text style={styles.cardSubTitle}>THẺ SINH VIÊN</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {/* Avatar with gold border */}
            <View style={styles.avatarWrap}>
              {studentProfile.avatarUrl ? (
                <Image source={{ uri: studentProfile.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {studentProfile.fullName.charAt(studentProfile.fullName.lastIndexOf(' ') + 1) || 'A'}
                  </Text>
                </View>
              )}
            </View>

            {/* Student info */}
            <View style={styles.cardInfoCol}>
              <Text style={styles.cardFullName}>{studentProfile.fullName}</Text>
              <View style={styles.cardMssvRow}>
                <Text style={styles.cardMssvLabel}>MSSV:</Text>
                <Text style={styles.cardMssvVal}>{studentProfile.studentCode}</Text>
              </View>
              <Text style={styles.cardSubInfo}>Lớp: {studentProfile.className}</Text>
              <Text style={styles.cardSubInfo} numberOfLines={1}>
                {studentProfile.major}
              </Text>
              <Text style={styles.cardYearInfo}>{studentProfile.academicYear}</Text>
            </View>
          </View>

          {/* Card Footer Barcode & QR code */}
          <View style={styles.cardFooter}>
            <View style={styles.barcodeVisual}>
              <View style={styles.barcodeBar} />
              <View style={[styles.barcodeBar, { width: 3 }]} />
              <View style={[styles.barcodeBar, { width: 1 }]} />
              <View style={[styles.barcodeBar, { width: 4 }]} />
              <View style={[styles.barcodeBar, { width: 2 }]} />
              <View style={[styles.barcodeBar, { width: 5 }]} />
              <View style={[styles.barcodeBar, { width: 2 }]} />
              <View style={[styles.barcodeBar, { width: 3 }]} />
              <View style={[styles.barcodeBar, { width: 1 }]} />
              <View style={[styles.barcodeBar, { width: 4 }]} />
              <View style={[styles.barcodeBar, { width: 2 }]} />
            </View>
            <View style={styles.qrIndicator}>
              <QrCodeIcon color="#FFFFFF" size={18} />
              <Text style={styles.qrIndicatorText}>Scan Barcode</Text>
            </View>
          </View>
        </View>

        {/* Academic Performance Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleRow}>
              <GraduationCapIcon color={THEME.primary} size={20} />
              <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Kết quả học tập tích lũy</Text>
            </View>
            <View style={styles.honorBadge}>
              <Text style={styles.honorBadgeText}>{studentProfile.academicRank}</Text>
            </View>
          </View>

          {/* 3 Balanced GPA Boxes */}
          <View style={styles.gpaContainer}>
            <View style={styles.gpaBox}>
              <Text style={styles.gpaBoxLabel}>GPA Hệ 4</Text>
              <Text style={styles.gpaBoxValue}>{studentProfile.gpaScale4.toFixed(2)}</Text>
              <Text style={styles.gpaBoxMax}>/ 4.00</Text>
            </View>

            <View style={styles.gpaBox}>
              <Text style={styles.gpaBoxLabel}>GPA Hệ 10</Text>
              <Text style={styles.gpaBoxValue}>{studentProfile.gpaScale10.toFixed(2)}</Text>
              <Text style={styles.gpaBoxMax}>/ 10.0</Text>
            </View>

            <View style={styles.gpaBox}>
              <Text style={styles.gpaBoxLabel}>Tín chỉ đạt</Text>
              <Text style={styles.gpaBoxValue}>{studentProfile.totalCredits}</Text>
              <Text style={styles.gpaBoxMax}>/ {studentProfile.requiredCredits} TC</Text>
            </View>
          </View>

          {/* Credits Progress Bar */}
          <View style={styles.creditProgressSection}>
            <View style={styles.creditHeaderRow}>
              <Text style={styles.creditProgressLabel}>Tiến độ hoàn thành chương trình</Text>
              <Text style={styles.creditProgressPercent}>{creditPercentage}%</Text>
            </View>
            <View style={styles.creditTrack}>
              <View style={[styles.creditFill, { width: `${creditPercentage}%` }]} />
            </View>
          </View>

          {/* Button to view full grade transcript */}
          <Pressable
            style={({ pressed }) => [styles.gradeDetailBtn, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate('GradeDetail')}
          >
            <View style={styles.gradeDetailBtnContent}>
              <BookIcon color="#FFFFFF" size={18} />
              <Text style={styles.gradeDetailBtnText}>
                Xem chi tiết bảng điểm các học kỳ
              </Text>
            </View>
            <ChevronRightIcon color="#FFFFFF" size={18} />
          </Pressable>
        </View>

        {/* Contact Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
            <Pressable
              style={styles.editBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <EditIcon color={THEME.primary} size={15} />
              <Text style={styles.editBtnText}>Chỉnh sửa</Text>
            </Pressable>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIconWrap}>
              <MailIcon color={THEME.primary} size={18} />
            </View>
            <View style={styles.contactTextCol}>
              <Text style={styles.contactLabel}>Email sinh viên PTIT</Text>
              <Text style={styles.contactValue}>{studentProfile.email}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIconWrap}>
              <PhoneIcon color={THEME.primary} size={18} />
            </View>
            <View style={styles.contactTextCol}>
              <Text style={styles.contactLabel}>Số điện thoại</Text>
              <Text style={styles.contactValue}>{studentProfile.phone}</Text>
            </View>
          </View>
        </View>

        {/* Reset Data Button */}
        <Pressable
          style={({ pressed }) => [styles.resetBtn, pressed && styles.cardPressed]}
          onPress={handleResetData}
        >
          <Text style={styles.resetBtnText}>Khôi phục dữ liệu mẫu ban đầu</Text>
        </Pressable>

        <View style={{ height: 90 }} />
      </ScrollView>
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
    paddingBottom: 14,
    ...THEME.shadowLg,
  },
  headerTitleRow: {},
  headerSub: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.ptit.goldLight,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
  },
  studentCardWrapper: {
    backgroundColor: '#BA1B1D',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardSchoolName: {
    fontSize: 9.5,
    fontWeight: '700',
    color: THEME.ptit.goldLight,
    letterSpacing: 0.5,
  },
  cardSubTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  cardStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  cardStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: {
    marginRight: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: THEME.accent,
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: THEME.accent,
  },
  avatarInitial: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.primary,
  },
  cardInfoCol: {
    flex: 1,
  },
  cardFullName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  cardMssvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardMssvLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginRight: 4,
  },
  cardMssvVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FDE68A',
  },
  cardSubInfo: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  cardYearInfo: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  barcodeVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 18,
  },
  barcodeBar: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  qrIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qrIndicatorText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  honorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  honorBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.ptit.gold,
  },
  gpaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gpaBox: {
    flex: 1,
    backgroundColor: THEME.cardAlt,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  gpaBoxLabel: {
    fontSize: 11,
    color: THEME.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  gpaBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.primary,
  },
  gpaBoxMax: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 1,
  },
  creditProgressSection: {
    marginBottom: 14,
  },
  creditHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  creditProgressLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  creditProgressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
  },
  creditTrack: {
    height: 7,
    backgroundColor: THEME.cardAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  creditFill: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 4,
  },
  gradeDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  gradeDetailBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeDetailBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: THEME.primaryLight,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
    marginLeft: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextCol: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  resetBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: THEME.cardAlt,
    marginTop: 8,
  },
  resetBtnText: {
    color: THEME.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
});
