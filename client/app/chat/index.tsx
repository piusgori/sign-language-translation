import React, { createRef, useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Pressable, StyleSheet, TextInput, View, VirtualizedList } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppContext } from '@/services/app-context';
import { useAuthContext } from '@/auth/auth-context';
import { PRIMARY_MAIN } from '@/config';
import SingleMessage from '@/sections/chat/single-message';
import FormProvider from '@/components/hookform/FormProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatCamera from '@/sections/chat/chat-camera';
import { Camera } from 'expo-camera';

const DATA = [
  'Hello', 'There', 'How', 'You'
]

const ChatScreen = () => {

  const { setMessageInput, sendMessage, selectedUser, chats } = useAppContext();
  const { user } = useAuthContext();
  const svRef = createRef<ScrollView>();

  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const contentChangeHandler = () => {
    svRef.current?.scrollToEnd({ animated: false });
  };

  const MessageSchema = Yup.object().shape({
    message: Yup.string(),
  });

  const defaultValues = { message: '' };

  const foundChat = chats.find(chat => ((chat.userOne?._id === selectedUser) || (chat.userTwo?._id === selectedUser)));

  const theUser = foundChat?.userOne._id === user?._id ? foundChat?.userTwo : foundChat?.userOne

  const methods = useForm({ resolver: yupResolver(MessageSchema), defaultValues });

  const { handleSubmit, watch, setValue, reset } = methods;

  const textMessage = watch('message');

  const onSubmit = () => {
    // console.log('Sending message');
    if (textMessage?.length! > 0) {
      Keyboard.dismiss()
      sendMessage();
      reset();

    }
  };

  const openCameraHandler = () => {
    if (!permission?.granted) {
      return Alert.alert('Camera Permission Denied', 'This app does not have access to the camera', [
        { text: 'Cancel' },
        { text: 'Request Again', onPress: requestPermission }
      ])
    }
    setCameraOpen(true);
  }

  useEffect(() => {
    contentChangeHandler();
  }, [selectedUser]);

  useEffect(() => {
    setMessageInput(textMessage || '')
  }, [textMessage]);

  useEffect(() => {
    if (permission?.canAskAgain && !permission.granted) {
      requestPermission().then(res => {
        console.log(res)
      })
    }
  })

  return (
    <>
      <ChatCamera closeCamera={() => { setCameraOpen(false) } } open={cameraOpen} />
      <View style={styles.container}>
          <View style={styles.topContainer}>
            <Pressable style={{ backgroundColor: 'white' }} onPress={() => { router.back() }} android_ripple={{ color: '#ccc' }}><MaterialIcons name='arrow-back-ios' size={24} color={PRIMARY_MAIN} /></Pressable>
            <Text variant='bodyLarge' style={{ color: PRIMARY_MAIN }}>{theUser?.firstName}</Text>
            <Pressable style={{ backgroundColor: 'white' }} onPress={() => { router.push('/profile/') }} android_ripple={{ 'color': '#ccc' }}><SimpleLineIcons name='settings' size={24} color={PRIMARY_MAIN} /></Pressable>
          </View>

          <FlatList
            initialNumToRender={2}
            data={foundChat?.messages?.sort((a, b) => new Date(b.createdAt || new Date).getTime() - new Date(a.createdAt || new Date).getTime())}
            renderItem={({ item }) => {
              return (
                <SingleMessage foundChat={foundChat} message={item} mine={item.from === user?._id} key={item.id} />
              )
            }}
            inverted
          />

          {/* <ScrollView ref={svRef} onContentSizeChange={contentChangeHandler}>
          {selectedUser && theChat?.messages?.map((mes, index) => {
              return (
                  <SingleMessage foundChat={theChat} message={mes} mine={mes.from === user?._id} key={index} />
              )
          })}
          </ScrollView> */}

          <FormProvider methods={methods}>
            <View style={styles.inputContainer}>
              <TextInput multiline placeholder='Write your message here' autoCapitalize='sentences' style={styles.inputTextfield} value={textMessage} onChangeText={(e) => { setValue('message', e) }} />
              <Pressable android_ripple={{ color: '#ccc' }} onPress={openCameraHandler}>
                <Entypo name="camera" size={24} color="gray" />
              </Pressable>
              <Pressable disabled={!textMessage} android_ripple={{ color: '#ccc' }} onPress={handleSubmit(onSubmit)}>
                <FontAwesome name="send" size={24} color="gray" />
              </Pressable>
            </View>
            {/* <RHFTextField name='message' placeholder='Write your message here' autoCapitalize='sentences' label='' outlineColor='#C5C6D0' returnKeyType='send' right={<TextInput.Icon disabled={!textMessage} icon='send' onPress={handleSubmit(onSubmit)} />} /> */}
          </FormProvider>

      </View>
    </>
  )
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    gap: 24,
    padding: 16,
    justifyContent: 'space-between'
  },
  topContainer: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingBottom: 6
  },
  inputTextfield: {
    flex: 1
  }
})