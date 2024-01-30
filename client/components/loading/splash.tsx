import { View, Text, Image } from 'react-native'
import React from 'react'
import { windowWidth } from '@/utils/data'

const Splash = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Image alt='Logo' style={{ height: windowWidth - 150, width: windowWidth - 150 }} source={require('@/assets/images/logo-trans.png')} />
    </View>
  )
}

export default Splash