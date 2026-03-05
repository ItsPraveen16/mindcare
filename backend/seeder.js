import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Student from './models/Student.js';
import Appointment from './models/Appointment.js';
import Escalation from './models/Escalation.js';
import Ambassador from './models/Ambassador.js';

dotenv.config();

connectDB();

const students = [
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
];

const ambassadors = [
    {
        id: 'A1',
        name: 'Maria K.',
        email: 'maria.k@mindcare.edu',
        assignedStudents: ['AJ', 'SW', 'MC']
    }
];

const appointments = [
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
];

const escalations = [
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
];

const importData = async () => {
    try {
        await Student.deleteMany();
        await Appointment.deleteMany();
        await Escalation.deleteMany();
        await Ambassador.deleteMany();

        await Student.insertMany(students);
        await Appointment.insertMany(appointments);
        await Escalation.insertMany(escalations);
        await Ambassador.insertMany(ambassadors);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

importData();
