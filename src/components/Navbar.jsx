import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { logout, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-100 flex justify-between items-center px-6 py-4 shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold select-none">
                    M
                </div>
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">MindCare</h1>
            </div>

            <div className="flex gap-4 items-center">
                {role && (
                    <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full capitalize">
                        {role}
                    </span>
                )}
                <button
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative"
                    aria-label="Notifications"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative group">
                    <button className="flex items-center gap-2 focus:outline-none">
                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-500 font-bold">
                            U
                        </div>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
