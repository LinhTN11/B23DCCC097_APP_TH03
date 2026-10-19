import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import {
  HomeIcon,
  BookIcon,
  CalendarIcon,
  TaskIcon,
  UserIcon,
} from '../components/AppIcons';
import { useApp } from '../context/AppContext';

const TAB_CONFIG: Record<string, { label: string; icon: (color: string, focused: boolean) => React.ReactNode }> = {
  HomeTab: {
    label: 'Tổng quan',
    icon: (color) => <HomeIcon color={color} size={22} />,
  },
  SubjectsTab: {
    label: 'Môn học',
    icon: (color) => <BookIcon color={color} size={22} />,
  },
  ScheduleTab: {
    label: 'Thời khóa biểu',
    icon: (color) => <CalendarIcon color={color} size={22} />,
  },
  AssignmentsTab: {
    label: 'Bài tập',
    icon: (color) => <TaskIcon color={color} size={22} />,
  },
  ProfileTab: {
    label: 'Cá nhân',
    icon: (color) => <UserIcon color={color} size={22} />,
  },
};

export const CustomBottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { assignments } = useApp();

  const pendingAssignmentCount = assignments.filter((a) => !a.isCompleted).length;

  return (
    <View style={[styles.barWrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: route.name,
            icon: () => null,
          };
          const color = isFocused ? THEME.primary : THEME.textMuted;
          const isAssignmentTab = route.name === 'AssignmentsTab';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && styles.tabItemPressed,
              ]}
            >
              <View style={styles.iconContainer}>
                {config.icon(color, isFocused)}
                {isAssignmentTab && pendingAssignmentCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {pendingAssignmentCount > 9 ? '9+' : pendingAssignmentCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  { color },
                  isFocused && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barWrapper: {
    backgroundColor: THEME.card,
    borderTopWidth: 1,
    borderTopColor: THEME.borderLight,
    ...THEME.shadowLg,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabItemPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 3,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: THEME.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});
