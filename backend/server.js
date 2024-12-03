const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const patientsRouter = require('./routes/patients');
const doctorsRotuer = require('./routes/doctors');
const appointmentRouter = require('./routes/appointments');
const doctors = require("./models/doctor.model");
const { Doctor, Slot, DateSchedule } = doctors;

require('dotenv').config();
 
app.use(express.json());
app.use(cors(
    {
        origin: "*", // allow the server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    }
));

app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRotuer);
app.use('/appointments', appointmentRouter);

const port = process.env.PORT || 5000;
let uri = '';
process.env.NODE_ENV === 'test' ? uri = process.env.ATLAS_URI_TEST : uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (!err) {
        console.log("Connection to database successful!");
    }
});

// Function to seed database with fixed doctors
async function seedDatabase() {
    const fixedDoctors = [
        {
            username: "doctor1",
            password: "password123",
            name: "Dr. John Smith",
            email: "johnsmith@example.com",
            phoneNumber: "1234567890",
            specialization: "Cardiology",
            feesPerSession: "100",
            dates: [
                {
                    date: "2024-11-12",
                    slots: [
                        { time: "09:00", isBooked: false },
                        { time: "10:00", isBooked: false },
                        { time: "11:00", isBooked: false }
                    ]
                }
            ]
        },
        {
            username: "doctor2",
            password: "password456",
            name: "Dr. Alice Brown",
            email: "alicebrown@example.com",
            phoneNumber: "0987654321",
            specialization: "Dermatology",
            feesPerSession: "80",
            dates: [
                {
                    date: "2024-11-12",
                    slots: [
                        { time: "13:00", isBooked: false },
                        { time: "14:00", isBooked: false },
                        { time: "15:00", isBooked: false }
                    ]
                }
            ]
        },
        {
            username: "spatel",
            password: "Shrey@3155",
            name: "Dr. Shrey patel",
            email: "snp3155@gmail.com",
            phoneNumber: "1234567890",
            specialization: "NeuroSurgeon",
            feesPerSession: "800",
            dates: [
                {
                    date: "2024-11-12",
                    slots: [
                        { time: "09:00", isBooked: false },
                        { time: "10:00", isBooked: false },
                        { time: "11:00", isBooked: false }
                    ]
                }
            ]
        },
    ];

    try {
        for (const doctor of fixedDoctors) {
            const existingDoctor = await Doctor.findOne({ username: doctor.username });
            if (!existingDoctor) {
                await Doctor.create(doctor);
                console.log(`Added doctor: ${doctor.name}`);
            } else {
                console.log(`Doctor already exists: ${doctor.name}`);
            }
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
}

function getCurrentTime() {
    const date = new Date()
    console.log(date)
}

function getEndDateTime(dateTime) {
    // 2021-03-22T09:00:00
    const hrs = (parseInt(dateTime.split('T')[1].split(':')[0]) + 1).toString().padStart(2, '0')
    const time = hrs + ':00:00'
    const date = dateTime.split('T')[0]
    return date + 'T' + time
}

app.listen(port, async () => {
    console.log(`Listening on port ${port}`)
    console.log(`NODE_ENV = ${process.env.NODE_ENV}`)
    getCurrentTime()
    getEndDateTime("2021-03-22T09:00:00")
    await seedDatabase();

})

app.get('/', (req, res) => {
    res.status(200).json("Hello");
})

module.exports = app;