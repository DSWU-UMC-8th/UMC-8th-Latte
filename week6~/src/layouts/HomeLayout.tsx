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
        <div className="min-h-screen flex flex-col relative">
            <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
            <div className="flex flex-1">
                <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                </div>
                <main className="flex-1 bg-black text-white pt-16">
                    {children ?? <Outlet />}
                    <div className="mt-20">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HomeLayout;