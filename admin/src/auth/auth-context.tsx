import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import localStorageAvailable from "../utils/localStorageAvailable";
import { isValidToken, setSession } from "./token-decoder";
import axiosInstance from "../utils/axios";

const AuthContext = createContext({
    isInitialized: false,
    isAuthenticated: false,
    user: {} as any,
    login: async (data: any) => { console.log(data) },
    register: async (data: any) => { console.log(data) },
    logout: () => {},
    update: (data: any) => { console.log(data) },
});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('There should include a context');
    return context;
}

const INITIAL_STATE = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
}

enum dispatchActionTypes { INITIAL = 'INITIAL', LOGIN = 'LOGIN', REGISTER = 'REGISTER', UPDATE = 'UPDATE', LOGOUT = 'LOGOUT' };

interface RF_ACTION {
    type: string,
    payload?: {
        isAuthenticated?: boolean,
        isInitiated?: boolean,
        user?: any
    }
}

const REDUCER_FUNCTION = (state: any, action: RF_ACTION ) => {
    if (action.type === dispatchActionTypes.INITIAL) {
        return {
            isInitialized: true,
            isAuthenticated: action?.payload?.isAuthenticated,
            user: action?.payload?.user
        };
    }
    if (action.type === dispatchActionTypes.LOGIN) {
        return {
            ...state,
            isAuthenticated: true,
            user: action?.payload?.user,
        }
    }
    if (action.type === dispatchActionTypes.REGISTER) {
        return {
            ...state,
            isAuthenticated: true,
            user: action?.payload?.user
        }
    }

    if (action.type === dispatchActionTypes.UPDATE) {
        return {
            ...state,
            user: { ...state?.user, ...action?.payload?.user }
        }
    }

    if (action.type === dispatchActionTypes.LOGOUT) {
        return {
            ...state,
            isAuthenticated: false,
            user: null
        }
    }
}

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(REDUCER_FUNCTION, INITIAL_STATE);

    const storageAvailable = localStorageAvailable();

    const initialize = useCallback(async () => {
        try {
            const accessToken = storageAvailable ? localStorage.getItem('accessToken'): '';
            if (accessToken && await isValidToken(accessToken)) {
                setSession(accessToken);
                const response = await axiosInstance.get('/auth/profile');
                dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: true, user: response.data?.user } })
            } else {
                dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: false, user: null } })
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: false, user: null } });
        }
    } ,[storageAvailable]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const login = useCallback(async (data: any) => {
        const response = await axiosInstance.post('/admin/auth/login', data);
        const { user, accessToken } = response.data;
        setSession(accessToken);
        dispatch({ type: dispatchActionTypes.LOGIN, payload: { user } });
    }, []);

    const register = useCallback(async (data: any) => {
        const response = await axiosInstance.post('/auth/register', data);
        const { user, accessToken } = response.data;
        setSession(accessToken);
        dispatch({ type: dispatchActionTypes.REGISTER, payload: { user } });
    }, []);

    const update = useCallback((data: any) => {
        dispatch({ type: dispatchActionTypes.UPDATE, payload: { user: data } });
    }, []);
    
    const logout = useCallback(() => {
        setSession(null);
        localStorage.removeItem('refreshToken');
        dispatch({ type: dispatchActionTypes.LOGOUT });
    }, []);

    const value = useMemo(() => ({
        isInitialized: state.isInitialized,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        login,
        register,
        logout,
        update,
    }), [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, update]);

    return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
}