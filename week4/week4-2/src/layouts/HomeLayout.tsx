import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Nav";

const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />  {/* children 렌더링 */}
            </main>
            <Footer />
        </div>
    )
};

export default HomeLayout;