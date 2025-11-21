import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({ title, onPress, loading, variant = 'primary', disabled, style }) => {
    const isPrimary = variant === 'primary';
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <AnimatedPressable
            style={[
                styles.container,
                isPrimary ? styles.primaryContainer : styles.secondaryContainer,
                disabled && styles.disabledContainer,
                animatedStyle,
                style
            ]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
            ) : (
                <Text style={[
                    styles.text,
                    isPrimary ? styles.primaryText : styles.secondaryText,
                    disabled && styles.disabledText
                ]}>
                    {title}
                </Text>
            )}
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryContainer: {
        backgroundColor: colors.primary,
    },
    secondaryContainer: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledContainer: {
        backgroundColor: colors.border,
        shadowOpacity: 0,
        elevation: 0,
        borderColor: colors.border,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: colors.primary,
    },
    disabledText: {
        color: '#fff',
    },
});
