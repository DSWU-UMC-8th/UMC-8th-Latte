import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;

        if (id === 'logo') navigate('/');
        else if (id === 'login') navigate('/login');
        else if (id === 'signup') navigate('/signup');
    };

    return (
        <nav className="w-full bg-black/90 text-white px-8 py-4 flex items-center justify-between shadow-md">
            <button 
                id="logo" 
                onClick={handleNavigate}
                className="text-pink-500 font-bold text-xl cursor-pointer">
                    UMC-8th
            </button>
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
                <>
                    <Link
                        to={"/mypage"}
                        className="text-pink-500 dark:text-gray-300 hover:text-pink-600"
                    >
                        마이페이지
                    </Link>
                </>
            )}

            <Link
                to={"/search"}
                className="text-pink-500 dark:text-gray-300 hover:text-pink-600"
            >
                검색
            </Link>
        </nav>
    );
};

export default Navbar;
