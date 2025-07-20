# 🗨️ Chat App - React Native Frontend

A single-room, cross-platform chat app built with **React Native (Expo)**, using **Zustand** for state management and **AsyncStorage** for persistence. This app connects to the [Dummy Chat API](https://dummy-chat-server.tribechat.com/api) and provides a smooth, responsive chat experience.

## 📱 Features Implemented

### ✅ Core Features
- **Message List**: Renders all messages with grouping by sender.
- **Message Header**: Shows avatar, name, and timestamp.
- **Edited Messages**: Display "edited" indicator.
- **Reactions**: Shows a row of emoji reactions under each message.
- **Grouped Messages**: Consecutive messages by the same user are grouped visually.
- **Image Support**: Renders image attachments inside messages.
- **Input Bar**: Allows sending new messages.
- **Persistent State**: Local storage via Zustand + AsyncStorage.

### ✨ Bonus Features
- **Date Separators** between messages from different days.
- **Message Reply View**: Displays quoted message when replying.
- **Lazy Loading**: Load older messages via infinite scroll.
- **Offline Support**: Hydrates data from storage if offline.

## 🛠️ Tech Stack

- **React Native (Expo)**
- **Zustand** – state management
- **@react-native-async-storage/async-storage**
- **React Navigation**
- **Tailwind CSS via NativeWind (optional)**

## 🔧 Setup & Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/tribe-chat-app.git
   cd tribe-chat-app