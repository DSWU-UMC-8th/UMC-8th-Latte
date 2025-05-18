import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Comment } from "../../types/lp";
import { updateComment, deleteComment } from "../../apis/lp";
import { BsThreeDotsVertical } from "react-icons/bs";

interface CommentItemProps {
    comment: Comment;
    currentUserId: number;
}

const CommentItem = ({ comment, currentUserId }: CommentItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const queryClient = useQueryClient();

    const updateCommentMutation = useMutation({
        mutationFn: () => updateComment(comment.lpId, comment.id, editedContent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", comment.lpId] });
            setIsEditing(false);
            setShowMenu(false);
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: () => deleteComment(comment.lpId, comment.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", comment.lpId] });
        },
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedContent.trim()) return;
        updateCommentMutation.mutate();
    };

    const handleDelete = () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            deleteCommentMutation.mutate();
        }
    };

    return (
        <div className="flex items-start gap-3 p-3 border-b border-gray-700 relative">
            <img
                src={comment.author.avatar || "/profileBase.png"}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-semibold text-sm">{comment.author.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    {comment.authorId === currentUserId && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                <BsThreeDotsVertical />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 mt-1 py-1 w-24 bg-gray-800 rounded shadow-lg z-10">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-700 text-sm"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-700 text-sm text-red-500"
                                    >
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="mt-2">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm"
                            rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                className="px-3 py-1 bg-pink-600 text-sm rounded hover:bg-pink-700"
                                disabled={updateCommentMutation.isPending}
                            >
                                저장
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(comment.content);
                                }}
                                className="px-3 py-1 bg-gray-600 text-sm rounded hover:bg-gray-700"
                            >
                                취소
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-sm mt-1">{comment.content}</p>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
