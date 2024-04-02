import { useForm } from "react-hook-form";
import GuestGuard from "../../auth/GuestGuard";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../utils/axios";
import { useSnackbar } from "notistack";
import AuthLayout from "../../layouts/auth";
import FormProvider from "../../components/hook-form/FormProvider";
import { Alert, Link, Stack, Typography } from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from "@mui/lab";

const ForgotPasswordPage = () => {

    const { enqueueSnackbar } = useSnackbar();

    const ForgotSchema = Yup.object().shape({
        email: Yup.string().required('Email Address is required').email('Please enter a valid email address'),
    });

    const defaultValues = { email: '' };

    const methods = useForm({ resolver: yupResolver(ForgotSchema), defaultValues });

    const { setError, handleSubmit, formState: { errors, isSubmitting } } = methods;

    const onSubmit = async (data: any) => {
        try {
          await axiosInstance.post('/auth/forgot-password', data);
          enqueueSnackbar('A reset password linkhas been sent to the entered email', { variant: 'success' })
        } catch (error: any) {
          setError('root', { ...error, message: error.message || error, });
        }
    }
  return (
    <GuestGuard>
        <AuthLayout>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                    <Typography textAlign='center'>Enter Your Email Address To Recover Your Account</Typography>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFTextField required name='email' label="Email Address" placeholder="Email Address" type='email' />
                    <Link variant="body2" component={RouterLink} to='/auth/login'>Back To Login</Link>
                    <LoadingButton loading={isSubmitting} type="submit" variant='contained'>Submit</LoadingButton>
                </Stack>
            </FormProvider>
        </AuthLayout>
    </GuestGuard>
  )
}

export default ForgotPasswordPage