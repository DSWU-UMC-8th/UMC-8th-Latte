import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { RequestSignupDto, ResponseSignupDto, RequestSigninDto, ResponseSigninDto, ResponseMyInfoDto } from "../types/auth";
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
  const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken); // 무시 가능 경고
    const token = getItem();
    const {data} = await axiosInstance.get('/v1/users/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return data;
};

export const postLogout = async () => {
  const {data} = await axiosInstance.post("/v1/auth/signout");

  return data;
};

export const editMyInfo = async ({
  name,
  bio,
  avatar,
}: {
  name: string;
  bio?: string;
  avatar?: string;
}) => {
  const { data } = await axiosInstance.patch("/v1/users", {
    name,
    bio,
    avatar,
  });
  return data;
};

// 프로필 수정
export const updateProfile = async ({ name, bio, avatar }: { name: string; bio?: string | null; avatar?: string | null }) => {
    try {
        const { data } = await axiosInstance.patch('/v1/users', {
            name,
            bio,
            avatar
        });
        return data;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};