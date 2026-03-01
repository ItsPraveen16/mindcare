import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { LineChart, Line, BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalData } from '../../context/GlobalDataContext';

const initialStressData = [
    { category: 'Study', level: 80 },
    { category: 'Social', level: 40 },
    { category: 'Sleep', level: 60 },
    { category: 'Health', level: 30 },
];

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative animate-fade-in-up">
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">✕</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    const { students, addMood, addTestResult, addAppointment, addEscalation, appointments: globalAppointments } = useGlobalData();

    // Hardcoded to simulate logged in student
    const studentId = 'AJ';
    const myData = students.find(s => s.id === studentId) || students[0];

    const handleMoodSelect = (mood) => {
        const scoreMap = { '😄 Happy': 9, '😐 Neutral': 6, '😢 Sad': 3, '😠 Angry': 2, '😰 Anxious': 4 };
        const score = scoreMap[mood] || 5;
        addMood(studentId, mood, score);
    };

    const [journalText, setJournalText] = useState('');
    const [journalEntries, setJournalEntries] = useState([
        { id: 1, text: "Had a long day at the library...", date: "YESTERDAY • 8:45 PM", mood: "Neutral" }
    ]);
    const [isJournalVisible, setIsJournalVisible] = useState(false);

    const handleSaveJournal = () => {
        if (!journalText.trim()) return;
        setJournalEntries(prev => [
            {
                id: Date.now(),
                text: journalText,
                date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
                mood: 'Neutral'
            },
            ...prev
        ]);
        setJournalText('');
    };

    const handleDeleteJournal = (id) => {
        setJournalEntries(prev => prev.filter(e => e.id !== id));
    };

    const [isTestOpen, setIsTestOpen] = useState(false);
    const [testAnswers, setTestAnswers] = useState({});
    const [stressChartData, setStressChartData] = useState(initialStressData);

    const handleTestSubmit = (e) => {
        e.preventDefault();
        const values = Object.values(testAnswers).map(v => parseInt(v));
        const totalScore = values.reduce((sum, val) => sum + val, 0);
        const riskScore = Math.floor((totalScore / (values.length * 5)) * 100) || 50;

        addTestResult(studentId, riskScore);

        if (riskScore >= 70) {
            addEscalation({
                id: Date.now(),
                studentId: studentId,
                studentName: myData.name,
                timestamp: 'Just now',
                createdBy: 'system',
                flaggedBy: 'Automated System',
                message: `Student completed mental wellness test with acute urgency level. Needs immediate review.`,
                status: 'Pending'
            });
        }

        setStressChartData(prev => prev.map(item => ({
            category: item.category,
            level: Math.max(10, Math.min(100, item.level + (Math.floor(Math.random() * 30) - 15)))
        })));
        setIsTestOpen(false);
        setTestAnswers({});
    };

    const [isApptOpen, setIsApptOpen] = useState(false);
    const [apptDate, setApptDate] = useState('');
    const [apptTime, setApptTime] = useState('');

    const myAppointments = globalAppointments.filter(a => a.studentId === studentId);

    const handleBookSession = (e) => {
        e.preventDefault();
        if (apptDate && apptTime) {
            const formatTime = (timeStr) => {
                let [hours, minutes] = timeStr.split(':');
                hours = parseInt(hours);
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                return `${String(hours).padStart(2, '0')}:${minutes}\n${ampm}`;
            };

            const newAppt = {
                id: Date.now(),
                studentId: studentId,
                doctor: 'Dr. Sarah Smith',
                name: myData.name,
                date: apptDate,
                dateStr: apptDate,
                time: formatTime(apptTime),
                initial: 'SS',
                type: 'Virtual Session',
                status: 'Scheduled'
            };

            addAppointment(newAppt);
            setIsApptOpen(false);
            setApptDate('');
            setApptTime('');

            // If urgent risk, flag it
            if (myData.riskLevel === 'Urgent') {
                addEscalation({
                    id: Date.now(),
                    studentId,
                    studentName: myData.name,
                    message: 'Urgent risk student just scheduled a new session. Please prepare.',
                    createdBy: 'system',
                    flaggedBy: 'System',
                    status: 'Pending',
                    timestamp: 'Just now'
                });
            }
        }
    };

    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

    const handleEmergencyConfirm = () => {
        addEscalation({
            id: Date.now(),
            studentId: studentId,
            studentName: myData.name,
            timestamp: 'Just now',
            createdBy: 'student',
            flaggedBy: 'Student Alert',
            message: `Student activated emergency help button from dashboard!`,
            status: 'Pending'
        });
        setIsEmergencyOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 md:pb-6">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Hi {myData.name.split(' ')[0]} <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-gray-500 mt-1">How are you feeling today? Checking in helps track your progress.</p>
                    </div>

                    <div className="flex bg-gray-50 p-2 rounded-xl border border-gray-100 gap-1 w-full md:w-auto overflow-x-auto">
                        {['😄 Happy', '😐 Neutral', '😢 Sad', '😠 Angry', '😰 Anxious'].map(mood => (
                            <button
                                key={mood}
                                onClick={() => handleMoodSelect(mood)}
                                className="px-4 py-2 hover:bg-white hover:shadow-sm rounded-lg text-sm font-medium text-gray-600 transition-all flex-shrink-0 active:scale-95"
                            >
                                {mood}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-blue-500">📝</span> Mood Journal
                                </h3>
                                <button
                                    onClick={() => setIsJournalVisible(true)}
                                    className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                    View All Entries
                                </button>
                            </div>
                            <textarea
                                value={journalText}
                                onChange={(e) => setJournalText(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all placeholder-gray-400"
                                placeholder="Write down your thoughts..."
                            ></textarea>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-gray-400">
                                    {journalEntries.length > 0 ? `Last entry: ${journalEntries[0].date}` : 'No entries yet'}
                                </span>
                                <button
                                    onClick={handleSaveJournal}
                                    className="px-5 py-2.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors active:scale-95"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider text-gray-500">Mood Trends</h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={myData.moodHistory}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <Tooltip cursor={{ stroke: '#e2e8f0' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider text-gray-500">Weekly Stress Levels</h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stressChartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="level" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 relative overflow-hidden">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-500 text-2xl shadow-sm mb-4">
                                📋
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">Check your Mental Wellness</h3>
                            <p className="text-gray-600 text-sm mb-6 max-w-[200px] relative z-10">
                                Take our monthly 5-minute assessment to understand your mental health trends and get personalized recommendations.
                            </p>
                            <button
                                onClick={() => setIsTestOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm w-max absolute bottom-6 z-10"
                            >
                                Start Test →
                            </button>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 z-0"></div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-indigo-500">📅</span> Appointments
                                </h3>
                            </div>

                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                                {myAppointments.map(appt => (
                                    <div key={appt.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                                            {appt.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-sm">{appt.doctor}</h4>
                                            <p className="text-gray-500 text-xs">{appt.dateStr} • {appt.time.replace('\n', ' ')}</p>
                                        </div>
                                    </div>
                                ))}
                                {myAppointments.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">No upcoming appointments.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setIsApptOpen(true)}
                                className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-500 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors mt-2"
                            >
                                Book New Session
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <button
                onClick={() => setIsEmergencyOpen(true)}
                className="fixed bottom-6 right-6 md:right-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-[0_8px_30px_rgb(220,38,38,0.3)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.5)] transition-all flex items-center gap-2 z-[90] transform hover:-translate-y-1"
            >
                <span className="text-xl">🚨</span> Emergency Help
            </button>

            <Modal isOpen={isJournalVisible} onClose={() => setIsJournalVisible(false)} title="Mood Journal History">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {journalEntries.length === 0 && (
                        <p className="text-center text-gray-500 py-6">No journal entries found.</p>
                    )}
                    {journalEntries.map(entry => (
                        <div key={entry.id} className="bg-gray-50 rounded-xl p-4 relative group">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-500">{entry.date}</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{entry.mood}</span>
                            </div>
                            <p className="text-sm text-gray-700 italic">"{entry.text}"</p>
                            <button
                                onClick={() => handleDeleteJournal(entry.id)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                🗑
                            </button>
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal isOpen={isTestOpen} onClose={() => setIsTestOpen(false)} title="Mental Wellness Check-in">
                <form onSubmit={handleTestSubmit} className="space-y-6">
                    {[
                        { id: 'q1', text: "How often have you felt overwhelmed this week?" },
                        { id: 'q2', text: "How well have you been sleeping?" },
                        { id: 'q3', text: "Are you finding time to relax?" }
                    ].map((q, i) => (
                        <div key={q.id}>
                            <label className="block text-sm font-medium text-gray-800 mb-2">{i + 1}. {q.text}</label>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map(score => (
                                    <label key={score} className="flex flex-col items-center gap-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={q.id}
                                            required
                                            value={score}
                                            onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-gray-500">{score === 1 ? '1 (Never)' : score === 5 ? '5 (Always)' : score}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsTestOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Submit Assessment</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isApptOpen} onClose={() => setIsApptOpen(false)} title="Book New Session">
                <form onSubmit={handleBookSession} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                        <input
                            type="date"
                            required
                            value={apptDate}
                            onChange={(e) => setApptDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                        <input
                            type="time"
                            required
                            value={apptTime}
                            onChange={(e) => setApptTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsApptOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Confirm Booking</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} title="🚨 Emergency Confirmation">
                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        You are about to alert the emergency support team. We take this very seriously and a counsellor will attempt to reach you immediately.
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                        Are you sure you want to proceed?
                    </p>
                    <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsEmergencyOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors">No, Cancel</button>
                        <button onClick={handleEmergencyConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-sm transition-colors">Yes, Help Me</button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default StudentDashboard;
