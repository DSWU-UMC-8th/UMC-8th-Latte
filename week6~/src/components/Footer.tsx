import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-gray-400 text-sm text-center py-4">
            <div className="container mx-auto text-center text-gray-500 dark:text-gray-400">
                <p>&copy; 2025 UMC-8th Latte</p>

                <div className="flex justify-center space-x-4 mt-3">
                    <Link to={"#"}>Pricy Policy</Link>
                    <Link to={"#"}>Terms of Service</Link>
                    <Link to={"#"}>Contact us</Link>
                </div>
            </div>
        </footer>
        );
    };

export default Footer;
