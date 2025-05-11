import { useNavigate } from "react-router-dom";
import { Lp } from "../../types/lp";
import { useAuth } from "../../context/AuthContext";

interface LpCardProps {
    lp:Lp
}

const LpCard = ({lp}:LpCardProps) => {

    const navigate = useNavigate();
    const { accessToken } = useAuth();

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
        <div 
            onClick={() => handleCardClick(lp.id)} 
            className="w-full aspect-square bg-gray-800 overflow-hidden rounded
            hover:scale-120 hover:z-20 z-0 transition-transform duration-200 relative group"
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
    )
}

export default LpCard;
