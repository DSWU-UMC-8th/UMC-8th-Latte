import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { RequestSignupDto, ResponseSignupDto, RequestSigninDto, ResponseSigninDto, ResponseMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async(body: RequestSignupDto):Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post('v1/auth/signup', body);

    return data;
}

export const postSignin = async(body: RequestSigninDto):Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post('/v1/auth/signin', body);

    return data;
}

export const getMyInfo = async(): Promise<ResponseMyInfoDto> => {
    const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken); 
    const token = getItem();
    const {data} = await axiosInstance.get('/v1/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data;
}