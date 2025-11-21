import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const Blob = ({ size, color, initialX, initialY, duration }) => {
    const translateX = useSharedValue(initialX);
    const translateY = useSharedValue(initialY);

    useEffect(() => {
        translateX.value = withRepeat(
            withSequence(
                withTiming(initialX + 50, { duration: duration, easing: Easing.inOut(Easing.ease) }),
                withTiming(initialX - 50, { duration: duration, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        translateY.value = withRepeat(
            withSequence(
                withTiming(initialY - 50, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) }),
                withTiming(initialY + 50, { duration: duration * 1.2, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value }
            ]
        };
    });

    return (
        <Animated.View
            style={[
                styles.blob,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                },
                style
            ]}
        />
    );
};

export const AnimatedBackground = ({ children }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F0F4FF', '#E0E7FF', '#F0F4FF']}
                style={StyleSheet.absoluteFill}
            />

            <Blob
                size={300}
                color={`${colors.primary}15`}
                initialX={-50}
                initialY={-50}
                duration={5000}
            />
            <Blob
                size={250}
                color={`${colors.secondary}15`}
                initialX={width - 150}
                initialY={height / 4}
                duration={7000}
            />
            <Blob
                size={350}
                color={`${colors.primary}10`}
                initialX={-100}
                initialY={height - 300}
                duration={6000}
            />

            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    blob: {
        position: 'absolute',
    },
    content: {
        flex: 1,
        zIndex: 1,
    },
});
