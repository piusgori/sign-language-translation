import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Divider, Text } from 'react-native-paper';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import { router } from 'expo-router';
import { CHAT } from '@/utils/types';
import { useAppContext } from '@/services/app-context';
import { DEFAULT_PROFILE, PRIMARY_MAIN } from '@/config';
import { useAuthContext } from '@/auth/auth-context';

dayjs.extend(relativeTime);

interface SCU {
    profile: CHAT
}

const SingleChatUser = ({ profile }: SCU) => {

    const { selectChatHandler } = useAppContext();
    const { user } = useAuthContext();

    const theUser = profile?.userOne?._id === user._id ? profile.userTwo : profile.userOne

    // const filteredMessages = profile?.messages?.filter(mes => ((!mes.doctorRead && mes.to === profile.user?._id)));

  return (
    <>
        <Divider />

        <Pressable android_ripple={{ color: '#ccc' }} style={{ padding: 10 }} onPress={() => { selectChatHandler(theUser?._id || ''); router.push('/chat/') }}>
            <View style={styles.container}>
                <View style={styles.detailsContainer}>
                    <Avatar.Image source={{ uri: theUser?.photoURL || DEFAULT_PROFILE }} size={50} />
                    <View style={{ gap: 6, flex: 1 }}>
                        <Text variant='bodyLarge' style={{ color: PRIMARY_MAIN }}>{theUser?.firstName}</Text>
                        <Text variant='bodyMedium' numberOfLines={1}>{profile.lastMessage?.message}</Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text>{dayjs(profile?.lastMessage?.createdAt).fromNow(true)}</Text>
                </View>
            </View>
        </Pressable>
    </>
  )
}

export default SingleChatUser;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1
    },
    imageContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        height: 50,
        width: 50
    },
})