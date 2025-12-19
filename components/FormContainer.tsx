import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface FormContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  style,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
