const CommentSkeleton = () => {
    return (
        <div className="flex items-start gap-3 p-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-600 rounded-full" />
            <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-gray-600 w-1/3 rounded" />
                <div className="h-3 bg-gray-700 w-1/4 rounded" />
            </div>
        </div>
    );
};

export default CommentSkeleton;
