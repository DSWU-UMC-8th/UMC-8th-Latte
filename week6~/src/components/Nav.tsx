import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo, postLogout } from "../apis/auth";
import { FaBars } from "react-icons/fa";
import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from "../constants/key";

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const { logout: handleLogout } = useAuth();

    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSuccess: () => {
            handleLogout();
            navigate('/login');
        },
    });

    const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;

        if (id === 'logo') navigate('/');
        else if (id === 'login') navigate('/login');
        else if (id === 'signup') navigate('/signup');
    };

    const { data } = useQuery({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
        enabled: !!accessToken, // 로그인 되어 있을 때만 호출
        staleTime: 1000 * 60 * 5, // 5분 동안은 신선하다고 판단
    });

    const handleLogoutClick = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃에 실패했습니다.');
        }
    };

    return (
        <nav className="w-full bg-black/90 text-white px-8 py-4 flex items-center justify-between shadow-md">
            <div className="flex gap-5">
                <button onClick={onToggleSidebar}>
                    <FaBars size={20} />
                </button>
                
                <button 
                    id="logo" 
                    onClick={handleNavigate}
                    className="text-pink-500 font-bold text-xl cursor-pointer">
                        UMC-8th
                </button>
            </div>
            
            
            <div className="flex gap-2">
                {!accessToken && (
                    <>
                        <button 
                            id="login" 
                            onClick={handleNavigate}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer">
                                로그인
                        </button>

                        <button 
                            id="signup" 
                            onClick={handleNavigate}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded cursor-pointer" >
                                회원가입
                        </button>
                    </>
                )}
            </div>
            
            {accessToken && (
                <div className="flex justify-center items-center gap-5">
                    <p>{data?.data.name}님 반갑습니다. </p>
                    <button
                        onClick={handleLogoutClick}
                        disabled={logoutMutation.isPending}
                        className="text-white hover:text-pink-500"
                    >
                        {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                    </button>
                </div>
            )}
            
        </nav>
    );
};

export default Navbar;