import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}


const Sidebar = ({ isOpen, onClose }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    const [showInput, setShowInput] = useState(false);
    const [search, setSearch] = useState("");
    
    // 바깥 클릭 시 닫기
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!isOpen) return;
            if (ref.current && !e.composedPath().includes(ref.current)) {
                onClose();
            }
        };
    
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);
    
    return (
        <aside
            ref={ref}
            className={`
                w-56 h-full bg-black/90 text-white p-6 shadow-md
                ${isOpen ? "block" : "hidden"}
                md:block
            `}
        >
            <div className="text-white">
                {!showInput ? (
                    <button
                        onClick={() => setShowInput(true)}
                        className="flex items-center gap-3 hover:text-pink-500 mt-5"
                        >
                        <FaSearch /> 찾기
                    </button>
                ) : (
                    <input
                        className="mt-5 p-2 rounded bg-gray-800 text-white w-full"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        autoFocus
                        onBlur={() => setShowInput(false)} // 포커스 잃으면 닫기
                    />
                )}
                </div>

            <Link to="/mypage" className="flex items-center gap-3 hover:text-pink-500 mt-7">
                <FaUser /> 마이페이지
            </Link>
        </aside>
    );
};

export default Sidebar;