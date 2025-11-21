import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export const NotesService = {
    /**
     * Save an image locally to the document directory
     * @param {string} uri 
     * @returns {Promise<string|null>}
     */
    saveImageLocally: async (uri) => {
        if (!uri) return null;
        try {
            const filename = uri.split('/').pop();
            const newPath = FileSystem.documentDirectory + filename;

            // Only copy if it's not already in the document directory
            if (!uri.includes(FileSystem.documentDirectory)) {
                await FileSystem.copyAsync({
                    from: uri,
                    to: newPath
                });
                return newPath;
            }
            return uri;
        } catch (error) {
            console.error('Error saving image:', error);
            return uri; // Fallback to original URI if copy fails
        }
    },

    /**
     * Get notes key for a user
     * @param {number} userId 
     */
    getNotesKey: (userId) => `notes_${userId}`,

    /**
     * Create a new note
     * @param {number} userId 
     * @param {string} title 
     * @param {string} content 
     * @param {string} imageUri 
     */
    createNote: async (userId, title, content, imageUri) => {
        try {
            const savedImageUri = await NotesService.saveImageLocally(imageUri);
            const key = NotesService.getNotesKey(userId);

            const notesJson = await AsyncStorage.getItem(key);
            const notes = notesJson ? JSON.parse(notesJson) : [];

            const newNote = {
                id: Date.now(),
                user_id: userId,
                title,
                content,
                image_uri: savedImageUri,
                created_at: new Date().toISOString()
            };

            notes.unshift(newNote); // Add to beginning
            await AsyncStorage.setItem(key, JSON.stringify(notes));

            return { success: true };
        } catch (error) {
            console.error('Error creating note:', error);
            return { success: false, message: 'Failed to create note' };
        }
    },

    /**
     * Get all notes for a user
     * @param {number} userId 
     */
    getNotes: async (userId) => {
        try {
            const key = NotesService.getNotesKey(userId);
            const notesJson = await AsyncStorage.getItem(key);
            return notesJson ? JSON.parse(notesJson) : [];
        } catch (error) {
            console.error('Error fetching notes:', error);
            return [];
        }
    },

    /**
     * Update a note
     * @param {number} noteId 
     * @param {string} title 
     * @param {string} content 
     * @param {string} imageUri 
     */
    updateNote: async (noteId, title, content, imageUri) => {
        try {
            // We need the user ID to find the right storage key. 
            // Since we don't pass userId here, we might need to search all users or pass it.
            // Optimisation: For now, we assume the caller knows the context, but since AsyncStorage is key-value,
            // we need the key. 
            // FIX: We will fetch the current user from AuthService to get the ID, or pass userId.
            // Better yet, let's pass the full note object or just search efficiently?
            // Given the constraints, let's fetch the current user ID from the session since only logged in users edit notes.

            const currentUserJson = await AsyncStorage.getItem('currentUser');
            if (!currentUserJson) return { success: false, message: 'No user logged in' };
            const currentUser = JSON.parse(currentUserJson);
            const key = NotesService.getNotesKey(currentUser.id);

            const notesJson = await AsyncStorage.getItem(key);
            let notes = notesJson ? JSON.parse(notesJson) : [];

            const noteIndex = notes.findIndex(n => n.id === noteId);
            if (noteIndex === -1) return { success: false, message: 'Note not found' };

            let finalImageUri = imageUri;
            if (imageUri && imageUri !== notes[noteIndex].image_uri) {
                finalImageUri = await NotesService.saveImageLocally(imageUri);
            }

            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                content,
                image_uri: finalImageUri
            };

            await AsyncStorage.setItem(key, JSON.stringify(notes));
            return { success: true };
        } catch (error) {
            console.error('Error updating note:', error);
            return { success: false, message: 'Failed to update note' };
        }
    },

    /**
     * Delete a note
     * @param {number} noteId 
     */
    deleteNote: async (noteId) => {
        try {
            const currentUserJson = await AsyncStorage.getItem('currentUser');
            if (!currentUserJson) return { success: false, message: 'No user logged in' };
            const currentUser = JSON.parse(currentUserJson);
            const key = NotesService.getNotesKey(currentUser.id);

            const notesJson = await AsyncStorage.getItem(key);
            let notes = notesJson ? JSON.parse(notesJson) : [];

            notes = notes.filter(n => n.id !== noteId);

            await AsyncStorage.setItem(key, JSON.stringify(notes));
            return { success: true };
        } catch (error) {
            console.error('Error deleting note:', error);
            return { success: false, message: 'Failed to delete note' };
        }
    }
};
