const API_URL = 'http://localhost:5000/api';

export const fetchStudents = async () => {
    const res = await fetch(`${API_URL}/students`);
    return res.json();
};

export const updateStudentRiskAPI = async (id, riskLevel) => {
    const res = await fetch(`${API_URL}/students/${id}/risk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ riskLevel })
    });
    return res.json();
};

export const addMoodAPI = async (id, mood, score) => {
    const res = await fetch(`${API_URL}/students/${id}/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, score })
    });
    return res.json();
};

export const addTestResultAPI = async (id, score) => {
    const res = await fetch(`${API_URL}/students/${id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score })
    });
    return res.json();
};

export const updateLastInteractionAPI = async (id) => {
    const res = await fetch(`${API_URL}/students/${id}/interaction`, {
        method: 'PUT'
    });
    return res.json();
};

export const fetchAppointments = async () => {
    const res = await fetch(`${API_URL}/appointments`);
    return res.json();
};

export const addAppointmentAPI = async (appointment) => {
    const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
    });
    return res.json();
};

export const startSessionAPI = async (id) => {
    const res = await fetch(`${API_URL}/appointments/${id}/start`, {
        method: 'PUT'
    });
    return res.json();
};

export const fetchEscalations = async () => {
    const res = await fetch(`${API_URL}/escalations`);
    return res.json();
};

export const addEscalationAPI = async (escalation) => {
    const res = await fetch(`${API_URL}/escalations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(escalation)
    });
    return res.json();
};

export const markEscalationReviewedAPI = async (id) => {
    const res = await fetch(`${API_URL}/escalations/${id}/review`, {
        method: 'PUT'
    });
    return res.json();
};

export const fetchChats = async () => {
    const res = await fetch(`${API_URL}/chats`);
    return res.json();
};

export const startChatAPI = async (studentId, ambassadorId) => {
    const res = await fetch(`${API_URL}/chats/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, ambassadorId })
    });
    return res.json();
};
