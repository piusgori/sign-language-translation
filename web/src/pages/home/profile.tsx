import { useSnackbar } from "notistack";
import { useAuthContext } from "../../auth/auth-context";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect } from "react";
import { storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axiosInstance from "../../utils/axios";
import FormProvider from "../../components/hook-form/FormProvider";
import { Alert, Stack, Typography } from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { LoadingButton } from "@mui/lab";
import { RHFCheckbox } from "../../components/hook-form/RHFCheckBox";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUpload";

const ProfilePage = () => {

    const { enqueueSnackbar } = useSnackbar();
    const { user, update } = useAuthContext();

    const ProfileSchema = Yup.object().shape({
        photoURL: Yup.mixed(),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().required('Email address is required').email('Please enter a valid email'),
        disabled: Yup.boolean()
    });

    const defaultValues = {
        photoURL: '',
        firstName: '',
        lastName: '',
        email: '',
        disabled: false,
    };

    const methods = useForm({ resolver: yupResolver(ProfileSchema), defaultValues });

    const { handleSubmit, setError, setValue, formState: { errors, isSubmitting } } = methods;

    useEffect(() => {
        setValue('photoURL', user?.photoURL);
        setValue('firstName', user?.firstName);
        setValue('lastName', user?.lastName);
        setValue('email', user?.email);
        setValue('disabled', user?.disabled);
    }, [user])

    const handleDrop = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, { preview: URL.createObjectURL(file), });
        if (file) setValue('photoURL', newFile, { shouldValidate: true });
      },
      [setValue]
    );

    const uploadImage = async (file: any) => {
        const documentRef = ref(storage, `profile/${file.name}`);
        const res = await uploadBytes(documentRef, file);
        const documentUrl = await getDownloadURL(res.ref);
        return documentUrl;
    }

    const onSubmit = async (data: any) => {
        try {
            const submitForm = data;
            if (data?.photoURL || data?.photoURL?.name) {
                const url = await uploadImage(data?.photoURL);
                submitForm.photoURL = url;
            };
            await axiosInstance.patch('/auth/update-profile', submitForm);
            update(submitForm);
            enqueueSnackbar('User details updated successfully', { variant: 'success' });
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography textAlign='center' sx={{ mb: 3 }} variant="h5">Update Your Profile Details</Typography>
        <Stack gap={2} direction={{ xs: 'column', md: 'row' }} sx={{ pt: 3 }}>
            <Stack gap={2} sx={{ flex: 1 }}>
                <Typography variant='subtitle1' fontWeight='600' textAlign='center'>Profile Picture</Typography>
                <RHFUploadAvatar name='photoURL' onDrop={handleDrop} />
            </Stack>
            <Stack gap={2} sx={{ flex: 1 }}>
                {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                <RHFTextField label='First Name' name='firstName' placeholder='First Name' required />
                <RHFTextField label='Last Name' name='lastName' placeholder='Last Name' required />
                <RHFTextField label='Email Address' name='email' placeholder='Email Addres' type='email' required />
                <RHFCheckbox label="Check here if you are disabled" name="disabled" />
                <LoadingButton variant='contained' loading={isSubmitting} type='submit'>Save</LoadingButton>
            </Stack>
        </Stack>
    </FormProvider>

  )
}

export default ProfilePage