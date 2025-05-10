import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
    const {data, isPending, isError } = useGetLpList({order});
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    if(isPending) {
        return <div className={"mt-20 p-10"}>Loading...</div>
    }

    if(isError) {
        <div className={"mt-20"}>Error</div>
    }

    const handleCardClick = (id: number) => {
        if (!accessToken) {
            if (confirm("로그인이 필요한 서비스입니다. 로그인을 해주세요!")) {
                navigate("/login");
            }
        } else {
            navigate(`/lp/${id}`);
        }
    };

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-end p-4 gap-2">
                <div className="rounded border border-gray-400 overflow-hidden">
                    <button
                        onClick={() => setOrder(PAGINATION_ORDER.asc)}
                        className={`px-4 py-2 text-sm font-medium 
                            ${
                            order === PAGINATION_ORDER.asc
                                ? "bg-gray-100 text-black"
                                : "bg-black text-white"
                            }
                        `}
                    >
                        오래된순
                    </button>
                    <button
                        onClick={() => setOrder(PAGINATION_ORDER.desc)}
                        className={`px-4 py-2 text-sm font-medium
                            ${
                            order === PAGINATION_ORDER.desc
                                ? "bg-gray-100 text-black"
                                : "bg-black text-white"
                            }
                        `}
                    >
                        최신순
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2 p-6 bg-black text-white">
                {data?.map((lp) => (
                    <div 
                        key={lp.id}
                        onClick={() => handleCardClick(lp.id)} 
                        className="w-full aspect-square bg-gray-800 overflow-hidden rounded
                        hover:scale-120 transition-transform duration-200 relative group"
                    >
                        <img
                            src="/bambi.jpg" // {lp.thumbnail}
                            alt={lp.title}
                            className="w-full h-full object-cover"
                        />

                        {/* hover 시 보여지는 정보 */}
                        <div
                            className="absolute bottom-0 left-0 size-full p-3
                            bg-gradient-to-t from-black/90 to-black/20
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 text-sm
                            flex flex-col justify-end"
                        >
                            <h3 className="font-semibold truncate">{lp.title}</h3>
                            <p className="text-xs text-gray-300 mt-1">
                                {new Date(lp.createdAt).toISOString().slice(0, 10)}
                            </p>
                            <p className="text-xs mt-1">❤️ {lp.likes?.length}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
};

export default HomePage;