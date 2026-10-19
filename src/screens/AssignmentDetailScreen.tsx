import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import type { RootStackScreenProps } from '../navigation/types';
import { THEME } from '../constants/theme';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import {
  ClockIcon,
  CheckCircleIcon,
  BookIcon,
  EditIcon,
  ChevronRightIcon,
} from '../components/AppIcons';

export const AssignmentDetailScreen: React.FC<RootStackScreenProps<'AssignmentDetail'>> = ({
  route,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { assignmentId } = route.params;
  const {
    assignments,
    toggleAssignmentStatus,
    updateAssignmentNotes,
  } = useApp();

  const item = useMemo(() => {
    return assignments.find((a) => a.id === assignmentId) || assignments[0];
  }, [assignments, assignmentId]);

  const [notes, setNotes] = useState<string>(item.userNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);

  const handleSaveNotes = async () => {
    await updateAssignmentNotes(item.id, notes);
    setIsEditingNotes(false);
    Alert.alert('Thành công', 'Đã lưu ghi chú bài tập thành công!');
  };

  const handleToggleStatus = async () => {
    await toggleAssignmentStatus(item.id);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header
        title="Chi tiết bài tập"
        subtitle={`PTIT S-Link • ${item.subjectCode}`}
        showBack
        onBack={() => navigation.goBack()}
        variant="ptitRed"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status & Subject Header */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Badge label={item.subjectCode} variant="primary" size="md" />
            <Badge
              label={item.priority === 'high' ? 'Ưu tiên cao' : 'Bình thường'}
              variant={item.priority === 'high' ? 'danger' : 'warning'}
              size="md"
            />
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subjectName}>{item.subjectName}</Text>

          <View style={styles.dueContainer}>
            <ClockIcon color={item.isCompleted ? THEME.textMuted : THEME.danger} size={18} />
            <Text style={[styles.dueText, item.isCompleted && styles.dueTextCompleted]}>
              Hạn nộp: {item.dueDate}
            </Text>
          </View>
        </View>

        {/* Action Button: Toggle Completion */}
        <Pressable
          style={({ pressed }) => [
            styles.statusButton,
            item.isCompleted ? styles.statusBtnCompleted : styles.statusBtnPending,
            pressed && styles.btnPressed,
          ]}
          onPress={handleToggleStatus}
        >
          <CheckCircleIcon
            color="#FFFFFF"
            filled={item.isCompleted}
            size={22}
          />
          <Text style={styles.statusButtonText}>
            {item.isCompleted
              ? 'Đã hoàn thành • Chạm để mở lại'
              : 'Đánh dấu đã hoàn thành'}
          </Text>
        </Pressable>

        {/* Description Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mô tả & Yêu cầu bài tập</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>

        {/* Submission Format */}
        {item.submissionFormat && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hình thức nộp bài</Text>
            <View style={styles.formatBox}>
              <Text style={styles.formatText}>{item.submissionFormat}</Text>
            </View>
          </View>
        )}

        {/* Personal Notes */}
        <View style={styles.card}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>Ghi chú cá nhân</Text>
            {!isEditingNotes && (
              <Pressable
                onPress={() => setIsEditingNotes(true)}
                style={styles.editNotesBtn}
                hitSlop={8}
              >
                <EditIcon color={THEME.primary} size={16} />
                <Text style={styles.editNotesText}>Sửa</Text>
              </Pressable>
            )}
          </View>

          {isEditingNotes ? (
            <View>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Nhập ghi chú cá nhân, link tài liệu, tiến độ làm bài..."
                placeholderTextColor={THEME.textMuted}
                multiline
                numberOfLines={4}
              />
              <View style={styles.notesActionRow}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => {
                    setNotes(item.userNotes || '');
                    setIsEditingNotes(false);
                  }}
                >
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={handleSaveNotes}>
                  <Text style={styles.saveBtnText}>Lưu ghi chú</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text style={item.userNotes ? styles.notesDisplay : styles.noNotesText}>
              {item.userNotes || 'Chưa có ghi chú nào. Chạm vào "Sửa" để thêm ghi chú của bạn.'}
            </Text>
          )}
        </View>

        {/* Subject Detail link */}
        <Pressable
          style={({ pressed }) => [styles.linkCard, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.subjectId })}
        >
          <View style={styles.linkIconWrap}>
            <BookIcon color={THEME.primary} size={20} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Xem môn học {item.subjectCode}</Text>
            <Text style={styles.linkSub}>{item.subjectName}</Text>
          </View>
          <ChevronRightIcon color={THEME.textMuted} size={18} />
        </Pressable>

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
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textPrimary,
    lineHeight: 28,
    marginBottom: 6,
  },
  subjectName: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: 14,
  },
  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardAlt,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  dueText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.danger,
    marginLeft: 8,
  },
  dueTextCompleted: {
    color: THEME.textSecondary,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  statusBtnPending: {
    backgroundColor: THEME.success,
  },
  statusBtnCompleted: {
    backgroundColor: THEME.secondary,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textPrimary,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: THEME.textSecondary,
  },
  formatBox: {
    backgroundColor: THEME.primaryLight,
    padding: 12,
    borderRadius: 10,
  },
  formatText: {
    fontSize: 13,
    color: THEME.primaryDark,
    lineHeight: 18,
    fontWeight: '500',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editNotesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editNotesText: {
    fontSize: 13,
    color: THEME.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  notesInput: {
    backgroundColor: THEME.cardAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 12,
    fontSize: 13,
    color: THEME.textPrimary,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  notesActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: THEME.cardAlt,
  },
  cancelBtnText: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: THEME.primary,
  },
  saveBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notesDisplay: {
    fontSize: 13,
    lineHeight: 20,
    color: THEME.textPrimary,
  },
  noNotesText: {
    fontSize: 13,
    color: THEME.textMuted,
    fontStyle: 'italic',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    ...THEME.shadow,
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  linkIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  linkSub: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
  },
});
