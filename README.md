# Offline Notes App

A modern, offline-first React Native notes application built with Expo. This app features a premium UI, multi-user support, and rich note management capabilities including image attachments.

## 🚀 Setup Instructions

1.  **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the App**:
    ```bash
    npx expo start
    ```
4.  **Run on Device/Emulator**:
    - Scan the QR code with the Expo Go app (Android/iOS).
    - Press `a` for Android Emulator or `i` for iOS Simulator.

## 📚 Libraries Used

### Core
-   **React Native**: 0.81.5
-   **Expo**: ~54.0.25
-   **React Navigation**: Stack & Native (~7.x)

### Storage & Data
-   **@react-native-async-storage/async-storage**: For offline data persistence (Users & Notes).
-   **expo-file-system**: For saving image attachments locally.

### UI & Animations
-   **react-native-reanimated**: For smooth, complex animations (Entry animations, Layout transitions).
-   **expo-linear-gradient**: For premium gradient backgrounds and UI elements.
-   **@expo/vector-icons**: For UI icons (Ionicons).
-   **react-native-safe-area-context**: For handling safe areas on modern devices.

### Media
-   **expo-image-picker**: For selecting images from the gallery or taking photos.
-   **expo-image**: For optimized image rendering.

## ⚠️ Known Issues & Limitations

-   **Offline-Only**: Data is stored strictly on the device. There is no cloud sync or backup. If the app is uninstalled, data may be lost (depending on OS cleanup).
-   **Image Storage**: Images are copied to the app's local document directory. Very large numbers of high-res images may consume significant device storage.
-   **Search**: Search functionality is local and filters currently loaded notes. It does not support advanced query operators.
-   **Security**: Passwords are stored locally. While isolated per user, this is not intended for high-security data storage without further encryption enhancements.
