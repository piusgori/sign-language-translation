import { Google } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useAuthContext } from "../../auth/auth-context";

interface SA {
    method: 'Login' | 'Signup'
}

const SocialAuth = ({ method }: SA) => {

    const { googleLogin, googleRegister } = useAuthContext();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const successHandler = async (resp: any) => {
        try {
            setIsLoading(true);
            const token = resp?.access_token;
            const { data } = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, { headers: { 'Authorization': `Bearer ${token}` } });
            const authUser = { given_name: data.given_name, family_name: data.family_name, email: data.email, googleId: data.id, photoURL: data.photo };
            if (method === 'Login') await googleLogin(authUser);
            else if (method === 'Signup') await googleRegister(authUser);
        } catch (err: any) {
            const  errMessage = err?.response?.data?.message || err?.message || err || 'Something went wrong'
            enqueueSnackbar(errMessage, { variant: 'error' })
        } finally {
            setIsLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: successHandler,
        onError: (err) => { console.log(err); }
    })

  return (
    <LoadingButton loading={isLoading} variant="outlined" color='inherit' startIcon={<Google />} onClick={() => login()}>Continue With Google</LoadingButton>
  )
}

export default SocialAuth;