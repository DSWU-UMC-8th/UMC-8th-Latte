import { PaginationDto } from "../types/common";
import { LpDetail, ResponseCommentListDto, ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

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


export const getCommentList = async (
    lpId: number,
    params: { cursor?: number; order: "asc" | "desc" }
    ): Promise<ResponseCommentListDto> => {
        const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
            params,
        });
    return data;
};