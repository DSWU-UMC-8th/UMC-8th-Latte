const LpCardSkeleton = () => {
    return (
        <div 
            className="w-full aspect-square bg-gray-800 overflow-hidden rounded
            animate-pulse relative"
        >
            <div className="w-full h-full bg-gray-600" />
            <div
                className="absolute bottom-0 left-0 size-full p-3
                bg-gradient-to-t from-black/90 to-black/20
                flex flex-col justify-end gap-2"
            >
                <div className="bg-gray-300 h-4 w-3/4 rounded-sm" />
                <div className="bg-gray-400 h-3 w-1/2 rounded-sm" />
                <div className="bg-gray-500 h-3 w-1/4 rounded-sm" />
            </div>
        </div>
    );
};


export default LpCardSkeleton;
