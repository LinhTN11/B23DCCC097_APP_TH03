import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// 5 Bottom Tabs
export type RootTabParamList = {
  HomeTab: undefined;
  SubjectsTab: undefined;
  ScheduleTab: undefined;
  AssignmentsTab: undefined;
  ProfileTab: undefined;
};

// Root Stack with Details and MainTabs
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  SubjectDetail: { subjectId: string };
  ScheduleDetail: { scheduleId: string };
  AssignmentDetail: { assignmentId: string };
  GradeDetail: undefined;
  EditProfile: undefined;
};

// Stack Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Composite Tab Screen Props
export type AppTabScreenProps<T extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
