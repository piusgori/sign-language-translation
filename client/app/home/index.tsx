import { RefreshControl, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text } from 'react-native-paper'
import { CHAT } from '@/utils/types';
import axiosInstance from '@/utils/axios';
import { PRIMARY_MAIN } from '@/config';
import { useAppContext } from '@/services/app-context';
import SingleChatUser from '@/sections/home/single-chat-user';
import SearchDialog from '@/sections/home/search-dialog';

const HomeScreen = () => {

  const { isRefreshing, refreshHandler, isLoading, chats } = useAppContext();

  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  return (
    <>

      <SearchDialog closeDialog={() => { setSearchOpen(false) }} open={searchOpen} />

      <ScrollView 
        contentContainerStyle={{ gap: 16, backgroundColor: '#fff', flex: 1 }}
        refreshControl={<RefreshControl colors={[PRIMARY_MAIN]} refreshing={isRefreshing} onRefresh={refreshHandler} />}
      >

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Text variant='headlineSmall' style={{ fontWeight: 'bold' }}>Your Communications</Text>
          <Button onPress={() => { setSearchOpen(true) }} icon='chat-plus' mode='contained-tonal'>Start</Button>
        </View>
        {/* <ScrollView contentContainerStyle={styles.messagesContainer}> */}
          {isLoading && <ActivityIndicator />}
          {!isLoading && chats.length === 0 && <Text style={{ textAlign: 'center' }}>No communications.</Text>}
          {!isLoading && chats.sort((a, b) => new Date(b.lastMessage?.createdAt || new Date()).getTime() - new Date(a.lastMessage?.createdAt || new Date()).getTime()).map((prof, ind) => <SingleChatUser profile={prof} key={ind} />)}
        {/* </ScrollView> */}
      </ScrollView>
    </>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  messagesContainer: {
    gap: 0,
  }
})