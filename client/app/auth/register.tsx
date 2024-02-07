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

const RegisterPage = () => {

  const { register } = useAuthContext();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const RegistrationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    passwordConfirm: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password')], "Passwords should match"),
  });

  const defaultValues = { firstName: '', lastName: '', password: '', passwordConfirm: '', email: '' };

  const methods = useForm({ resolver: yupResolver(RegistrationSchema), defaultValues });
  
  const { handleSubmit, setValue, watch, setError, formState: { errors, isSubmitting } } = methods;

  const values = watch();

  const onSubmit = async (data: any) => {
    try {
      if (data.password !== data.passwordConfirm) {
        setError('passwordConfirm', { message: 'Passwords Should Match' })
        return;
      }
      await register(data);
    } catch (error: any) {
      console.log(error);
      ToastAndroid.show(error, ToastAndroid.LONG)
    }
  }

  return (
    <FormProvider methods={methods}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.eachContainer}>
          <Text variant='headlineSmall'>REGISTER</Text>
          <Image style={{ height: 100, width: 100 }} alt='Logo' source={require('@/assets/images/logo-trans.png')} />
        </View>

        <View style={styles.eachContainer}>
          <RHFTextField label='First Name' name='firstName' placeholder='First Name' autoCapitalize='words' />
          <RHFTextField label='Last Name' name='lastName' placeholder='Last Name' autoCapitalize='words' />
          <RHFTextField label='Email Address' name='email' placeholder='Email Address' autoCapitalize='none' keyboardType='email-address' />
          <RHFTextField label='Password' name='password' placeholder='Password' autoCapitalize='none' secureTextEntry={!showPassword} right={<TextInput.Icon onPress={() => { setShowPassword(prev => !prev) }} icon={showPassword ? 'eye-off' : 'eye'} />} />
          <RHFTextField label='Confirm Password' name='passwordConfirm' placeholder='Confirm Password' autoCapitalize='none' secureTextEntry={!showPassword} right={<TextInput.Icon onPress={() => { setShowPassword(prev => !prev) }} icon={showPassword ? 'eye-off' : 'eye'} />} />
          <Button mode='contained' style={{ borderRadius: 4, width: '100%' }} onPress={handleSubmit(onSubmit)} loading={isSubmitting}>Create Account</Button>
          <Text>Or</Text>
          <SocialAuth method='Register' />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text>Already Have An Account?</Text>
            <Button onPress={() => { router.push('/auth/login') }}>Login</Button>
          </View>
        </View>
      </ScrollView>
    </FormProvider>
  )
}

export default RegisterPage

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