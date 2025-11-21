import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const AuthService = {
  /**
   * Register a new user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  registerUser: async (username, password) => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (userExists) {
        return { success: false, message: 'Username already exists' };
      }

      // Generate a simple ID based on timestamp
      const newUser = {
        id: Date.now(),
        username,
        password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

      return { success: true };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Failed to register user' };
    }
  },

  /**
   * Login a user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  loginUser: async (username, password) => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

      if (user) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Failed to login' };
    }
  },

  /**
   * Get currently logged in user
   * @returns {Promise<object|null>}
   */
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Logout current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  /**
   * Get all users (for debugging/verification)
   * @returns {Promise<Array>}
   */
  getAllUsers: async () => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
};
