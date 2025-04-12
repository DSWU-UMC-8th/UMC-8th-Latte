const Navbar = () => {
    return (
        <nav className="w-full bg-black/90 text-white px-8 py-4 flex items-center justify-between shadow-md">
            <div className="text-pink-500 font-bold text-xl">
                UMC-8th
            </div>

            <div className="flex gap-2">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    로그인
                </button>

                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
                    회원가입
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
