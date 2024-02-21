import { View, Text, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { Button, Card, Dialog, Portal, TextInput } from 'react-native-paper';
import { USER } from '@/utils/types';
import axiosInstance from '@/utils/axios';
import { useAppContext } from '@/services/app-context';
import { useRouter } from 'expo-router';

interface SD {
    open: boolean;
    closeDialog: () => void;
}

const SearchDialog = ({ closeDialog, open }: SD) => {

    const { selectChatHandler } = useAppContext();

    
    const [input, setInput] = useState<string>('');
    const [searchUser, setSearchUser] = useState<USER | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    
    const router = useRouter();

    const closeHandler = () => {
        setInput('');
        setSearchUser(null);
        closeDialog()
    }

    const searchUserHandler = async () => {
        try {
            setIsSearching(true);
            const { data } = await axiosInstance.get(`/search-user?email=${input}`);
            setSearchUser(data.user)
        } catch (err: any) {
            ToastAndroid.show(err, ToastAndroid.LONG)
        } finally {
            setIsSearching(false);
        }
    }

    const selectUserHandler = () => {
        selectChatHandler(searchUser?._id || '');
        router.push('/chat/')
        closeHandler();
    }

  return (
    <Portal>
      <Dialog visible={open} onDismiss={closeHandler}>
        <Dialog.Title>Search For User To Start Communication With</Dialog.Title>
        {!searchUser && <Dialog.Content>
            <TextInput
                value={input}
                onChangeText={(e) => { setInput(e) }}
                keyboardType='email-address'
                autoCapitalize='none'
                placeholder='Enter User Email Address'
                label='Email Address'
            />
        </Dialog.Content>}
        {searchUser && <Dialog.ScrollArea>
            <Card>
                <Card.Title title='User Found' />
                <Card.Content>
                    <Text>{searchUser.firstName} {searchUser.lastName} - {searchUser.email}</Text>
                    <Text>This user {searchUser.disabled ? 'has' : 'does not have'} a hearing or listening impairement</Text>
                </Card.Content>
                <Card.Actions>
                    <Button onPress={closeHandler}>Cancel</Button>
                    <Button mode='contained' onPress={selectUserHandler}>Select</Button>
                </Card.Actions>
            </Card>
        </Dialog.ScrollArea>}
        {!searchUser && <Dialog.Actions>
            <Button onPress={closeHandler}>Cancel</Button>
            <Button mode='contained' loading={isSearching} onPress={searchUserHandler}>Search</Button>
        </Dialog.Actions>}
      </Dialog>
    </Portal>
  )
}

export default SearchDialog