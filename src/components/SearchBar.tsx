import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { SearchIcon, CloseIcon } from './AppIcons';
import { THEME } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <SearchIcon color={THEME.textMuted} size={18} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={THEME.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearBtn}
          hitSlop={10}
        >
          <CloseIcon color={THEME.textSecondary} size={16} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 12,
    height: 46,
    ...THEME.shadow,
  },
  iconWrap: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: THEME.textPrimary,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: THEME.cardAlt,
  },
});
