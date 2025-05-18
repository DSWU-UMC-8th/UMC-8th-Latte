import { PaginationDto } from "../types/common";
import { LpDetail, RequestLpDto, ResponseCommentListDto, ResponseLikeLpDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

interface CreateLpData {
    title: string;
    content: string;
    tags: string[];
    published: boolean;
}

export const getLpList = async (
    paginationDto: PaginationDto,
): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    return data;
};

export const getLpDetail = async (id: number): Promise<LpDetail> => {
    const { data } = await axiosInstance.get(`/v1/lps/${id}`);
    return data;
};

export const createLp = async (formData: FormData) => {
    // FormData에서 값을 추출하고 문자열로 변환
    const title = formData.get('title')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const tags = JSON.parse(formData.get('tags')?.toString() || '[]');

    const lpData: CreateLpData = {
        title,
        content,
        tags,
        published: true
    };

    console.log('Sending LP data:', lpData); // 디버깅용 로그

    const { data } = await axiosInstance.post('/v1/lps', lpData);
    return data;
};

export const postLike = async({lpId}: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const {data} = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

    return data;
}

export const deleteLike = async({lpId}: RequestLpDto) => {
    const {data} = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

    return data;
}

export const getCommentList = async (
    lpId: number,
    params: { cursor?: number; order: "asc" | "desc" }
    ): Promise<ResponseCommentListDto> => {
        const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
            params,
        });
        console.log('Comment list response:', data); // 디버깅을 위한 로그 추가
        return data;
};

export const createComment = async (lpId: number, content: string) => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
    });
    return data;
};

export const updateComment = async (lpId: number, commentId: number, content: string) => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
        content,
    });
    return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    return data;
};

export const updateLp = async (lpId: number, formData: FormData) => {
    const title = formData.get('title')?.toString() || '';
    const content = formData.get('content')?.toString() || '';
    const tags = JSON.parse(formData.get('tags')?.toString() || '[]');

    const lpData = {
        title,
        content,
        tags,
        published: true
    };

    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, lpData);
    return data;
};

export const deleteLp = async (lpId: number) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
    return data;
};