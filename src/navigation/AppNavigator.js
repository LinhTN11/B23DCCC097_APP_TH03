import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';
import typography from '../theme/typography';
import Icon from '../components/common/Icon';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { ROUTES, TAB_TITLES } from './routes';

const Tab = createBottomTabNavigator();

const renderHomeIcon = ({ color, size }) => (
  <Icon name="home" color={color} size={size} />
);
const renderCourseIcon = ({ color, size }) => (
  <Icon name="book" color={color} size={size} />
);
const renderScheduleIcon = ({ color, size }) => (
  <Icon name="calendar" color={color} size={size} />
);
const renderAssignmentIcon = ({ color, size }) => (
  <Icon name="clipboard" color={color} size={size} />
);
const renderProfileIcon = ({ color, size }) => (
  <Icon name="person" color={color} size={size} />
);

export default function AppNavigator() {
  const { assignments } = useAppData();
  const pendingAssignments = assignments.filter(
    (item) => item.status !== 'done',
  ).length;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.tabInactive,
            tabBarLabelStyle: {
              fontSize: typography.sizes.xxs,
              fontWeight: typography.weights.semibold,
            },
            tabBarStyle: {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
            tabBarHideOnKeyboard: true,
          }}>
          <Tab.Screen
            name={ROUTES.HOME_TAB}
            component={HomeStack}
            options={{
              title: TAB_TITLES[ROUTES.HOME_TAB],
              tabBarIcon: renderHomeIcon,
            }}
          />
          <Tab.Screen
            name={ROUTES.COURSES_TAB}
            component={CourseStack}
            options={{
              title: TAB_TITLES[ROUTES.COURSES_TAB],
              tabBarIcon: renderCourseIcon,
            }}
          />
          <Tab.Screen
            name={ROUTES.SCHEDULE_TAB}
            component={ScheduleStack}
            options={{
              title: TAB_TITLES[ROUTES.SCHEDULE_TAB],
              tabBarIcon: renderScheduleIcon,
            }}
          />
          <Tab.Screen
            name={ROUTES.ASSIGNMENTS_TAB}
            component={AssignmentStack}
            options={{
              title: TAB_TITLES[ROUTES.ASSIGNMENTS_TAB],
              tabBarIcon: renderAssignmentIcon,
              tabBarBadge: pendingAssignments > 0 ? pendingAssignments : undefined,
              tabBarBadgeStyle: {
                backgroundColor: colors.danger,
                color: colors.white,
                fontSize: typography.sizes.xxs,
                fontWeight: typography.weights.bold,
              },
            }}
          />
          <Tab.Screen
            name={ROUTES.PROFILE_TAB}
            component={ProfileStack}
            options={{
              title: TAB_TITLES[ROUTES.PROFILE_TAB],
              tabBarIcon: renderProfileIcon,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
