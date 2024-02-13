import { View } from 'react-native'
import React from 'react'
import { Button, Text } from 'react-native-paper'

const HomeScreen = () => {

  return (
    <View style={{ gap: 16, backgroundColor: '#fff', flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Text variant='headlineSmall' style={{ fontWeight: 'bold' }}>Your Communications</Text>
        <Button icon='chat-plus' mode='contained-tonal'>Start</Button>
      </View>
    </View>
  )
}

export default HomeScreen