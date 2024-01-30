import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

const Preloader = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
    </View>
  )
}

export default Preloader