import { Comment } from "../../types/lp";

const CommentItem = ({ comment }: { comment: Comment }) => {
    return (
        <div className="flex items-start gap-3 p-3 border-gray-700">
            <img
                src={comment.author.avatar || "/profileBase.png"}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
                <span className="font-semibold text-sm">{comment.author.name}</span>
                <span className="text-xs text-gray-400 mb-1">
                {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <p className="text-sm">{comment.content}</p>
            </div>
        </div>
    );
};

export default CommentItem;
