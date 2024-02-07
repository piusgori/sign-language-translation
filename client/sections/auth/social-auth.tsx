import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import React, { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ActivityIndicator } from 'react-native-paper';
import { useAuthContext } from '@/auth/auth-context';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
});

const SocialAuth = ({ method }: { method: 'Register' | 'Login' }) => {

  const [isLoading, setIsLoading] = useState(false);
  const { googleLogin, googleRegister } = useAuthContext();

  const authenticationHandler = async () => {
    try {
        setIsLoading(true);
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        }
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        const authUser = { given_name: userInfo.user.givenName, family_name: userInfo.user.familyName, email: userInfo.user.email, googleId: userInfo.user.id }
        if (method === 'Login') await googleLogin(authUser);
        else if (method === 'Register') await googleRegister(authUser);
    } catch (error: any) {
      ToastAndroid.show(error, ToastAndroid.LONG)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <View style={{ width: '100%' }}>
      {(isLoading) ? <ActivityIndicator /> : <TouchableOpacity
        onPress={authenticationHandler}
        style={styles.buttonContainer}
      >
        <Image alt='google' source={require('@/assets/images/google.png')} style={styles.googleImageContainer} />
        <Text>Continue With Google</Text>
      </TouchableOpacity>}
    </View>
  )
}

export default SocialAuth

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  googleImageContainer: {
    height: 16,
    width: 16,
    objectFit: 'contain'
  }
})