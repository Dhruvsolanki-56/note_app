import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotesService } from '../services/NotesService';
import { colors } from '../theme/colors';

export default function NoteEditorScreen({ navigation, route }) {
    const { userId, noteId, existingNote } = route.params || {};

    const [title, setTitle] = useState(existingNote?.title || '');
    const [content, setContent] = useState(existingNote?.content || '');
    const [imageUri, setImageUri] = useState(existingNote?.image_uri || null);
    const [loading, setLoading] = useState(false);

    const isEditing = !!existingNote;

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }, [title, content, imageUri]);

    const handleImageSelection = () => {
        Alert.alert(
            'Add Image',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Library', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) {
            Alert.alert('Empty Note', 'Please enter a title or content');
            return;
        }

        setLoading(true);
        try {
            let result;
            if (isEditing) {
                result = await NotesService.updateNote(existingNote.id, title, content, imageUri);
            } else {
                result = await NotesService.createNote(userId, title, content, imageUri);
            }

            if (result.success) {
                navigation.goBack();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        await NotesService.deleteNote(existingNote.id);
                        setLoading(false);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{isEditing ? 'Edit Note' : 'New Note'}</Text>
                    <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
                        <Text style={[styles.saveButtonText, loading && styles.disabled]}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeIn.duration(600)}>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Title"
                            placeholderTextColor={colors.textSecondary}
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                            multiline
                        />

                        <TouchableOpacity onPress={handleImageSelection} activeOpacity={0.9}>
                            {imageUri ? (
                                <View style={styles.imageWrapper}>
                                    <Image source={{ uri: imageUri }} style={styles.image} />
                                    <View style={styles.editImageBadge}>
                                        <Text style={styles.editImageText}>✎</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.placeholderImage}>
                                    <Text style={styles.addImageIcon}>📷</Text>
                                    <Text style={styles.addImageText}>Add Cover Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TextInput
                            style={styles.bodyInput}
                            placeholder="Start typing your thoughts..."
                            placeholderTextColor={colors.textSecondary}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            textAlignVertical="top"
                        />

                        {isEditing && (
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                <Text style={styles.deleteText}>Delete Note</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    iconButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        color: colors.text,
        fontWeight: '300',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.text,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.primary,
        borderRadius: 20,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    titleInput: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 24,
        lineHeight: 40,
    },
    bodyInput: {
        fontSize: 18,
        lineHeight: 28,
        color: colors.text,
        minHeight: 200,
        marginBottom: 40,
    },
    imageWrapper: {
        marginBottom: 24,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        backgroundColor: colors.surface,
    },
    image: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
    },
    editImageBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editImageText: {
        color: '#fff',
        fontSize: 18,
    },
    placeholderImage: {
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: 20,
        marginBottom: 24,
        backgroundColor: 'rgba(108, 99, 255, 0.05)',
    },
    addImageIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    addImageText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        marginTop: 20,
        marginBottom: 60,
        padding: 16,
        backgroundColor: '#FFF0F0',
        borderRadius: 16,
        alignItems: 'center',
    },
    deleteText: {
        color: colors.error,
        fontWeight: '600',
        fontSize: 16,
    },
});
