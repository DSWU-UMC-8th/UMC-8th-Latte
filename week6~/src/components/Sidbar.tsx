import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";
import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../apis/auth';
import { useMutation } from '@tanstack/react-query';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
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
    
    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            navigate('/');
        },
    });

    const handleWithdrawal = () => {
        if (window.confirm('정말로 탈퇴하시겠습니까?')) {
            deleteMutation.mutate();
        }
    };

    return (
        <aside
            ref={ref}
            className={`
                w-56 h-full bg-black/90 text-white p-6 shadow-md
                ${isOpen ? "block" : "hidden"}
                md:block
            `}
        >
            <div className="text-white mb-130">
                <button
                    className="flex items-center gap-3 hover:text-pink-500 mt-5"
                >
                    <FaSearch /> 찾기
                </button>

                <Link to="/mypage" className="flex items-center gap-3 hover:text-pink-500 mt-7">
                    <FaUser /> 마이페이지
                </Link>
            </div>

            <button
                onClick={handleWithdrawal}
                className="w-full text-left text-gray-400 hover:text-gray-300 transition-colors mt-auto"
            >
                탈퇴하기
            </button>
        </aside>
    );
};

export default Sidebar;