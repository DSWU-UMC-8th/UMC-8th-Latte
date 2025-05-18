import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../apis/auth';
import { useAuth } from '../../context/AuthContext';
import { UpdateProfileRequest } from '../../types/auth';

const useEditMyInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: UpdateProfileRequest) => {
            const response = await updateProfile(params);
            return response;
        },
        onSuccess: () => {
            // 프로필 업데이트 후 캐시 무효화
            queryClient.invalidateQueries(['user']);
        }
    });
};

export default useEditMyInfo; 