import { useQuery } from "@tanstack/react-query";
import { LpDetail } from "../../types/lp";
import { getLpDetail } from "../../apis/lp";

const useGetLpDetail = (id: number) => {
    return useQuery<LpDetail>({
        queryKey: ["lpDetail", id],
        queryFn: () => getLpDetail(id),
    });
};

export default useGetLpDetail;