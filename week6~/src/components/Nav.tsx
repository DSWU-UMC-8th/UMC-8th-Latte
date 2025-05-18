import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { FaBars } from "react-icons/fa";

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;

        if (id === 'logo') navigate('/');
        else if (id === 'login') navigate('/login');
        else if (id === 'signup') navigate('/signup');
    };

    useEffect(() => {
        if (!accessToken) return;

        const getData = async () => {
            const response = await getMyInfo();
            setData(response);
        }

        getData();
    }, [accessToken]);

    const handleLogout = async () => {
        await logout();
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
                    <button className="border-none bg-none text-white hover:text-pink-600
                        p-[8px] cursor-pointer" onClick={handleLogout}>로그아웃</button>
                </div>
            )}
            
        </nav>
    );
};

export default Navbar;
