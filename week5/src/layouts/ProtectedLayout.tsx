import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
    const {accessToken } =useAuth();

    if(!accessToken) {
        return <Navigate to={"login"} replace /> // reaplace: history 안 남음
    }

    return (
        <div className="h-dvh flex flex-col">
            <Outlet />
        </div>  
    )
};

export default ProtectedLayout;