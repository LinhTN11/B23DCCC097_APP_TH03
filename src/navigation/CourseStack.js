import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';
import { ROUTES, SCREEN_TITLES } from './routes';
import { stackScreenOptions } from './stackOptions';

const Stack = createNativeStackNavigator();

export default function CourseStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name={ROUTES.COURSE_LIST}
        component={CourseListScreen}
        options={{ title: SCREEN_TITLES[ROUTES.COURSE_LIST] }}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{ title: SCREEN_TITLES[ROUTES.COURSE_DETAIL] }}
      />
      <Stack.Screen
        name={ROUTES.SESSION_DETAIL}
        component={SessionDetailScreen}
        options={{ title: SCREEN_TITLES[ROUTES.SESSION_DETAIL] }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{ title: SCREEN_TITLES[ROUTES.ASSIGNMENT_DETAIL] }}
      />
      <Stack.Screen
        name={ROUTES.GRADE_LIST}
        component={GradeListScreen}
        options={{ title: SCREEN_TITLES[ROUTES.GRADE_LIST] }}
      />
      <Stack.Screen
        name={ROUTES.GRADE_DETAIL}
        component={GradeDetailScreen}
        options={{ title: SCREEN_TITLES[ROUTES.GRADE_DETAIL] }}
      />
    </Stack.Navigator>
  );
}
