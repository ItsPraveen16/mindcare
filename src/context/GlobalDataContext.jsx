import React, { createContext, useContext, useState } from 'react';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
    const [students, setStudents] = useState([
        {
            id: 'AJ',
            name: 'Alex Johnson',
            moodHistory: [
                { day: 'Mon', score: 6 },
                { day: 'Tue', score: 7 },
                { day: 'Wed', score: 5 },
                { day: 'Thu', score: 8 },
                { day: 'Fri', score: 9 },
                { day: 'Sat', score: 8 },
                { day: 'Sun', score: 7 }
            ],
            testHistory: [{ score: 85 }],
            riskLevel: "Stable",
            lastInteraction: '2 hours ago',
            assignedAmbassadorId: 'A1'
        },
        {
            id: 'SW',
            name: 'Sarah Williams',
            moodHistory: [
                { day: 'Mon', score: 4 },
                { day: 'Tue', score: 3 },
                { day: 'Wed', score: 2 },
                { day: 'Thu', score: 4 },
                { day: 'Fri', score: 1 }
            ],
            testHistory: [{ score: 42 }],
            riskLevel: "Urgent",
            lastInteraction: '1 day ago',
            assignedAmbassadorId: 'A1'
        },
        {
            id: 'MC',
            name: 'Michael Chen',
            moodHistory: [
                { day: 'Mon', score: 5 },
                { day: 'Tue', score: 6 },
                { day: 'Wed', score: 4 },
                { day: 'Thu', score: 5 },
                { day: 'Fri', score: 5 }
            ],
            testHistory: [{ score: 68 }],
            riskLevel: "Warning",
            lastInteraction: 'Just now',
            assignedAmbassadorId: 'A1'
        }
    ]);

    const [appointments, setAppointments] = useState([
        {
            id: 1,
            studentId: 'AJ',
            name: 'Alex Johnson',
            date: new Date().toISOString().split('T')[0], // Today
            dateStr: 'Today',
            time: '09:00\nAM',
            type: 'Virtual Session',
            status: 'Scheduled',
            doctor: 'Dr. Sarah Smith',
            initial: 'SS'
        },
        {
            id: 2,
            studentId: 'MC',
            name: 'Michael Chen',
            date: new Date().toISOString().split('T')[0],
            dateStr: 'Today',
            time: '10:30\nAM',
            type: 'Office - Room 304',
            status: 'Scheduled',
            doctor: 'Dr. Sarah Smith',
            initial: 'SS'
        }
    ]);

    const [escalations, setEscalations] = useState([
        {
            id: 1,
            studentId: 'SW',
            studentName: 'Sarah Williams',
            message: '"Sarah expressed significant distress during the peer support group today. Needs urgent followup."',
            createdBy: 'ambassador',
            flaggedBy: 'Ambassador: Maria K.',
            status: 'Pending',
            timestamp: '1h ago'
        }
    ]);

    const [chats, setChats] = useState([]);

    // Functions
    const updateStudentRisk = (studentId, riskLevel) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, riskLevel } : s));
    };

    const addMood = (studentId, mood, score) => {
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDay = dayLabels[new Date().getDay()];

        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const newMoodHistory = [...s.moodHistory, { day: currentDay, score }];
                if (newMoodHistory.length > 7) newMoodHistory.shift();

                // Recalculate risk based on last 5 moods
                const last5 = newMoodHistory.slice(-5);
                const avgScore = last5.reduce((sum, item) => sum + item.score, 0) / last5.length;

                let newRisk = s.riskLevel;
                if (avgScore < 4) newRisk = "Urgent";
                else if (avgScore < 6) newRisk = "Warning";
                else newRisk = "Stable";

                return { ...s, moodHistory: newMoodHistory, riskLevel: newRisk, lastInteraction: 'Just now' };
            }
            return s;
        }));
    };

    const addTestResult = (studentId, score) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                let newRisk = s.riskLevel;
                if (score >= 70) newRisk = "Urgent";
                else if (score >= 40) newRisk = "Warning";

                return {
                    ...s,
                    testHistory: [...s.testHistory, { score }],
                    riskLevel: newRisk,
                    lastInteraction: 'Just now'
                };
            }
            return s;
        }));
    };

    const addAppointment = (appointment) => {
        setAppointments(prev => [...prev, appointment]);
    };

    const startSession = (appointmentId) => {
        setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Active' } : a));
    };

    const addEscalation = (escalation) => {
        setEscalations(prev => [escalation, ...prev]);
    };

    const markEscalationReviewed = (id) => {
        setEscalations(prev => prev.map(e => e.id === id ? { ...e, status: 'Reviewed' } : e));
    };

    const updateLastInteraction = (studentId) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, lastInteraction: 'Just now' } : s));
    };

    const startChat = (studentId, ambassadorId) => {
        updateLastInteraction(studentId);
        setChats(prev => {
            const existing = prev.find(c => c.studentId === studentId && c.ambassadorId === ambassadorId && c.status === "Open");
            if (existing) return prev;
            return [...prev, { id: Date.now(), studentId, ambassadorId, messages: [], status: "Open" }];
        });
    };

    return (
        <GlobalDataContext.Provider value={{
            students,
            appointments,
            escalations,
            chats,
            updateStudentRisk,
            addMood,
            addTestResult,
            addAppointment,
            startSession,
            addEscalation,
            markEscalationReviewed,
            updateLastInteraction,
            startChat
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
};

export const useGlobalData = () => useContext(GlobalDataContext);
