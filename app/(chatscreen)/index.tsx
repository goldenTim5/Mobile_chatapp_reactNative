import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { fetchLatestMessages, fetchOlderMessages, postNewMessage } from '@/src/api/messages';
import { fetchAllParticipants } from '@/src/api/participants';
import { useMessageStore } from '@/src/store/messagesStore';
import { useParticipantStore } from '@/src/store/participantsStore';
import { TMessageJSON } from '@/src/types';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const ChatScreen = () => {
  // Zustand stores
  const { messages, setMessages, addMessage, prependMessages } = useMessageStore();
  const { participants, setParticipants } = useParticipantStore();

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // For lazy loading older messages
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [msgs, users] = await Promise.all([
          fetchLatestMessages(),
          fetchAllParticipants(),
        ]);
       
        setParticipants(users);
        setMessages(msgs.reverse());
        
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Loading Error',
          text2: 'It seems like offline. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  //Handle Send Event
  const handleSend = async () => {
    setLoading(true);
    if (!inputText.trim()) return;
    console.log(messages);
    try {
      const newMessage = await postNewMessage(inputText.trim());
      addMessage(newMessage);
      setInputText('');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: "Failed to send message. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  //Handle Load More Messages Event
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || messages.length === 0) return;

    setLoadingMore(true);
    try {
      const lastMsg = messages[0]; // first in array because FlatList is inverted
      const older = await fetchOlderMessages(lastMsg.uuid);
      if (older.length > 0) {
        prependMessages(older);
      } else {
        setHasMore(false); // no more messages
      }
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: "Failed to load older messages. Please try again later."
      });
    } finally {
      setLoadingMore(false);
    }
  };

  //Build Each Message Item
  const renderItem = ({ item, index }: { item: TMessageJSON, index: number }) => {
    const author = participants[item.authorUuid];

    const edited = item.sentAt !== item.updatedAt;

    //For Grouping by Date
    const prevMessage = messages[index + 1]; // because list is inverted
    const isNewDay =
    !prevMessage ||
    new Date(item.sentAt).toDateString() !== new Date(prevMessage.sentAt).toDateString();

    //For Grouping by User
    const isSameAuthor =
      index < messages.length - 1 && messages[index + 1].authorUuid === item.authorUuid; 

    return (
      <View>
      {isNewDay && (
        <ThemedText style={styles.dateSeparator}>
          {new Date(item.sentAt).toDateString()}
        </ThemedText>
      )}
        <View style={{...styles.messageContainer, ...(isSameAuthor ? styles.sameAuthor : {}), ...(item.authorUuid === 'you' ? styles.messageContainerYou : {})}}>
          {!isSameAuthor && (
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', position: 'absolute', top: 0, right: 0 }}>
              {edited && (
                <ThemedText type="default" style={{ fontSize: 10, marginLeft: 6, color: '#666' }}>
                  (edited)
                </ThemedText>
              )}
            </View>
          </View>
          )}
          
          <ThemedText>{item.text}</ThemedText>

          {item.attachments?.[0]?.type === 'image' && (
            <Image
              source={{ uri: item.attachments[0].url }}
              style={{
                width: item.attachments[0].width > 300 ? '100%' : item.attachments[0].width,
                maxWidth : item.attachments[0].width,
                aspectRatio: item.attachments[0].width / item.attachments[0].height,
                marginTop: 6,
                borderRadius: 8,

              }}
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
      </View>
    );
  };

  return (
      <ThemedView style={{ flex: 1 }}>
        <Toast />
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
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loadingMore ? <ActivityIndicator style={{ margin: 10 }} /> : null
              }
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
  messageContainerYou: {
    backgroundColor: '#b8daffff',
  },
  sameAuthor: {
    width: '90%',
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
  dateSeparator: {
    alignSelf: 'center',
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#ddd',
    borderRadius: 10,
    fontSize: 12,
    color: '#444',
  }
});
