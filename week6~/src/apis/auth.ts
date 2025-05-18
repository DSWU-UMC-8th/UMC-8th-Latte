import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { 
    RequestSignupDto, 
    ResponseSignupDto, 
    RequestSigninDto, 
    ResponseSigninDto, 
    ResponseMyInfoDto,
    UpdateProfileRequest,
    UpdateProfileResponse 
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const token = getItem();
    const {data} = await axiosInstance.get('/v1/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

export const postLogout = async () => {
    const { data } = await axiosInstance.post("/v1/auth/signout");
    return data;
};

export const updateProfile = async (body: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    try {
        const { data } = await axiosInstance.patch('/v1/users', body);
        return data;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

export const deleteAccount = async () => {
    const { data } = await axiosInstance.delete('/v1/users');
    return data;
};