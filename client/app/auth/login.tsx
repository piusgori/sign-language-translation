import { StyleSheet, Image, ScrollView, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import { useAuthContext } from '@/auth/auth-context';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '@/components/hookform/FormProvider';
import RHFTextField from '@/components/hookform/RHFTextField';
import SocialAuth from '@/sections/auth/social-auth';
import { useRouter } from 'expo-router';

const LoginPage = () => {

  const { login } = useAuthContext();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const RegistrationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = { password: '', email: '' };

  const methods = useForm({ resolver: yupResolver(RegistrationSchema), defaultValues });
  
  const { handleSubmit, setValue, watch, setError, formState: { errors, isSubmitting } } = methods;

  const values = watch();

  const onSubmit = async (data: any) => {
    try {
      await login(data);
    } catch (error: any) {
      ToastAndroid.show(error, ToastAndroid.LONG)
    }
  }

  return (
    <FormProvider methods={methods}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.eachContainer}>
          <Text variant='headlineSmall'>LOGIN</Text>
          <Image style={{ height: 100, width: 100 }} alt='Logo' source={require('@/assets/images/logo-trans.png')} />
        </View>

        <View style={styles.eachContainer}>
          <RHFTextField label='Email Address' name='email' placeholder='Email Address' autoCapitalize='none' keyboardType='email-address' />
          <RHFTextField label='Password' name='password' placeholder='Password' autoCapitalize='none' secureTextEntry={!showPassword} right={<TextInput.Icon onPress={() => { setShowPassword(prev => !prev) }} icon={showPassword ? 'eye-off' : 'eye'} />} />
          <Button mode='contained' style={{ borderRadius: 4, width: '100%' }} onPress={handleSubmit(onSubmit)} loading={isSubmitting}>Login</Button>
          <Text>Or</Text>
          <SocialAuth method='Login' />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text>Don't Have An Account?</Text>
            <Button onPress={() => { router.push('/auth/register') }}>Create Account</Button>
          </View>
        </View>
      </ScrollView>
    </FormProvider>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    gap: 50,
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  eachContainer: {
    gap: 20,
    alignItems: 'center',
    width: '100%'
  }
})