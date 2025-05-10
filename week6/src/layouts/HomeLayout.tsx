import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Nav";
import Sidebar from "../components/Sidbar";
import { useState } from "react";
import { ReactNode } from "react";

interface HomeLayoutProps {
    children?: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
        <div className="h-screen flex flex-col">
            <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 overflow-auto bg-black text-white">
                    {children ?? <Outlet />}

                    <div className="mt-20">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    )
};

export default HomeLayout;