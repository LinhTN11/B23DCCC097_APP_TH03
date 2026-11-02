import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { formatDateTime, parseDate, toDateTimeInput } from '../../utils/date';
import { validateAssignment } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';

function buildDueDatePlusDays(daysToAdd = 1) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 0, 0);
  return toDateTimeInput(date);
}

const QUICK_DUE_PRESETS = [
  { key: 'tomorrow', label: 'Ngày mai 23:59', days: 1 },
  { key: '3days', label: '+3 ngày', days: 3 },
  { key: '7days', label: '+7 ngày', days: 7 },
];

export default function AssignmentFormScreen({ navigation }) {
  const { courses, addAssignment } = useAppData();
  const { isOnline } = useSync();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(
    courses.length > 0 ? courses[0].id : null,
  );
  const [dueDate, setDueDate] = useState(buildDueDatePlusDays(1));
  const [selectedPreset, setSelectedPreset] = useState('tomorrow');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId && courses.length > 0) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId]);

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        label: `${course.code} - ${course.name}`,
        value: course.id,
      })),
    [courses],
  );

  const handleSelectPreset = (preset) => {
    const formatted = buildDueDatePlusDays(preset.days);
    setDueDate(formatted);
    setSelectedPreset(preset.key);
    if (errors.dueDate) {
      setErrors((prev) => ({ ...prev, dueDate: undefined }));
    }
  };

  const handleChangeDueDate = (value) => {
    setDueDate(value);
    setSelectedPreset(null);
  };

  const handleSave = async () => {
    const validationErrors = validateAssignment({ title, dueDate });
    const nextErrors = { ...validationErrors };
    if (!courseId) {
      nextErrors.courseId = 'Vui lòng chọn môn học';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const parsedDueDate = parseDate(dueDate);
    if (!parsedDueDate) {
      return;
    }

    setSaving(true);
    try {
      const result = await addAssignment({
        courseId,
        title,
        description,
        dueDate: parsedDueDate.toISOString(),
      });
      navigation.goBack();
      Alert.alert(
        result.queued ? 'Đã lưu ngoại tuyến' : 'Đã thêm bài tập',
        result.queued
          ? 'Bài tập được xếp vào hàng đợi và sẽ tự đồng bộ khi có mạng.'
          : 'Bài tập mới đã được thêm vào danh sách.',
      );
    } catch (saveError) {
      Alert.alert(
        'Không thể thêm bài tập',
        saveError.message || 'Vui lòng thử lại sau.',
      );
    } finally {
      setSaving(false);
    }
  };

  const parsedPreview = parseDate(dueDate);

  return (
    <ScreenContainer scroll>
      <View
        style={[
          styles.offlineNote,
          !isOnline ? styles.offlineNoteWarning : null,
        ]}>
        <Icon
          name={isOnline ? 'sync' : 'cloud-off'}
          color={isOnline ? colors.info : colors.warning}
          size={18}
        />
        <Text
          style={[
            styles.offlineText,
            !isOnline ? styles.offlineTextWarning : null,
          ]}>
          {isOnline
            ? 'Đang trực tuyến: Bài tập sẽ được lưu trực tiếp lên máy chủ.'
            : 'Bạn đang offline: Bài tập sẽ được lưu vào hàng đợi (Outbox) và tự đồng bộ sau.'}
        </Text>
      </View>

      <View style={styles.formCard}>
        <FormInput
          label="Tiêu đề bài tập *"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          placeholder="Ví dụ: Hoàn thiện màn hình đăng nhập"
        />

        <Text style={styles.label}>Môn học *</Text>
        {courseOptions.length > 0 ? (
          <FilterChips
            options={courseOptions}
            selected={courseId}
            onSelect={setCourseId}
          />
        ) : (
          <Text style={styles.errorText}>Chưa có môn học để chọn.</Text>
        )}
        {errors.courseId ? (
          <Text style={styles.errorText}>{errors.courseId}</Text>
        ) : null}

        <View style={styles.spacer} />

        <Text style={styles.label}>Chọn nhanh hạn nộp</Text>
        <View style={styles.presetRow}>
          {QUICK_DUE_PRESETS.map((preset) => {
            const active = selectedPreset === preset.key;
            return (
              <Pressable
                key={preset.key}
                onPress={() => handleSelectPreset(preset)}
                accessibilityRole="button"
                accessibilityLabel={`Chọn hạn nộp ${preset.label}`}
                style={({ pressed }) => [
                  styles.presetBtn,
                  active ? styles.presetBtnActive : null,
                  pressed ? styles.pressed : null,
                ]}>
                <Icon
                  name="clock"
                  color={active ? colors.white : colors.primary}
                  size={14}
                />
                <Text
                  style={[
                    styles.presetText,
                    active ? styles.presetTextActive : null,
                  ]}>
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FormInput
          label="Hạn nộp (YYYY-MM-DDTHH:mm) *"
          value={dueDate}
          onChangeText={handleChangeDueDate}
          error={errors.dueDate}
          placeholder="YYYY-MM-DDTHH:mm"
          autoCapitalize="none"
        />
        <Text style={styles.hint}>
          {parsedPreview
            ? `Thời hạn hiển thị: ${formatDateTime(parsedPreview)}`
            : 'Định dạng: YYYY-MM-DDTHH:mm, ví dụ 2026-11-09T23:59.'}
        </Text>

        <FormInput
          label="Mô tả & Yêu cầu"
          value={description}
          onChangeText={setDescription}
          placeholder="Yêu cầu chi tiết, định dạng nộp bài, ghi chú..."
          multiline
        />
      </View>

      <AppButton
        title="Lưu bài tập"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        accessibilityLabel="Lưu bài tập mới"
      />
      <View style={styles.cancel}>
        <AppButton
          title="Hủy"
          onPress={() => navigation.goBack()}
          variant="outline"
          accessibilityLabel="Hủy thêm bài tập"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  offlineNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoLight,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  offlineNoteWarning: {
    backgroundColor: colors.warningLight,
  },
  offlineText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.info,
    lineHeight: typography.lineHeights.md,
  },
  offlineTextWarning: {
    color: colors.warning,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  spacer: {
    height: spacing.md,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: spacing.touch,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  presetBtnActive: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.82,
  },
  presetText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  presetTextActive: {
    color: colors.white,
  },
  hint: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  cancel: {
    marginTop: spacing.md,
  },
});
