import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../theme/colors';

export const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, error, autoCapitalize }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const borderColor = useSharedValue(colors.border);
    const borderWidth = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            borderColor: borderColor.value,
            borderWidth: borderWidth.value,
        };
    });

    const handleFocus = () => {
        setIsFocused(true);
        borderColor.value = withTiming(colors.primary, { duration: 200 });
        borderWidth.value = withTiming(2, { duration: 200 });
    };

    const handleBlur = () => {
        setIsFocused(false);
        borderColor.value = withTiming(colors.border, { duration: 200 });
        borderWidth.value = withTiming(1, { duration: 200 });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Animated.View style={[styles.inputContainer, animatedStyle, error && styles.inputError]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    autoCapitalize={autoCapitalize}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    textAlignVertical="center" // Android fix
                    includeFontPadding={false} // Android fix
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                        <Ionicons
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </Animated.View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    inputContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        height: 56, // Fixed height for better alignment
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        height: '100%', // Take full height of container
        paddingVertical: 0, // Remove default padding
    },
    iconContainer: {
        padding: 8,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
});
