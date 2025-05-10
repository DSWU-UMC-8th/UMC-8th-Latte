import { createContext, PropsWithChildren, useContext, useState } from "react";
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

    const [accessToken, setAccessToken] = useState<string | null> (
        getAccessTokenFromStorage(), // 지연 초기화 (페이지 이동시)
    );

    const [refreshToken, setRefreshToken] = useState<string | null> (
        getRefreshTokenFromStorage(), // 지연 초기화 (페이지 이동시)
    );

    const login = async(SiginData: RequestSigninDto) => {
        const {data} = await postSignin(SiginData);

        try {
            if(data){
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;
    
                setAccessTokenInStorage(newAccessToken); // localStroage 저장
                setRefreshTokenInStorage(newRefreshToken);
    
                setAccessToken(newAccessToken); 
                setRefreshToken(newRefreshToken); 

                alert("로그인 성공");
                window.location.href = "/"; //navigate는 router 안에서만 사용 가능 
            }

        } catch (error) {
            console.error(error);
            alert("로그인 실패");
        }
    }

    const logout = async() => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshsTokenFromStorage();

            setAccessToken(null); 
            setRefreshToken(null); 

            alert("로그아웃 성공");
            window.location.href = "/";

        } catch (error) {
            console.error(error);
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout}}>
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