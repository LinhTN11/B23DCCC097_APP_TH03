import React from 'react';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from './types';
import { CustomBottomTabBar } from './CustomBottomTabBar';
import { HomeScreen } from '../screens/HomeScreen';
import { SubjectListScreen } from '../screens/SubjectListScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { AssignmentScreen } from '../screens/AssignmentScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 1. Tổng quan */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Tổng quan' }}
      />

      {/* 2. Môn học */}
      <Tab.Screen
        name="SubjectsTab"
        component={SubjectListScreen}
        options={{ title: 'Môn học' }}
      />

      {/* 3. Thời khóa biểu */}
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleScreen}
        options={{ title: 'Thời khóa biểu' }}
      />

      {/* 4. Bài tập */}
      <Tab.Screen
        name="AssignmentsTab"
        component={AssignmentScreen}
        options={{ title: 'Bài tập' }}
      />

      {/* 5. Cá nhân và kết quả học tập */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Cá nhân' }}
      />
    </Tab.Navigator>
  );
};
