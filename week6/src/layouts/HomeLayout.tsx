import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Nav";
import Sidebar from "../components/Sidbar";
import { useState } from "react";

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
        <div className="h-dvh flex flex-col">
            <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 overflow-auto bg-black text-white p-4">
                    <Outlet /> {/* children 렌더링 */}
                </main>
            </div>
            <Footer />
        </div>
    )
};

export default HomeLayout;