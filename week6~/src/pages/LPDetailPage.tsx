import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { FaRegHeart } from "react-icons/fa6";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import CommentList from "../components/Comments/LpCommentList";
import usePostLike from "../hooks/mutation/usePostLike";
import useDeleteLike from "../hooks/mutation/useDeleteLike";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
  const { id } = useParams();
  const lpId = Number(id);
  const {accessToken} = useAuth();
  
  const { data: lpData } = useGetLpDetail(lpId);
  const { data: userInfo } = useQuery<ResponseMyInfoDto>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });
  
  const lp = lpData?.data;

  const {data: me} = useGetMyInfo(accessToken);

  // 좋아요 눌렀는지 확인
  const isLiked = lp?.likes?.some((like) => like.userId === me?.data.id);

  // mutation 훅 사용
  // 비동기 요청 실행하고, 콜백 함수 이용해서 후속 작업 처리함
  // mutateAsync -> Promise 반환해서 await 사용 가능 
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();
  // const { mutate: deleteLpMutate } = useDeleteLp();
  // const { mutate: updateLpMutate } = useUpdateLp();

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };

  const handleDislikeLp = () => {
    disLikeMutate({ lpId: Number(lpId) });
  };

  if (!lpData) {
    return (
      <div className="text-white text-center mt-10">
        해당 LP를 찾을 수 없습니다. (id: {lpId})
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto bg-zinc-900 text-white rounded-xl p-13 shadow-md space-y-4 mt-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img 
                src={userInfo?.data.avatar ?? "/profileBase.png"}
                alt="프로필 이미지" 
                className="w-8 h-8 rounded-full" />
              <span className="font-medium">{userInfo?.data.name}</span>
            </div>
            <span>{new Date(lp.createdAt).toISOString().slice(0, 10)}</span>            
          </div>

          <div className="flex justify-between mt-8">
            <h1 className="text-xl font-semibold">{lp.title}</h1>
            <div className="text-xl text-white flex gap-3 items-end">
                <button className="hover:text-pink-500"><GoPencil /></button>
                <button className="hover:text-pink-500"><RiDeleteBin6Line /></button>
            </div>
          </div>

          <div className="w-full flex justify-center mt-10">
            <div className="w-80 h-80 shadow-xl/60 rounded-lg flex items-center justify-center">
              <div 
                className="animate-spin relative w-72 h-72 rounded-full border-[6px] border-zinc-700"
                style={{ animationDuration: "13s" }}
                >
                <img
                  src="/bambi.jpg"  // {lp.thumbnail}
                  alt="lp cover"
                  className="w-full h-full object-cover rounded-full"
                />

                {/* 중앙 구멍 */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10 border border-gray-800" />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-200 text-center leading-relaxed mt-10">
            {lp?.content}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {lp?.tags.map(tag => (
              <span key={tag.id} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300">
                #{tag.name}
              </span>
            ))}
          </div>

          <div className="flex flex-col justify-center items-center gap-2 pt-4">
            <button
              onClick={isLiked ? handleDislikeLp : handleLikeLp}
              className={`rounded text-white`}
            >
              {isLiked ? <FcLike /> : <FaRegHeart /> } 
            </button>
            <span className="text-sm">{lp?.likes.length || 0}</span>
          </div>
      </div>

      <div className="mt-20">
        <CommentList lpId={lpId} currentUserId={me?.data.id ?? 0} />
      </div>
    </div>
  );
};

export default LpDetailPage;