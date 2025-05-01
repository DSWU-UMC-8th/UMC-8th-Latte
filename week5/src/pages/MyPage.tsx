import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";

const MyPage = () => {
    const { logout } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
        const response = await getMyInfo();
            console.log(response);
            setData(response);
        }

        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4
            w-full bg-black text-white">
            <h3 className="bg-pink-900 p-[5px]">회원 정보</h3>
            <div>
                이름: {data?.data.name} <br/ >
                이메일: {data?.data.email}
            </div>
            <button className="bg-gray-800 p-[8px] cursor-pointer rounded-sm" onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default MyPage;