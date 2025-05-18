import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import useEditMyInfo from "../hooks/mutations/useEditMyInfo";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../constants/key";

const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const { mutate: editInfoMutate } = useEditMyInfo();

    // useQuery를 사용하여 데이터 가져오기
    const { data: queryData } = useQuery<ResponseMyInfoDto>({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
    });

    useEffect(() => {
        if (queryData) {
            setData(queryData);
            setName(queryData.data.name);
            setBio(queryData.data.bio ?? "");
        }
    }, [queryData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("닉네임은 빈칸일 수 없습니다!");
            return;
        }

        setUploading(true);
        try {
            let avatarUrl = null;
            if (avatar) {
                const reader = new FileReader();
                avatarUrl = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(avatar);
                });
            }

            const updateData = {
                name,
                bio: bio || null,
                avatar: avatarUrl || data?.data.avatar || null
            };

            editInfoMutate(updateData, {
                onSuccess: () => {
                    setIsEditing(false);
                },
                onError: (error) => {
                    console.error('Failed to update profile:', error);
                    alert('프로필 수정에 실패했습니다.');
                },
                onSettled: () => {
                    setUploading(false);
                }
            });
        } catch (error) {
            console.error('Error during profile update:', error);
            alert('프로필 수정에 실패했습니다.');
            setUploading(false);
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
                                    src={data?.data.avatar || '/profileBase.png'}
                                    alt="프로필"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">{data?.data.name}</h2>
                                    <p className="text-gray-400">{data?.data.email}</p>
                                    <p className="text-gray-400">{data?.data.bio || '소개가 없습니다.'}</p>
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
                        <form onSubmit={handleSave} className="space-y-4">
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
                                    value={data?.data.email || ''}
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
                                    disabled={uploading}
                                    className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600 transition-colors"
                                >
                                    {uploading ? '저장 중...' : '저장'}
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