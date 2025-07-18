import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Image } from 'expo-image';
import { fetchLatestMessages, postNewMessage } from "src/api/messages";
import { fetchAllParticipants } from 'src/api/participants';
import { useMessageStore } from 'src/store/messagesStore';
import { TMessageJSON, TParticipant } from 'src/types';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const ChatScreen = () => {
  const { messages, setMessages, addMessage } = useMessageStore();
  const [participants, setParticipants] = useState<Record<string, TParticipant>>({});
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [msgs, users] = await Promise.all([
          fetchLatestMessages(),
          fetchAllParticipants(),
        ]);
        const userMap: Record<string, TParticipant> = {};
        users.forEach((p) => {
          userMap[p.uuid] = p;
        });
        setParticipants(userMap);
        setMessages(msgs.reverse());
      } catch (err) {
        console.error('Loading error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    try {
      const newMessage = await postNewMessage(inputText.trim());
      addMessage(newMessage);
      setInputText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderItem = ({ item }: { item: TMessageJSON }) => {
    const author = participants[item.authorUuid];
    return (
      <View style={styles.messageContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: author?.avatarUrl || 'https://placehold.co/40x40' }}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <ThemedText type="defaultSemiBold">{author?.name || 'Unknown'}</ThemedText>
            <ThemedText type="default">
              {new Date(item.sentAt).toLocaleTimeString()}
            </ThemedText>
          </View>
        </View>
        <ThemedText>{item.text}</ThemedText>

        {item.attachments?.[0]?.type === 'image' && (
          <Image
            source={{ uri: item.attachments[0].url }}
            style={{
              width: item.attachments[0].width,
              height: item.attachments[0].height,
              marginTop: 6,
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
        )}

        {item.replyToMessage && (
          <View style={styles.replyPreview}>
            <ThemedText type="default">
              Reply: {item.replyToMessage.text.slice(0, 60)}...
            </ThemedText>
          </View>
        )}

        {item.reactions.length > 0 && (
          <View style={styles.reactionRow}>
            {item.reactions.map((r) => (
              <ThemedText key={r.uuid} style={styles.reaction}>
                {r.value}
              </ThemedText>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.uuid}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 12 }}
            inverted
            initialNumToRender={20}
          />
          <View style={styles.inputBar}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>
                Send
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  headerText: {
    flexDirection: 'column',
  },
  replyPreview: {
    marginTop: 6,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderColor: '#ccc',
  },
  reactionRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  reaction: {
    marginRight: 8,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
});