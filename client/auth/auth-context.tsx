import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { isValidToken, setSession } from "./token-decoder";
import axiosInstance from "../utils/axios";
import { lsGetItem, lsRemoveItem, lsSetItem } from "../utils/data";

const AuthContext = createContext({
    isInitialized: false,
    isAuthenticated: false,
    user: null as any | null,
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

    const getUserDetails = async () => {
        const response = await axiosInstance.get('/auth/profile');
        return response.data.user;
    }

    const initialize = useCallback(async () => {
        try {
            let accessToken = await lsGetItem('accessToken');
            if (accessToken && await isValidToken(accessToken)) {
                await setSession(accessToken);
                const user = await getUserDetails();
                dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: true, user } })   
            } else {
                dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: false, user: null } })
            }
        } catch (error) {
            dispatch({ type: dispatchActionTypes.INITIAL, payload: { isAuthenticated: false, user: null } });
        }
    } ,[]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const login = useCallback(async (data: any) => {
        const response = await axiosInstance.post('/auth/login', data);
        const { user, accessToken } = response.data;
        await setSession(accessToken);
        dispatch({ type: dispatchActionTypes.LOGIN, payload: { user } });
    }, []);

    const register = useCallback(async (data: any) => {
        const response = await axiosInstance.post('/auth/register', data);
        const { user, accessToken } = response.data;
        await setSession(accessToken);
        dispatch({ type: dispatchActionTypes.REGISTER, payload: { user: { ...user, credit: 10 } } });
    }, []);

    const update = useCallback((data: any) => {
        dispatch({ type: dispatchActionTypes.UPDATE, payload: { user: data } });
    }, []);
    
    const logout = useCallback(async () => {
        await setSession(null);
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