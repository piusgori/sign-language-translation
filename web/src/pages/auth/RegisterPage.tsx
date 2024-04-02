import { Alert, IconButton, InputAdornment, Link, Stack, Typography } from "@mui/material"
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup'
import { useState } from "react";
import { useAuthContext } from "../../auth/auth-context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { Login, Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import GuestGuard from "../../auth/GuestGuard";
import AuthLayout from "../../layouts/auth";
import SocialAuth from "../../sections/auth/social-auth";

const RegisterPage = () => {

    const { register } = useAuthContext();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().required('Email Address is required').email('Please enter a valid email address'),
        password: Yup.string().required('Password is required'),
    });

    const defaultValues = { firstName: '', lastName: '', email: '', password: '' };

    const methods = useForm({ resolver: yupResolver(RegisterSchema), defaultValues });

    const { setError, handleSubmit, formState: { errors, isSubmitting } } = methods;

    const onSubmit = async (data: { email: string, password: string }) => {
        try {
          await register(data);
        } catch (error: any) {
          setError('root', { ...error, message: error.message || error, });
        }
    }
    
  return (
    <GuestGuard>
      <AuthLayout>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2}>
                <Typography textAlign='center'>Get Started!</Typography>
                {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                <RHFTextField required name='firstName' label="First Name" placeholder="First Name" />
                <RHFTextField required name='lastName' label="Last Name" placeholder="Last Name" />
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
                <SocialAuth method="Signup" />
                <LoadingButton loading={isSubmitting} startIcon={<Login />} type="submit" variant='contained'>Create Account</LoadingButton>
                <Typography variant='body2'>Already have an account? <Link component={RouterLink} to='/auth/login'>Login</Link></Typography>
            </Stack>
        </FormProvider>
      </AuthLayout>
    </GuestGuard>
        
  )
}

export default RegisterPage