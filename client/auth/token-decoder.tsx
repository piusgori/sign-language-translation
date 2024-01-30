import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import axiosInstance from "@/utils/axios";
import { lsRemoveItem, lsSetItem } from "@/utils/data";

const jwtDecoder = (token: string) => {
    const jsonPayload = jwtDecode(token) as any;
    return jsonPayload;
}

export const isValidToken = async (accessToken: string) => {
    if (!accessToken) return false;
    const decoded = jwtDecoder(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const tokenExpired = async (exp: number) => {
    // eslint-disable-next-line prefer-const
    let expiredTimer;
    const currentTime = Date.now();
    const timeLeft = exp * 1000 - currentTime;
    clearTimeout(expiredTimer);
    expiredTimer = setTimeout(async () => {
        await lsRemoveItem('accessToken');
        window.location.href = '/auth/login';
    }, timeLeft);
};
  
export const setSession = async (accessToken: string | null) => {
    if (accessToken) {
      await lsSetItem('accessToken', accessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      const { exp } = jwtDecoder(accessToken);
      tokenExpired(exp);
    } else {
        await lsRemoveItem('accessToken');
        delete axiosInstance.defaults.headers.common.Authorization;
        router.replace('/auth/login' as any);
    }
  };