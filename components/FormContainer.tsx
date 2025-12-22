import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';

interface FormContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollEnabled?: boolean;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  scrollEnabled = true,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={Keyboard.dismiss}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
