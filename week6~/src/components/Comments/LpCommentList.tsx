import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { getCommentList } from "../../apis/lp";
import CommentItem from "./LpCommentItem";
import CommentSkeletonList from "./CommentSkeletonList";
import CommentForm from "./CommentForm";

interface CommentListProps {
    lpId: number;
    currentUserId: number;
}

const CommentList = ({ lpId, currentUserId }: CommentListProps) => {
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const { ref, inView } = useInView();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ["comments", lpId, order],
        queryFn: ({ pageParam = 0 }) =>
            getCommentList(lpId, { cursor: pageParam, order }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetching) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetching, fetchNextPage]);

    const comments = data?.pages.flatMap((page) => page.data.data) ?? [];

    return (
        <div className="p-6 w-full max-w-2xl mx-auto rounded-md bg-[#1e1e1e] text-white">
            <h4 className="text-m mb-3">댓글</h4>

            <CommentForm lpId={lpId} />

            <div className="flex gap-2 my-3 mt-5 justify-end text-sm">
                <button
                    onClick={() => setOrder("asc")}
                    className={`px-3 py-1 rounded ${order === "asc" ? "bg-white text-black" : "bg-gray-700"}`}
                >
                    오래된순
                </button>
                <button
                    onClick={() => setOrder("desc")}
                    className={`px-3 py-1 rounded ${order === "desc" ? "bg-white text-black" : "bg-gray-700"}`}
                >
                    최신순
                </button>
            </div>

            <div className="rounded-md bg-[#1e1e1e]">
                {comments.map((comment) => (
                    <CommentItem 
                        key={comment.id} 
                        comment={comment}
                        currentUserId={currentUserId}
                    />
                ))}

                {isFetching && <CommentSkeletonList count={5} />}
                <div ref={ref} className="h-6" />
            </div>
        </div>
    );
};

export default CommentList;
