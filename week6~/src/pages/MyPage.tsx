import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../apis/auth';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import { useAuth } from '../context/AuthContext';
import { QUERY_KEY } from '../constants/key';
import { ResponseMyInfoDto } from '../types/auth';

// 사용자 데이터 타입 정의
interface UserData {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

// API 응답 타입 정의
interface ApiResponse {
    status: boolean;
    message: string;
    statusCode: number;
    data: UserData;
}

const MyPage = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useAuth();
    const { data: me, refetch } = useGetMyInfo(accessToken);
    
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);

    useEffect(() => {
        const userData = me as ResponseMyInfoDto | undefined;
        if (userData?.data) {
            setName(userData.data.name);
            setBio(userData.data.bio || '');
        }
    }, [me]);

    const updateProfileMutation = useMutation<ApiResponse, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            const response = await updateProfile(formData, accessToken);
            return response;
        },
        onSuccess: async (response) => {
            // 캐시 직접 업데이트
            queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        ...response.data
                    }
                };
            });
            
            // 리페치
            await refetch();
            setIsEditing(false);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        if (bio) formData.append('bio', bio);
        if (avatar) formData.append('avatar', avatar);

        try {
            await updateProfileMutation.mutateAsync(formData);
        } catch (error) {
            console.error('프로필 수정 중 오류 발생:', error);
            alert('프로필 수정에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px-56px)] flex flex-col">
            <div className="flex-grow max-w-2xl mx-auto w-full p-4">
                <div className="bg-zinc-900 rounded-lg p-6 text-white">
                    {!isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={(me as ResponseMyInfoDto)?.data?.avatar || '/profileBase.png'}
                                    alt="프로필"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">{name}</h2>
                                    <p className="text-gray-400">{(me as ResponseMyInfoDto)?.data?.email}</p>
                                    <p className="text-gray-400">{bio || '소개가 없습니다.'}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition-colors"
                                >
                                    프로필 수정
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">이름 *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">이메일</label>
                                <input
                                    type="email"
                                    value={(me as ResponseMyInfoDto)?.data?.email || ''}
                                    disabled
                                    className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">소개</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-pink-500 h-24 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">프로필 사진</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files && setAvatar(e.target.files[0])}
                                    className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:border-pink-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={updateProfileMutation.isPending}
                                    className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition-colors"
                                >
                                    {updateProfileMutation.isPending ? '저장 중...' : '저장'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPage;