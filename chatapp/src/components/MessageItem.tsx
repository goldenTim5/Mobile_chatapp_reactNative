import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from '../styles/MessageItem.styles';
import { TMessage } from '../types';

type Props = {
  message: TMessage;
};

export const MessageItem = ({ message }: Props) => {
  const imageAttachment = message.attachments.find(
    (att) => att.type === 'image'
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message.text}</Text>

      {imageAttachment && (
        <Image
          source={{ uri: imageAttachment.url }}
          style={[styles.image, { width: imageAttachment.width, height: imageAttachment.height }]}
          resizeMode="cover"
        />
      )}
    </View>
  );
};
