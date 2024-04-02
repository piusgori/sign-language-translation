import { useForm } from "react-hook-form";
import GuestGuard from "../../auth/GuestGuard";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../utils/axios";
import { useSnackbar } from "notistack";
import AuthLayout from "../../layouts/auth";
import FormProvider from "../../components/hook-form/FormProvider";
import { Alert, IconButton, InputAdornment, Link, Stack, Typography } from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from "@mui/lab";
import { useJwt } from "react-jwt";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ResetPasswordPage = () => {

    const { enqueueSnackbar } = useSnackbar();
    const { token }: { token?: string } = useParams();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { decodedToken, isExpired }: { decodedToken: any, isExpired: boolean } = useJwt(token!);

    const ResetPasswordSchema = Yup.object().shape({
        password: Yup.string().required('New password is required'),
        confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords don\'t match'),
    });

    const defaultValues = { password: '', confirmPassword: '' };

    const methods = useForm({ resolver: yupResolver(ResetPasswordSchema), defaultValues });

    const { setError, handleSubmit, formState: { errors, isSubmitting } } = methods;

    const onSubmit = async (data: any) => {
        try {
            await axiosInstance.post('/auth/reset-password', data, { headers: { 'Authorization': `Bearer ${token}` } });
            enqueueSnackbar('Your password has been reset. You can now login', { variant: 'success' })
            setTimeout(() => {
                navigate('/auth/login');
            }, 3000)
        } catch (error: any) {
          setError('root', { ...error, message: error.message || error, });
        }
    }
  return (
    <GuestGuard>
        <AuthLayout>
            {(!decodedToken || isExpired) && <Alert severity="error">The link you have used to access this page has either expired or invalid</Alert>}
            {decodedToken && !isExpired && <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={2}>
                    <Typography textAlign='center'>Reset Your Password</Typography>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
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
                    <RHFTextField
                        required
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder='Confirm Password'
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
                    <Link variant="body2" component={RouterLink} to='/auth/login'>Back To Login</Link>
                    <LoadingButton loading={isSubmitting} type="submit" variant='contained'>Reset</LoadingButton>
                </Stack>
            </FormProvider>}
        </AuthLayout>
    </GuestGuard>
  )
}

export default ResetPasswordPage