import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { SubjectDetailScreen } from '../screens/SubjectDetailScreen';
import { ScheduleDetailScreen } from '../screens/ScheduleDetailScreen';
import { AssignmentDetailScreen } from '../screens/AssignmentDetailScreen';
import { GradeDetailScreen } from '../screens/GradeDetailScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* 5 Bottom Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
      />

      {/* Chi tiết môn học */}
      <Stack.Screen
        name="SubjectDetail"
        component={SubjectDetailScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Chi tiết buổi học */}
      <Stack.Screen
        name="ScheduleDetail"
        component={ScheduleDetailScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Chi tiết bài tập */}
      <Stack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Chi tiết kết quả học tập */}
      <Stack.Screen
        name="GradeDetail"
        component={GradeDetailScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Chỉnh sửa thông tin sinh viên */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
