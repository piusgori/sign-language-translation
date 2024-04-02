import axiosInstance from "../utils/axios";

const jwtDecode = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`).join(''));
    return JSON.parse(jsonPayload);
}

export const isValidToken = async (accessToken: string) => {
    if (!accessToken) return false;
    const decoded = jwtDecode(accessToken);
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
        alert('Token expired');
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';

    }, timeLeft);
};
  
export const setSession = async (accessToken: string | null) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      const { exp } = jwtDecode(accessToken);
      tokenExpired(exp);
    } else {
      localStorage.removeItem('accessToken');
      delete axiosInstance.defaults.headers.common.Authorization;
    }
  };