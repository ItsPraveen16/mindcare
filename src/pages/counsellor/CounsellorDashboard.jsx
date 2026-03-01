import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalData } from '../../context/GlobalDataContext';

const stressData = [
    { name: 'Stable', value: 45, color: '#10b981' },
    { name: 'Improved', value: 25, color: '#3b82f6' },
    { name: 'Fluctuating', value: 20, color: '#f59e0b' },
    { name: 'Declined', value: 10, color: '#ef4444' },
];

const CounsellorDashboard = () => {
    const { students, appointments, escalations, markEscalationReviewed, startSession, addEscalation } = useGlobalData();

    // Top Stats calculation based on requirements
    const totalStudents = students.length;
    const highRiskStudents = students.filter(s => s.riskLevel === 'Urgent').length;

    // Checking today's date for sessions
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysSessions = appointments.filter(a => a.date === todayStr).length;

    const pendingEscalations = escalations.filter(e => e.status === 'Pending');

    // Helpers for UI
    const getRiskColor = (risk) => {
        if (risk === 'Urgent') return 'border-red-200 bg-red-50 text-red-600';
        if (risk === 'Warning') return 'border-yellow-200 bg-yellow-50 text-yellow-600';
        return 'border-green-200 bg-green-50 text-green-600';
    };

    const handleEmergencyIntervention = () => {
        addEscalation({
            id: Date.now(),
            studentId: 'ALL',
            studentName: 'General Alert',
            timestamp: 'Just now',
            createdBy: 'counsellor',
            flaggedBy: 'Counsellor',
            message: 'Emergency Intervention manually triggered by the counsellor. Initiating site-wide checks.',
            status: 'Pending'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 md:pb-6">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Overview Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: 'Total Students Assigned', value: totalStudents, icon: '🫂', trend: '+2%', tColor: 'text-green-500' },
                        { title: 'High-Risk Students', value: highRiskStudents, icon: '⚠️', trend: '-5%', tColor: 'text-green-500' },
                        { title: 'Today\'s Sessions', value: todaysSessions, icon: '📆', trend: 'No change', tColor: 'text-gray-400' },
                        { title: 'Pending Escalations', value: pendingEscalations.length, icon: '❗', trend: '+1', tColor: 'text-red-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center">{stat.icon}</span>
                                    <h4 className="text-gray-500 text-sm font-medium">{stat.title}</h4>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <span className={`text-xs font-bold ${stat.tColor}`}>{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">

                        {/* Student Monitoring Table */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800 text-lg">Student Monitoring</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                    View Full List <span>→</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                            <th className="pb-3 px-2 font-semibold">Student Name</th>
                                            <th className="pb-3 px-2 font-semibold">Mood Trend</th>
                                            <th className="pb-3 px-2 font-semibold text-center">Latest Test</th>
                                            <th className="pb-3 px-2 font-semibold text-center">Risk Level</th>
                                            <th className="pb-3 px-2 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((s, i) => {
                                            const latestScore = s.testHistory[s.testHistory.length - 1]?.score || 0;
                                            return (
                                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                                {s.id}
                                                            </div>
                                                            <span className="font-medium text-gray-800">{s.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 w-24">
                                                        <div className="flex items-end gap-1 h-6">
                                                            {s.moodHistory.slice(-5).map((mh, j) => (
                                                                <div key={j} className="w-2 bg-blue-200 rounded-t-sm" style={{ height: `${mh.score * 10}%` }}></div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-center text-sm font-medium text-gray-600 border-x border-gray-50">{latestScore}/100</td>
                                                    <td className="py-4 px-2 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskColor(s.riskLevel)}`}>
                                                            {s.riskLevel}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-2 text-right">
                                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                                                            Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-sm tracking-wider uppercase">Mood Distribution</h3>
                                <div className="h-48 flex items-center justify-center relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stressData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {stressData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '8xl', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    {/* Custom Legend */}
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                                        {stressData.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                                {entry.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-sm tracking-wider uppercase">Monthly Improvement</h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {/* Aggregated view for demo, binding to first student's history to simulate trend line */}
                                        <LineChart data={students[0]?.moodHistory || []}>
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <Tooltip cursor={{ stroke: '#e2e8f0' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="space-y-6">

                        {/* Escalation Alerts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-2xl opacity-60 -mr-10 -mt-10"></div>
                            <div className="flex justify-between items-center mb-4 relative z-10">
                                <h3 className="font-bold text-gray-800 text-lg">Escalation Alerts</h3>
                                {pendingEscalations.length > 0 && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">ACTION REQUIRED</span>}
                            </div>

                            <div className="space-y-4 relative z-10 max-h-[400px] overflow-y-auto">
                                {pendingEscalations.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center">No pending escalations.</p>
                                )}
                                {pendingEscalations.map(escalation => (
                                    <div key={escalation.id} className="bg-red-50/50 rounded-xl p-4 border border-red-100 transition-colors hover:bg-red-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-800">{escalation.studentName}</h4>
                                            <span className="text-xs text-red-500 font-semibold uppercase tracking-wider">{escalation.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2 italic">Flagged by {escalation.flaggedBy}</p>
                                        <p className="text-sm text-gray-700 font-medium mb-3">{escalation.message}</p>
                                        <button
                                            onClick={() => markEscalationReviewed(escalation.id)}
                                            className="w-full bg-white border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            Mark as Reviewed
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Sessions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Upcoming Sessions</h3>

                            <div className="flex justify-between items-center mb-4 text-sm font-semibold text-gray-600 border-b border-gray-100 pb-2">
                                <span>Today / Upcoming</span>
                                <div className="flex gap-2">
                                    <button className="text-gray-400 hover:text-gray-600">&lt;</button>
                                    <button className="text-gray-400 hover:text-gray-600">&gt;</button>
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                {appointments.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center">No upcoming sessions.</p>
                                )}
                                {appointments.map((session) => (
                                    <div key={session.id} className="flex gap-4">
                                        <div className="text-xs font-bold text-gray-500 text-center w-8 leading-tight pt-1 whitespace-pre-line">
                                            {session.time || '12:00\nPM'}
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center group hover:border-gray-200 transition-colors relative overflow-hidden">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${session.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">{session.name}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <span>{String(session.type).includes('Virtual') ? '💻' : '🏢'}</span> {session.type}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => session.status === 'Scheduled' && startSession(session.id)}
                                                disabled={session.status === 'Active' || session.status === 'Completed'}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${session.status === 'Active' ? 'bg-green-600 text-white cursor-not-allowed opacity-80' : 'bg-blue-600 text-white hover:brightness-110'} group-hover:shadow`}
                                            >
                                                {session.status}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </main>

            {/* Emergency Intervention Button */}
            <button
                onClick={handleEmergencyIntervention}
                className="fixed bottom-6 right-6 md:right-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-[0_8px_30px_rgb(220,38,38,0.3)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.5)] transition-all flex items-center gap-2 z-50 transform hover:-translate-y-1"
            >
                <span className="text-xl">⚠️</span> EMERGENCY INTERVENTION
            </button>
        </div>
    );
};

export default CounsellorDashboard;
