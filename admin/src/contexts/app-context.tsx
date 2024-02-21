import { ReactNode, createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext({
    drawerOpen: false,
    setDrawerOpen: (_: boolean) => {  },
});

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('There should be a context');
    return context;
}

export default function AppContextProvider({ children }: { children: ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const value = useMemo(() => ({
        drawerOpen,
        setDrawerOpen,
    }), [drawerOpen, setDrawerOpen,]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}