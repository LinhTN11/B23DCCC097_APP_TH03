import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import Icon from '../common/Icon';
import SyncBadge from '../common/SyncBadge';

/**
 * Props bắt buộc:
 * - student: thông tin sinh viên {fullName, studentCode, className, major}.
 * - onOpenNotifications: callback mở modal thông báo & nhắc hạn.
 * Props tùy chọn:
 * - pendingProfile: boolean trạng thái chờ đồng bộ hồ sơ.
 * - pendingCount: số lượng thay đổi chờ đồng bộ.
 * - isOnline: trạng thái kết nối mạng.
 * - syncing: đang đồng bộ hay không.
 * - onSyncNow: callback bấm đồng bộ ngay.
 * - notificationCount: số lượng nhắc hạn 24h + thông báo mới.
 * - onPressAvatar: callback khi bấm vào avatar.
 */
function PtitHeader({
  student,
  pendingProfile = false,
  pendingCount = 0,
  isOnline = true,
  syncing = false,
  onSyncNow,
  notificationCount = 0,
  onOpenNotifications,
  onPressAvatar,
}) {
  const fullName = (student && student.fullName) || 'Nguyễn Văn An';
  const studentCode = (student && student.studentCode) || 'B21DCCN088';
  const className = (student && student.className) || 'D21CQCN01-B';
  const major = (student && student.major) || 'Công nghệ thông tin';
  const initial =
    fullName.trim().charAt(fullName.trim().lastIndexOf(' ') + 1) || 'A';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandBadge}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>
            PTIT S-LINK • CỔNG THÔNG TIN SINH VIÊN
          </Text>
        </View>

        <Pressable
          onPress={onOpenNotifications}
          accessibilityRole="button"
          accessibilityLabel={`Thông báo và nhắc hạn, có ${notificationCount} mục`}
          style={({ pressed }) => [
            styles.bellButton,
            pressed ? styles.pressed : null,
          ]}>
          <Icon name="bell" color={colors.white} size={22} />
          {notificationCount > 0 ? (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>
                {notificationCount > 9 ? '9+' : notificationCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.infoCol}>
          <Text style={styles.greeting}>Xin chào sinh viên,</Text>
          <Text style={styles.name}>{fullName}</Text>
          <View style={styles.metaRow}>
            <View style={styles.codePill}>
              <Text style={styles.codeText}>{studentCode}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.metaText}>{className}</Text>
          </View>
          <Text style={styles.majorText} numberOfLines={1}>
            Ngành: {major}
          </Text>
        </View>

        <Pressable
          onPress={onPressAvatar}
          disabled={!onPressAvatar}
          accessibilityRole="button"
          accessibilityLabel="Mở hồ sơ cá nhân sinh viên"
          style={({ pressed }) => [
            styles.avatarButton,
            pressed ? styles.pressed : null,
          ]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initial.toUpperCase()}</Text>
          </View>
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: isOnline ? colors.success : colors.warning },
            ]}
          />
        </Pressable>
      </View>

      {pendingProfile || pendingCount > 0 ? (
        <View style={styles.syncRow}>
          <View style={styles.syncLeft}>
            <SyncBadge pending={pendingProfile || pendingCount > 0} />
            {pendingCount > 0 ? (
              <Text style={styles.syncCountText}>
                {pendingCount} thao tác chờ mạng
              </Text>
            ) : null}
          </View>

          {pendingCount > 0 && onSyncNow ? (
            <Pressable
              onPress={onSyncNow}
              disabled={!isOnline || syncing}
              accessibilityRole="button"
              accessibilityLabel={`Đồng bộ ngay ${pendingCount} thay đổi`}
              style={({ pressed }) => [
                styles.syncButton,
                !isOnline || syncing ? styles.syncButtonDisabled : null,
                pressed ? styles.pressed : null,
              ]}>
              <Icon name="sync" color={colors.primary} size={14} />
              <Text style={styles.syncButtonText}>
                {syncing
                  ? 'Đang đồng bộ...'
                  : isOnline
                  ? `Đồng bộ ngay (${pendingCount})`
                  : `Chờ mạng (${pendingCount})`}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    gap: spacing.xs,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  brandText: {
    color: colors.white,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
    letterSpacing: 0.4,
  },
  bellButton: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  bellBadgeText: {
    color: colors.white,
    fontSize: typography.sizes.xxs,
    fontWeight: typography.weights.extrabold,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  infoCol: {
    flex: 1,
  },
  greeting: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  name: {
    color: colors.white,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    marginTop: spacing.xxs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  codePill: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.radiusSm,
  },
  codeText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.extrabold,
  },
  dot: {
    color: colors.primaryLight,
    marginHorizontal: spacing.xs,
    fontSize: typography.sizes.xs,
  },
  metaText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  majorText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  avatarButton: {
    minWidth: spacing.touch,
    minHeight: spacing.touch,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  syncRow: {
    marginTop: spacing.md,
    paddingTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  syncCountText: {
    color: colors.primaryLight,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  syncButton: {
    minHeight: spacing.touch,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusMd,
    gap: spacing.xs,
  },
  syncButtonDisabled: {
    opacity: 0.65,
  },
  syncButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  pressed: {
    opacity: 0.85,
  },
});

export default PtitHeader;
