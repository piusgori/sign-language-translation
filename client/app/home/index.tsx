import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { useAuthContext } from '@/auth/auth-context'

const HomeScreen = () => {

  const { logout } = useAuthContext();

  return (
    <View style={{ gap: 16, backgroundColor: '#fff', flex: 1 }}>
      <Text>Welcome</Text>
      <Button mode='contained' onPress={logout}>Logout</Button>
    </View>
  )
}

export default HomeScreen