import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { validateProfile } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import SyncBadge from '../../components/common/SyncBadge';
import InfoRow from '../../components/profile/InfoRow';
import Icon from '../../components/common/Icon';

export default function EditProfileScreen({ navigation }) {
  const { student, updateProfile } = useAppData();
  const { isOnline, pendingActions } = useSync();
  const [fullName, setFullName] = useState(student ? student.fullName : '');
  const [email, setEmail] = useState(student ? student.email : '');
  const [phone, setPhone] = useState(student ? student.phone : '');
  const [className, setClassName] = useState(
    student ? student.className : '',
  );
  const [major, setMajor] = useState(student ? student.major : '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const pendingProfile = pendingActions.some((action) =>
    String(action.url).includes('/students/'),
  );

  const handleSave = async () => {
    const validationErrors = validateProfile({ fullName, email, phone });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        className: className.trim(),
        major: major.trim(),
      });
      navigation.goBack();
      Alert.alert(
        result.queued ? 'Đã lưu vào hàng đợi Outbox' : 'Đã cập nhật thông tin',
        result.queued
          ? 'Bạn đang offline. Thay đổi đã được lưu vào Outbox và sẽ tự động đồng bộ khi có mạng.'
          : 'Thông tin hồ sơ sinh viên PTIT đã được cập nhật thành công.',
      );
    } catch (saveError) {
      Alert.alert(
        'Không thể cập nhật',
        saveError.message || 'Vui lòng thử lại sau.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (!student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin sinh viên..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      {/* Hướng dẫn đồng bộ Offline / Conflict B5 */}
      <View
        style={[
          styles.syncCard,
          isOnline ? styles.syncCardOnline : styles.syncCardOffline,
        ]}>
        <View style={styles.syncHeaderRow}>
          <View style={styles.syncTitleGroup}>
            <Icon
              name={isOnline ? 'sync' : 'cloud-off'}
              color={isOnline ? colors.primary : colors.warning}
              size={18}
            />
            <Text style={styles.syncTitle}>
              {isOnline
                ? 'Chế độ trực tuyến (Đồng bộ tức thì)'
                : 'Chế độ ngoại tuyến (Hàng đợi Outbox)'}
            </Text>
          </View>
          <SyncBadge pending={pendingProfile} />
        </View>
        <Text style={styles.syncDesc}>
          {isOnline
            ? 'Thay đổi sẽ được gửi trực tiếp lên máy chủ khi lưu. Nếu xảy ra xung đột phiên bản (updatedAt), hệ thống sẽ ưu tiên bản ghi mới hơn trên máy chủ.'
            : 'Bạn đang offline. Thay đổi vẫn được áp dụng ngay trên máy (Optimistic UI), xếp vào hàng đợi Outbox và tự động đồng bộ khi có mạng trở lại (giải quyết xung đột theo updatedAt).'}
        </Text>
      </View>

      {/* Thông tin định danh cố định */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Thông tin định danh PTIT</Text>
        <InfoRow label="Mã sinh viên" value={student.studentCode} />
        <InfoRow
          label="Khoa đào tạo"
          value={student.faculty || 'Khoa Công nghệ thông tin 1'}
        />
        <InfoRow
          label="Hệ đào tạo"
          value={student.trainingSystem || 'Đại học chính quy'}
        />
      </View>

      {/* Biểu mẫu chỉnh sửa */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân & Liên hệ</Text>

        <FormInput
          label="Họ và tên *"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          placeholder="Nguyễn Văn An"
          autoCapitalize="words"
        />
        <FormInput
          label="Email sinh viên *"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="an.nv@stu.ptit.edu.vn"
        />
        <FormInput
          label="Số điện thoại *"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          placeholder="0912345678"
        />
        <FormInput
          label="Lớp hành chính"
          value={className}
          onChangeText={setClassName}
          placeholder="CNTT-K21A"
        />
        <FormInput
          label="Chuyên ngành"
          value={major}
          onChangeText={setMajor}
          placeholder="Công nghệ thông tin"
        />
      </View>

      <AppButton
        title="Lưu thay đổi"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        accessibilityLabel="Lưu thông tin cá nhân"
      />
      <View style={styles.cancelWrap}>
        <AppButton
          title="Hủy"
          onPress={() => navigation.goBack()}
          variant="outline"
          accessibilityLabel="Hủy chỉnh sửa thông tin"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  syncCard: {
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  syncCardOnline: {
    backgroundColor: colors.primaryLight,
  },
  syncCardOffline: {
    backgroundColor: colors.warningLight,
  },
  syncHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  syncTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  syncTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    flex: 1,
  },
  syncDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  cancelWrap: {
    marginTop: spacing.md,
  },
});
