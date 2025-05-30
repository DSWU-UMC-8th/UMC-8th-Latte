import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const Header = ({ title }: { title: string }) => {
    const navigate = useNavigate();
    
    return (
        <div className="relative flex items-center w-full max-w-[400px] mb-3">
                <ChevronLeftIcon
                    onClick={() => navigate(-1)}
                    className="text-white size-6 absolute left-0"
                />
                <h1 className="ml-[10px] text-center w-full text-xl font-bold">
                    {title}
                </h1>
        </div>
    );
};

export default Header;
