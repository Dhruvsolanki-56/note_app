import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export const SearchBar = ({ value, onChangeText, onSortPress, sortLabel }) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContent}>
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search your notes..."
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
                <Text style={styles.sortLabel}>{sortLabel}</Text>
                <Ionicons name="filter" size={18} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

import { Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        marginHorizontal: 24,
        marginVertical: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    searchContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        height: '100%',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: colors.border,
        marginHorizontal: 8,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: '100%',
    },
    sortLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
        marginRight: 4,
    },
});
