import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, Layout, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../components/SearchBar';
import { AuthService } from '../services/AuthService';
import { NotesService } from '../services/NotesService';
import { colors } from '../theme/colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');

    useEffect(() => {
        loadUser();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadNotes();
            }
        }, [user])
    );

    const loadUser = async () => {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
    };

    const loadNotes = async () => {
        if (!user) return;
        setRefreshing(true);
        const userNotes = await NotesService.getNotes(user.id);
        setNotes(userNotes);
        setRefreshing(false);
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AuthService.logout();
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    const handleSortPress = () => {
        Alert.alert(
            'Sort By',
            'Choose a sorting option',
            [
                { text: 'Newest to Oldest', onPress: () => setSortBy('date_desc') },
                { text: 'Oldest to Newest', onPress: () => setSortBy('date_asc') },
                { text: 'Title (A-Z)', onPress: () => setSortBy('title_asc') },
                { text: 'Title (Z-A)', onPress: () => setSortBy('title_desc') },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const filteredNotes = useMemo(() => {
        let result = [...notes];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(note =>
                (note.title && note.title.toLowerCase().includes(query)) ||
                (note.content && note.content.toLowerCase().includes(query))
            );
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'date_asc':
                    return new Date(a.created_at) - new Date(b.created_at);
                case 'title_asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'title_desc':
                    return (b.title || '').localeCompare(a.title || '');
                default:
                    return 0;
            }
        });

        return result;
    }, [notes, searchQuery, sortBy]);

    const renderNoteItem = ({ item, index }) => (
        <AnimatedTouchableOpacity
            entering={FadeInDown.delay(index * 100).springify()}
            layout={Layout.springify()}
            style={styles.noteCard}
            onPress={() => navigation.navigate('NoteEditor', { noteId: item.id, existingNote: item })}
            activeOpacity={0.9}
        >
            {item.image_uri && (
                <Image source={{ uri: item.image_uri }} style={styles.noteImage} />
            )}
            <View style={styles.noteContent}>
                <View style={styles.noteHeader}>
                    <Text style={styles.noteTitle} numberOfLines={1}>{item.title || 'Untitled Note'}</Text>
                </View>
                <Text style={styles.noteBody} numberOfLines={3}>{item.content || 'No content'}</Text>
                <View style={styles.noteFooter}>
                    <Text style={styles.noteDate}>
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    <View style={styles.readMore}>
                        <Text style={styles.readMoreText}>Read</Text>
                        <Ionicons name="arrow-forward" size={12} color={colors.primary} />
                    </View>
                </View>
            </View>
        </AnimatedTouchableOpacity>
    );

    const getSortLabel = () => {
        switch (sortBy) {
            case 'date_desc': return 'Newest';
            case 'date_asc': return 'Oldest';
            case 'title_asc': return 'A-Z';
            case 'title_desc': return 'Z-A';
            default: return 'Sort';
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F7F9FC" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.username}>{user?.username || 'User'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.profileButton}>
                        <LinearGradient
                            colors={[colors.primary, colors.secondary]}
                            style={styles.profileGradient}
                        >
                            <Text style={styles.profileInitials}>
                                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSortPress={handleSortPress}
                    sortLabel={getSortLabel()}
                />

                <FlatList
                    data={filteredNotes}
                    renderItem={renderNoteItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={loadNotes}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>{searchQuery ? '🔍' : '✨'}</Text>
                            <Text style={styles.emptyText}>
                                {searchQuery ? 'No matching notes found' : 'Start your journey'}
                            </Text>
                            {!searchQuery && <Text style={styles.emptySubtext}>Create your first note to capture your thoughts.</Text>}
                        </View>
                    }
                />

                <AnimatedTouchableOpacity
                    entering={ZoomIn.delay(500).springify()}
                    style={styles.fab}
                    onPress={() => navigation.navigate('NoteEditor', { userId: user?.id })}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[colors.primary, '#8B80F9']}
                        style={styles.fabGradient}
                    >
                        <Ionicons name="add" size={32} color="#fff" />
                    </LinearGradient>
                </AnimatedTouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 8,
    },
    greeting: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
        marginBottom: 2,
    },
    username: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: -0.5,
    },
    profileButton: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    profileGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitials: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    noteCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    noteImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    noteContent: {
        padding: 20,
    },
    noteHeader: {
        marginBottom: 8,
    },
    noteTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: -0.3,
    },
    noteBody: {
        fontSize: 15,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: 16,
    },
    noteFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        paddingTop: 16,
    },
    noteDate: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    readMore: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    readMoreText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
        opacity: 0.8,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 22,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    fabGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
