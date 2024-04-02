import { Alert, IconButton, InputAdornment, Link, Stack, Typography } from "@mui/material"
import FormProvider from "../../components/hook-form/FormProvider"
import { useAuthContext } from "../../auth/auth-context";
import { useState } from "react";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from "@mui/lab";
import GuestGuard from "../../auth/GuestGuard";
import AuthLayout from "../../layouts/auth";
import SocialAuth from "../../sections/auth/social-auth";

const LoginPage = () => {

    const { login } = useAuthContext();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const LoginSchema = Yup.object().shape({
        email: Yup.string().required('Email Address is required').email('Please enter a valid email address'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = { email: '', password: '' };

    const methods = useForm({ resolver: yupResolver(LoginSchema), defaultValues });

    const { setError, handleSubmit, formState: { errors, isSubmitting } } = methods;

    const onSubmit = async (data: { email: string, password: string }) => {
        try {
          await login(data);
        } catch (error: any) {
          setError('root', { ...error, message: error.message || error, });
        }
    }

  return (
    <GuestGuard>
        <AuthLayout>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                    <Typography textAlign='center'>Welcome again!</Typography>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFTextField required name='email' label="Email Address" placeholder="Email Address" type='email' />
                    <RHFTextField
                        required
                        name="password"
                        label="Password"
                        placeholder='Password'
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            ),
                        }}
                    />
                    <Link variant="body2" component={RouterLink} to='/auth/forgot-password'>Forgot Password?</Link>
                    <SocialAuth method="Login" />
                    <LoadingButton loading={isSubmitting} startIcon={<Login />} type="submit" variant='contained'>Login</LoadingButton>
                    <Typography variant='body2'>Don't have an account? <Link component={RouterLink} to='/auth/register'>Sign Up</Link></Typography>
                </Stack>
            </FormProvider>
        </AuthLayout>
    </GuestGuard>
  )
}

export default LoginPage