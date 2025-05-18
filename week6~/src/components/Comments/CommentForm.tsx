import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../apis/lp";

interface CommentFormProps {
    lpId: number;
}

const CommentForm = ({ lpId }: CommentFormProps) => {
    const [content, setContent] = useState("");
    const queryClient = useQueryClient();

    const createCommentMutation = useMutation({
        mutationFn: () => createComment(lpId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
            setContent("");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        createCommentMutation.mutate();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 border-gray-700">
            <input
                type="text"
                placeholder="댓글을 입력해주세요"
                className="flex-grow border border-gray-400 text-white p-2 rounded focus:outline-none bg-transparent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button 
                type="submit"
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
                disabled={createCommentMutation.isPending}
            >
                {createCommentMutation.isPending ? "작성 중..." : "작성"}
            </button>
        </form>
    );
};

export default CommentForm;
