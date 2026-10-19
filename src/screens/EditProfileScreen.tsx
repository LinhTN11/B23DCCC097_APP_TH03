import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { RootStackScreenProps } from '../navigation/types';
import { THEME } from '../constants/theme';
import { Header } from '../components/Header';
import { UserIcon, MailIcon, PhoneIcon } from '../components/AppIcons';

export const EditProfileScreen: React.FC<RootStackScreenProps<'EditProfile'>> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { studentProfile, updateProfile } = useApp();

  const [fullName, setFullName] = useState(studentProfile.fullName);
  const [email, setEmail] = useState(studentProfile.email);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Họ và tên không được để trống.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return false;
    }
    if (!phone.trim() || phone.replace(/\s+/g, '').length < 9) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập số điện thoại hợp lệ.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      Alert.alert('Thành công', 'Đã cập nhật thông tin sinh viên thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Header
          title="Chỉnh sửa thông tin"
          subtitle="Hồ sơ sinh viên PTIT S-Link"
          showBack
          onBack={() => navigation.goBack()}
          variant="ptitRed"
        />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Notice Card */}
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>Lưu ý sinh viên:</Text>
            <Text style={styles.noticeText}>
              Theo quy chế đào tạo, bạn có thể tự cập nhật họ tên, email liên lạc và số điện thoại. Mã sinh viên, lớp và ngành học được quản lý cố định bởi Phòng Đào tạo.
            </Text>
          </View>

          {/* Fixed Fields */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin cố định</Text>

            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>Mã sinh viên</Text>
              <Text style={styles.readOnlyValue}>{studentProfile.studentCode}</Text>
            </View>

            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>Lớp sinh hoạt</Text>
              <Text style={styles.readOnlyValue}>{studentProfile.className}</Text>
            </View>

            <View style={styles.readOnlyItem}>
              <Text style={styles.readOnlyLabel}>Ngành đào tạo</Text>
              <Text style={styles.readOnlyValue}>{studentProfile.major}</Text>
            </View>
          </View>

          {/* Editable Fields Form */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin có thể chỉnh sửa</Text>

            {/* Họ và tên */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <UserIcon color={THEME.primary} size={16} />
                <Text style={styles.inputLabel}>Họ và tên sinh viên *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên..."
                placeholderTextColor={THEME.textMuted}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <MailIcon color={THEME.primary} size={16} />
                <Text style={styles.inputLabel}>Email liên lạc *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email sinh viên..."
                placeholderTextColor={THEME.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Số điện thoại */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <PhoneIcon color={THEME.primary} size={16} />
                <Text style={styles.inputLabel}>Số điện thoại *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại..."
                placeholderTextColor={THEME.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.btnPressed,
              isSubmitting && styles.btnDisabled,
            ]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Text>
          </Pressable>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  noticeCard: {
    backgroundColor: THEME.primaryLight,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primaryDark,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 18,
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 14,
  },
  readOnlyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderLight,
  },
  readOnlyLabel: {
    fontSize: 13,
    color: THEME.textSecondary,
  },
  readOnlyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textPrimary,
    marginLeft: 6,
  },
  input: {
    backgroundColor: THEME.cardAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.textPrimary,
  },
  submitBtn: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    ...THEME.shadow,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
