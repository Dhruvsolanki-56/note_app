import { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthService } from '../services/AuthService';
import { colors } from '../theme/colors';

const { height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await AuthService.registerUser(username, password);
        setLoading(false);

        if (result.success) {
            Alert.alert('Success', 'Account created successfully', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } else {
            Alert.alert('Error', result.message || 'Registration failed');
        }
    };

    return (
        <AnimatedBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.topSection}>
                    <Animated.View entering={FadeInUp.delay(200).duration(1000).springify()}>
                        <Text style={styles.welcomeText}>Get Started</Text>
                        <Text style={styles.subText}>Create your account today</Text>
                    </Animated.View>
                </View>

                <Animated.View
                    entering={FadeInDown.delay(400).duration(1000).springify()}
                    style={styles.bottomSheet}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <Text style={styles.formTitle}>Sign Up</Text>
                        <Text style={styles.formSubtitle}>Fill in your details to register</Text>

                        <Input
                            label="Username"
                            placeholder="Choose a username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <Button
                            title="Register"
                            onPress={handleSignup}
                            loading={loading}
                            style={styles.button}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.linkBold}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
        </AnimatedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        height: height * 0.30,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    welcomeText: {
        fontSize: 42,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
    },
    subText: {
        fontSize: 18,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 32,
        paddingTop: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        marginBottom: 24,
        borderRadius: 16,
        height: 56,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    linkBold: {
        color: colors.secondary,
        fontWeight: '700',
        fontSize: 14,
    },
});
