import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from './AppIcons';
import { THEME } from '../constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  variant?: 'light' | 'ptitRed';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
  variant = 'light',
}) => {
  const insets = useSafeAreaInsets();
  const isRed = variant === 'ptitRed';

  return (
    <View
      style={[
        styles.container,
        isRed ? styles.containerRed : styles.containerLight,
        { paddingTop: Math.max(insets.top, 12) },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftRow}>
          {showBack && (
            <Pressable
              onPress={onBack}
              style={[styles.backBtn, isRed && styles.backBtnRed]}
              hitSlop={10}
            >
              <ArrowLeftIcon color={isRed ? '#FFFFFF' : THEME.textPrimary} size={22} />
            </Pressable>
          )}
          <View style={styles.titleWrap}>
            <Text
              style={[styles.title, isRed && styles.titleRed]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[styles.subtitle, isRed && styles.subtitleRed]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement && <View style={styles.rightWrap}>{rightElement}</View>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  containerLight: {
    backgroundColor: THEME.card,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  containerRed: {
    backgroundColor: THEME.primary,
    ...THEME.shadowLg,
  },
  contentRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
    padding: 6,
    borderRadius: 8,
    backgroundColor: THEME.cardAlt,
  },
  backBtnRed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.textPrimary,
  },
  titleRed: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 1,
  },
  subtitleRed: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  rightWrap: {
    marginLeft: 12,
  },
});
