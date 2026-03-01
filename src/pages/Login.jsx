import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate API call and set login
        login(selectedRole);
        navigate(`/${selectedRole}`);
    };

    const roles = [
        {
            id: 'student',
            title: 'Student',
            desc: 'Track your daily mood and habits',
            icon: '😊',
        },
        {
            id: 'counsellor',
            title: 'Counsellor',
            desc: 'Monitor and support students',
            icon: '🩺',
        },
        {
            id: 'ambassador',
            title: 'Ambassador',
            desc: 'Provide peer-to-peer support',
            icon: '🤝',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative">
            <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">M</div>
                <h1 className="text-xl font-bold text-gray-800">MindCare</h1>
            </div>

            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4 text-2xl">
                        🧠
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Because your mind matters</h2>
                    <p className="text-gray-500">Select your role to access your personalized dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left flex flex-col items-center text-center ${selectedRole === role.id
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md transform -translate-y-1'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-500'
                                }`}
                        >
                            <div className="text-3xl mb-3 opacity-90">{role.icon}</div>
                            <h3 className={`font-semibold mb-1 ${selectedRole === role.id ? 'text-blue-900' : 'text-gray-700'}`}>
                                {role.title}
                            </h3>
                            <p className="text-xs">{role.desc}</p>
                        </button>
                    ))}
                </div>

                <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">✉️</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@school.edu"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                            />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                                👁️
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded text-blue-600 focus:ring-blue-500" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-4"
                    >
                        Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                    </button>
                </form>
            </div>

            <p className="text-gray-400 text-sm">© 2024 MindCare. Professional mental health support for everyone.</p>
        </div>
    );
};

export default Login;
