import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { ResponseMyInfoDto } from "../../types/auth";

function useGetMyInfo(accessToken: string | null) {
    return useQuery<ResponseMyInfoDto>({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
        enabled: !!accessToken,
        staleTime: 0, // 항상 최신 데이터를 가져오도록
        cacheTime: 1000 * 60 * 5,
        refetchOnMount: 'always', // 컴포넌트 마운트 시 항상 리페치
        refetchOnWindowFocus: true,
        retry: 2
    });
}

export default useGetMyInfo;