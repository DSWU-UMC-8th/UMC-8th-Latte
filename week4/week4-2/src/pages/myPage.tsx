import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";

const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);

    useEffect(() => {
        const getData = async () => {
        const response = await getMyInfo();
            console.log(response);
            setData(response);
        }

        getData();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4
            w-full bg-black text-white">
            <h3 className="bg-pink-900 p-[5px]">회원 정보</h3>
            <div>
                이름: {data?.data.name} <br/ >
                이메일: {data?.data.email}
            </div>
        </div>
    )
}

export default MyPage;