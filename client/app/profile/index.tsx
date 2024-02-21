import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, IconButton, Text } from 'react-native-paper';
import { useAuthContext } from '@/auth/auth-context';
import { DEFAULT_PROFILE, PRIMARY_MAIN } from '@/config';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from '@/components/hookform/FormProvider';
import RHFTextField from '@/components/hookform/RHFTextField';
import RHFCheckBox from '@/components/hookform/RHFCheckBox';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import uuid from 'react-native-uuid';
import axiosInstance from '@/utils/axios';

const ProfileScreen = () => {

    const { user, update, logout } = useAuthContext();

    const UserSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name Is Required'),
        lastName: Yup.string().required('Last Name Is Required'),
        email: Yup.string().required('Email Address Is Required').email('Please enter a vaild email address'),
        photoURL: Yup.mixed(),
        disabled: Yup.boolean()
    });

    const [uploadImage, setUploadImage] = useState<any>(null)

    const defaultValues = { firstName: '', lastName: '', email: '', photoURL: DEFAULT_PROFILE, disabled: false };

    const methods = useForm({ resolver: yupResolver(UserSchema), defaultValues });

    const { handleSubmit, setValue, watch, setError, formState: { errors, isSubmitting } } = methods;

    const values = watch();

    const pickImageHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setUploadImage(result.assets[0]);
            setValue('photoURL', result.assets[0].uri)
        }
    }

    const uploadImageHandler = async () => {
        const response = await fetch(values.photoURL);
        const blob = await response.blob();
        const imageRef = ref(storage, `images/${uploadImage?.fileName || 'image'}-${uuid.v4()}`);
        const res = await uploadBytes(imageRef, blob);
        const downloadUrl = await getDownloadURL(res.ref);
        return downloadUrl;
    }

    const onSubmit = async (data: any) => {
        try {
            const submitForm = data;
            if (uploadImage) {
                const imageUrl = await uploadImageHandler();
                submitForm.photoURL = imageUrl;
            }
            await axiosInstance.patch('/auth/update-profile', submitForm);
            update(submitForm);
            ToastAndroid.show('Your Profile Details Have Been Saved', ToastAndroid.LONG)
        } catch (error: any) {
          ToastAndroid.show(error, ToastAndroid.LONG)
        }
      }

      useEffect(() => {
        setValue('disabled', user?.disabled);
        setValue('email', user?.email);
        setValue('firstName', user?.firstName);
        setValue('lastName', user?.lastName);
        setValue('photoURL', user?.photoURL || DEFAULT_PROFILE);
      }, [user])

  return (
    <FormProvider methods={methods}>
        <ScrollView contentContainerStyle={{ gap: 20, alignItems: 'center' }}>
            <View style={{ width: '100%', flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                <View />
                <Text variant='headlineSmall' style={{ marginLeft: 50 }}>Your Profile</Text>
                <IconButton
                    icon='logout'
                    iconColor={PRIMARY_MAIN}
                    mode='contained'
                    onPress={logout}
                />
            </View>
            <View style={{ height: 160, width: 160, position: 'relative' }}>
                <Avatar.Image size={150} source={{ uri: values.photoURL }} />
                <IconButton
                    style={{ position: 'absolute', bottom: 0, right: 0 }}
                    icon='camera'
                    iconColor={PRIMARY_MAIN}
                    mode='contained'
                    onPress={pickImageHandler}
                />
            </View>
            
            <View style={{ gap: 20, width: '100%' }}>
                <RHFTextField label='First Name' name='firstName' placeholder='First Name' autoCapitalize='words' />
                <RHFTextField label='Last Name' name='lastName' placeholder='Last Name' autoCapitalize='words' />
                <RHFTextField label='Email Address' name='email' placeholder='Email Address' autoCapitalize='none' keyboardType='email-address' />
                <RHFCheckBox label='Please check here if you have a hearing or listening impairement?' name='disabled' />
                <Button loading={isSubmitting} mode='contained' onPress={handleSubmit(onSubmit)}>Save Details</Button>
            </View>
        </ScrollView>
    </FormProvider>
  )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    imageBackContainer: {

    }
})