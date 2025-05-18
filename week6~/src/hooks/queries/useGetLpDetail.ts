import { useQuery } from "@tanstack/react-query";
import { LpDetail } from "../../types/lp";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

const useGetLpDetail = (id: number) => {
    return useQuery<LpDetail>({
        queryKey: [QUERY_KEY.lpDetail, id],
        queryFn: () => getLpDetail(id),
    });
};

export default useGetLpDetail;