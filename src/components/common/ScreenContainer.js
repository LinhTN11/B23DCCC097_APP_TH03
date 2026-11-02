import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import OfflineBanner from './OfflineBanner';

/**
 * Props bắt buộc:
 * - children: nội dung màn hình.
 * Props tùy chọn:
 * - scroll: dùng ScrollView thay vì View (mặc định false).
 */
function ScreenContainer({
  children,
  scroll = false,
  edges = ['left', 'right', 'bottom'],
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.body}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
});

export default ScreenContainer;
