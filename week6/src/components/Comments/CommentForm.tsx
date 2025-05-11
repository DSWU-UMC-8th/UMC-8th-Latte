const CommentForm = () => {
    return (
        <div className="flex gap-2 border-gray-700">
            <input
                type="text"
                placeholder="댓글을 입력해주세요"
                className="flex-grow border border-gray-400 text-white p-2 rounded focus:outline-none"
                disabled
            />
            <button className="bg-gray-600 text-white px-4 py-2 rounded" disabled>
                작성
            </button>
        </div>
        );
    };
    
    export default CommentForm;
