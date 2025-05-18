import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { RequestSigninDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signInData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
})

export const AuthProvider = ({children}: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshsTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(() => {
        const token = getAccessTokenFromStorage();
        return token;
    });

    const [refreshToken, setRefreshToken] = useState<string | null>(() => {
        const token = getRefreshTokenFromStorage();
        return token;
    });

    const login = async (signInData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signInData);
            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);

                window.location.href = "/";
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인에 실패했습니다.');
        }
    };

    const logout = async() => {
        try {
            await postLogout();
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            removeAccessTokenFromStorage();
            removeRefreshsTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);
            window.location.href = "/login";
        }
    };

    // 토큰 상태가 변경될 때마다 localStorage 업데이트
    useEffect(() => {
        if (accessToken) {
            setAccessTokenInStorage(accessToken);
        } else {
            removeAccessTokenFromStorage();
        }
    }, [accessToken, setAccessTokenInStorage, removeAccessTokenFromStorage]);

    useEffect(() => {
        if (refreshToken) {
            setRefreshTokenInStorage(refreshToken);
        } else {
            removeRefreshsTokenFromStorage();
        }
    }, [refreshToken, setRefreshTokenInStorage, removeRefreshsTokenFromStorage]);

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}