import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../apis/auth';
import { useAuth } from '../../context/AuthContext';
import { QUERY_KEY } from '../../constants/key';
import { ResponseMyInfoDto } from '../../types/auth';

interface EditInfoParams {
    name: string;
    bio?: string | null;
    avatar?: string | null;
}

const useEditMyInfo = () => {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: EditInfoParams) => {
            if (!accessToken) throw new Error('No access token');
            
            const response = await updateProfile({
                name: params.name,
                bio: params.bio ?? null,
                avatar: params.avatar ?? null
            });
            return response;
        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

            const previousData = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

            if (previousData) {
                queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], {
                    ...previousData,
                    data: {
                        ...previousData.data,
                        name: newData.name,
                        bio: newData.bio ?? previousData.data.bio,
                        avatar: newData.avatar ?? previousData.data.avatar,
                    }
                });
            }

            return { previousData };
        },
        onError: (error, _newData, context) => {
            if (context?.previousData) {
                queryClient.setQueryData([QUERY_KEY.myInfo], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
        },
    });
};

export default useEditMyInfo; 