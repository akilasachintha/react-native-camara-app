import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {addDataToLocalStorage, getDataFromLocalStorage} from "@helpers/asyncStorageHelper";
import {useNavigation} from "@react-navigation/native";
import {useLoadingContext} from "@context/LoadingContext";
import {useToast} from "@context/ToastContext";

export interface AuthContextType {
    isLoggedIn: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const navigation = useNavigation();
    const {showLoading, hideLoading} = useLoadingContext();
    const {showToast} = useToast();

    useEffect(() => {
        const loadLoginStatus = async () => {
            const storedIsLoggedIn = await getDataFromLocalStorage("isLoggedIn");
            const storedToken = await getDataFromLocalStorage("token");

            if (storedIsLoggedIn !== null) {
                setIsLoggedIn(JSON.parse(storedIsLoggedIn));
            }
            if (storedToken !== null) {
                setToken(JSON.parse(storedToken));
            }
        };

        loadLoginStatus().catch((e) => console.error(e));
    }, []);

    const login = async (token: string) => {
        await addDataToLocalStorage("isLoggedIn", JSON.stringify(true));
        await addDataToLocalStorage("token", JSON.stringify(token));

        setIsLoggedIn(true);
        setToken(token);

        // @ts-ignore
        navigation.reset({
            index: 0,
            // @ts-ignore
            routes: [{name: "Main"}],
        });
    };

    const logout = async () => {
        await addDataToLocalStorage("isLoggedIn", JSON.stringify(false));
        await addDataToLocalStorage("token", JSON.stringify(null));

        setIsLoggedIn(false);
        setToken(null);

        showLoading();

        setTimeout(() => {
            hideLoading();
            // @ts-ignore
            navigation.navigate("HomeStack");

            showToast("Successfully logged out");
        }, 2000);
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};