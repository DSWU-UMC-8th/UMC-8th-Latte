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

// login 함수로도 export
export const login = postSignin;

export const getMyInfo = async(token: string): Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get('/v1/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
}

// 로그아웃
export const postLogout = async() => {
    const { data } = await axiosInstance.post('/v1/auth/signout');

    return data;
}

// 프로필 수정
export const updateProfile = async (formData: FormData, token: string) => {
    const { data } = await axiosInstance.patch('/v1/users', formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return data;
};

// 회원 탈퇴
export const deleteAccount = async () => {
  const { data } = await axiosInstance.delete('/v1/users');
  return data;
};

// 로그아웃
export const logout = async () => {
  const { data } = await axiosInstance.post('/v1/auth/logout');
  return data;
};