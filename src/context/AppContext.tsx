import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  StudentProfile,
  Subject,
  ScheduleItem,
  Assignment,
  SemesterGrade,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_SCHEDULE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SEMESTER_GRADES,
} from '../data/mockData';

const STORAGE_KEYS = {
  PROFILE: '@student_management_profile_v1',
  ASSIGNMENTS: '@student_management_assignments_v1',
  SUBJECTS: '@student_management_subjects_v1',
};

interface AppContextType {
  studentProfile: StudentProfile;
  subjects: Subject[];
  schedule: ScheduleItem[];
  assignments: Assignment[];
  semesterGrades: SemesterGrade[];
  isLoading: boolean;
  updateProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  toggleAssignmentStatus: (id: string) => Promise<void>;
  updateAssignmentNotes: (id: string, notes: string) => Promise<void>;
  resetToDefault: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [schedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [semesterGrades] = useState<SemesterGrade[]>(INITIAL_SEMESTER_GRADES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted data on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const [savedProfile, savedAssignments] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS),
        ]);

        if (savedProfile) {
          setStudentProfile(JSON.parse(savedProfile));
        }
        if (savedAssignments) {
          setAssignments(JSON.parse(savedAssignments));
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedData();
  }, []);

  // Update Student Profile
  const updateProfile = useCallback(
    async (updated: Partial<StudentProfile>) => {
      setStudentProfile((prev) => {
        const next = { ...prev, ...updated };
        AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next)).catch(console.error);
        return next;
      });
    },
    []
  );

  // Toggle assignment completed status
  const toggleAssignmentStatus = useCallback(
    async (id: string) => {
      setAssignments((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        );
        AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(next)).catch(console.error);
        return next;
      });
    },
    []
  );

  // Update Assignment notes
  const updateAssignmentNotes = useCallback(
    async (id: string, notes: string) => {
      setAssignments((prev) => {
        const next = prev.map((item) =>
          item.id === id ? { ...item, userNotes: notes } : item
        );
        AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(next)).catch(console.error);
        return next;
      });
    },
    []
  );

  // Reset to default sample data
  const resetToDefault = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS),
      ]);
      setStudentProfile(INITIAL_STUDENT_PROFILE);
      setAssignments(INITIAL_ASSIGNMENTS);
      setSubjects(INITIAL_SUBJECTS);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        studentProfile,
        subjects,
        schedule,
        assignments,
        semesterGrades,
        isLoading,
        updateProfile,
        toggleAssignmentStatus,
        updateAssignmentNotes,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
