import { View, Text, ToastAndroid } from 'react-native'
import React, { useState } from 'react';
import { Avatar, Button, Dialog, IconButton, Portal } from 'react-native-paper';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/utils/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axiosInstance from '@/utils/axios';
import FormProvider from '@/components/hookform/FormProvider';
import RHFTextField from '@/components/hookform/RHFTextField';
import uuid from 'react-native-uuid';
import { PRIMARY_MAIN } from '@/config';

interface ALRD {
    open: boolean;
    closeDialog: () => void;
}

const AddLearnRequestDialog = ({ closeDialog, open }: ALRD) => {

    const RequestSchema = Yup.object().shape({
        meaning: Yup.string().required('Meaning Is Required'),
        image: Yup.mixed(),
    });

    const [uploadImage, setUploadImage] = useState<any>(null)

    const defaultValues = { meaning: '', image: '' };

    const methods = useForm({ resolver: yupResolver(RequestSchema), defaultValues });

    const { handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = methods;

    const values = watch();

    const closeHandler = () => {
        reset();
        closeDialog();
    }

    const pickImageHandler = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setUploadImage(result.assets[0]);
            setValue('image', result.assets[0].uri)
        }
    }

    const uploadImageHandler = async () => {
        const response = await fetch(values.image);
        const blob = await response.blob();
        const imageRef = ref(storage, `learning/${uploadImage?.fileName || 'image'}-${uuid.v4()}`);
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
            await axiosInstance.post('/add-request', submitForm);
            ToastAndroid.show('Your Request Has Been Submitted. you will be notified upon approval', ToastAndroid.LONG);
            closeHandler()
        } catch (error: any) {
            ToastAndroid.show(error, ToastAndroid.LONG)
        }
      }

  return (
    <Portal>
      <Dialog visible={open} onDismiss={closeHandler}>
        <FormProvider methods={methods}>
            <Dialog.Title>Submit Your Request To Contribute To The Community</Dialog.Title>
            <Dialog.Content style={{ gap: 12 }}>
                <Text style={{ textAlign: 'center' }}>Select Sign Image</Text>
                <View style={{ height: 160, width: 160, position: 'relative' }}>
                    <Avatar.Image size={150} source={{ uri: values.image }} />
                    <IconButton
                        style={{ position: 'absolute', bottom: 0, right: 0 }}
                        icon='camera'
                        iconColor={PRIMARY_MAIN}
                        mode='contained'
                        onPress={pickImageHandler}
                    />
                </View>
                <RHFTextField label='Meaning' name='meaning' placeholder='Meaning' />
            </Dialog.Content>
            <Dialog.Actions>
                {!isSubmitting && <Button onPress={closeHandler}>Cancel</Button>}
                <Button mode='contained' loading={isSubmitting} onPress={handleSubmit(onSubmit)}>Submit</Button>
            </Dialog.Actions>
        </FormProvider>
      </Dialog>
    </Portal>
  )
}

export default AddLearnRequestDialog