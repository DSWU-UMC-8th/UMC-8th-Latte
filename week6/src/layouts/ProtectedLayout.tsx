import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomeLayout from "./HomeLayout";

const ProtectedLayout = () => {
    const {accessToken } =useAuth();

    if(!accessToken) {
        return <Navigate to={"login"} replace /> // reaplace: history 안 남음
    }

    return (
        <HomeLayout>
            <Outlet />
        </HomeLayout>  
    )
};

export default ProtectedLayout;