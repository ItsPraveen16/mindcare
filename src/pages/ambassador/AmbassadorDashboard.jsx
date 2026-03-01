import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalData } from '../../context/GlobalDataContext';

const impactData = [
    { week: 'W1', count: 12 },
    { week: 'W2', count: 18 },
    { week: 'W3', count: 15 },
    { week: 'W4', count: 24 },
];

const AmbassadorDashboard = () => {
    const { students, chats, startChat, updateLastInteraction, addEscalation, updateStudentRisk } = useGlobalData();
    const [isAvailable, setIsAvailable] = useState(true);

    // Ambassador ID mocked as 'A1'
    const ambassadorId = 'A1';
    const assignedStudents = students.filter(s => s.assignedAmbassadorId === ambassadorId);
    const activeChats = chats.filter(c => c.ambassadorId === ambassadorId && c.status === 'Open');

    // Helpers purely for UI presentation
    const getStatusColor = (risk) => {
        if (risk === 'Urgent') return 'bg-red-100 text-red-700';
        if (risk === 'Warning') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const handleStartChat = (studentId) => {
        startChat(studentId, ambassadorId);
    };

    const handleWeeklyCheckIn = () => {
        // Just a mocked global interaction for the first assigned student as an example
        if (assignedStudents.length > 0) {
            updateLastInteraction(assignedStudents[0].id);
        }
    };

    const handleEmergency = () => {
        addEscalation({
            id: Date.now(),
            studentId: assignedStudents[0]?.id || 'Unknown',
            studentName: assignedStudents[0]?.name || 'Unknown',
            timestamp: 'Just now',
            createdBy: 'ambassador',
            flaggedBy: 'Ambassador: Sarah',
            message: `Ambassador triggered area-wide emergency protocols.`,
            status: 'Pending'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 md:pb-6">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Hi Sarah <span className="text-2xl">🌟</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded text-purple-700 bg-purple-100 uppercase tracking-wide">
                                Community Ambassador
                            </span>
                            <span className="text-gray-500 text-sm flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                {isAvailable ? 'Online & Ready to Support' : 'Away'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center cursor-pointer bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAvailable ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-700">Online Status</div>
                        </label>
                        <button onClick={handleEmergency} className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-full transition-colors flex items-center gap-2 border border-red-200">
                            🚨 Emergency
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Assigned Students', value: assignedStudents.length, sub: 'Active', icon: '👥', color: 'text-purple-600', bg: 'bg-purple-50' },
                        { title: 'Weekly Check-ins', value: '8', sub: '80% target', icon: '✅', color: 'text-teal-600', bg: 'bg-teal-50' },
                        { title: 'Active Chats', value: activeChats.length, sub: 'Live', icon: '💬', color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-semibold ${stat.color}`}>{stat.sub}</span>
                            </div>
                            <h4 className="text-gray-500 text-sm mb-1">{stat.title}</h4>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}

                    {/* Mini Chart Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <h4 className="text-gray-500 text-sm mb-1">Monthly Impact</h4>
                            <div className="h-12 mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={impactData}>
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                        <Bar dataKey="count" fill="#a855f7" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Assigned Students */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 text-lg">Assigned Students</h3>
                                <button className="text-purple-600 text-sm font-medium hover:underline">View All</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                            <th className="pb-3 px-2 font-semibold">Student Name</th>
                                            <th className="pb-3 px-2 font-semibold">Mood Status</th>
                                            <th className="pb-3 px-2 font-semibold">Last Interaction</th>
                                            <th className="pb-3 px-2 font-semibold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedStudents.map(student => (
                                            <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {student.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(student.riskLevel)}`}>
                                                        {student.riskLevel}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-sm text-gray-500">{student.lastInteraction}</td>
                                                <td className="py-4 px-2 text-right">
                                                    <button
                                                        onClick={() => handleStartChat(student.id)}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Start Chat
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {assignedStudents.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-6 text-center text-sm text-gray-500">No students assigned.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Conversations Placeholder */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Active Conversations <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2">{activeChats.length} Live</span></h3>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 p-6 min-h-[128px]">
                                {activeChats.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <span className="text-gray-400 text-3xl mb-2 block">💬</span>
                                            <p className="text-sm text-gray-500 font-medium pb-2">Select a student to start chatting</p>
                                            <button className="px-5 py-2.5 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors w-full">Go to Message Center</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {activeChats.map(chat => {
                                            const student = students.find(s => s.id === chat.studentId);
                                            return (
                                                <div key={chat.id} className="flex gap-4 items-center bg-white p-3 rounded-lg shadow-sm">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">{student?.name.charAt(0)}</div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-gray-800">{student?.name}</h4>
                                                        <p className="text-xs text-gray-500 italic">Chat started.</p>
                                                    </div>
                                                    <button className="text-purple-600 text-sm hover:underline">Open</button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="space-y-6">

                        {/* Quick Toolkit */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Quick Toolkit</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { name: 'Weekly Check-in', icon: '📝', bg: 'bg-teal-50', hover: 'hover:bg-teal-100', action: handleWeeklyCheckIn },
                                    { name: 'Resources', icon: '📚', bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100' },
                                    { name: 'Protocols', icon: '📋', bg: 'bg-orange-50', hover: 'hover:bg-orange-100' },
                                    { name: 'Log Session', icon: '⏳', bg: 'bg-blue-50', hover: 'hover:bg-blue-100' },
                                ].map(tool => (
                                    <button
                                        key={tool.name}
                                        onClick={tool.action}
                                        className={`p-4 rounded-xl flex flex-col items-center justify-center text-center transition-colors ${tool.bg} ${tool.hover}`}
                                    >
                                        <span className="text-2xl mb-2">{tool.icon}</span>
                                        <span className="text-xs font-semibold text-gray-700">{tool.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Announcements */}
                        <div className="bg-gradient-to-b from-purple-50 to-white rounded-2xl p-6 border border-purple-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                            <h3 className="font-bold text-gray-800 text-sm tracking-wider uppercase mb-4 relative z-10 text-purple-800">Announcements</h3>

                            <div className="space-y-4 relative z-10">
                                <div className="border-l-4 border-purple-500 pl-3">
                                    <span className="text-xs text-purple-600 font-bold mb-1 block">SYSTEM NOTICE</span>
                                    <p className="text-sm text-gray-700 font-medium">New escalation protocol training is now mandatory.</p>
                                    <a href="#" className="text-xs text-purple-600 font-bold mt-2 inline-block hover:underline">Complete Training Now</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AmbassadorDashboard;
