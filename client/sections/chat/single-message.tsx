import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import { Image } from 'expo-image';

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { PRIMARY_LIGHTER, PRIMARY_MAIN } from '@/config';
import { CHAT, MESSAGE } from '@/utils/types';

dayjs.extend(relativeTime)

interface SM {
    mine?: boolean;
    foundChat?: CHAT;
    message: MESSAGE
}

const SingleMessage = ({ mine, foundChat, message }: SM) => {
  return (
    <>
        {mine && <View style={{ width: '100%', gap: 4, alignItems: 'flex-end', marginVertical: 6 }}>
          <View style={{ backgroundColor: PRIMARY_LIGHTER, padding: 16, borderRadius: 8, maxWidth: '75%', minWidth: '15%' }}>
            <Text style={{ color: PRIMARY_MAIN }}>{message.message}</Text>
          </View>
          <Text style={{ color: PRIMARY_MAIN, alignSelf: 'flex-end' }}>{dayjs(message.createdAt).fromNow(true)}</Text>
          {/* <Text style={{ color: PRIMARY_MAIN, alignSelf: 'flex-end' }}>{new Date(message.createdAt || new Date()).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text> */}
        </View>}

        {!mine && <View style={{ width: '100%', flexDirection: 'row', gap: 12, marginVertical: 6 }}>
          <Avatar.Text label={foundChat?.userOne?.firstName || foundChat?.userTwo?.firstName || ''}  size={25} />
          {/* <View style={styles.chatProfileSection}>
            <Image style={styles.chatProfile} alt={selectedChat?.firstName} source={{ uri: selectedChat?.photoURL || USER_PROFILE_FALLBACk }} />
          </View> */}
          <View style={{ gap: 4, flex: 1 }}>
            <View style={{ backgroundColor: PRIMARY_MAIN, padding: 16, borderRadius: 8, minWidth: '15%', gap: 12, alignSelf: 'flex-start' }}>
                {/* {message.media && <View style={styles.mediaContainer}>
                    <Image alt='media' source={{ uri: message.media }} style={styles.media} />
                </View>} */}
              <Text style={{ color: 'white' }}>{message.message}</Text>
            </View>
            <Text style={{ color: PRIMARY_MAIN, alignSelf: 'flex-start' }}>{dayjs(message.createdAt).fromNow(true)}</Text>
            {/* <Text style={{ color: PRIMARY_MAIN, alignSelf: 'flex-end' }}>{new Date(message.createdAt || new Date()).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text> */}
          </View>
        </View>}
    </>
  )
}

export default SingleMessage;

const styles = StyleSheet.create({
    chatProfileSection: {
      height: 50,
      width: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    chatProfile: {
      height: 50,
      width: 50
    },

    mediaContainer: {
        height: 200,
        width: 200,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    media: {
        height: 200,
        width: 200
    },
  })