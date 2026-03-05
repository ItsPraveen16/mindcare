import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    fetchStudents,
    updateStudentRiskAPI,
    addMoodAPI,
    addTestResultAPI,
    updateLastInteractionAPI,
    fetchAppointments,
    addAppointmentAPI,
    startSessionAPI,
    fetchEscalations,
    addEscalationAPI,
    markEscalationReviewedAPI,
    fetchChats,
    startChatAPI
} from '../services/api';

const GlobalDataContext = createContext();

export const GlobalDataProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [escalations, setEscalations] = useState([]);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsData, appointmentsData, escalationsData, chatsData] = await Promise.all([
                fetchStudents(),
                fetchAppointments(),
                fetchEscalations(),
                fetchChats()
            ]);
            setStudents(studentsData);
            setAppointments(appointmentsData);
            setEscalations(escalationsData);
            setChats(chatsData);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    // Functions
    const updateStudentRisk = async (studentId, riskLevel) => {
        try {
            const updated = await updateStudentRiskAPI(studentId, riskLevel);
            setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
        } catch (error) {
            console.error(error);
        }
    };

    const addMood = async (studentId, mood, score) => {
        try {
            const updated = await addMoodAPI(studentId, mood, score);
            if (updated && updated.success === false) {
                alert(updated.message);
                return;
            }
            setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
        } catch (error) {
            console.error(error);
        }
    };

    const addTestResult = async (studentId, score) => {
        try {
            const updated = await addTestResultAPI(studentId, score);
            setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
        } catch (error) {
            console.error(error);
        }
    };

    const addAppointment = async (appointment) => {
        try {
            const added = await addAppointmentAPI(appointment);
            setAppointments(prev => [...prev, added]);
        } catch (error) {
            console.error(error);
        }
    };

    const startSession = async (appointmentId) => {
        try {
            const updated = await startSessionAPI(appointmentId);
            setAppointments(prev => prev.map(a => a.id === appointmentId ? updated : a));
        } catch (error) {
            console.error(error);
        }
    };

    const addEscalation = async (escalation) => {
        try {
            const added = await addEscalationAPI(escalation);
            setEscalations(prev => [added, ...prev]);
        } catch (error) {
            console.error(error);
        }
    };

    const markEscalationReviewed = async (id) => {
        try {
            const updated = await markEscalationReviewedAPI(id);
            setEscalations(prev => prev.map(e => e.id === id ? updated : e));
        } catch (error) {
            console.error(error);
        }
    };

    const updateLastInteraction = async (studentId) => {
        try {
            const updated = await updateLastInteractionAPI(studentId);
            setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
        } catch (error) {
            console.error(error);
        }
    };

    const startChat = async (studentId, ambassadorId) => {
        try {
            const chat = await startChatAPI(studentId, ambassadorId);

            // Re-fetch chats or insert directly to list
            setChats(prev => {
                const existing = prev.find(c => c.studentId === studentId && c.ambassadorId === ambassadorId && c.status === "Open");
                if (existing) return prev;
                return [...prev, chat];
            });
            updateLastInteraction(studentId);
        } catch (error) {
            console.error(error);
        }
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
