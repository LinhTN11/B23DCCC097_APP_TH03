import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';

/**
 * Props bắt buộc:
 * - onOpenSchedule: mở tab Thời khóa biểu.
 * - onOpenGrades: mở màn Bảng điểm.
 * - onOpenModal: callback(modalKey) mở một trong các modal ('exam' | 'training' | 'tuition' | 'survey' | 'onestop' | 'news').
 * Props tùy chọn:
 * - gpa: điểm GPA hiển thị phụ đề.
 * - examCount: số môn thi.
 * - trainingScore: điểm rèn luyện.
 * - notificationCount: số thông báo/nhắc hạn.
 */
function SLinkServiceGrid({
  gpa = 0,
  examCount = 5,
  trainingScore = 88,
  notificationCount = 4,
  onOpenSchedule,
  onOpenGrades,
  onOpenModal,
}) {
  const services = [
    {
      key: 'schedule',
      title: 'Lịch học',
      subtitle: 'Tuần này',
      icon: 'calendar',
      onPress: onOpenSchedule,
    },
    {
      key: 'exam',
      title: 'Lịch thi',
      subtitle: `${examCount} môn`,
      icon: 'exam',
      onPress: () => onOpenModal && onOpenModal('exam'),
    },
    {
      key: 'grades',
      title: 'Bảng điểm',
      subtitle: `GPA ${Number(gpa || 0).toFixed(2)}`,
      icon: 'graduation',
      onPress: onOpenGrades,
    },
    {
      key: 'training',
      title: 'Điểm rèn luyện',
      subtitle: `${trainingScore} - Tốt`,
      icon: 'training',
      onPress: () => onOpenModal && onOpenModal('training'),
    },
    {
      key: 'tuition',
      title: 'Học phí',
      subtitle: 'Đã nộp đủ',
      icon: 'tuition',
      onPress: () => onOpenModal && onOpenModal('tuition'),
    },
    {
      key: 'survey',
      title: 'Khảo sát',
      subtitle: 'Giảng viên',
      icon: 'survey',
      onPress: () => onOpenModal && onOpenModal('survey'),
    },
    {
      key: 'onestop',
      title: 'Một cửa SV',
      subtitle: 'Thủ tục số',
      icon: 'onestop',
      onPress: () => onOpenModal && onOpenModal('onestop'),
    },
    {
      key: 'news',
      title: 'Thông báo',
      subtitle: `${notificationCount} tin mới`,
      icon: 'news',
      onPress: () => onOpenModal && onOpenModal('news'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>TIỆN ÍCH SỐ PTIT S-LINK</Text>
      <View style={styles.grid}>
        {services.map((service) => (
          <Pressable
            key={service.key}
            onPress={service.onPress}
            accessibilityRole="button"
            accessibilityLabel={`Tiện ích ${service.title}, ${service.subtitle}`}
            style={({ pressed }) => [
              styles.gridItem,
              pressed ? styles.pressed : null,
            ]}>
            <View style={styles.iconCircle}>
              <Icon name={service.icon} color={colors.primary} size={22} />
            </View>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {service.title}
            </Text>
            <Text style={styles.itemSub} numberOfLines={1}>
              {service.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
  },
  gridItem: {
    width: '25%',
    minHeight: spacing.touch + 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.xxs,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  itemTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  itemSub: {
    fontSize: typography.sizes.xxs,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});

export default SLinkServiceGrid;
