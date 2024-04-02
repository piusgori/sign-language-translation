import { PRIMARY_LIGHTER, PRIMARY_MAIN } from '@/config';
import { useAppContext } from '@/services/app-context'
import { useRouter } from 'expo-router';
import React from 'react'
import { FlatList, RefreshControl, View } from 'react-native';
import { Chip, IconButton, Text } from 'react-native-paper';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

const NotificationsScreen = () => {
    const { notifications, isGettingNotifications, getNotificationsHandler } = useAppContext();
    const { back } = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', gap: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton
                icon='arrow-left'
                onPress={() => { back() }}
            />
            <Text variant='headlineMedium'>Notifications</Text>
            <View />
        </View>

        <FlatList
            initialNumToRender={2}
            refreshControl={<RefreshControl colors={[PRIMARY_MAIN]} refreshing={isGettingNotifications} onRefresh={getNotificationsHandler} />}
            data={notifications}
            renderItem={({ item }) => {
                return (
                    <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginVertical: 12 }}>
                        <Text style={{ flex: 1 }}>{item.message}</Text>
                        <View style={{ gap: 10 }}>
                            <Text>{dayjs(item.createdAt).fromNow(true)}</Text>
                            {!item.read && <Chip>New</Chip>}
                        </View>
                    </View>
                )                
            }}
        />
    </View>
  )
}

export default NotificationsScreen