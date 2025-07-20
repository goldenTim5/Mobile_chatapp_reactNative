import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerText: {
    flexDirection: 'column',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  text: {
    fontSize: 16,
  },
  reactionRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 6,
  },
  reaction: {
    fontSize: 16,
  },
  replyPreview: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  replyText: {
    fontStyle: 'italic',
    color: '#333',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});