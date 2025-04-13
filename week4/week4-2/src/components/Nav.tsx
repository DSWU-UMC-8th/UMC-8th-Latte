import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.id;

        if (id === 'login') navigate('/login');
        else if (id === 'signup') navigate('/signup');
    };

    return (
        <nav className="w-full bg-black/90 text-white px-8 py-4 flex items-center justify-between shadow-md">
            <div className="text-pink-500 font-bold text-xl">
                UMC-8th
            </div>

            <div className="flex gap-2">
                <button 
                    id="login" 
                    onClick={handleNavigate}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">
                        로그인
                </button>

                <button 
                    id="signup" 
                    onClick={handleNavigate}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded" >
                        회원가입
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
