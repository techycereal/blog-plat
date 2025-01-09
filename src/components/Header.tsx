import { Link } from "react-router-dom";
import { useBlog } from "./BlogContext";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { isAuthenticated, Logout } = useBlog();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate()
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {/* Sidebar for mobile view */}
            <div
                className={`fixed top-0 left-0 w-64 bg-gray-800 text-white h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden z-20`}
            >
                <div className="flex justify-between p-4">
                    <h2 className="text-xl font-bold">Blog</h2>
                    <button onClick={toggleSidebar} className="text-white">
                        <GiHamburgerMenu size={24} />
                    </button>
                </div>
                <div className="p-4">
                    <Link
                        to={`/`}
                        className="block text-blue-500 hover:underline mt-2"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to={`/create`}
                        className="block text-blue-500 hover:underline mt-2"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        Create
                    </Link>
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to={`/signin`}
                                className="block text-blue-500 hover:underline mt-2"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to={`/signup`}
                                className="block text-blue-500 hover:underline mt-2"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={`/account`}
                                className="block text-blue-500 hover:underline mt-2"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                Account
                            </Link>
                            <div
                                className="block text-blue-500 hover:underline mt-2"
                                onClick={() => {
                                    Logout();
                                    setIsSidebarOpen(false);
                                    navigate('/signin')
                                }}
                            >
                                Logout
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="fixed top-2 left-2 right-2 flex justify-between items-center md:flex-row flex-col z-10 md:relative">
                {/* Hamburger icon for mobile */}
                <button
                    className="text-gray-700 md:hidden fixed left-4 top-4"
                    onClick={toggleSidebar}
                >
                    <GiHamburgerMenu size={24} />
                </button>

                {/* Desktop menu links */}
                <div className="hidden md:flex flex-row gap-4">
                    <Link
                        to={`/`}
                        className="text-blue-500 hover:underline"
                    >
                        Home
                    </Link>
                    <Link
                        to={`/create`}
                        className="text-blue-500 hover:underline"
                    >
                        Create
                    </Link>
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to={`/signin`}
                                className="text-blue-500 hover:underline"
                            >
                                Sign In
                            </Link>
                            <Link
                                to={`/signup`}
                                className="text-blue-500 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={`/account`}
                                className="text-blue-500 hover:underline"
                            >
                                Account
                            </Link>
                            <div
                                className="text-blue-500 hover:underline"
                                onClick={() => [Logout(), navigate('/signin')]}
                            >
                                Logout
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
